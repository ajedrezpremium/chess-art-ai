import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CombinationDetailClient } from './CombinationDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('combinations')
    .select('title, white_player, black_player, year, description, artwork_url')
    .eq('slug', slug)
    .single();
  
  if (!data) {
    return { title: 'Combinación no encontrada' };
  }
  
  return {
    title: `#${data.title} - ${data.white_player} vs ${data.black_player} (${data.year}) | Chess Art & AI Academy`,
    description: data.description || `Análisis de la combinación ${data.title} entre ${data.white_player} y ${data.black_player}`,
    openGraph: {
      title: `${data.title} - ${data.white_player} vs ${data.black_player}`,
      description: data.description || '',
      images: data.artwork_url ? [data.artwork_url] : [],
      type: 'article',
    },
  };
}

export default async function CombinationPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: combination, error } = await supabase
    .from('combinations')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !combination) {
    notFound();
  }
  
  return <CombinationDetailClient combination={combination} />;
}