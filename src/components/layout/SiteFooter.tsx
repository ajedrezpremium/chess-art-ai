'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function SiteFooter({ locale: localeProp }: { locale?: 'es' | 'en' } = {}) {
  const [locale, setLocale] = useState<'es' | 'en'>(localeProp ?? 'es');

  useEffect(() => {
    if (localeProp) {
      setLocale(localeProp);
      return;
    }
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, [localeProp]);

  const t =
    locale === 'es'
      ? {
          rights: 'Todos los derechos reservados',
          privacy: 'Privacidad',
          terms: 'Términos',
          contact: 'Contacto',
          explore: 'Explorar',
          combinations: 'Combinaciones',
          artists: 'Artistas',
          shop: 'Tienda',
          viewer: 'Visor PGN',
        }
      : {
          rights: 'All rights reserved',
          privacy: 'Privacy',
          terms: 'Terms',
          contact: 'Contact',
          explore: 'Explore',
          combinations: 'Combinations',
          artists: 'Artists',
          shop: 'Shop',
          viewer: 'PGN Viewer',
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
          className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-chess-text-muted"
          aria-label={locale === 'es' ? 'Enlaces del sitio' : 'Site links'}
        >
          <Link href="/combinaciones" className="hover:text-chess-gold transition-colors">
            {t.combinations}
          </Link>
          <Link href="/artistas" className="hover:text-chess-gold transition-colors">
            {t.artists}
          </Link>
          <Link href="/tienda" className="hover:text-chess-gold transition-colors">
            {t.shop}
          </Link>
          <Link href="/visor" className="hover:text-chess-gold transition-colors">
            {t.viewer}
          </Link>
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
