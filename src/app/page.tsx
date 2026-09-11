import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { HomeClient } from './HomeClient';

export const metadata: Metadata = {
  title: 'Chess Art & AI Academy - Ajedrez, Arte e Inteligencia Artificial',
  description: 'Descubre las mejores combinaciones de la historia del ajedrez a través del arte, el ajedrez interactivo y la inteligencia artificial. Serie Top 100 por Pablo Iglesias.',
};

export default async function HomePage() {
  const supabase = await createClient();
  
  const { data: combinations } = await supabase
    .from('combinations')
    .select('*')
    .order('number', { ascending: true })
    .limit(10);
  
  const featured = combinations?.[0] || null;
  const galleryPreview = combinations?.slice(1, 5) || [];
  
  return <HomeClient featured={featured} galleryPreview={galleryPreview} />;
}