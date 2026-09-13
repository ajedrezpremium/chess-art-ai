'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Palette, BookOpen, Film, Image, Music, Globe, ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getTranslations } from '@/lib/i18n';

const navItems: Array<{ href: string; key: 'chess' | 'art' | 'books' | 'cinema' | 'music'; icon: typeof Palette; tooltipKey: string }> = [
  { href: '/combinaciones', key: 'chess', icon: Palette, tooltipKey: 'header.nav.chess' },
  { href: '/arte', key: 'art', icon: Image, tooltipKey: 'header.nav.art' },
  { href: '/libros', key: 'books', icon: BookOpen, tooltipKey: 'header.nav.books' },
  { href: '/cine', key: 'cinema', icon: Film, tooltipKey: 'header.nav.cinema' },
  { href: '/musica', key: 'music', icon: Music, tooltipKey: 'header.nav.music' },
];

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
];

interface HeaderProps {
  locale?: 'es' | 'en';
}

export function Header({ locale = 'es' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = getTranslations(locale);

  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-chess-bg/95 backdrop-blur-2xl border-b border-chess-border/50"
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" aria-label="Main navigation">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 font-display text-xl md:text-2xl font-semibold text-chess-text-primary tracking-tight z-50"
              aria-label="CHESS ART"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-chess-gold to-chess-gold-light">
                <span className="text-chess-bg font-bold text-lg">♟</span>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="gradient-text-gold text-lg md:text-xl font-bold">CHESS</span>
                <span className="text-chess-text-primary text-lg md:text-xl font-bold">ART</span>
              </div>
              <span className="hidden sm:inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-chess-gold to-chess-gold-light text-chess-bg text-[10px] font-bold">
                AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger>
                      <Link
                        href={item.href}
                        className={isActive
                          ? 'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-chess-gold bg-chess-gold/10 transition-all duration-200'
                          : 'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-chess-text-secondary hover:text-chess-text-primary hover:bg-chess-surface-elevated/50 transition-all duration-200'}
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
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center" className="bg-chess-surface-elevated border-chess-border text-chess-text-primary text-sm px-3 py-1.5 rounded-lg shadow-strong">
                      {t[item.tooltipKey]}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Right side actions - only language selector */}
            <div className="flex items-center gap-3">
              {/* Language Selector with Flag */}
              <div className="relative">
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      className="h-10 w-10 sm:w-auto px-3 rounded-xl text-chess-text-secondary hover:text-chess-gold hover:bg-chess-surface-elevated/50 transition-all duration-200 flex items-center gap-2"
                      onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                      aria-label={getTranslations('es').header.language}
                      aria-expanded={isLangMenuOpen}
                      aria-haspopup="listbox"
                    >
                      <span className="text-lg" aria-hidden="true">{languages.find(l => l.code === locale)?.flag}</span>
                      <span className="hidden sm:inline font-medium text-sm">{languages.find(l => l.code === locale)?.short}</span>
                      <ChevronDown className="h-4 w-4 transition-transform" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end" className="bg-chess-surface-elevated border-chess-border text-chess-text-primary text-sm px-3 py-1.5 rounded-lg shadow-strong">
                    {getTranslations('es').header.language}
                  </TooltipContent>
                </Tooltip>

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
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('toggle-language', { detail: lang.code }));
                            setIsLangMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150"
                          role="option"
                          aria-selected="false"
                        >
                          <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                          <span className="font-medium">{lang.label}</span>
                          <span className="text-xs text-chess-text-muted ml-auto">{lang.short}</span>
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
                  <div className="pt-2 border-t border-chess-border/30" />
                  <a
                    href="/combinaciones"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-chess-violet to-chess-violet-light text-chess-bg font-semibold rounded-xl transition-all duration-200"
                  >
                    <span className="h-5 w-5">🤖</span>
                    {t.hero.ctaSecondary || 'Hablar con el Agente IA'}
                  </a>
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
    </TooltipProvider>
  );
}