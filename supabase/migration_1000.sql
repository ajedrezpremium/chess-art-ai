-- Migración: ampliar el Top 100 a una colección mayor (p. ej. 1000+ combinaciones).
-- Ejecutar en Supabase SQL Editor DESPUÉS de schema.sql.

ALTER TABLE combinations DROP CONSTRAINT IF EXISTS combinations_number_check;
ALTER TABLE combinations ADD CONSTRAINT combinations_number_check CHECK (number BETWEEN 1 AND 100000);
