/**
 * Descubre obras PD sobre ajedrez en Wikimedia Commons.
 * 1) Varias búsquedas (deepcat + palabras clave de época).
 * 2) Metadatos en lote (fecha, autor, licencia).
 * 3) Filtra candidatas: licencia PD/CC0/CC-BY o fecha < 1900.
 * Uso: node scripts/discover-commons.mjs
 */
const QUERIES = [
  'deepcat:"Chess in art" painting',
  'deepcat:"Chess in art" 18th century',
  'deepcat:"Chess in art" 19th century',
  'deepcat:"Chess in art" engraving',
  'deepcat:"Chess in art" miniature',
  'chess players oil canvas 19th century',
];
const UA = { 'User-Agent': 'ChessArtAI/1.0 (catalogo; contacto chessaiagency@gmail.com)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(q) {
  const out = [];
  let offset = 0;
  for (let page = 0; page < 3; page++) {
    const url =
      'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
      '&list=search&srnamespace=6&srlimit=100&filetype:bitmap' +
      `&srsearch=${encodeURIComponent(q)}&sroffset=${offset}`;
    const res = await fetch(url.replace('filetype:bitmap', 'filetype%3Abitmap'), { headers: UA });
    const data = await res.json();
    const hits = data?.query?.search || [];
    out.push(...hits.map((h) => h.title));
    if (!data?.continue) break;
    offset = data.continue.sroffset;
    await sleep(300);
  }
  return out;
}

async function metadata(titles) {
  const url =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json' +
    '&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata' +
    '&iiextmetadatafilter=DateTimeOriginal%7CArtist%7CImageDescription%7CLicenseShortName%7CUsageTerms' +
    '&iiurlwidth=1200' +
    `&titles=${encodeURIComponent(titles.join('|'))}`;
  const res = await fetch(url, { headers: UA });
  const data = await res.json();
  return Object.values(data?.query?.pages || {});
}

const seen = new Set();
const all = [];
for (const q of QUERIES) {
  console.log('query:', q);
  const titles = await search(q);
  for (const t of titles) {
    if (!seen.has(t)) {
      seen.add(t);
      all.push(t);
    }
  }
  await sleep(400);
}
console.log(`total únicos: ${all.length}`);

const cands = [];
for (let i = 0; i < all.length; i += 40) {
  const batch = all.slice(i, i + 40);
  try {
    const pages = await metadata(batch);
    for (const p of pages) {
      const ii = p.imageinfo?.[0];
      if (!ii || !/^image\/(jpeg|png|webp)/.test(ii.mime || '')) continue;
      const ex = ii.extmetadata || {};
      const txt = (k) => (ex[k]?.value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
      const lic = txt('LicenseShortName');
      const date = txt('DateTimeOriginal');
      const yearMatch = (p.title + ' ' + date).match(/(1[3-8]\d{2})/);
      const pd = /public domain|pd art|cc0/i.test(lic) || /PDMCreative Commons Public Domain/i.test(JSON.stringify(ex));
      const ccby = /CC-BY(?!-SA)|BY 2\.0/i.test(lic);
      if (pd || ccby || yearMatch) {
        cands.push({
          file: p.title,
          year: yearMatch ? yearMatch[1] : '',
          date, artist: txt('Artist').slice(0, 120),
          license: lic.slice(0, 80),
          thumb: ii.thumburl || ii.url,
          page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, '_'))}`,
        });
      }
    }
  } catch (e) {
    console.log('lote fallido:', e.message);
  }
  await sleep(400);
  if ((i / 40) % 5 === 0) console.log(`... ${i}/${all.length}, candidatas: ${cands.length}`);
}

const { writeFileSync } = await import('node:fs');
writeFileSync('scripts/discover-report.json', JSON.stringify(cands, null, 2));
console.log(`\nCandidatas: ${cands.length} → scripts/discover-report.json`);
