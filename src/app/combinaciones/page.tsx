import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { DEMO_COMBINATIONS } from '@/lib/data/combinations';
import { CombinationGalleryClient } from './CombinationGalleryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'TOP 100 Combinaciones | Chess Art & AI Academy',
  description: 'Explora las 100 combinaciones más brillantes de la historia del ajedrez, ilustradas artísticamente por Pablo Iglesias. Cada combinación incluye análisis interactivo, PGN y explicación por IA.',
};

export default async function CombinacionesPage() {
  let combinations: any[] | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('combinations')
      .select('*')
      .order('number', { ascending: true })
      .limit(20);
    
    if (!error && data && data.length > 0) {
      combinations = data;
    }
  } catch (err) {
    console.error('Error fetching combinations:', err);
  }
  
  return <CombinationGalleryClient initialCombinations={combinations || DEMO_COMBINATIONS} />;
}