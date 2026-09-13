'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { PGNViewer } from '@/components/chess/PGNViewer';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { CombinationCard } from '@/components/combinations/CombinationCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Brain, Palette, Share2, Download, ChevronLeft, ChevronRight, Heart, BookOpen, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Combination } from '@/types/combination';
import { DIFFICULTY_COLORS } from '@/lib/chess/pgn-utils';
import { getTranslations } from '@/lib/i18n';

const DIFFICULTY_LABELS_ES: Record<string, string> = {
  Beginner: 'Principiante',
  Easy: 'Fácil',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado',
  Expert: 'Experto',
  Master: 'Maestro',
};

interface CombinationDetailClientProps {
  combination: Combination;
}

export function CombinationDetailClient({ combination }: CombinationDetailClientProps) {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [activeTab, setActiveTab] = useState<'board' | 'artwork' | 'analysis'>('board');
  const [relatedCombinations, setRelatedCombinations] = useState<Combination[]>([]);
  const [showFullArtwork, setShowFullArtwork] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const translations = getTranslations(locale);
  const difficultyColor = DIFFICULTY_COLORS[combination.difficulty] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  const difficultyLabel = DIFFICULTY_LABELS_ES[combination.difficulty] || combination.difficulty;
  const formatNumber = (num: number) => `#${num.toString().padStart(3, '0')}`;

  useEffect(() => {
    fetch(`/api/combinations?category=${combination.category}&difficulty=${combination.difficulty}&limit=4`)
      .then(res => res.json())
      .then(data => {
        setRelatedCombinations(data.combinations.filter((c: Combination) => c.id !== combination.id).slice(0, 4));
      })
      .catch(console.error);
  }, [combination.category, combination.difficulty, combination.id]);

  const chessContext = {
    currentFen: combination.fen,
    currentPgn: combination.pgn,
    moveHistory: [],
    currentMoveIndex: -1,
    combination,
  };

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header locale={locale} />
      <main className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
          {/* Breadcrumb / Back */}
          <div className="mb-8">
            <Link
              href="/combinaciones"
              className="inline-flex items-center gap-2 text-sm text-chess-text-secondary hover:text-chess-gold transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{locale === 'es' ? 'Volver a la galería' : 'Back to gallery'}</span>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-chess-gold">{formatNumber(combination.number)}</span>
              <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
                {DIFFICULTY_LABELS_ES[combination.difficulty]}
              </Badge>
              {combination.category && (
                <Badge variant="outline" className="text-xs border-chess-border/50 text-chess-text-secondary">
                  {combination.category}
                </Badge>
              )}
              {combination.opening && (
                <Badge variant="outline" className="text-xs border-chess-border/50 text-chess-text-secondary">
                  {combination.opening}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-8 lg:space-y-12">
            {/* Title & Meta */}
            <div className="space-y-4">
              <h1 className="font-display text-display-sm lg:display-md text-chess-text-primary leading-tight">
                {combination.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-chess-text-secondary text-sm">
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-chess-gold" />
                  {combination.white_player} vs {combination.black_player}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {combination.event} · {combination.year}
                </span>
                <span className="flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  {combination.result}
                </span>
              </div>
            </div>

            {/* Main Content: Artwork + Board */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Artwork Panel */}
              <div className="space-y-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-chess-surface border border-chess-border/50">
                  {combination.artwork_url ? (
                    <button
                      onClick={() => setShowFullArtwork(true)}
                      className="w-full h-full relative"
                      aria-label={locale === 'es' ? 'Ver ilustración a pantalla completa' : 'View fullscreen artwork'}
                    >
                      <img
                        src={combination.artwork_url}
                        alt={combination.title}
                        className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-chess-bg/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="bg-chess-surface/80 backdrop-blur">
                          <ExternalLink className="h-4 w-4 text-chess-gold" />
                        </Button>
                      </div>
                    </button>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-chess-text-muted">
                      <Palette className="h-16 w-16 text-chess-gold/50" />
                      <p className="font-display text-chess-text-secondary">{locale === 'es' ? 'Ilustración de Pablo Iglesias' : 'Artwork by Pablo Iglesias'}</p>
                      <p className="text-sm text-chess-text-muted">Próximamente</p>
                    </div>
                  )}
                </div>

                {combination.artist_notes && (
                  <div className="glass p-6">
                    <div className="flex items-center gap-2 text-sm font-medium text-chess-gold mb-3">
                      <Palette className="h-4 w-4" />
                      <span>{locale === 'es' ? 'Notas del artista' : 'Artist notes'}</span>
                    </div>
                    <p className="text-body-md text-chess-text-secondary leading-relaxed">{combination.artist_notes}</p>
                  </div>
                )}
              </div>

              {/* Board Panel */}
              <div className="space-y-6">
                <div role="tablist" className="flex border-b border-chess-border/50">
                  {[
                    { id: 'board', label: locale === 'es' ? 'Tablero Interactivo' : 'Interactive Board', icon: Brain },
                    { id: 'artwork', label: locale === 'es' ? 'Ilustración' : 'Artwork', icon: Palette },
                    { id: 'analysis', label: locale === 'es' ? 'Análisis' : 'Analysis', icon: BookOpen },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`${tab.id}-panel`}
                      id={`${tab.id}-tab`}
                      onClick={() => setActiveTab(tab.id as 'board' | 'artwork' | 'analysis')}
                      className={cn(
                        'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all duration-200',
                        activeTab === tab.id
                          ? 'border-chess-gold text-chess-gold bg-chess-gold/5'
                          : 'border-transparent text-chess-text-secondary hover:text-chess-text-primary hover:border-chess-gold/30 hover:bg-chess-surface-elevated/30'
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div role="tabpanel" className="pt-6">
                  {activeTab === 'board' && (
                    <PGNViewer
                      pgn={combination.pgn}
                      initialFen={combination.fen}
                      showControls={true}
                      showMoveList={true}
                      autoPlaySpeed={1000}
                    />
                  )}

                  {activeTab === 'artwork' && combination.artwork_url && (
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-chess-surface border border-chess-border/50">
                      <img
                        src={combination.artwork_url}
                        alt={combination.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {activeTab === 'analysis' && (
                    <div className="space-y-6">
                      <div className="glass p-6">
                        <h3 className="font-display text-heading-sm text-chess-text-primary mb-4">
                          {locale === 'es' ? 'Descripción y análisis' : 'Description & Analysis'}
                        </h3>
                        <p className="text-body-md text-chess-text-secondary leading-relaxed">
                          {combination.description || (locale === 'es' ? 'Sin descripción disponible.' : 'No description available.')}
                        </p>
                      </div>

                      <div className="glass p-6">
                        <h3 className="font-display text-heading-sm text-chess-text-primary mb-4">
                          {locale === 'es' ? 'Ideas tácticas clave' : 'Key Tactical Ideas'}
                        </h3>
                        <ul className="space-y-3 text-chess-text-secondary text-body-md">
                          <li className="flex items-start gap-3 group">
                            <span className="w-2 h-2 rounded-full bg-chess-gold mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                            <span className="text-chess-text-secondary group-hover:text-chess-text-primary transition-colors">{locale === 'es' ? 'Sacrificio de material por iniciativa decisiva' : 'Material sacrifice for decisive initiative'}</span>
                          </li>
                          <li className="flex items-start gap-3 group">
                            <span className="w-2 h-2 rounded-full bg-chess-gold mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                            <span className="text-chess-text-secondary group-hover:text-chess-text-primary transition-colors">{locale === 'es' ? 'Coordinación armónica de piezas menores' : 'Harmonious coordination of minor pieces'}</span>
                          </li>
                          <li className="flex items-start gap-3 group">
                            <span className="w-2 h-2 rounded-full bg-chess-gold mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                            <span className="text-chess-text-secondary group-hover:text-chess-text-primary transition-colors">{locale === 'es' ? 'Mate en el centro del tablero' : 'Mate in the center of the board'}</span>
                          </li>
                          <li className="flex items-start gap-3 group">
                            <span className="w-2 h-2 rounded-full bg-chess-gold mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                            <span className="text-chess-text-secondary group-hover:text-chess-text-primary transition-colors">{locale === 'es' ? 'Desarrollo rápido y control central absoluto' : 'Rapid development and absolute central control'}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PGN Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-heading-md text-chess-text-primary flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-chess-gold" />
                  {locale === 'es' ? 'Partida completa (PGN)' : 'Full Game (PGN)'}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-chess-text-secondary hover:text-chess-gold">
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-chess-text-secondary hover:text-chess-gold">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="glass-strong p-6">
                <PGNViewer
                  pgn={combination.pgn}
                  initialFen={combination.fen}
                  showControls={true}
                  showMoveList={true}
                />
              </div>
            </section>

            {/* Related Combinations */}
            {relatedCombinations.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-heading-md text-chess-text-primary flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-chess-gold" />
                    {locale === 'es' ? 'Combinaciones relacionadas' : 'Related combinations'}
                  </h2>
                  <Link
                    href="/combinaciones"
                    className="text-sm text-chess-gold hover:text-chess-gold-light font-medium flex items-center gap-1"
                  >
                    {locale === 'es' ? 'Ver todas' : 'View all'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedCombinations.map(related => (
                    <CombinationCard
                      key={related.id}
                      combination={related}
                      locale={locale}
                      variant="compact"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Pablo Iglesias Artist Profile */}
            <section className="border-t border-chess-border/30 pt-12">
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="font-display text-heading-md text-chess-text-primary flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chess-gold to-chess-gold-light flex items-center justify-center">
                      <Palette className="h-6 w-6 text-chess-bg" />
                    </div>
                    <span>{locale === 'es' ? 'El artista: Pablo Iglesias' : 'The Artist: Pablo Iglesias'}</span>
                  </h2>
                  <div className="text-chess-text-secondary leading-relaxed space-y-4">
                    <p>
                      {locale === 'es'
                        ? 'Pablo Iglesias es un artista visual especializado en la intersección entre el ajedrez y el arte contemporáneo. Su serie "Top 100 Combinaciones de la Historia" transforma posiciones ajedrecísticas icónicas en obras de arte que capturan la tensión, el sacrificio y la belleza de cada momento decisivo.'
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
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chess-gold to-chess-gold-light flex items-center justify-center">
                        <span className="text-2xl font-bold text-chess-bg">PI</span>
                      </div>
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
                        href="mailto:pablo.iglesias@chessart.ai"
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
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-chess-border/30 bg-chess-surface/50 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-chess-text-muted text-sm">
          <p>Chess Art & AI Academy · {new Date().getFullYear()} · {translations.footer.rights}</p>
        </div>
      </footer>

      {/* Fullscreen Artwork Modal */}
      {showFullArtwork && combination.artwork_url && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center p-4"
          onClick={() => setShowFullArtwork(false)}
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'es' ? 'Ilustración a pantalla completa' : 'Fullscreen artwork'}
        >
          <img
            src={combination.artwork_url}
            alt={combination.title}
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setShowFullArtwork(false)}
            className="absolute top-6 right-6 p-2 glass rounded-full text-chess-text-secondary hover:text-chess-text-primary hover:bg-chess-surface-elevated/50 transition-all"
            aria-label={locale === 'es' ? 'Cerrar' : 'Close'}
          >
            <ChevronLeft className="h-6 w-6 rotate-45" />
          </button>
        </div>
      )}

      <AIChatWidget initialContext={chessContext} locale={locale} />
    </div>
  );
}