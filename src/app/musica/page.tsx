'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import { GalleryPage } from '@/components/gallery/GalleryPage';

const mockMusicData = [
  { id: '1', title: 'Jaque Mate - Banda Sonora', image: '/artworks/music.svg', category: 'soundtrack', year: '2020', author: 'Carlos Rafael Rivera', description: 'Banda sonora original de La Reina del Ajedrez. Minimalista, emotiva y técnicamente brillante al piano.', tags: ['Banda sonora', 'Netflix', 'Piano'], type: 'soundtrack' },
  { id: '2', title: 'Chess - El Musical', image: '/artworks/music.svg', category: 'soundtrack', year: '1984', author: 'Benny Andersson / Björn Ulvaeus / Tim Rice', description: 'Álbum conceptual que narra la Guerra Fría a través de una partida de campeonato. Incluye "One Night in Bangkok".', tags: ['Musical', 'ABBA', 'Guerra Fría'], type: 'soundtrack' },
  { id: '3', title: 'Jaque Mate (Jazz)', image: '/artworks/music.svg', category: 'jazz', year: '1969', author: 'Bobby Hutcherson', description: 'Álbum de jazz modal inspirado en la geometría del tablero, con vibráfono y piano en diálogo constante.', tags: ['Jazz modal', 'Blue Note', 'Vibráfono'], type: 'jazz' },
  { id: '4', title: 'Partita para Ajedrez', image: '/artworks/music.svg', category: 'classical', year: '2015', author: 'Jason Kouchak', description: 'Suite pianística donde cada movimiento representa una pieza. Grabada en el British Museum de Londres.', tags: ['Piano', 'Clásica contemporánea', 'Reino Unido'], type: 'classical' },
  { id: '5', title: 'Sinfonía Nº 6 - El Tablero', image: '/artworks/music.svg', category: 'contemporary', year: '2010', author: 'Jason Kouchak', description: 'Obra orquestal donde cada movimiento representa una fase de la partida: apertura, medio juego y final.', tags: ['Orquesta', 'Programática', 'Contemporánea'], type: 'contemporary' },
  { id: '6', title: 'Jazz en el Tablero', image: '/artworks/music.svg', category: 'jazz', year: '2005', author: 'Varios artistas', description: 'Compilación de standards de jazz inspirados en el ajedrez, con piezas vocales e instrumentales legendarias.', tags: ['Recopilación', 'Jazz vocal', 'Instrumental'], type: 'jazz' },
];

const musicFilters = [
  { value: 'all', label: 'Todo' },
  { value: 'classical', label: 'Clásica' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'contemporary', label: 'Contemporánea' },
  { value: 'soundtrack', label: 'Banda sonora' },
];

export default function MusicaPage() {
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
          items={mockMusicData}
          categoryKey="music"
          locale={locale}
          title={t.music?.title || 'MÚSICA AJEDREZ'}
          subtitle={t.music?.subtitle || 'Composiciones inspiradas en el juego ciencia'}
          searchPlaceholder={t.music?.search || 'Buscar música...'}
          filters={musicFilters}
        />
        <AIChatWidget locale={locale} />
      </main>
    </div>
  );
}
