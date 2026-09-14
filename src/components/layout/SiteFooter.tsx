'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function SiteFooter() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const t =
    locale === 'es'
      ? {
          rights: 'Todos los derechos reservados',
          privacy: 'Privacidad',
          terms: 'Términos',
          contact: 'Contacto',
        }
      : {
          rights: 'All rights reserved',
          privacy: 'Privacy',
          terms: 'Terms',
          contact: 'Contact',
        };

  return (
    <footer className="border-t border-chess-border/30 bg-chess-surface/50 py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-display text-lg font-semibold gradient-text-gold">CHESS ART</span>
          <span className="text-chess-text-muted">AI ACADEMY</span>
        </div>
        <p className="text-chess-text-muted text-sm">
          Chess Art &amp; AI Academy · {new Date().getFullYear()} · {t.rights}
        </p>
        <nav
          className="mt-4 flex items-center justify-center gap-6 text-sm text-chess-text-muted"
          aria-label={locale === 'es' ? 'Enlaces legales' : 'Legal links'}
        >
          <Link href="/privacidad" className="hover:text-chess-gold transition-colors">
            {t.privacy}
          </Link>
          <Link href="/terminos" className="hover:text-chess-gold transition-colors">
            {t.terms}
          </Link>
          <Link href="/contacto" className="hover:text-chess-gold transition-colors">
            {t.contact}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
