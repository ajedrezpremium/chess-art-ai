-- ============================================================
-- CHESS ART AI — Sistema de artistas
-- Perfiles públicos + cola de moderación (revisión 24–48h)
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

-- 1) Perfiles de artista (solo se muestran los verificados/aprobados)
create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  bio_es text default '',
  bio_en text default '',
  avatar_url text default '',
  website text default '',
  linkedin text default '',
  instagram text default '',
  series text default '',
  verified boolean default false,
  featured boolean default false,
  created_at timestamptz default now()
);

-- 2) Cola de envíos para moderación editorial y legal
create table if not exists public.artist_submissions (
  id uuid primary key default gen_random_uuid(),
  artist_name text not null,
  email text not null,
  title text not null,
  category text not null,
  description text not null,
  image_url text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  review_note text default '',
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create index if not exists idx_submissions_status
  on public.artist_submissions (status, created_at desc);
create index if not exists idx_artists_slug
  on public.artists (slug);

-- 3) RLS
alter table public.artists enable row level security;
alter table public.artist_submissions enable row level security;

-- Lectura pública de artistas verificados
drop policy if exists "public read verified artists" on public.artists;
create policy "public read verified artists"
  on public.artists for select
  using (verified = true);

-- Cualquiera puede enviar una obra (solo insert)
drop policy if exists "anon insert submissions" on public.artist_submissions;
create policy "anon insert submissions"
  on public.artist_submissions for insert
  with check (true);

-- 4) Primera ficha: Pablo Iglesias (fundador, serie DIBUJOS)
insert into public.artists (slug, name, bio_es, bio_en, linkedin, series, verified, featured)
values (
  'pablo-iglesias',
  'Pablo Iglesias',
  'Artista visual especializado en la intersección entre el ajedrez y el arte contemporáneo. Su serie DIBUJOS transforma posiciones ajedrecísticas icónicas en obras que capturan la tensión, el sacrificio y la belleza del momento decisivo.',
  'Visual artist specialized in the intersection of chess and contemporary art. His DRAWINGS series transforms iconic chess positions into works capturing the tension, sacrifice and beauty of the decisive moment.',
  'https://www.linkedin.com/in/pabloiglesias1991/',
  'DIBUJOS · Top 100 Combinaciones',
  true,
  true
)
on conflict (slug) do update set
  verified = true,
  featured = true;
