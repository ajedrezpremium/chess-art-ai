'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import { GalleryPage } from '@/components/gallery/GalleryPage';
import { ART_CATALOGUE } from '@/lib/data/art-catalogue';

const booksFilters = [
  { value: 'all', label: 'Todo' },
  { value: 'strategy', label: 'Estrategia' },
  { value: 'tactics', label: 'Táctica' },
  { value: 'endgame', label: 'Finales' },
  { value: 'openings', label: 'Aperturas' },
  { value: 'history', label: 'Historia' },
  { value: 'biography', label: 'Biografías' },
  { value: 'fiction', label: 'Ficción' },
];

export default function LibrosPage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const t = getTranslations(locale);
  const items = ART_CATALOGUE.filter((w) => w.discipline === 'books').map((w) => ({
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
          categoryKey="books"
          locale={locale}
          title={t.books?.title || 'BIBLIOTECA AJEDREZ'}
          subtitle={t.books?.subtitle || 'Los mejores libros de ajedrez de la historia'}
          searchPlaceholder={t.books?.search || 'Buscar libros...'}
          filters={booksFilters}
        />
        <AIChatWidget locale={locale} />
      </main>
    </div>
  );
}
