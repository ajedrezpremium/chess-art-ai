'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Palette, BookOpen, Film, Image, Music, Users, ShoppingBag, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTranslations } from '@/lib/i18n';

const navItems: Array<{ href: string; key: 'chess' | 'art' | 'books' | 'cinema' | 'music' | 'artists' | 'shop'; icon: typeof Palette; tipKey: 'artistsTip' | 'shopTip' | null }> = [
  { href: '/combinaciones', key: 'chess', icon: Palette, tipKey: null },
  { href: '/arte', key: 'art', icon: Image, tipKey: null },
  { href: '/libros', key: 'books', icon: BookOpen, tipKey: null },
  { href: '/cine', key: 'cinema', icon: Film, tipKey: null },
  { href: '/musica', key: 'music', icon: Music, tipKey: null },
  { href: '/artistas', key: 'artists', icon: Users, tipKey: 'artistsTip' },
  { href: '/tienda', key: 'shop', icon: ShoppingBag, tipKey: 'shopTip' },
];

const languages = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'en', label: 'English', short: 'EN' },
] as const;

interface HeaderProps {
  locale?: 'es' | 'en';
}

export function Header({ locale: localeProp = 'es' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [locale, setLocale] = useState<'es' | 'en'>(localeProp);
  const pathname = usePathname();

  // Header auto-ocultable: se esconde al bajar (libera el visor/tablero),
  // reaparece al subir o al estar arriba del todo.
  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      if (y < 80) {
        setVisible(true);
      } else if (y > lastY + 4) {
        setVisible(false);
      } else if (y < lastY - 4) {
        setVisible(true);
      }
      lastY = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Con el menú móvil abierto, el header siempre visible.
  const showHeader = visible || isMobileMenuOpen;

  useEffect(() => {
    setLocale(localeProp);
  }, [localeProp]);

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const handleLocaleChange = (code: 'es' | 'en') => {
    setLocale(code);
    setIsLangMenuOpen(false);
    window.dispatchEvent(new CustomEvent('toggle-language', { detail: code }));
  };

  const t = getTranslations(locale);

  const tip = (k: 'artistsTip' | 'shopTip' | null) =>
    k ? String((t.header.nav as Record<string, string>)[k] ?? '') : '';

  return (
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: showHeader ? 0 : '-110%', opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
        className="fixed top-0 left-0 right-0 z-40 bg-chess-bg/95 backdrop-blur-2xl border-b border-chess-border/50"
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" aria-label="Main navigation">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-xl md:text-2xl font-semibold tracking-tight z-50"
              aria-label="Chess Art"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-chess-gold to-chess-gold-light">
                <span className="text-chess-bg font-bold text-lg">♟</span>
              </span>
              <span className="whitespace-nowrap leading-none">
                <span className="gradient-text-gold font-bold">CHESS ART</span>
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-chess-gold to-chess-gold-light text-chess-bg text-[10px] font-bold align-middle">
                  AI
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={tip(item.tipKey) || String(t.nav[item.key as keyof typeof t.nav])}
                    className={isActive
                      ? 'relative flex items-center gap-2 px-3 xl:px-4 py-2.5 text-sm font-medium rounded-xl text-chess-gold bg-chess-gold/10 transition-all duration-200'
                      : 'relative flex items-center gap-2 px-3 xl:px-4 py-2.5 text-sm font-medium rounded-xl text-chess-text-secondary hover:text-chess-text-primary hover:bg-chess-surface-elevated/50 transition-all duration-200'}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 transition-transform hover:scale-110" aria-hidden="true" />
                    <span>{t.nav[item.key as keyof typeof t.nav]}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-chess-gold to-chess-gold-light rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions - only language selector */}
            <div className="flex items-center gap-3">
              {/* Language Selector with Flag */}
              <div className="relative">
                    <button
                      className="h-10 w-10 sm:w-auto px-3 rounded-xl text-chess-text-secondary hover:text-chess-gold hover:bg-chess-surface-elevated/50 transition-all duration-200 flex items-center gap-2"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      aria-label={getTranslations('es').header.language}
                      title={getTranslations('es').header.language}
                      aria-expanded={isLangMenuOpen}
                      aria-haspopup="listbox"
                    >
                      <Globe className="h-4 w-4" aria-hidden="true" />
                      <span className="font-medium text-sm">{languages.find(l => l.code === locale)?.short}</span>
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
                      className="absolute right-0 mt-2 w-40 glass-strong rounded-xl py-2 shadow-strong border border-chess-border/50 z-50"
                      role="listbox"
                      aria-label={getTranslations('es').header.language}
                    >
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => handleLocaleChange(lang.code)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150"
                          role="option"
                          aria-selected={locale === lang.code}
                        >
                          <span className="w-8 text-center text-xs font-bold text-chess-gold">{lang.short}</span>
                          <span className="font-medium">{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                className="lg:hidden h-10 w-10 rounded-xl text-chess-text-secondary hover:text-chess-text-primary hover:bg-chess-surface-elevated/50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                className="lg:hidden overflow-hidden border-t border-chess-border/50 pt-4 pb-6"
              >
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={isActive
                          ? 'flex items-center gap-3 px-4 py-3.5 text-body-md font-medium rounded-xl text-chess-gold bg-chess-gold/10 transition-all duration-200'
                          : 'flex items-center gap-3 px-4 py-3.5 text-body-md font-medium rounded-xl text-chess-text-secondary hover:text-chess-text-primary hover:bg-chess-surface-elevated/50 transition-all duration-200'}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span>{t.nav[item.key as keyof typeof t.nav]}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Scroll progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-chess-gold to-chess-violet"
          style={{ width: isScrolled ? '100%' : '0%' }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        aria-hidden="true"
      />
      </motion.header>
  );
}