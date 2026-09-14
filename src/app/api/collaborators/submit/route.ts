import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/collaborators/submit
 * Aportes de colaboradores (anónimos o con alias): obras, extractos,
 * curiosidades o datos para valorar y publicar si enriquecen la web.
 * Se guardan como `pending` (revisión 24–48h).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { alias, email, kind, title, description, link } = body ?? {};

    if (!alias || !kind || !title || !description) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }
    if (link && typeof link === 'string' && link.trim() && !/^https?:\/\//i.test(link.trim())) {
      return NextResponse.json(
        { ok: false, error: 'El enlace no es válido.' },
        { status: 400 }
      );
    }

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
      description: String(description).slice(0, 4000),
      link: link ? String(link).slice(0, 1000) : null,
      status: 'pending',
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

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('collaborators/submit error:', e);
    return NextResponse.json(
      { ok: false, error: 'Error procesando la solicitud.' },
      { status: 500 }
    );
  }
}
