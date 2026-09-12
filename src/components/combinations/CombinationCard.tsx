'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ChessRook, ExternalLink, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Combination } from '@/types/combination';
import { DIFFICULTY_COLORS } from '@/lib/chess/pgn-utils';

const DIFFICULTY_LABELS_ES: Record<string, string> = {
  Beginner: 'Principiante',
  Easy: 'Fácil',
  Intermediate: 'Intermedio',
  Advanced: 'Avanzado',
  Expert: 'Experto',
  Master: 'Maestro',
};

const DIFFICULTY_LABELS_EN: Record<string, string> = {
  Beginner: 'Beginner',
  Easy: 'Easy',
  Intermediate: 'Intermediate',
  Advanced: 'Advanced',
  Expert: 'Expert',
  Master: 'Master',
};

interface CombinationCardProps {
  combination: Combination;
  locale?: 'es' | 'en';
  variant?: 'default' | 'compact' | 'featured' | 'masonry';
}

export function CombinationCard({ 
  combination, 
  locale = 'es',
  variant = 'default'
}: CombinationCardProps) {
  const difficultyColor = DIFFICULTY_COLORS[combination.difficulty] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  const difficultyLabel = locale === 'es' 
    ? DIFFICULTY_LABELS_ES[combination.difficulty] 
    : DIFFICULTY_LABELS_EN[combination.difficulty];

  const formatNumber = (num: number) => `#${num.toString().padStart(3, '0')}`;

  if (variant === 'compact') {
    return (
      <Link 
        href={`/combinaciones/${combination.slug}`}
        className="group flex items-center gap-4 p-4 bg-chess-surface/50 border border-chess-border/50 rounded-xl hover:border-chess-gold/50 hover:bg-chess-surface hover:shadow-medium transition-all duration-300 ease-out-expo"
      >
        <div className="relative flex-shrink-0 w-16 h-16 rounded-xl bg-chess-surface-elevated border border-chess-border/50 overflow-hidden">
          {combination.artwork_url ? (
            <motion.img
              src={combination.artwork_url}
              alt={combination.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChessRook className="h-8 w-8 text-chess-border" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-chess-gold mb-1">{formatNumber(combination.number)}</p>
          <h3 className="font-medium text-chess-text-primary truncate group-hover:text-chess-gold transition-colors">
            {combination.title}
          </h3>
          <p className="text-xs text-chess-text-muted truncate">
            {combination.white_player} vs {combination.black_player} ({combination.year})
          </p>
        </div>
        <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
          {difficultyLabel}
        </Badge>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group relative card-interactive overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          {combination.artwork_url ? (
            <Link
              href={`/combinaciones/${combination.slug}`}
              className="block w-full h-full"
              aria-label={locale === 'es' ? `Ver ${combination.title}` : `View ${combination.title}`}
            >
              <motion.img
                src={combination.artwork_url}
                alt={combination.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </Link>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-chess-text-muted bg-chess-surface-elevated">
              <ChessRook className="h-16 w-16 text-chess-border" />
              <p className="font-display text-chess-text-secondary">Ilustración próximamente</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chess-bg/80 via-transparent to-transparent group-hover:from-chess-bg/60 transition-all duration-500" />
          
          {/* Overlay with quick info */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-start justify-between">
              <span className="text-xs font-mono text-chess-gold bg-chess-bg/80 px-2 py-1 rounded">
                #{combination.number.toString().padStart(3, '0')}
              </span>
              <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
                {difficultyLabel}
              </Badge>
            </div>
            <div className="text-left">
              <h3 className="font-display text-lg md:text-xl font-semibold text-chess-text-primary mb-2 group-hover:text-chess-gold transition-colors">
                {combination.title}
              </h3>
              <p className="text-sm text-chess-text-secondary mb-1">
                {combination.white_player} vs {combination.black_player}
              </p>
              <p className="text-xs text-chess-text-muted">
                {combination.event} · {combination.year}
              </p>
            </div>
          </div>
          
          {/* CTA */}
          <Link
            href={`/combinaciones/${combination.slug}`}
            className="absolute bottom-5 left-5 right-5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <button className="btn-primary w-full group">
              <Eye className="h-4 w-4 mr-2" />
              <span>{locale === 'es' ? 'Ver combinación' : 'View combination'}</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-chess-gold">{formatNumber(combination.number)}</span>
            <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
              {difficultyLabel}
            </Badge>
          </div>
          <h3 className="font-display text-lg font-semibold text-chess-text-primary group-hover:text-chess-gold transition-colors line-clamp-1">
            {combination.title}
          </h3>
          <p className="text-sm text-chess-text-secondary">
            {combination.white_player} <span className="text-chess-text-muted">vs</span> {combination.black_player}
          </p>
          <p className="text-xs text-chess-text-muted">
            {combination.event} · {combination.year}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {combination.opening && (
              <Badge variant="outline" className="text-xs border-chess-border/50 text-chess-text-secondary hover:text-chess-text-primary hover:border-chess-gold/30 transition-all">
                {combination.opening}
              </Badge>
            )}
            {combination.category && (
              <Badge variant="outline" className="text-xs border-chess-border/50 text-chess-text-secondary hover:text-chess-text-primary hover:border-chess-gold/30 transition-all">
                {combination.category}
              </Badge>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'masonry') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-interactive group relative overflow-hidden"
        style={{ gridColumn: 'span 1', gridRow: 'span 1' }}
      >
        <Link href={`/combinaciones/${combination.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            {combination.artwork_url ? (
              <motion.img
                src={combination.artwork_url}
                alt={combination.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-chess-surface-elevated">
                <ChessRook className="h-12 w-12 text-chess-border" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-chess-bg/80 via-transparent to-transparent group-hover:from-chess-bg/60 transition-all duration-500" />
            
            {/* Overlay info */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono text-chess-gold bg-chess-bg/80 px-2 py-1 rounded">
                  #{combination.number.toString().padStart(3, '0')}
                </span>
                <span className={cn('badge-difficulty', DIFFICULTY_COLORS[combination.difficulty])}>
                  {locale === 'es' ? DIFFICULTY_LABELS_ES[combination.difficulty] : DIFFICULTY_LABELS_EN[combination.difficulty]}
                </span>
              </div>
              <div className="text-left">
                <h3 className="font-display text-lg md:text-xl font-semibold text-chess-text-primary mb-1 group-hover:text-chess-gold transition-colors">
                  {combination.title}
                </h3>
                <p className="text-sm text-chess-text-secondary">
                  {combination.white_player} vs {combination.black_player}
                </p>
                <p className="text-xs text-chess-text-muted">
                  {combination.event} · {combination.year}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <article className="card-interactive group flex flex-col h-full overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        {combination.artwork_url ? (
          <Link
            href={`/combinaciones/${combination.slug}`}
            className="block w-full h-full"
            aria-label={locale === 'es' ? `Ver ${combination.title}` : `View ${combination.title}`}
          >
            <motion.img
              src={combination.artwork_url}
              alt={combination.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-chess-surface-elevated to-chess-surface">
            <ChessRook className="h-12 w-12 text-chess-border" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-chess-bg/80 via-transparent to-transparent group-hover:from-chess-bg/60 transition-all duration-500" />
        <div className="absolute top-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-mono text-chess-gold bg-chess-bg/80 px-2 py-1 rounded">
            {formatNumber(combination.number)}
          </span>
          <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
            {locale === 'es' ? DIFFICULTY_LABELS_ES[combination.difficulty] : DIFFICULTY_LABELS_EN[combination.difficulty]}
          </Badge>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-chess-text-primary group-hover:text-chess-gold transition-colors line-clamp-2 mb-3">
          {combination.title}
        </h3>
        <div className="space-y-1 text-sm text-chess-text-secondary mb-4">
          <p>{combination.white_player} vs {combination.black_player}</p>
          <p>{combination.event} · {combination.year}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {combination.opening && (
            <Badge variant="outline" className="text-xs border-chess-border/50 text-chess-text-secondary hover:text-chess-text-primary hover:border-chess-gold/30 transition-all">
              {combination.opening}
            </Badge>
          )}
          {combination.category && (
            <Badge variant="outline" className="text-xs border-chess-border/50 text-chess-text-secondary hover:text-chess-text-primary hover:border-chess-gold/30 transition-all">
              {combination.category}
            </Badge>
          )}
        </div>
        <div className="mt-auto pt-4 border-t border-chess-border/30">
          <Link
            href={`/combinaciones/${combination.slug}`}
            className="btn-primary w-full justify-center gap-2 group"
          >
            <Eye className="h-4 w-4" />
            <span>{locale === 'es' ? 'Ver combinación' : 'View combination'}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}