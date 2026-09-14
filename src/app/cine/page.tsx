'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import { GalleryPage } from '@/components/gallery/GalleryPage';
import { ART_CATALOGUE } from '@/lib/data/art-catalogue';

const cinemaFilters = [
  { value: 'all', label: 'Todo' },
  { value: 'movie', label: 'Película' },
  { value: 'documentary', label: 'Documental' },
  { value: 'series', label: 'Serie' },
  { value: 'short', label: 'Cortometraje' },
];

export default function CinePage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const t = getTranslations(locale);
  const items = ART_CATALOGUE.filter((w) => w.discipline === 'cinema').map((w) => ({
    id: w.id,
    title: w.title,
    image: w.image,
    category: w.category,
    year: w.year,
    author: w.artist,
    description: w.note,
    tags: w.tags,
    type: w.category,
  }));

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      <main className="pt-20 lg:pt-24">
        <GalleryPage
          items={items}
          categoryKey="cinema"
          locale={locale}
          title={t.cinema?.title || 'CINE AJEDREZ'}
          subtitle={t.cinema?.subtitle || 'Películas y documentales donde el ajedrez es protagonista'}
          searchPlaceholder={t.cinema?.search || 'Buscar películas...'}
          filters={cinemaFilters}
        />
        <AIChatWidget locale={locale} />
      </main>
    </div>
  );
}
