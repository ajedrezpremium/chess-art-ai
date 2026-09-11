import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CombinationGalleryClient } from './CombinationGalleryClient';

export const metadata: Metadata = {
  title: 'TOP 100 Combinaciones | Chess Art & AI Academy',
  description: 'Explora las 100 combinaciones más brillantes de la historia del ajedrez, ilustradas artísticamente por Pablo Iglesias. Cada combinación incluye análisis interactivo, PGN y explicación por IA.',
};

export default async function CombinacionesPage() {
  const supabase = await createClient();
  
  const { data: combinations, error } = await supabase
    .from('combinations')
    .select('*')
    .order('number', { ascending: true })
    .limit(20);
  
  if (error) {
    console.error('Error fetching combinations:', error);
  }
  
  return <CombinationGalleryClient initialCombinations={combinations || []} />;
}