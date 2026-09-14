'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Hero } from '@/components/layout/Hero';
import { CombinationCard, CombinationVisual } from '@/components/combinations/CombinationCard';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { PGNViewer } from '@/components/chess/PGNViewer';
import { getTranslations } from '@/lib/i18n';
import type { Combination } from '@/types/combination';
import { ChessRook, ArrowRight, Sparkles, ExternalLink, Palette } from 'lucide-react';
import { DIFFICULTY_COLORS } from '@/lib/chess/pgn-utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DIFFICULTY_LABELS_ES: Record<string, string> = {
  Beginner: 'Principiante', Easy: 'Fácil', Intermediate: 'Intermedio',
  Advanced: 'Avanzado', Expert: 'Experto', Master: 'Maestro',
};

interface HomeClientProps {
  featured: Combination | null;
  galleryPreview: Combination[];
}

export function HomeClient({ featured, galleryPreview }: HomeClientProps) {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [activeTab, setActiveTab] = useState<'board' | 'artwork'>('board');
  
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);
  
  const translations = getTranslations(locale);
  
  const chessContext = featured ? {
    currentFen: featured.fen,
    currentPgn: featured.pgn,
    moveHistory: [],
    currentMoveIndex: -1,
    combination: featured,
  } : undefined;

  const handleAgentToggle = () => {
    // The agent will handle its own toggle via the button click
  };

  return (
    <div className="min-h-screen bg-chess-bg">
      {/* Header */}
      <Header />

      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <Hero locale={locale} />

        {/* Featured Combination */}
        {featured && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-16 lg:py-24"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-chess-surface/50 border border-chess-border/50 rounded-full text-sm font-medium text-chess-gold mb-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chess-gold opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-chess-gold" />
                    </span>
                    <span className="font-display text-chess-gold">♟ {translations.gallery.title}</span>
                  </span>
                  <h2 className="font-display text-heading-lg text-chess-text-primary">
                    {locale === 'es' ? 'Combinación destacada de la semana' : 'Featured combination of the week'}
                  </h2>
                </div>
                <Link
                  href="/combinaciones"
                  className="btn-secondary self-end whitespace-nowrap"
                >
                  {locale === 'es' ? 'Ver todas las combinaciones' : 'View all combinations'}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Artwork Panel */}
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-chess-surface border border-chess-border/50">
                    {featured.artwork_url ? (
                      <CombinationVisual
                        combination={featured}
                        imgClassName="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-chess-text-muted">
                        <Palette className="h-16 w-16 text-chess-gold/50" />
                        <p className="font-display text-chess-text-secondary">{locale === 'es' ? 'Ilustración de Pablo Iglesias' : 'Artwork by Pablo Iglesias'}</p>
                        <p className="text-sm text-chess-text-muted">Próximamente</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-chess-bg/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {featured.artist_notes && (
                    <motion.div
                      className="mt-6 glass p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-chess-gold mb-3">
                        <Palette className="h-4 w-4" />
                        <span>{locale === 'es' ? 'Notas del artista' : 'Artist notes'}</span>
                      </div>
                      <p className="text-body-md text-chess-text-secondary leading-relaxed">{featured.artist_notes}</p>
                    </motion.div>
                  )}
                </div>

                {/* Interactive Board Panel */}
                <div className="relative w-full max-w-[560px] justify-self-center">
                  <div className="mb-6 flex flex-wrap items-center gap-2" role="tablist">
                    {[
                      { id: 'board', label: locale === 'es' ? 'Tablero Interactivo' : 'Interactive Board', icon: ChessRook },
                      { id: 'artwork', label: locale === 'es' ? 'Ilustración Completa' : 'Full Artwork', icon: Sparkles },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        id={`${tab.id}-tab`}
                        onClick={() => setActiveTab(tab.id as 'board' | 'artwork')}
                        className={cn(
                          'flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200',
                          activeTab === tab.id
                            ? 'border-chess-gold bg-chess-gold/5 text-chess-gold'
                            : 'border-chess-border/50 text-chess-text-secondary hover:text-chess-text-primary hover:border-chess-gold/30 hover:bg-chess-surface-elevated/30'
                        )}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div role="tabpanel" className="chess-board-container">
                    {activeTab === 'board' && (
                      <PGNViewer
                        pgn={featured.pgn}
                        initialFen={featured.fen}
                        showControls={true}
                        showMoveList={true}
                        autoPlaySpeed={1000}
                      />
                    )}
                    
                    {activeTab === 'artwork' && featured.artwork_url && (
                      <div className="relative aspect-square">
                        <img
                          src={featured.artwork_url}
                          alt={featured.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (!img.src.endsWith('/artworks/placeholder.svg')) {
                              img.src = '/artworks/placeholder.svg';
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Combination Info */}
                  <motion.div
                    className="mt-6 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-mono text-chess-gold">#{featured.number.toString().padStart(3, '0')}</span>
                      <span className={cn('badge-difficulty', DIFFICULTY_COLORS[featured.difficulty])}>
                        {DIFFICULTY_LABELS_ES[featured.difficulty] || featured.difficulty}
                      </span>
                      {featured.category && (
                        <span className="badge-difficulty bg-chess-surface-elevated/50 text-chess-text-secondary border-chess-border/50 px-3 py-1.5">
                          {featured.category}
                        </span>
                      )}
                      {featured.opening && (
                        <span className="badge-difficulty bg-chess-surface-elevated/50 text-chess-text-secondary border-chess-border/50 px-3 py-1.5">
                          {featured.opening}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-heading-md text-chess-text-primary">
                      {featured.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-chess-text-secondary text-sm">
                      <span className="flex items-center gap-1">
                        <ChessRook className="h-4 w-4 text-chess-gold" />
                        {featured.white_player} vs {featured.black_player}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="hidden sm:inline">•</span>
                        {featured.event} · {featured.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="hidden sm:inline">•</span>
                        {featured.result}
                      </span>
                    </div>
                  </motion.div>

                  {/* CTA */}
                  <Link
                    href={`/combinaciones/${featured.slug}`}
                    className="mt-6 w-full sm:w-auto"
                  >
                    <Button className="btn-primary w-full sm:w-auto group" size="lg">
                      {locale === 'es' ? 'Explorar combinación completa' : 'Explore full combination'}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Gallery Preview */}
        {galleryPreview.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="py-16 lg:py-24 bg-chess-surface/30"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display text-heading-lg text-chess-text-primary">
                    {locale === 'es' ? 'Más combinaciones históricas' : 'More historical combinations'}
                  </h2>
                  <p className="mt-2 text-body-md text-chess-text-secondary">
                    {locale === 'es' 
                      ? 'Descubre las obras maestras que definieron la historia del ajedrez'
                      : 'Discover the masterpieces that defined chess history'}
                  </p>
                </div>
                <Link
                  href="/combinaciones"
                  className="btn-secondary self-end whitespace-nowrap"
                >
                  {locale === 'es' ? 'Ver galería completa' : 'View full gallery'}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>

              <div className="masonry-grid">
                {galleryPreview.map((combination, index) => (
                  <motion.article
                    key={combination.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                    className={cn(
                      'card-interactive group relative overflow-hidden',
                      index === 0 && 'lg:col-span-2 lg:row-span-2 masonry-item-lg',
                      index === 3 && 'xl:col-span-2 xl:row-span-2 masonry-item-xl'
                    )}
                  >
                    <Link href={`/combinaciones/${combination.slug}`} className="block">
                      <div className="relative aspect-square overflow-hidden">
                        {combination.artwork_url ? (
                          <motion.img
                            src={combination.artwork_url}
                            alt={combination.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-chess-surface-elevated">
                            <ChessRook className="h-12 w-12 text-chess-border" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-chess-bg/80 via-transparent to-transparent group-hover:from-chess-bg/60 transition-all duration-500" />
                        
                        {/* Overlay info */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-mono text-chess-gold bg-chess-bg/80 px-2 py-1 rounded">
                              #{combination.number.toString().padStart(3, '0')}
                            </span>
                            <span className={cn('badge-difficulty', DIFFICULTY_COLORS[combination.difficulty])}>
                              {DIFFICULTY_LABELS_ES[combination.difficulty]}
                            </span>
                          </div>
                          <div className="text-left">
                            <h3 className="font-display text-lg md:text-xl font-semibold text-chess-text-primary mb-1 group-hover:text-chess-gold transition-colors">
                              {combination.title}
                            </h3>
                            <p className="text-sm text-chess-text-secondary">
                              {combination.white_player} vs {combination.black_player}
                            </p>
                            <p className="text-xs text-chess-text-muted">
                              {combination.event} · {combination.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 text-center"
              >
                <Link href="/combinaciones" className="btn-secondary inline-flex">
                  {locale === 'es' ? 'Ver las 100 combinaciones' : 'View all 100 combinations'}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* About / Artist Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="py-16 lg:py-24 border-t border-chess-border/30"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-display text-heading-lg text-chess-text-primary flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-chess-gold to-chess-gold-light flex items-center justify-center">
                    <Sparkles className="h-7 w-7 text-chess-bg" />
                  </div>
                  <span>{locale === 'es' ? 'El artista: Pablo Iglesias' : 'The Artist: Pablo Iglesias'}</span>
                </h2>
                <div className="prose prose-invert max-w-none text-chess-text-secondary leading-relaxed space-y-4">
                  <p>
                    {locale === 'es'
                      ? 'Pablo Iglesias es un artista visual especializado en la intersección entre el ajedrez y el arte contemporáneo. Su serie <strong>"Top 100 Combinaciones de la Historia"</strong> transforma posiciones ajedrecísticas icónicas en obras de arte que capturan la tensión, el sacrificio y la belleza de cada momento decisivo.'
                      : 'Pablo Iglesias is a visual artist specialized in the intersection of chess and contemporary art. His series "Top 100 Combinations in History" transforms iconic chess positions into artworks that capture the tension, sacrifice, and beauty of each decisive moment.'
                    }
                  </p>
                  <p>
                    {locale === 'es'
                      ? 'Cada ilustración nace del diagrama 2D de la posición inicial del problema, utilizando la geometría del tablero como lienzo compositivo base. Las piezas, los ataques, las debilidades y la tensión posicional se traducen en formas, colores y texturas que evocan la drama de la combinación sin alterar la verdad ajedrecística.'
                      : 'Each illustration is born from the 2D diagram of the initial problem position, using the board geometry as a base compositional canvas. The pieces, attacks, weaknesses, and positional tension are translated into forms, colors, and textures that evoke the drama of the combination without altering the chess truth.'
                    }
                  </p>
                  <p>
                    {locale === 'es'
                      ? 'Su trabajo ha sido expuesto en galerías de arte contemporáneo y clubs de ajedrez internacionales, creando un puente único entre la comunidad ajedrecística y el mundo del arte visual.'
                      : 'His work has been exhibited in contemporary art galleries and international chess clubs, creating a unique bridge between the chess community and the visual art world.'
                    }
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="/artists/pablo-iglesias.svg"
                      alt="Retrato ilustrado de Pablo Iglesias"
                      className="w-16 h-16 rounded-2xl object-cover border border-chess-gold/30"
                    />
                    <div>
                      <p className="font-semibold text-chess-text-primary">Pablo Iglesias</p>
                      <p className="text-sm text-chess-text-muted">{locale === 'es' ? 'Artista de la serie Top 100' : 'Top 100 Series Artist'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-chess-text-secondary mb-6">
                    {locale === 'es'
                      ? 'Artista visual especializado en la intersección entre ajedrez y arte contemporáneo.'
                      : 'Visual artist specialized in the intersection of chess and contemporary art.'
                    }
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="mailto:chessaiagency@gmail.com" 
                      className="flex items-center gap-3 text-sm text-chess-text-secondary hover:text-chess-gold transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-chess-surface-elevated/50 flex items-center justify-center group-hover:bg-chess-gold/20 transition-colors">
                        <Palette className="h-4 w-4" />
                      </span>
                      {locale === 'es' ? 'Contactar para colaboraciones' : 'Contact for collaborations'}
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center gap-3 text-sm text-chess-text-secondary hover:text-chess-gold transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-chess-surface-elevated/50 flex items-center justify-center group-hover:bg-chess-gold/20 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </span>
                      {locale === 'es' ? 'Ver portafolio completo' : 'View full portfolio'}
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center gap-3 text-sm text-chess-text-secondary hover:text-chess-gold transition-colors group"
                    >
                      <span className="w-8 h-8 rounded-lg bg-chess-surface-elevated/50 flex items-center justify-center group-hover:bg-chess-gold/20 transition-colors">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      {locale === 'es' ? 'Seguir en redes sociales' : 'Follow on social media'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </main>

      <SiteFooter />

      <AIChatWidget initialContext={chessContext} locale={locale} />
    </div>
  );
}