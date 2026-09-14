'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ChessRook, Palette, Brain } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';

interface HeroProps {
  locale?: 'es' | 'en';
}

export function Hero({ locale = 'es' }: HeroProps) {
  const t = getTranslations(locale);
  const stats = [
    { key: 'chess', label: t.hero.stats?.chess || 'Combinaciones', value: '100', icon: ChessRook },
    { key: 'art', label: t.hero.stats?.art || 'Ilustraciones', value: '100', icon: Palette },
    { key: 'ai', label: t.hero.stats?.ai || 'Análisis IA', value: '∞', icon: Brain },
    { key: 'artist', label: t.hero.stats?.artist || 'Artista', value: '1', icon: Sparkles },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 md:pt-24 pb-16">
      {/* Background layers */}
      <div className="absolute inset-0 hero-gradient-mesh" aria-hidden="true" />
      <div className="absolute inset-0 hero-bg-grid" aria-hidden="true" />
      
      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(12)].map((_, i) => {
          const left = (i * 37 + 11) % 100;
          const top = (i * 53 + 7) % 100;
          const size = 2 + ((i * 7) % 4);
          return (
            <motion.div
              key={i}
              className="floating-particle w-1 h-1"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.5, 1, 0.5] }}
              transition={{
                duration: 6 + (i % 5),
                repeat: Infinity,
                delay: (i % 6) * 0.5,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Decorative chess board pattern overlay */}
      <div className="absolute inset-0 chess-pattern opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Title - LARGER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="mb-6 space-y-1"
        >
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            <span className="block">{t.hero.title1}</span>
            <span className="block gradient-text-gold">{t.hero.title2}</span>
            <span className="block gradient-text-gold">{t.hero.title3}</span>
          </h1>
        </motion.div>

        {/* Subtitle - LARGER */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-4xl text-xl md:text-2xl lg:text-3xl text-chess-text-secondary leading-relaxed font-light"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/combinaciones">
            <Button className="btn-primary btn-cta-attention group w-full sm:w-auto" size="lg">
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              {t.hero.ctaPrimary || 'Explorar el Top 100'}
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.19, 1, 0.22, 1] }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="text-center group"
            >
              <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-chess-surface/50 border border-chess-border/50 transition-all duration-300 group-hover:border-chess-gold/50 group-hover:bg-chess-gold/10">
                <stat.icon className="h-7 w-7 text-chess-gold" aria-hidden="true" />
              </div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-chess-text-primary tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-chess-text-muted mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <svg className="w-6 h-6 text-chess-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}