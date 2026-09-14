'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import { GalleryPage } from '@/components/gallery/GalleryPage';
import { ART_CATALOGUE } from '@/lib/data/art-catalogue';

const artFilters = [
  { value: 'all', label: 'Todo' },
  { value: 'painting', label: 'Pintura' },
  { value: 'sculpture', label: 'Escultura' },
  { value: 'digital', label: 'Digital' },
  { value: 'photography', label: 'Fotografía' },
  { value: 'print', label: 'Grabado/Cartel' },
  { value: 'urban', label: 'Arte urbano' },
];

export default function ArtePage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const t = getTranslations(locale);
  const items = ART_CATALOGUE.filter((w) => w.discipline === 'art').map((w) => ({
    id: w.id,
    title: w.title,
    image: w.image,
    category: w.category,
    year: w.year,
    author: w.artist,
    description: w.chessNote ? `${w.note} ${w.chessNote}` : w.note,
    tags: w.tags,
    type: w.category,
    period: w.period,
    location: [w.institution, w.city, w.country].filter(Boolean).join(', ') || undefined,
    license: w.license,
    chessRole: w.chessRole,
    sources: w.sources,
  }));

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      <main className="pt-20 lg:pt-24">
        <GalleryPage
          items={items}
          categoryKey="art"
          locale={locale}
          title={t.art?.title || 'ARTE AJEDREZ'}
          subtitle={t.art?.subtitle || 'Obras maestras donde el ajedrez inspira el arte'}
          searchPlaceholder={t.art?.search || 'Buscar obras...'}
          filters={artFilters}
        />
        <AIChatWidget locale={locale} />
      </main>
    </div>
  );
}
