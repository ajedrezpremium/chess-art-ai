// Importador PGN -> Supabase (combinations).
// Uso:
//   node --env-file=.env.local scripts/import-pgn.mjs data/mis-combinaciones.pgn [--start=11] [--limit=500] [--dry]
//
// El CBV de ChessBase es un formato propietario binario: NO se puede importar
// directamente. Expórtalo antes desde ChessBase como PGN sin comprimir:
//   ChessBase > Abrir la base > Archivo > Guardar como > formato PGN.
//
// Convención que espera este script (la que usan las colecciones de combinaciones):
//   - Cada "partida" del PGN es UNA combinación: posición inicial (+ FEN en
//     cabecera si no es la inicial) seguida de la línea de la solución.
//   - Si una partida trae la partida completa (>14 semijugadas) sin FEN inicial,
//     se toma como puzzle las últimas 12 semijugadas (heurística documentada).
//
// Columnas destino: number, slug, title, white_player, black_player, event,
// year, result, fen, pgn, opening, category, difficulty, description,
// artwork_url, artist_notes.

import fs from 'node:fs';
import { Chess } from 'chess.js';
import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const opt = (name, def) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
};
const START = parseInt(opt('start', '11'), 10);
const LIMIT = parseInt(opt('limit', '100000'), 10);
const DRY = args.includes('--dry');

if (!file || !fs.existsSync(file)) {
  console.error('Uso: node --env-file=.env.local scripts/import-pgn.mjs <archivo.pgn> [--start=11] [--limit=500] [--dry]');
  process.exit(1);
}

const supabase = DRY
  ? null
  : createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function splitGames(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  const parts = normalized.split(/\n(?=\[Event\s)/g).map((s) => s.trim()).filter(Boolean);
  return parts;
}

function parseHeaders(block) {
  const headers = {};
  const re = /\[(\w+)\s+"([^"]*)"\]/g;
  let m;
  while ((m = re.exec(block))) headers[m[1]] = m[2];
  return headers;
}

function stripMovetext(movetext) {
  let s = movetext;
  s = s.replace(/\{[^}]*\}/g, ' ');          // comentarios {...}
  s = s.replace(/;[^\n]*/g, ' ');            // comentarios ;...
  s = s.replace(/\$\d+/g, ' ');              // NAGs
  // variantes (...) con anidamiento
  let out = '';
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (depth === 0) out += ch;
  }
  return out;
}

function tokenizeMoves(movetext) {
  const clean = stripMovetext(movetext);
  return clean
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t && !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t));
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'partida';
}

function difficultyForPlies(n) {
  if (n <= 4) return 'Easy';
  if (n <= 6) return 'Intermediate';
  if (n <= 8) return 'Advanced';
  if (n <= 10) return 'Expert';
  return 'Master';
}

function buildPgn(headers, sans, fen) {
  const h = { ...headers };
  if (fen) {
    h.SetUp = '1';
    h.FEN = fen;
  } else {
    delete h.SetUp;
    delete h.FEN;
  }
  const order = ['Event', 'Site', 'Date', 'White', 'Black', 'Result', 'ECO', 'Opening', 'SetUp', 'FEN'];
  let out = '';
  for (const k of order) if (h[k]) out += `[${k} "${h[k]}"]\n`;
  for (const k of Object.keys(h)) if (!order.includes(k)) out += `[${k} "${h[k]}"]\n`;
  out += '\n';
  let moveNo = 1;
  let whiteToMove = true;
  if (fen) {
    const turn = fen.split(/\s+/)[1];
    whiteToMove = turn !== 'b';
    const full = parseInt(fen.split(/\s+/)[5] || '1', 10);
    if (Number.isFinite(full)) moveNo = full;
  }
  const parts = [];
  for (const san of sans) {
    if (whiteToMove) parts.push(`${moveNo}.`);
    parts.push(san);
    if (!whiteToMove) moveNo++;
    whiteToMove = !whiteToMove;
  }
  out += parts.join(' ') + ` ${h.Result || '*'}`;
  return out;
}

function parseGame(block) {
  const headers = parseHeaders(block);
  const movetext = block.split(/\n\s*\n/).slice(1).join('\n');
  const tokens = tokenizeMoves(movetext);
  const startFen = headers.FEN && headers.SetUp === '1' ? headers.FEN : undefined;

  const game = new Chess();
  try {
    if (startFen) game.load(startFen);
  } catch {
    return { error: 'FEN inicial inválida', headers };
  }
  const sans = [];
  for (const tok of tokens) {
    try {
      const mv = game.move(tok);
      sans.push(mv.san);
    } catch {
      break; // corta en la primera jugada ilegal (basura al final del fragmento)
    }
  }
  if (sans.length === 0) return { error: 'sin jugadas válidas', headers };

  // Derivar puzzle: si la línea es corta, es la combinación completa;
  // si es una partida larga sin FEN, el puzzle son las últimas 12 semijugadas.
  let puzzleFen;
  let puzzleSans;
  if (startFen || sans.length <= 14) {
    puzzleFen = startFen;
    puzzleSans = sans;
  } else {
    const g2 = new Chess();
    const lead = sans.slice(0, sans.length - 12);
    for (const s of lead) g2.move(s);
    puzzleFen = g2.fen();
    const g3 = new Chess();
    g3.load(puzzleFen);
    puzzleSans = [];
    for (const s of sans.slice(sans.length - 12)) {
      try {
        puzzleSans.push(g3.move(s).san);
      } catch {
        break;
      }
    }
  }

  const year = parseInt((headers.Date || '').slice(0, 4), 10) || null;
  return { headers, sans: puzzleSans, fen: puzzleFen, year };
}

async function main() {
  const text = fs.readFileSync(file, 'utf8');
  const games = splitGames(text);
  console.log(`Partidas detectadas: ${games.length}`);

  let number = START;
  if (!DRY) {
    const { data } = await supabase.from('combinations').select('number').order('number', { ascending: false }).limit(1);
    if (data && data[0]) number = Math.max(START, data[0].number + 1);
  }

  let ok = 0;
  let skipped = 0;
  const rows = [];
  for (const [i, block] of games.entries()) {
    if (ok + skipped >= LIMIT) break;
    const parsed = parseGame(block);
    if (parsed.error || !parsed.sans || parsed.sans.length === 0) {
      skipped++;
      if (DRY && skipped <= 5) console.log(`  salto #${i + 1}: ${parsed.error}`);
      continue;
    }
    const h = parsed.headers;
    const white = h.White || 'Desconocido';
    const black = h.Black || 'Desconocido';
    const event = h.Event || '';
    const year = parsed.year;
    const base = slugify(`${white}-vs-${black}-${event}-${year || ''}-${number}`);
    const row = {
      number: number++,
      slug: base,
      title: `${white} vs ${black}${event ? `, ${event}` : ''}${year ? ` ${year}` : ''}`.slice(0, 160),
      white_player: white.slice(0, 120),
      black_player: black.slice(0, 120),
      event: (event || '').slice(0, 160),
      year,
      result: h.Result || '*',
      fen: parsed.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      pgn: buildPgn(h, parsed.sans, parsed.fen),
      opening: (h.Opening || h.ECO || '').slice(0, 120),
      category: 'Combinación táctica',
      difficulty: difficultyForPlies(parsed.sans.length),
      description: '',
      artwork_url: '/artworks/placeholder.svg',
      artist_notes: '',
    };
    rows.push(row);
    ok++;
    if (DRY && ok <= 3) console.log(`  OK #${row.number}: ${row.title} (${parsed.sans.length} plies)`);
  }

  console.log(`Válidas: ${ok}, descartadas: ${skipped}`);
  if (DRY) {
    console.log('(dry run: nada insertado)');
    return;
  }

  const BATCH = 100;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('combinations').upsert(chunk, { onConflict: 'slug' });
    if (error) {
      console.error(`Error en lote ${i / BATCH + 1}:`, error.message);
      process.exit(1);
    }
    console.log(`Lote ${i / BATCH + 1}: ${chunk.length} insertadas/actualizadas`);
  }
  console.log('🎉 Importación completa');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
