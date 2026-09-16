/**
 * Busca portadas de libros clásicos de ajedrez (dominio público) en Open Library.
 * Verifica que la portada existe y genera scripts/books-report.json para revisión.
 * Uso: node scripts/discover-books.mjs
 */
const BOOKS = [
  // [título búsqueda, autor, año aprox, idioma, nota ES]
  ['The chess-player handbook', 'Howard Staunton', '1847', 'EN', 'El manual victoriano que enseñó aperturas a generaciones.'],
  ['Morphy games of chess', 'Lowenthal', '1860', 'EN', 'Las partidas del genio de Nueva Orleans, anotadas en su época.'],
  ['The modern chess instructor', 'Wilhelm Steinitz', '1889', 'EN', 'El primer campeón mundial explica la escuela posicional.'],
  ['Chess fundamentals', 'Jose Raul Capablanca', '1921', 'EN', 'El tratado claro y directo del tercer campeón.'],
  ['My chess career', 'Jose Raul Capablanca', '1920', 'EN', 'Sesenta partidas comentadas por el propio Capablanca.'],
  ['Common sense in chess', 'Emanuel Lasker', '1896', 'EN', 'Doce conferencias del campeón filósofo.'],
  ['Manual of chess', 'Emanuel Lasker', '1925', 'EN', 'El manual enciclopédico de Lasker.'],
  ['The art of chess', 'James Mason', '1895', 'EN', 'Clásico inglés de medio juego y finales.'],
  ['Chess openings ancient and modern', 'Edward Freeborough', '1893', 'EN', 'Teoría de aperturas del XIX con partidas modelo.'],
  ['Handbuch des Schachspiels', 'Paul von Bilguer', '1843', 'DE', 'La biblia alemana del ajedrez durante un siglo.'],
  ['Die moderne Schachpartie', 'Siegbert Tarrasch', '1912', 'DE', 'Tarrasch y los dogmas clásicos del juego posicional.'],
  ['Lehrbuch des Schachspiels', 'Jean Dufresne', '1863', 'DE', 'El manual popular alemán del XIX.'],
  ['Analyse du jeu des echecs', 'Francois Andre Danican Philidor', '1749', 'FR', 'Los peones son el alma del ajedrez. Fundacional.'],
  ["Traite du jeu des echecs", 'La Bourdonnais', '1833', 'FR', 'El campeón francés de la Régence en su tratado.'],
  ['Libro de la invencion liberal', 'Ruy Lopez', '1561', 'ES', 'El extremeño que dio nombre a la apertura española.'],
  ['Repeticion de amores', 'Luis Ramirez de Lucena', '1497', 'ES', 'Primer libro impreso con las reglas modernas.'],
  ['Arte de axedres', 'Francesc Vicent', '1495', 'ES', 'Incunable valenciano, entre los primeros del mundo.'],
  ['Il giuoco degli scacchi', 'Gioachino Greco', '1619', 'IT', 'El Calabrés: celadas y miniaturas eternas.'],
  ['Trattato dellinventione', 'Pietro Carrera', '1617', 'IT', 'El siciliano y su defensa con dama temprana.'],
  ["Il Puttino", 'Alessandro Salvio', '1604', 'IT', 'El napolitano: teoría y partidas del XVII.'],
  ['Questo libro e da imparare giocare a scachi', 'Damiano', '1512', 'IT', 'Manual renacentista de bolsillo.'],
  ['Schachnovelle', 'Stefan Zweig', '1942', 'DE', 'La novela definitiva sobre la obsesión ajedrecística.'],
  ['A travers les echecs', 'Alphonse Delannoy', '1890', 'FR', 'Miscelánea francesa del café de la Régence.'],
  ['The principles of chess', 'James Mason', '1894', 'EN', 'Fundamentos para el jugador de club.'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];

for (const [title, author, year, lang, note] of BOOKS) {
  try {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=8&fields=key,title,author_name,first_publish_year,cover_i,language`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ChessArtAI/1.0' } });
    const data = await res.json();
    const docs = (data.docs || []).filter((d) => d.cover_i);
    if (docs.length === 0) {
      out.push({ title, author, year, lang, note, cover: null, reason: 'sin-portada' });
    } else {
      docs.sort((a, b) => Math.abs((a.first_publish_year || 9999) - year) - Math.abs((b.first_publish_year || 9999) - year));
      const best = docs[0];
      const cover = `https://covers.openlibrary.org/b/id/${best.cover_i}-L.jpg`;
      const head = await fetch(cover, { method: 'HEAD' });
      out.push({
        title: best.title, author: (best.author_name || [author]).join(', '),
        year: String(best.first_publish_year || year), lang, note,
        cover: head.ok ? cover : null, olKey: best.key,
        reason: head.ok ? 'ok' : `portada-${head.status}`,
      });
    }
    console.log(`${head_ok(out[out.length - 1])} ${title} (${author})`);
  } catch (e) {
    out.push({ title, author, year, lang, note, cover: null, reason: String(e).slice(0, 80) });
  }
  await sleep(400);
}

function head_ok(o) { return o.cover ? 'OK  ' : 'FALTA'; }

const { writeFileSync } = await import('node:fs');
writeFileSync('scripts/books-report.json', JSON.stringify(out, null, 2));
const ok = out.filter((o) => o.cover).length;
console.log(`\nPortadas OK: ${ok}/${out.length} → scripts/books-report.json`);
