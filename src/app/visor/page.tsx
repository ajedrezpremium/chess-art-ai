'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FreePGNViewer } from '@/components/chess/PGNViewer';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';

export default function VisorPage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const translations = getTranslations(locale);

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      
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

      <SiteFooter />

      <AIChatWidget locale={locale} />
    </div>
  );
}