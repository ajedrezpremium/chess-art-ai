'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import { GalleryPage } from '@/components/gallery/GalleryPage';

const mockArtData = [
  { id: '1', title: 'El Juego de Ajedrez', image: '/artworks/art.svg', category: 'painting', year: '1555', author: 'Sofonisba Anguissola', description: 'Retrato de tres hermanas jugando al ajedrez, considerada una de las primeras representaciones femeninas del juego. Una obra fundacional del arte ajedrecístico.', tags: ['Renacimiento', 'Italia', 'Mujeres en el ajedrez'], type: 'painting' },
  { id: '2', title: 'Los Ajedrecistas', image: '/artworks/art.svg', category: 'painting', year: '1910', author: 'Marcel Duchamp', description: 'Representación cubista de dos jugadores concentrados en su partida. Duchamp, ajedrecista apasionado, fusiona vanguardia y juego.', tags: ['Cubismo', 'Vanguardia', 'Francia'], type: 'painting' },
  { id: '3', title: 'Partida de Ajedrez', image: '/artworks/art.svg', category: 'sculpture', year: '1920', author: 'Alexander Calder', description: 'Escultura móvil que representa piezas de ajedrez en movimiento perpetuo. El equilibrio inestable como metáfora de la partida.', tags: ['Escultura cinética', 'Modernismo', 'EEUU'], type: 'sculpture' },
  { id: '4', title: 'La Partida', image: '/artworks/art.svg', category: 'digital', year: '2018', author: 'Refik Anadol', description: 'Instalación de datos que visualiza millones de partidas de ajedrez en tiempo real mediante inteligencia artificial.', tags: ['Data art', 'IA', 'Turquía/EEUU'], type: 'digital' },
  { id: '5', title: 'Reina de Ébano', image: '/artworks/art.svg', category: 'photography', year: '2020', author: 'Steve McCurry', description: 'Fotografía de una niña africana sosteniendo una reina de ébano tallada a mano. El ajedrez como lenguaje universal.', tags: ['Fotografía documental', 'África', 'Contemporáneo'], type: 'photography' },
  { id: '6', title: 'Jaque Mate', image: '/artworks/art.svg', category: 'painting', year: '1890', author: 'Friedrich August von Kaulbach', description: 'Escena dramática del momento decisivo en una partida de salón vienés. La tensión del mate en estado puro.', tags: ['Academicismo', 'Austria', 'Siglo XIX'], type: 'painting' },
];

const artFilters = [
  { value: 'all', label: 'Todo' },
  { value: 'painting', label: 'Pintura' },
  { value: 'sculpture', label: 'Escultura' },
  { value: 'digital', label: 'Digital' },
  { value: 'photography', label: 'Fotografía' },
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

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      <main className="pt-20 lg:pt-24">
        <GalleryPage
          items={mockArtData}
          categoryKey="art"
          locale={locale}
          title={t.art?.title || 'ARTE AJEDREZ'}
          subtitle={t.art?.subtitle || 'Obras maestras donde el ajedrez inspira el arte'}
          searchPlaceholder={t.art?.search || 'Buscar obras...'}
          filters={locale === 'es' ? artFilters : artFilters.map((f) => ({ ...f, label: f.value === 'all' ? 'All' : f.label }))}
        />
        <AIChatWidget locale={locale} />
      </main>
    </div>
  );
}
