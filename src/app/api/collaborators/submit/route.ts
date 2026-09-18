import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ART_CATALOGUE } from '@/lib/data/art-catalogue';
import { evaluateCollaborator, checkRateLimit } from '@/lib/moderation/auto-approve';

/**
 * POST /api/collaborators/submit
 * Mismo automatismo que artistas: controles instantáneos y publicación
 * inmediata (`approved_auto`) o cola de revisión (`pending`).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { alias, email, kind, title, description, link, rightsAccepted } = body ?? {};

    if (!alias || !kind || !title || !description) {
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
    if (link && typeof link === 'string' && link.trim() && !/^https?:\/\//i.test(link.trim())) {
      return NextResponse.json(
        { ok: false, error: 'El enlace no es válido.' },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    if (!checkRateLimit(`collab:${ip}`)) {
      return NextResponse.json(
        { ok: false, error: 'Demasiados envíos. Inténtalo de nuevo en una hora.' },
        { status: 429 }
      );
    }

    const verdict = evaluateCollaborator({
      alias: String(alias),
      title: String(title),
      description: String(description),
      link: link ? String(link) : '',
      rightsAccepted: true,
      catalogueTitles: ART_CATALOGUE.map((w) => w.title),
    });

    let supabase;
    try {
      supabase = await createClient();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: 'Base de datos no disponible. Envía tu aporte a chessaiagency@gmail.com',
        },
        { status: 503 }
      );
    }

    const { error } = await supabase.from('collaborator_submissions').insert({
      alias: String(alias).slice(0, 120),
      email: email ? String(email).slice(0, 200) : null,
      kind: String(kind).slice(0, 60),
      title: String(title).slice(0, 200),
      description: `${String(description).slice(0, 3800)}\n\n[Declaración aceptada: contenido propio o con derechos acreditados]`,
      link: link ? String(link).slice(0, 1000) : null,
      status: verdict.decision,
    });

    if (error) {
      console.error('collaborator_submissions insert error:', error.message);
      return NextResponse.json(
        {
          ok: false,
          error: 'No se pudo guardar (tabla pendiente de crear). Envía tu aporte a chessaiagency@gmail.com',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, status: verdict.decision });
  } catch (e) {
    console.error('collaborators/submit error:', e);
    return NextResponse.json(
      { ok: false, error: 'Error procesando la solicitud.' },
      { status: 500 }
    );
  }
}
