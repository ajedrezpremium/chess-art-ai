'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import { GalleryPage } from '@/components/gallery/GalleryPage';

const mockBooksData = [
  { id: '1', title: 'Mi Sistema', image: '/artworks/books.svg', category: 'strategy', year: '1925', author: 'Aron Nimzowitsch', description: 'Obra fundacional del juego posicional moderno. Conceptos como profilaxis, bloqueo y sobreprotección que cambiaron el ajedrez.', tags: ['Estrategia', 'Clásico', 'Imprescindible'], type: 'strategy' },
  { id: '2', title: 'Ajedrez Fundamental', image: '/artworks/books.svg', category: 'tactics', year: '1947', author: 'José Raúl Capablanca', description: 'El genio cubano explica los principios básicos del final de partida y la simplicidad en el juego con claridad legendaria.', tags: ['Finales', 'Clásico', 'Cuba'], type: 'tactics' },
  { id: '3', title: 'Piensa como un Gran Maestro', image: '/artworks/books.svg', category: 'strategy', year: '1971', author: 'Alexander Kotov', description: 'Metodología del árbol de análisis y cálculo de variantes. Referencia obligada para entrenar el pensamiento ajedrecístico.', tags: ['Cálculo', 'Entrenamiento', 'URSS'], type: 'strategy' },
  { id: '4', title: 'El Final de Partida', image: '/artworks/books.svg', category: 'endgame', year: '2003', author: 'Jesús de la Villa', description: 'Recopilación de los 100 finales esenciales que todo jugador debe conocer de memoria para rematar partidas.', tags: ['Finales', 'Práctico', 'España'], type: 'endgame' },
  { id: '5', title: 'Aperturas para Blancas', image: '/artworks/books.svg', category: 'openings', year: '2020', author: 'Viktor Moskalenko', description: 'Repertorio completo y agresivo para 1.e4 con ideas frescas y poco exploradas para el jugador de club.', tags: ['Aperturas', 'Repertorio', 'Ucrania'], type: 'openings' },
  { id: '6', title: 'Bobby Fischer: Mi Vida', image: '/artworks/books.svg', category: 'biography', year: '1969', author: 'Bobby Fischer', description: 'Autobiografía del único estadounidense campeón del mundo con 60 partidas memorables comentadas por él mismo.', tags: ['Biografía', 'EEUU', 'Leyenda'], type: 'biography' },
];

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

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      <main className="pt-20 lg:pt-24">
        <GalleryPage
          items={mockBooksData}
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
