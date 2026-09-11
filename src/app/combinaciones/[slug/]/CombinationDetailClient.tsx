'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PGNViewer } from '@/components/chess/PGNViewer';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { CombinationCard } from '@/components/combinations/CombinationCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Trophy, 
  Brain, 
  Palette, 
  Share2, 
  Download,
  ChevronLeft,
  ChevronRight,
  Heart,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import type { Combination } from '@/types/combination';
import { DIFFICULTY_COLORS } from '@/lib/chess/pgn-utils';
import { getTranslations, t } from '@/lib/i18n';

const DIFFICULTY_LABELS_ES: Record<string, string> = {
  Beginner: 'Principiante', Easy: 'Fácil', Intermediate: 'Intermedio',
  Advanced: 'Avanzado', Expert: 'Experto', Master: 'Maestro',
};

interface CombinationDetailClientProps {
  combination: Combination;
}

export function CombinationDetailClient({ combination }: CombinationDetailClientProps) {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [activeTab, setActiveTab] = useState<'board' | 'artwork' | 'analysis'>('board');
  const [relatedCombinations, setRelatedCombinations] = useState<Combination[]>([]);
  const [showFullArtwork, setShowFullArtwork] = useState(false);
  
  const translations = getTranslations(locale);
  const difficultyColor = DIFFICULTY_COLORS[combination.difficulty] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  const difficultyLabel = DIFFICULTY_LABELS_ES[combination.difficulty] || combination.difficulty;
  const formatNumber = (num: number) => `#${num.toString().padStart(3, '0')}`;

  useEffect(() => {
    // Fetch related combinations (same category or difficulty)
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
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-xl text-white tracking-tight">
                CHESS ART
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/combinaciones" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {translations.nav.top100}
                </Link>
                <Link href="/visor" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {translations.nav.pgn}
                </Link>
                <Link href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {translations.nav.about}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setLocale(l => l === 'es' ? 'en' : 'es')}>
                {locale === 'es' ? 'EN' : 'ES'}
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-blue-400">{formatNumber(combination.number)}</span>
              <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
                {difficultyLabel}
              </Badge>
              {combination.category && (
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                  {combination.category}
                </Badge>
              )}
              {combination.opening && (
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                  {combination.opening}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {combination.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
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
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Artwork Panel */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                {combination.artwork_url ? (
                  <button
                    onClick={() => setShowFullArtwork(true)}
                    className="w-full h-full relative"
                    aria-label="Ver ilustración a pantalla completa"
                  >
                    <img
                      src={combination.artwork_url}
                      alt={combination.title}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="default" size="icon" className="bg-white/10 backdrop-blur">
                        <Palette className="h-4 w-4" />
                      </Button>
                    </div>
                  </button>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                    <Palette className="h-16 w-16" />
                    <p>Ilustración no disponible</p>
                    <p className="text-xs">Próximamente: arte de Pablo Iglesias</p>
                  </div>
                )}
              </div>
              
              {combination.artist_notes && (
                <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Palette className="h-4 w-4 text-blue-400" />
                    <span>{locale === 'es' ? 'Notas del artista' : 'Artist notes'}</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{combination.artist_notes}</p>
                </div>
              )}
            </div>

            {/* Board Panel */}
            <div className="space-y-4">
              <div role="tablist" className="flex border-b border-slate-800">
                {[
                  { id: 'board', label: locale === 'es' ? 'Tablero' : 'Board', icon: Brain },
                  { id: 'analysis', label: locale === 'es' ? 'Análisis' : 'Analysis', icon: BookOpen },
                ].map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id as 'board' | 'analysis')}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div role="tabpanel" className="pt-4">
                {activeTab === 'board' && (
                  <PGNViewer
                    pgn={combination.pgn}
                    initialFen={combination.fen}
                    showControls={true}
                    showMoveList={true}
                    autoPlaySpeed={1000}
                  />
                )}
                
                {activeTab === 'analysis' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                      <h3 className="font-medium text-white mb-3">
                        {locale === 'es' ? 'Descripción' : 'Description'}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {combination.description || (locale === 'es' ? 'Sin descripción disponible.' : 'No description available.')}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                      <h3 className="font-medium text-white mb-3">
                        {locale === 'es' ? 'Ideas tácticas clave' : 'Key Tactical Ideas'}
                      </h3>
                      <ul className="space-y-2 text-slate-400 text-sm">
                        <li className="flex items-start gap-2">• Sacrificio de material por iniciativa</li>
                        <li className="flex items-start gap-2">• Coordinación de piezas menores</li>
                        <li className="flex items-start gap-2">• Mate en el centro del tablero</li>
                        <li className="flex items-start gap-2">• Desarrollo rápido y control central</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PGN Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              {locale === 'es' ? 'Partida completa (PGN)' : 'Full Game (PGN)'}
            </h2>
            <PGNViewer
              pgn={combination.pgn}
              initialFen={combination.fen}
              showControls={true}
              showMoveList={true}
            />
          </section>

          {/* Related Combinations */}
          {relatedCombinations.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  {locale === 'es' ? 'Combinaciones relacionadas' : 'Related combinations'}
                </h2>
                <Link
                  href="/combinaciones"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Ver todas →
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
          <section className="border-t border-slate-800 pt-8">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-400" />
                  {locale === 'es' ? 'El artista: Pablo Iglesias' : 'The Artist: Pablo Iglesias'}
                </h2>
                <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed">
                  <p>
                    Pablo Iglesias es un artista visual especializado en la intersección entre el ajedrez y el arte contemporáneo. 
                    Su serie <strong>Top 100 Combinaciones de la Historia</strong> transforma posiciones ajedrecísticas icónicas 
                    en obras de arte que capturan la tensión, el sacrificio y la belleza de cada momento decisivo.
                  </p>
                  <p>
                    Cada ilustración nace del diagrama 2D de la posición inicial del problema, utilizando la geometría del tablero 
                    como lienzo compositivo base. Las piezas, los ataques, las debilidades y la tensión posicional se traducen 
                    en formas, colores y texturas que evocan la drama de la combinación sin alterar la verdad ajedrecística.
                  </p>
                  <p>
                    Su trabajo ha sido expuesto en galerías de arte contemporáneo y clubs de ajedrez internacionales, 
                    creando un puente único entre la comunidad ajedrecística y el mundo del arte visual.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">PI</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">Pablo Iglesias</p>
                      <p className="text-xs text-slate-400">Artista de la serie Top 100</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <a 
                      href="mailto:pablo.iglesias@chessart.ai" 
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      Contactar para colaboraciones
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      Ver portafolio completo
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      Seguir en redes sociales
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>Chess Art & AI Academy · {new Date().getFullYear()} · {translations.footer.rights}</p>
        </div>
      </footer>

      {/* Fullscreen Artwork Modal */}
      {showFullArtwork && combination.artwork_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center p-4"
          onClick={() => setShowFullArtwork(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ilustración a pantalla completa"
        >
          <motion.img
            src={combination.artwork_url}
            alt={combination.title}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setShowFullArtwork(false)}
            className="absolute top-6 right-6 p-2 bg-slate-900/50 backdrop-blur rounded-full text-slate-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <ChevronRight className="h-6 w-6 rotate-45" />
          </button>
        </motion.div>
      )}

      <AIChatWidget initialContext={chessContext} locale={locale} />
    </div>
  );
}