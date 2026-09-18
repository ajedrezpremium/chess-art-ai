import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ART_CATALOGUE } from '@/lib/data/art-catalogue';
import {
  evaluateArtist,
  imageReachable,
  checkRateLimit,
  legalFootnote,
} from '@/lib/moderation/auto-approve';

/**
 * POST /api/artists/submit
 * Aprobación automática in situ: la propuesta que supera los controles
 * (declaración de derechos, filtros anti-spam, anfitrión verificable,
 * sin duplicados, imagen accesible, límite por IP) se publica al instante
 * con `status: 'approved_auto'` e insignia "Auto · en verificación".
 * El resto queda `pending` para revisión humana (24–48h).
 * Sin garantía absoluta: retirada inmediata ante aviso (Términos §7).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, title, category, description, imageUrl, rightsAccepted, origin, license } =
      body ?? {};

    if (!name || !email || !title || !category || !description || !imageUrl) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }
    if (rightsAccepted !== true) {
      return NextResponse.json(
        { ok: false, error: 'Debes aceptar la declaración de autoría y derechos.' },
        { status: 400 }
      );
    }
    if (typeof imageUrl !== 'string' || !/^https?:\/\//i.test(imageUrl)) {
      return NextResponse.json(
        { ok: false, error: 'La URL de la imagen no es válida.' },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    if (!checkRateLimit(`artists:${ip}`)) {
      return NextResponse.json(
        { ok: false, error: 'Demasiados envíos. Inténtalo de nuevo en una hora.' },
        { status: 429 }
      );
    }

    const verdict = evaluateArtist({
      name: String(name),
      email: String(email),
      title: String(title),
      category: String(category),
      description: String(description),
      imageUrl: String(imageUrl),
      rightsAccepted: true,
      origin: String(origin || ''),
      license: String(license || ''),
      catalogueTitles: ART_CATALOGUE.map((w) => w.title),
    });

    let status = verdict.decision;
    // Comprobación de imagen accesible: fail-open → pending, nunca rechazo.
    if (status === 'approved_auto') {
      const reachable = await imageReachable(String(imageUrl));
      if (reachable !== true) {
        status = 'pending';
        verdict.reasons.push(reachable === false ? 'image-unreachable' : 'image-unverified');
      }
    }

    let supabase;
    try {
      supabase = await createClient();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Base de datos no disponible. Envía tu obra a chessaiagency@gmail.com',
        },
        { status: 503 }
      );
    }

    const { error } = await supabase.from('artist_submissions').insert({
      artist_name: String(name).slice(0, 120),
      email: String(email).slice(0, 200),
      title: String(title).slice(0, 200),
      category: String(category).slice(0, 60),
      description: `${String(description).slice(0, 3800)}\n\n${legalFootnote(
        String(origin || ''),
        String(license || '')
      )}`,
      image_url: String(imageUrl).slice(0, 1000),
      status,
    });

    if (error) {
      console.error('artist_submissions insert error:', error.message);
      return NextResponse.json(
        {
          ok: false,
          error:
            'No se pudo guardar (tabla pendiente de crear). Envía tu obra a chessaiagency@gmail.com',
        },
        { status: 503 }
      );
    }

    if (status !== 'approved_auto') {
      console.info('artist_submission pending:', verdict.reasons.join(','));
    }
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    console.error('artists/submit error:', e);
    return NextResponse.json(
      { ok: false, error: 'Error procesando la solicitud.' },
      { status: 500 }
    );
  }
}
