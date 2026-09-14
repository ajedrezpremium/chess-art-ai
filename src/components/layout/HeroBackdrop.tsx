'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, ExternalLink, MousePointerClick } from 'lucide-react';
import { FEATURED_WORKS } from '@/lib/data/hero-features';

const ROTATE_MS = 7000;

interface HeroBackdropProps {
  locale?: 'es' | 'en';
}

/**
 * Fondo de portada interactivo: alterna 5 obras emblemáticas con fundido,
 * controles manuales y ficha (título + introducción) al pulsar la imagen.
 */
export function HeroBackdrop({ locale = 'es' }: HeroBackdropProps) {
  const [index, setIndex] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const es = locale === 'es';
  const work = FEATURED_WORKS[index % FEATURED_WORKS.length];

  const go = useCallback((dir: 1 | -1) => {
    setInfoOpen(false);
    setIndex((i) => (i + dir + FEATURED_WORKS.length) % FEATURED_WORKS.length);
  }, []);

  useEffect(() => {
    if (paused || infoOpen) return;
    const t = setTimeout(() => go(1), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, paused, infoOpen, go]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden={infoOpen ? undefined : true}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Imagen rotativa con fundido */}
      <AnimatePresence mode="sync">
        <motion.img
          key={work.id}
          src={work.image}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith('/artworks/art.svg')) img.src = '/artworks/art.svg';
          }}
        />
      </AnimatePresence>

      {/* Velos para legibilidad del titular */}
      <div className="absolute inset-0 bg-chess-bg/72" />
      <div className="absolute inset-0 bg-gradient-to-b from-chess-bg/80 via-chess-bg/40 to-chess-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-chess-bg/70 via-transparent to-chess-bg/40" />

      {/* Pastilla de obra actual (pulsa para leer la ficha) */}
      <div className="absolute bottom-24 md:bottom-20 left-6 sm:left-8 lg:left-12 z-20 max-w-md">
        <button
          onClick={() => setInfoOpen((v) => !v)}
          aria-expanded={infoOpen}
          className="group flex items-center gap-3 rounded-2xl border border-chess-border/60 bg-chess-bg/70 py-2.5 pl-3 pr-4 backdrop-blur-md transition-colors hover:border-chess-gold/60 text-left"
        >
          <img
            src={work.image}
            alt=""
            className="h-12 w-12 rounded-xl object-cover border border-chess-border/60"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.endsWith('/artworks/art.svg')) img.src = '/artworks/art.svg';
            }}
          />
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-chess-gold">
              {es ? work.disciplineEs : work.disciplineEn} · {work.year}
            </span>
            <span className="block truncate text-sm font-medium text-chess-text-primary">
              {work.title} — {work.author}
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-xs text-chess-text-muted group-hover:text-chess-gold transition-colors">
              <MousePointerClick className="h-3.5 w-3.5" />
              {es ? 'Pulsa para descubrir la obra' : 'Tap to discover the work'}
            </span>
          </span>
        </button>

        {/* Ficha: título + introducción */}
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className="card-elevated mt-3 p-5"
              role="dialog"
              aria-label={work.title}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-chess-gold">
                    {es ? work.disciplineEs : work.disciplineEn} · {work.year}
                  </p>
                  <h3 className="font-display text-lg font-bold text-chess-text-primary">{work.title}</h3>
                  <p className="text-sm text-chess-text-secondary">{work.author}</p>
                </div>
                <button
                  onClick={() => setInfoOpen(false)}
                  className="rounded-lg p-1.5 text-chess-text-muted hover:text-chess-text-primary hover:bg-chess-surface-elevated/60"
                  aria-label={es ? 'Cerrar ficha' : 'Close panel'}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-chess-text-secondary">
                {es ? work.introEs : work.introEn}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <Link href={work.galleryHref} className="font-semibold text-chess-gold hover:text-chess-gold-light">
                  {es ? 'Ver en galería →' : 'View in gallery →'}
                </Link>
                <a
                  href={work.sourceUrl}
                  target={work.sourceUrl.startsWith('/') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-chess-text-muted hover:text-chess-text-primary"
                >
                  {work.sourceName} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controles de rotación */}
      <div className="absolute bottom-24 md:bottom-20 right-6 sm:right-8 lg:right-12 z-20 flex items-center gap-2">
        <button
          onClick={() => go(-1)}
          className="rounded-full border border-chess-border/60 bg-chess-bg/70 p-2 text-chess-text-secondary backdrop-blur-md hover:border-chess-gold/60 hover:text-chess-gold"
          aria-label={es ? 'Obra anterior' : 'Previous work'}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label={es ? 'Obras destacadas' : 'Featured works'}>
          {FEATURED_WORKS.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={i === index % FEATURED_WORKS.length}
              aria-label={f.title}
              onClick={() => { setInfoOpen(false); setIndex(i); }}
              className={
                i === index % FEATURED_WORKS.length
                  ? 'h-2 w-6 rounded-full bg-chess-gold transition-all'
                  : 'h-2 w-2 rounded-full bg-chess-text-muted/50 hover:bg-chess-text-secondary transition-all'
              }
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          className="rounded-full border border-chess-border/60 bg-chess-bg/70 p-2 text-chess-text-secondary backdrop-blur-md hover:border-chess-gold/60 hover:text-chess-gold"
          aria-label={es ? 'Obra siguiente' : 'Next work'}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
