-- Migración: tabla curatorial `artworks` (200 obras arte+ajedrez).
-- Modelo según esquema curatorial v1 (categorías, i18n, fuentes oficiales).
-- Ejecutar en Supabase SQL Editor DESPUÉS de schema.sql.

CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  discipline TEXT NOT NULL CHECK (discipline IN ('art', 'books', 'cinema', 'music')),
  schema_category TEXT NOT NULL CHECK (schema_category IN (
    'pintura_clasica', 'arte_moderno_vanguardias', 'escultura_instalaciones',
    'manuscritos_libros', 'carteleria_grafismo', 'cine_audiovisual',
    'fotografia', 'musica_ballet', 'arte_urbano_diseno'
  )),
  category TEXT NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT,
  title_original TEXT,
  artist_name TEXT NOT NULL,
  nationality TEXT,
  birth_year INT,
  death_year INT,
  year_display TEXT NOT NULL,
  year_numeric INT,
  is_circa BOOLEAN NOT NULL DEFAULT FALSE,
  period TEXT,
  institution TEXT,
  city TEXT,
  country TEXT,
  thumbnail_url TEXT,
  full_image_url TEXT,
  image_local TEXT NOT NULL DEFAULT '/artworks/placeholder.svg',
  alt_text TEXT,
  license TEXT,
  sources JSONB NOT NULL DEFAULT '[]',
  chess_role TEXT CHECK (chess_role IN ('central_theme', 'metaphor', 'prop_object', 'historical_record')),
  chess_note_es TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artworks_slug ON artworks(slug);
CREATE INDEX IF NOT EXISTS idx_artworks_discipline ON artworks(discipline);
CREATE INDEX IF NOT EXISTS idx_artworks_schema_category ON artworks(schema_category);
CREATE INDEX IF NOT EXISTS idx_artworks_year ON artworks(year_numeric);

ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read artworks" ON artworks;
CREATE POLICY "Public read artworks" ON artworks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write artworks" ON artworks;
CREATE POLICY "Admin write artworks" ON artworks
  FOR ALL USING (auth.role() = 'service_role');
