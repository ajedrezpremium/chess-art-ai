'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import { GalleryPage } from '@/components/gallery/GalleryPage';

const mockCinemaData = [
  { id: '1', title: 'La Reina del Ajedrez', image: '/artworks/cinema.svg', category: 'series', year: '2020', author: 'Scott Frank', description: 'Huérfana prodigio que domina el ajedrez mundial en plena Guerra Fría mientras lucha contra sus demonios personales.', tags: ['Serie', 'Netflix', 'Anya Taylor-Joy'], type: 'series' },
  { id: '2', title: 'Buscando a Bobby Fischer', image: '/artworks/cinema.svg', category: 'movie', year: '1993', author: 'Steven Zaillian', description: 'Un niño prodigio descubre el ajedrez en los parques de Nueva York. Basada en la vida de Josh Waitzkin.', tags: ['Drama', 'EEUU', 'Año 1993'], type: 'movie' },
  { id: '3', title: 'Partida de Ajedrez', image: '/artworks/cinema.svg', category: 'movie', year: '2009', author: 'Gerardo Herrero', description: 'Thriller histórico sobre la partida secreta entre Alekhine y un oficial nazi en el París de 1943.', tags: ['Thriller', 'España/Argentina', 'Segunda Guerra'], type: 'movie' },
  { id: '4', title: 'Magnus', image: '/artworks/cinema.svg', category: 'documentary', year: '2016', author: 'Benjamin Ree', description: 'Documental íntimo sobre Magnus Carlsen, desde niño prodigio hasta campeón del mundo de ajedrez.', tags: ['Documental', 'Noruega', 'Magnus Carlsen'], type: 'documentary' },
  { id: '5', title: 'La Jugadora', image: '/artworks/cinema.svg', category: 'movie', year: '2009', author: 'Gilles Paquet-Brenner', description: 'Una joven prodigio desafía al establishment masculino en el competitivo mundo del ajedrez profesional.', tags: ['Drama', 'Francia', 'Género'], type: 'movie' },
  { id: '6', title: 'Destino: Ajedrez', image: '/artworks/cinema.svg', category: 'short', year: '2018', author: 'Anon', description: 'Cortometraje animado donde las piezas cobran vida y libran una batalla épica sobre el tablero.', tags: ['Animación', 'Corto', 'Experimental'], type: 'short' },
];

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

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      <main className="pt-20 lg:pt-24">
        <GalleryPage
          items={mockCinemaData}
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
