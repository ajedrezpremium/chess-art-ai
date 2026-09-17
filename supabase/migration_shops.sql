-- ============================================================
-- CHESS ART AI — Altas de puntos de venta (guía Tienda)
-- Solicitudes con revisión editorial 24–48h.
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists public.shop_applications (
  id uuid primary key default gen_random_uuid(),
  shop text not null,
  email text not null,
  web text not null,
  country text not null,
  kind text not null,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  review_note text default '',
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create index if not exists idx_shop_apps_status
  on public.shop_applications (status, created_at desc);

alter table public.shop_applications enable row level security;

drop policy if exists "anon insert shop applications" on public.shop_applications;
create policy "anon insert shop applications"
  on public.shop_applications for insert
  with check (true);
