'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CombinationCard } from '@/components/combinations/CombinationCard';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { PGNViewer } from '@/components/chess/PGNViewer';
import { getTranslations } from '@/lib/i18n';
import type { Combination } from '@/types/combination';
import { 
  Calendar, 
  Trophy, 
  Brain, 
  Palette, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  ChessRook
} from 'lucide-react';
import { DIFFICULTY_COLORS } from '@/lib/chess/pgn-utils';

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
  
  const translations = getTranslations(locale);
  
  const chessContext = featured ? {
    currentFen: featured.fen,
    currentPgn: featured.pgn,
    moveHistory: [],
    currentMoveIndex: -1,
    combination: featured,
  } : undefined;

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
              <button
                onClick={() => setLocale(l => l === 'es' ? 'en' : 'es')}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition-colors"
              >
                {locale === 'es' ? 'EN' : 'ES'}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-20 md:py-32 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-blue-400 font-medium">
              <Sparkles className="h-4 w-4" />
              <span>MVP - Chess Art & AI Academy</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                {translations.hero.title1}
              </h1>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                {translations.hero.title2}
              </h1>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                {translations.hero.title3}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {translations.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="group w-full sm:w-auto px-8 py-4 text-lg bg-blue-600 hover:bg-blue-500 border-0">
                {translations.hero.ctaPrimary}
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg border-slate-700 hover:border-blue-500/50">
                {translations.hero.ctaSecondary}
                <ChessRook className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Featured Combination */}
        {featured && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {translations.gallery.title}
                </h2>
                <p className="text-slate-400 mt-1">
                  {locale === 'es' ? 'Combinación destacada' : 'Featured combination'}
                </p>
              </div>
              <Link
                href="/combinaciones"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                Ver todas <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Artwork */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  {featured.artwork_url ? (
                    <img
                      src={featured.artwork_url}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-500">
                      <Palette className="h-16 w-16" />
                      <p>Ilustración de Pablo Iglesias</p>
                      <p className="text-xs">Próximamente</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>
                
                {featured.artist_notes && (
                  <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Palette className="h-4 w-4 text-blue-400" />
                      <span>{locale === 'es' ? 'Notas del artista' : 'Artist notes'}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{featured.artist_notes}</p>
                  </div>
                )}
              </div>

              {/* Interactive Board */}
              <div className="space-y-4">
                <div role="tablist" className="flex border-b border-slate-800">
                  {[
                    { id: 'board', label: locale === 'es' ? 'Tablero Interactivo' : 'Interactive Board', icon: Brain },
                    { id: 'artwork', label: locale === 'es' ? 'Ilustración' : 'Artwork', icon: Palette },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id as 'board' | 'artwork')}
                      className={`
                        flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors
                        ${activeTab === tab.id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-slate-500 hover:text-slate-300'}
                      `}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div role="tabpanel" className="pt-4">
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
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                      <img
                        src={featured.artwork_url}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Combination Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-blue-400">#{featured.number.toString().padStart(3, '0')}</span>
                    <Badge variant="outline" className={`${DIFFICULTY_COLORS[featured.difficulty]} text-xs`}>
                      {DIFFICULTY_LABELS_ES[featured.difficulty]}
                    </Badge>
                    {featured.category && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {featured.category}
                      </Badge>
                    )}
                    {featured.opening && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {featured.opening}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{featured.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {featured.white_player} vs {featured.black_player}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featured.event} · {featured.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="h-4 w-4" />
                      {featured.result}
                    </span>
                  </div>
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
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {locale === 'es' ? 'Más combinaciones' : 'More combinations'}
              </h2>
              <Link
                href="/combinaciones"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                Ver todas <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryPreview.map(combination => (
                <CombinationCard
                  key={combination.id}
                  combination={combination}
                  locale={locale}
                  variant="default"
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="py-16 border-t border-slate-800"
        >
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-400" />
                {locale === 'es' ? 'Acerca de Chess Art & AI Academy' : 'About Chess Art & AI Academy'}
              </h2>
              <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed space-y-4">
                <p>
                  {locale === 'es' 
                    ? 'Chess Art & AI Academy es una plataforma única que fusiona tres mundos: el ajedrez, el arte visual y la inteligencia artificial. Nuestra misión es presentar las combinaciones más brillantes de la historia del ajedrez a través de ilustraciones artísticas creadas por Pablo Iglesias, permitiendo a los usuarios explorar, jugar y comprender cada posición con la ayuda de un agente IA experto.'
                    : 'Chess Art & AI Academy is a unique platform that fuses three worlds: chess, visual art, and artificial intelligence. Our mission is to present the most brilliant combinations in chess history through artistic illustrations created by Pablo Iglesias, allowing users to explore, play, and understand each position with the help of an expert AI agent.'
                  }
                </p>
                <p>
                  {locale === 'es'
                    ? 'Cada combinación del Top 100 incluye: una ilustración artística basada en el diagrama 2D de la posición inicial, un visor PGN profesional con controles técnicos (tipo Lichess/Chess.com), análisis táctico, y un agente IA flotante que entiende el contexto de la posición actual.'
                    : 'Each Top 100 combination includes: an artistic illustration based on the 2D diagram of the initial position, a professional PGN viewer with technical controls (Lichess/Chess.com style), tactical analysis, and a floating AI agent that understands the context of the current position.'
                  }
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <ChessRook className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Pablo Iglesias</p>
                    <p className="text-xs text-slate-400">Artista de la serie Top 100</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  {locale === 'es'
                    ? 'Artista visual especializado en la intersección entre ajedrez y arte contemporáneo.'
                    : 'Visual artist specialized in the intersection of chess and contemporary art.'
                  }
                </p>
                <a 
                  href="mailto:pablo.iglesias@chessart.ai" 
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Palette className="h-4 w-4" />
                  {locale === 'es' ? 'Contactar para colaboraciones' : 'Contact for collaborations'}
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* PGN Viewer Demo */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-16 border-t border-slate-800"
        >
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {translations.nav.pgn}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {locale === 'es'
                ? 'Prueba el visor PGN interactivo con una partida de ejemplo'
                : 'Try the interactive PGN viewer with a sample game'
              }
            </p>
          </div>
          <PGNViewer
            pgn={`[Event "Demo Game"]
[White "Morphy"]
[Black "Duke of Brunswick"]
[Result "1-0"]
[Date "1858.??.??"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`}
            showControls={true}
            showMoveList={true}
          />
        </motion.section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>Chess Art & AI Academy · {new Date().getFullYear()} · {translations.footer.rights}</p>
        </div>
      </footer>

      <AIChatWidget initialContext={chessContext} locale={locale} />
    </div>
  );
}