'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { FreePGNViewer } from '@/components/chess/PGNViewer';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';

export default function VisorPage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const translations = getTranslations(locale);

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header locale={locale} />
      
      <main className="pt-20 lg:pt-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-4 mb-10">
              <h1 className="font-display text-display-sm text-chess-text-primary">
                {translations.nav.pgn}
              </h1>
              <p className="text-chess-text-secondary max-w-2xl mx-auto">
                {locale === 'es'
                  ? 'Analiza cualquier partida pegando su PGN. Visor profesional con controles de reproducción, lista de jugadas y análisis.'
                  : 'Analyze any game by pasting its PGN. Professional viewer with playback controls, move list, and analysis.'}
              </p>
            </div>
            
            <div className="glass-strong p-6 lg:p-8">
              <FreePGNViewer />
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-chess-border/30 bg-chess-surface/50 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-chess-text-muted text-sm">
          <p>Chess Art & AI Academy · {new Date().getFullYear()} · {getTranslations(locale).footer.rights}</p>
        </div>
      </footer>

      <AIChatWidget locale={locale} />
    </div>
  );
}