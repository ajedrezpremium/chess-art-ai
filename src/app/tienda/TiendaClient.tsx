'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { ShoppingBag, BookOpen, Crown, Palette, Clapperboard, ExternalLink, Info } from 'lucide-react';

interface ShopLink {
  name: string;
  url: string;
  descEs: string;
  descEn: string;
}

interface ShopCategory {
  id: string;
  icon: typeof BookOpen;
  titleEs: string;
  titleEn: string;
  links: ShopLink[];
}

const CATEGORIES: ShopCategory[] = [
  {
    id: 'libros',
    icon: BookOpen,
    titleEs: 'Libros de ajedrez',
    titleEn: 'Chess books',
    links: [
      {
        name: 'ChessBase Shop',
        url: 'https://shop.chessbase.com/en',
        descEs: 'Editorial oficial: DVDs, libros digitales y bases de datos de los grandes maestros.',
        descEn: 'Official publisher: DVDs, e-books and databases from grandmasters.',
      },
      {
        name: 'Everyman Chess',
        url: 'https://www.everymanchess.com',
        descEs: 'Editorial británica de referencia: aperturas, estrategia y finales.',
        descEn: 'Leading British publisher: openings, strategy and endgames.',
      },
      {
        name: 'Quality Chess',
        url: 'https://www.qualitychess.co.uk',
        descEs: 'Libros de alto nivel para jugadores de club y profesionales.',
        descEn: 'High-level books for club players and professionals.',
      },
      {
        name: 'New In Chess',
        url: 'https://www.newinchess.com',
        descEs: 'Revista y editorial holandesa legendaria desde 1984.',
        descEn: 'Legendary Dutch magazine and publisher since 1984.',
      },
      {
        name: 'Casa del Libro',
        url: 'https://www.casadellibro.com/libros-de-ajedrez/121000000',
        descEs: 'Librería española con sección de ajedrez en castellano.',
        descEn: 'Spanish bookshop with a chess section in Spanish.',
      },
    ],
  },
  {
    id: 'tableros',
    icon: Crown,
    titleEs: 'Tableros y piezas',
    titleEn: 'Boards & pieces',
    links: [
      {
        name: 'House of Staunton',
        url: 'https://www.houseofstaunton.com',
        descEs: 'Piezas Staunton artesanales, proveedor de campeonatos oficiales.',
        descEn: 'Handcrafted Staunton pieces, supplier of official championships.',
      },
      {
        name: 'DGT',
        url: 'https://www.dgt.nl',
        descEs: 'Tableros y relojes electrónicos oficiales de la FIDE.',
        descEn: 'Official FIDE electronic boards and clocks.',
      },
      {
        name: 'ChessBaron',
        url: 'https://www.chessbaron.co.uk',
        descEs: 'Tienda europea clásica: juegos, relojes y accesorios.',
        descEn: 'Classic European shop: sets, clocks and accessories.',
      },
    ],
  },
  {
    id: 'arte',
    icon: Palette,
    titleEs: 'Arte y obra gráfica',
    titleEn: 'Art & prints',
    links: [
      {
        name: 'Tienda Museo del Prado',
        url: 'https://tienda.museodelprado.es',
        descEs: 'Reproducciones y obra gráfica del museo (envío internacional).',
        descEn: 'Museum reproductions and prints (international shipping).',
      },
      {
        name: 'The MET Store',
        url: 'https://store.metmuseum.org',
        descEs: 'Tienda oficial del Metropolitan Museum of Art de Nueva York.',
        descEn: 'Official store of New York’s Metropolitan Museum of Art.',
      },
    ],
  },
  {
    id: 'cine',
    icon: Clapperboard,
    titleEs: 'Cine y documentales',
    titleEn: 'Film & documentaries',
    links: [
      {
        name: 'Filmin',
        url: 'https://www.filmin.es',
        descEs: 'Plataforma con cine de autor: busca «ajedrez» en su catálogo.',
        descEn: 'Arthouse streaming platform: search “chess” in its catalogue.',
      },
      {
        name: 'Amazon',
        url: 'https://www.amazon.es/s?k=ajedrez+pelicula',
        descEs: 'Películas y documentales sobre ajedrez en DVD y streaming.',
        descEn: 'Chess films and documentaries on DVD and streaming.',
      },
    ],
  },
];

export function TiendaClient() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  useEffect(() => {
    const h = (e: CustomEvent<'es' | 'en'>) => setLocale(e.detail);
    window.addEventListener('toggle-language', h as EventListener);
    return () => window.removeEventListener('toggle-language', h as EventListener);
  }, []);
  const es = locale === 'es';

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header locale={locale} />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-36 md:pt-44 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-chess-surface/50 border border-chess-border/50 rounded-full text-sm font-medium text-chess-gold mb-4">
            <ShoppingBag className="h-4 w-4" />
            {es ? 'Enlaces oficiales' : 'Official links'}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-chess-text-primary">
            {es ? 'Tienda' : 'Shop'}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-chess-text-secondary">
            {es
              ? 'Selección de tiendas y editoriales oficiales para informarte y comprar obras relacionadas con el ajedrez: libros, cuadros, dibujos y películas.'
              : 'A selection of official shops and publishers to explore and buy chess-related works: books, paintings, drawings and films.'}
          </p>
        </motion.div>

        <div className="space-y-12">
          {CATEGORIES.map((cat, ci) => (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: ci * 0.08 }}
            >
              <h2 className="flex items-center gap-3 font-display text-xl md:text-2xl font-bold text-chess-text-primary mb-6">
                <span className="w-10 h-10 rounded-xl bg-chess-gold/10 border border-chess-gold/30 flex items-center justify-center">
                  <cat.icon className="h-5 w-5 text-chess-gold" />
                </span>
                {es ? cat.titleEs : cat.titleEn}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="card-interactive group p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-chess-text-primary group-hover:text-chess-gold transition-colors">
                        {link.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-chess-text-muted group-hover:text-chess-gold transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-sm text-chess-text-secondary leading-relaxed flex-1">
                      {es ? link.descEs : link.descEn}
                    </p>
                    <span className="mt-3 text-xs font-medium text-chess-gold">
                      {es ? 'Enlace oficial ↗' : 'Official link ↗'}
                    </span>
                  </a>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <p className="mt-12 flex items-start gap-2 text-sm text-chess-text-muted max-w-3xl">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-chess-gold" />
          {es
            ? 'Todos los enlaces llevan a webs oficiales externas. ChessArt AI no vende directamente ni recibe comisión: es una guía editorial independiente.'
            : 'All links go to external official websites. ChessArt AI does not sell directly nor earns commission: it is an independent editorial guide.'}
        </p>
      </main>
      <SiteFooter locale={locale} />
      <AIChatWidget locale={locale} />
    </div>
  );
}
