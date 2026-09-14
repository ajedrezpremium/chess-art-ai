-- ============================================================
-- CHESS ART AI — Colaboradores (aportes anónimos o con alias)
-- Obras, extractos, curiosidades y datos para valorar y publicar
-- si enriquecen la web. Revisión 24–48h.
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists public.collaborator_submissions (
  id uuid primary key default gen_random_uuid(),
  alias text not null default 'Anónimo',
  email text,
  kind text not null,
  title text not null,
  description text not null,
  link text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  review_note text default '',
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create index if not exists idx_collab_status
  on public.collaborator_submissions (status, created_at desc);

alter table public.collaborator_submissions enable row level security;

-- Cualquiera puede enviar un aporte (solo insert, admite anonimato)
drop policy if exists "anon insert collaborator submissions" on public.collaborator_submissions;
create policy "anon insert collaborator submissions"
  on public.collaborator_submissions for insert
  with check (true);
