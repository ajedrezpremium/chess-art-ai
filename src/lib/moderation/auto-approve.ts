/**
 * Moderación automática para propuestas de la comunidad (artistas y colaboradores).
 *
 * IMPORTANTE: ningún automatismo puede *garantizar* originalidad ni cobertura
 * legal sin revisión humana. Este módulo aplica la red de seguridad automatizable:
 *  1. Declaración jurada obligatoria (autoría o derechos + licencia de exhibición).
 *  2. Filtros de spam, longitud y anfitriones de alto riesgo (Pinterest, RRSS…).
 *  3. Detección de duplicados contra el catálogo curado.
 *  4. Comprobación de que la URL de imagen responde (fail-open → `pending`).
 *  5. Límite de envíos por IP.
 *
 * Resultado: `approved_auto` (publicación instantánea con insignia
 * "Auto · en verificación comunitaria") o `pending` (revisión humana 24–48h).
 * Todo `approved_auto` queda sujeto a retirada inmediata ante aviso fundado
 * (ver Términos §7 y chessaiagency@gmail.com).
 */

export type AutoDecision = 'approved_auto' | 'pending';

export interface AutoCheckResult {
  decision: AutoDecision;
  /** Motivos internos (algunos no se exponen al usuario). */
  reasons: string[];
  /** Motivo público seguro para mostrar en el formulario. */
  publicReason: string | null;
}

const norm = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Anfitriones donde es imposible verificar licencia → revisión humana.
const BLOCKED_IMAGE_HOSTS = [
  'pinterest.',
  'pinimg.com',
  'facebook.com',
  'fbcdn.net',
  'instagram.com',
  'cdninstagram.com',
  'tiktok.com',
  'x.com',
  'whatsapp.',
  'telegram.',
];

const SPAM_PATTERNS = [
  /casino|apuesta|bet365|porn|xxx|viagra|cialis|crypto|bitcoin|forex|onlyfans/i,
  /ganar dinero|hazte rico|ingresos pasivos|trabaja desde casa/i,
  /https?:\/\/\S+\s+https?:\/\/\S+\s+https?:\/\//i, // 3+ enlaces en el texto
];

export const ALLOWED_LICENSES = ['CC0', 'CC BY', 'CC BY-SA'] as const;
export type CommunityLicense = (typeof ALLOWED_LICENSES)[number];

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

export function isBlockedImageHost(url: string): boolean {
  const h = hostOf(url);
  return BLOCKED_IMAGE_HOSTS.some((b) => h.includes(b));
}

/** Límite simple en memoria por IP: 5 envíos / hora (por instancia; MVP). */
const hits = new Map<string, number[]>();
export function checkRateLimit(ip: string, max = 5, windowMs = 3_600_000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

export function hasSpam(text: string): boolean {
  return SPAM_PATTERNS.some((re) => re.test(text || ''));
}

/** Comprueba que la URL de imagen responde. Fail-open: si no se puede
 *  verificar, devuelve `null` y la propuesta va a `pending`, no se rechaza. */
export async function imageReachable(url: string, timeoutMs = 6000): Promise<boolean | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, { method: 'HEAD', signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(t);
    if (!res.ok) return false;
    const ct = res.headers.get('content-type') || '';
    // Algunos alojamientos no devuelven content-type en HEAD: no penalizar.
    if (ct && !ct.startsWith('image/')) return false;
    return true;
  } catch {
    return null;
  }
}

export interface ArtistInput {
  name: string;
  email: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  rightsAccepted: boolean;
  origin: string; // 'own-work' | 'licensed'
  license: string;
  /** Títulos del catálogo curado para detectar duplicados (inyectado por la ruta). */
  catalogueTitles: string[];
}

/** Núcleo síncrono: declaración, formato, spam, anfitrión y duplicados. */
export function evaluateArtist(input: ArtistInput): AutoCheckResult {
  const reasons: string[] = [];
  if (!input.rightsAccepted) reasons.push('rights-not-accepted');
  if (!['own-work', 'licensed'].includes(input.origin)) reasons.push('origin-unknown');
  if (!(ALLOWED_LICENSES as readonly string[]).includes(input.license)) reasons.push('license-invalid');
  if (input.title.trim().length < 4) reasons.push('title-too-short');
  if (input.description.trim().length < 30) reasons.push('description-too-short');
  if (hasSpam(`${input.title} ${input.description} ${input.name}`)) reasons.push('spam-pattern');
  if (!/^https?:\/\//i.test(input.imageUrl)) reasons.push('image-url-invalid');
  else if (isBlockedImageHost(input.imageUrl)) reasons.push('image-host-unverifiable');

  const key = norm(input.title);
  const dup = input.catalogueTitles.some(
    (t) => t && (norm(t) === key || (key.length > 8 && norm(t).includes(key)))
  );
  if (dup) reasons.push('possible-duplicate');

  if (reasons.length > 0) {
    const needsHuman = reasons.some((r) =>
      ['image-host-unverifiable', 'possible-duplicate', 'description-too-short'].includes(r)
    );
    return {
      decision: 'pending',
      reasons,
      publicReason: needsHuman ? 'review' : null,
    };
  }
  return { decision: 'approved_auto', reasons: [], publicReason: null };
}

export interface CollaboratorInput {
  alias: string;
  title: string;
  description: string;
  link: string;
  rightsAccepted: boolean;
  catalogueTitles: string[];
}

export function evaluateCollaborator(input: CollaboratorInput): AutoCheckResult {
  const reasons: string[] = [];
  if (!input.rightsAccepted) reasons.push('rights-not-accepted');
  if (input.title.trim().length < 4) reasons.push('title-too-short');
  if (input.description.trim().length < 20) reasons.push('description-too-short');
  if (hasSpam(`${input.title} ${input.description} ${input.alias}`)) reasons.push('spam-pattern');
  if (input.link && input.link.trim() && !/^https?:\/\//i.test(input.link.trim()))
    reasons.push('link-invalid');
  const key = norm(input.title);
  const dup = input.catalogueTitles.some(
    (t) => t && (norm(t) === key || (key.length > 8 && norm(t).includes(key)))
  );
  if (dup) reasons.push('possible-duplicate');
  return {
    decision: reasons.length > 0 ? 'pending' : 'approved_auto',
    reasons,
    publicReason: reasons.length > 0 ? 'review' : null,
  };
}

/** Línea legal que se adjunta a la descripción para dejar constancia de la
 *  cesión dentro del esquema actual de la tabla (sin migraciones). */
export function legalFootnote(origin: string, license: string): string {
  const o = origin === 'own-work' ? 'obra propia' : 'obra de terceros con derechos acreditados';
  return `[Declaración aceptada: ${o} · Licencia de exhibición: ${license}]`;
}
