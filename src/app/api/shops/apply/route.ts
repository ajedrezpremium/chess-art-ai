import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/shops/apply
 * Solicitudes de alta como punto de venta para la guía Tienda.
 * Se guardan como `pending` (revisión 24–48h).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { shop, email, web, country, kind, message } = body ?? {};

    if (!shop || !email || !web || !country || !kind) {
      return NextResponse.json(
        { ok: false, error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }
    if (!/^https?:\/\//i.test(String(web).trim())) {
      return NextResponse.json(
        { ok: false, error: 'La web no es válida.' },
        { status: 400 }
      );
    }

    let supabase;
    try {
      supabase = await createClient();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Base de datos no disponible. Escríbenos a chessaiagency@gmail.com' },
        { status: 503 }
      );
    }

    const { error } = await supabase.from('shop_applications').insert({
      shop: String(shop).slice(0, 200),
      email: String(email).slice(0, 200),
      web: String(web).slice(0, 500),
      country: String(country).slice(0, 100),
      kind: String(kind).slice(0, 60),
      message: message ? String(message).slice(0, 2000) : null,
      status: 'pending',
    });

    if (error) {
      console.error('shop_applications insert error:', error.message);
      return NextResponse.json(
        { ok: false, error: 'No se pudo guardar (tabla pendiente de crear). Escríbenos a chessaiagency@gmail.com' },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('shops/apply error:', e);
    return NextResponse.json(
      { ok: false, error: 'Error procesando la solicitud.' },
      { status: 500 }
    );
  }
}
