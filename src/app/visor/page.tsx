'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FreePGNViewer } from '@/components/chess/PGNViewer';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import Link from 'next/link';

export default function VisorPage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const translations = getTranslations(locale);

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
                <Link href="/visor" className="text-sm text-blue-400 font-medium">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FreePGNViewer />
        </motion.div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>Chess Art & AI Academy · {new Date().getFullYear()} · {translations.footer.rights}</p>
        </div>
      </footer>

      <AIChatWidget locale={locale} />
    </div>
  );
}