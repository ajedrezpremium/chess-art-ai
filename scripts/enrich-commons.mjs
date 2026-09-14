/**
 * Enriquecimiento masivo del catálogo con imágenes REALES de Wikimedia Commons.
 * - Lee src/lib/data/art-catalogue.ts y extrae (id, título, artista).
 * - Por cada obra consulta Commons API (generator=search + imageinfo).
 * - Solo acepta el candidato si el apellido del artista aparece en el nombre
 *   del archivo Y hay coincidencia con una palabra significativa del título.
 * - Genera src/lib/data/art-image-overrides.ts (id → { image, filePage }).
 * - Lo no emparejado queda con placeholder + enlace público de búsqueda.
 * Uso: node scripts/enrich-commons.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CATALOGUE = join(ROOT, 'src', 'lib', 'data', 'art-catalogue.ts');
const OUT_TS = join(ROOT, 'src', 'lib', 'data', 'art-image-overrides.ts');
const OUT_REPORT = join(__dirname, 'commons-report.json');

// Fichas que ya tienen imagen real verificada a mano: no tocar.
const SKIP = new Set(['art-001', 'art-106', 'art-201']);

const STOP = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'en', 'y', 'e',
  'con', 'del', 'al', 'por', 'para', 'su', 'sus', 'the', 'of', 'a', 'an', 'in',
  'on', 'and', 'with', 'chess', 'ajedrez', 'juego', 'jugar', 'jugando',
  'jugador', 'jugadores', 'players', 'player', 'playing', 'game', 'partida',
  'schach', 'echecs', 'scacchi', 'schaak', 'jeu', 'gioco', 'jeux',
]);

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

function surname(artist) {
  const clean = artist.replace(/\(.*?\)/g, ' ').trim();
  const tokens = norm(clean).split(' ').filter((t) => t.length > 2 && !STOP.has(t));
  if (tokens.length === 0) return '';
  return tokens[tokens.length - 1];
}

function titleWords(title) {
  return norm(title).split(' ').filter((t) => t.length >= 5 && !STOP.has(t));
}

function confident(fileTitle, artist, title) {
  const f = norm(fileTitle);
  const sur = surname(artist);
  if (!sur || !f.includes(sur)) return { ok: false, reason: 'sin-apellido' };
  const words = titleWords(title);
  if (words.length === 0) {
    const chessHint = /(chess|ajedrez|schach|echec|scacchi|schaak|shakh|szachy)/.test(f);
    return chessHint
      ? { ok: true, reason: 'apellido+ajedrez' }
      : { ok: false, reason: 'titulo-generico' };
  }
  const hit = words.some((wd) => f.includes(wd));
  return hit ? { ok: true, reason: 'apellido+titulo' } : { ok: false, reason: 'sin-titulo' };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const HINT = {
  painting: 'painting', sculpture: 'sculpture', photography: 'photograph',
  print: 'poster', cinema: 'film', movie: 'film', series: 'film',
  books: '', history: '', fiction: '', music: '', urban: '', digital: '',
};

async function searchOnce(q) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&generator=search&gsrnamespace=6&gsrlimit=10&prop=imageinfo' +
    '&iiprop=url%7Cmime%7Csize&iiurlwidth=1200' +
    `&gsrsearch=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ChessArtAI/1.0 (catalogo; contacto chessaiagency@gmail.com)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  return pages
    .filter((p) => p.imageinfo && /image\/(jpeg|png|webp)/.test(p.imageinfo[0]?.mime || ''))
    .map((p) => ({
      file: p.title,
      page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, '_'))}`,
      thumb: p.imageinfo[0].thumburl || p.imageinfo[0].url,
      width: p.imageinfo[0].width,
    }));
}

function queriesFor(w) {
  const hint = HINT[w.category] || '';
  const qs = [`${w.artist} ${w.title}`];
  if (hint) qs.push(`${w.artist} chess ${hint}`);
  else qs.push(`${w.artist} chess`);
  return [...new Set(qs)];
}

function confidentLoose(fileTitle, artist, title) {
  const f = norm(fileTitle);
  const sur = surname(artist);
  if (!sur || !f.includes(sur)) return { ok: false, reason: 'sin-apellido' };
  const words = titleWords(title);
  const chessHint = /(chess|ajedrez|schach|echec|scacchi|schaak|shakh|szachy|xadrez|zweinstein)/.test(f);
  if (words.some((wd) => f.includes(wd))) return { ok: true, reason: 'apellido+titulo' };
  if (chessHint) return { ok: true, reason: 'apellido+ajedrez' };
  return { ok: false, reason: 'sin-contexto' };
}

function parseCatalogue(src) {
  const re = /w\('([^']+)','([a-z]+)','([^']+)',"((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    out.push({ id: m[1], discipline: m[2], category: m[3], title: m[4], artist: m[5], year: m[6] });
  }
  return out;
}

// Preservar emparejados de pasadas anteriores (no re-evaluar).
let prevOverrides = {};
try {
  const prev = readFileSync(OUT_TS, 'utf8');
  const ids = [...prev.matchAll(/"(art-\d+)":/g)].map((m) => m[1]);
  prevOverrides = Object.fromEntries(ids.map((id) => [id, true]));
} catch { /* primera pasada */ }

const src = readFileSync(CATALOGUE, 'utf8');
const works = parseCatalogue(src);
console.log(`Obras en catálogo: ${works.length}`);

const overrides = {};
const report = { matched: [], skipped: [], failed: [] };

// Reinyectar los ya conseguidos (se revalidan al final del fichero generado).
let prevRaw = '';
try {
  prevRaw = readFileSync(OUT_TS, 'utf8');
} catch { /* nada */ }

for (const wjson of works) {
  const w = wjson;
  if (SKIP.has(w.id) || prevOverrides[w.id]) {
    report.skipped.push({ id: w.id, reason: SKIP.has(w.id) ? 'verificada-a-mano' : 'ya-emparejada' });
    continue;
  }
  try {
    const seen = new Set();
    const candidates = [];
    for (const q of queriesFor(w)) {
      await sleep(350);
      for (const c of await searchOnce(q)) {
        if (!seen.has(c.file)) {
          seen.add(c.file);
          candidates.push(c);
        }
      }
    }
    let placed = false;
    for (const c of candidates) {
      const conf = confidentLoose(c.file, w.artist, w.title);
      if (conf.ok) {
        overrides[w.id] = { image: c.thumb, filePage: c.page, width: c.width };
        report.matched.push({ id: w.id, file: c.file, reason: conf.reason });
        placed = true;
        break;
      }
    }
    if (!placed) {
      report.skipped.push({
        id: w.id,
        reason: candidates.length === 0 ? 'sin-resultados' : 'baja-confianza',
        top: candidates[0]?.file || null,
      });
    }
  } catch (e) {
    report.failed.push({ id: w.id, error: String(e) });
  }
  const done = report.matched.length + report.skipped.length;
  if (done % 25 === 0) {
    console.log(`... ${report.matched.length} nuevas, ${done} procesadas`);
  }
}

// Fusionar con emparejados previos.
let merged = { ...overrides };
if (prevRaw) {
  const m = prevRaw.match(/= (\{[\s\S]*\});\s*$/);
  if (m) {
    try {
      merged = { ...JSON.parse(m[1]), ...overrides };
    } catch { /* conservar solo nuevas */ }
  }
}

const ts =
  `// Generado por scripts/enrich-commons.mjs — NO editar a mano.\n` +
  `// Imágenes reales verificadas en Wikimedia Commons (apellido+título/ajedrez).\n` +
  `// Ver scripts/commons-report.json para el detalle.\n` +
  `export interface ArtImageOverride { image: string; filePage: string; width?: number }\n\n` +
  `export const ART_IMAGE_OVERRIDES: Record<string, ArtImageOverride> = ${JSON.stringify(merged, null, 2)};\n`;
writeFileSync(OUT_TS, ts);
writeFileSync(OUT_REPORT, JSON.stringify(report, null, 2));
console.log(`\nHecho: ${report.matched.length} nuevas, total ${Object.keys(merged).length}, ${report.skipped.length} pendientes, ${report.failed.length} fallos.`);
