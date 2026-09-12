'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import type { Combination } from '@/types/combination';
import { DIFFICULTY_COLORS } from '@/lib/chess/pgn-utils';
import { ChessBoardSvg } from '@/components/chess/ChessBoard';
import Link from 'next/link';

interface CombinationCardProps {
  combination: Combination;
  locale?: 'es' | 'en';
  variant?: 'default' | 'compact' | 'featured';
}

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

export function CombinationCard({ 
  combination, 
  locale = 'es',
  variant = 'default'
}: CombinationCardProps) {
  const [imgError, setImgError] = useState(false);
  const difficultyColor = DIFFICULTY_COLORS[combination.difficulty] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  const difficultyLabel = locale === 'es' 
    ? DIFFICULTY_LABELS_ES[combination.difficulty] 
    : DIFFICULTY_LABELS_EN[combination.difficulty];

  const formatNumber = (num: number) => `#${num.toString().padStart(3, '0')}`;

  if (variant === 'compact') {
    return (
      <Link 
        href={`/combinaciones/${combination.slug}`}
        className="group flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all"
      >
        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden relative flex items-center justify-center">
          {combination.artwork_url && !imgError ? (
            <img 
              src={combination.artwork_url} 
              alt={combination.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ChessBoardSvg fen={combination.fen} coordinates={false} className="w-full h-full border-none shadow-none rounded-none" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-blue-400">{formatNumber(combination.number)}</p>
          <h3 className="font-medium text-white truncate group-hover:text-blue-300 transition-colors">
            {combination.title}
          </h3>
          <p className="text-xs text-slate-500 truncate">
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
      <article className="group relative bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 flex items-center justify-center">
          {combination.artwork_url && !imgError ? (
            <img
              src={combination.artwork_url}
              alt={combination.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <ChessBoardSvg fen={combination.fen} coordinates={false} className="max-w-[280px] w-full" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/combinaciones/${combination.slug}`}
              className="btn-primary"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver detalle
            </Link>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-blue-400">{formatNumber(combination.number)}</span>
            <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
              {difficultyLabel}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
            {combination.title}
          </h3>
          <p className="text-sm text-slate-400">
            {combination.white_player} <span className="text-slate-600">vs</span> {combination.black_player}
          </p>
          <p className="text-xs text-slate-500">
            {combination.event} · {combination.year}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {combination.opening && (
              <span className="bg-slate-800/50 px-2 py-0.5 rounded">{combination.opening}</span>
            )}
            {combination.category && (
              <span className="bg-slate-800/50 px-2 py-0.5 rounded">{combination.category}</span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-slate-950 flex items-center justify-center">
        {combination.artwork_url && !imgError ? (
          <img
            src={combination.artwork_url}
            alt={combination.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full p-2 flex items-center justify-center">
            <ChessBoardSvg fen={combination.fen} coordinates={false} className="w-full h-full border-none shadow-none" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-xs font-mono text-blue-400 bg-slate-900/80 px-2 py-1 rounded">
            {formatNumber(combination.number)}
          </span>
          <Badge variant="outline" className={cn(difficultyColor, 'text-xs')}>
            {difficultyLabel}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
          {combination.title}
        </h3>
        <div className="space-y-1 text-sm text-slate-400 mb-3">
          <p>{combination.white_player} vs {combination.black_player}</p>
          <p>{combination.event} · {combination.year}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {combination.opening && (
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
              {combination.opening}
            </Badge>
          )}
          {combination.category && (
            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
              {combination.category}
            </Badge>
          )}
        </div>
        <div className="mt-auto pt-3 border-t border-slate-800">
          <Link
            href={`/combinaciones/${combination.slug}`}
            className="btn-primary w-full justify-center gap-2"
          >
            <Eye className="h-4 w-4" />
            <span>{locale === 'es' ? 'Ver combinación' : 'View combination'}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}