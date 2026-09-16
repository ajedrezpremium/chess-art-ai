import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { DEMO_COMBINATIONS } from '@/lib/data/combinations';
import { HomeClient } from './HomeClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Chess Art & AI Academy - Ajedrez, Arte e Inteligencia Artificial',
  description: 'Descubre las mejores combinaciones de la historia del ajedrez a través del arte, el ajedrez interactivo y la inteligencia artificial. Serie Top 100 por Pablo Iglesias.',
};

export default async function HomePage() {
  let combinations = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('combinations')
      .select('*')
      .order('number', { ascending: true })
      .limit(10);
    
    if (!error && data && data.length > 0) {
      combinations = data;
    }
  } catch (err) {
    console.error('Error fetching combinations for home:', err);
  }

  const list = combinations || DEMO_COMBINATIONS;
  const featured = list[0] || null;
  const galleryPreview = list.slice(0, 4);
  
  return <HomeClient featured={featured} galleryPreview={galleryPreview} />;
}