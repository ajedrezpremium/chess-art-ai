import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/artists/submit
 * Recibe la ficha de un artista + obra y la guarda como `pending`
 * en `artist_submissions` para revisión editorial (24–48h).
 * Si la tabla aún no existe, devuelve error controlado con fallback a email.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, title, category, description, imageUrl } = body ?? {};

    if (!name || !email || !title || !category || !description || !imageUrl) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }
    if (typeof imageUrl !== 'string' || !/^https?:\/\//i.test(imageUrl)) {
      return NextResponse.json(
        { ok: false, error: 'La URL de la imagen no es válida.' },
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
      description: String(description).slice(0, 4000),
      image_url: String(imageUrl).slice(0, 1000),
      status: 'pending',
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

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('artists/submit error:', e);
    return NextResponse.json(
      { ok: false, error: 'Error procesando la solicitud.' },
      { status: 500 }
    );
  }
}
