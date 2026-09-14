// RAG ligero sobre el catálogo curatorial (src/lib/data/art-catalogue.ts).
// Sin base vectorial: puntuación por palabras clave (título > autor > tags >
// nota). El endpoint /api/ai/chat lo usa para inyectar las 3 fichas más
// relevantes en el contexto del sistema.

import { ART_CATALOGUE, type ArtWork } from '@/lib/data/art-catalogue';

const STOP_ES = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'en', 'y', 'o', 'que', 'qué', 'con', 'por', 'para', 'como', 'cómo', 'más',
  'muy', 'sin', 'sobre', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'hay',
  'son', 'es', 'fue', 'era', 'ser', 'tiene', 'tienen', 'hace', 'hacen', 'cada',
  'donde', 'dónde', 'cuando', 'cuándo', 'porque', 'pero', 'porque', 'the',
]);
const STOP_EN = new Set([
  'the', 'a', 'an', 'of', 'in', 'on', 'and', 'or', 'is', 'are', 'was', 'were',
  'what', 'when', 'where', 'how', 'with', 'from', 'about', 'that', 'this',
  'for', 'has', 'have', 'more', 'very', 'each', 'which', 'who', 'whom',
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length >= 3 && !STOP_ES.has(t) && !STOP_EN.has(t));
}

export interface ArtMatch {
  work: ArtWork;
  score: number;
}

export function searchArtCatalogue(
  query: string,
  _locale: 'es' | 'en' = 'es',
  limit = 3,
): ArtMatch[] {
  const q = tokens(query);
  if (q.length === 0) return [];

  const scored: ArtMatch[] = [];
  for (const work of ART_CATALOGUE) {
    const title = tokens(work.title).join(' ');
    const artist = tokens(work.artist).join(' ');
    const tags = work.tags.flatMap((t) => tokens(t)).join(' ');
    const note = tokens(work.note).join(' ');
    let score = 0;
    for (const tok of q) {
      if (title.includes(tok)) score += 5;
      if (artist.includes(tok)) score += 4;
      if (tags.includes(tok)) score += 3;
      if (note.includes(tok)) score += 1.5;
      if (work.category.includes(tok) || work.year.includes(tok)) score += 1.5;
    }
    if (score > 0) scored.push({ work, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export function formatArtContext(matches: ArtMatch[], locale: 'es' | 'en'): string {
  if (matches.length === 0) return '';
  const head =
    locale === 'es'
      ? 'Catálogo de referencia (200 obras arte+ajedrez; úsalo para responder con datos concretos y cita título/autor/año):'
      : 'Reference catalogue (200 chess+art works; use it to answer with concrete data, citing title/artist/year):';
  const lines = matches.map(
    (m) => `• ${m.work.title} — ${m.work.artist} (${m.work.year}) [${m.work.discipline}/${m.work.category}]: ${m.work.note} Tags: ${m.work.tags.join(', ')}.`
  );
  return `${head}\n${lines.join('\n')}`;
}
