'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CombinationCard } from './CombinationCard';
import type { Combination } from '@/types/combination';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ChevronDown, X, SlidersHorizontal } from 'lucide-react';

interface CombinationGalleryProps {
  initialCombinations: Combination[];
  locale?: 'es' | 'en';
  onLoadMore?: () => Promise<Combination[]>;
  hasMore?: boolean;
}

const DIFFICULTIES = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert', 'Master'];

export function CombinationGallery({ 
  initialCombinations, 
  locale = 'es',
  onLoadMore,
  hasMore = false
}: CombinationGalleryProps) {
  const [combinations, setCombinations] = useState(initialCombinations);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [playerFilter, setPlayerFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredCombinations = combinations.filter(c => {
    const matchesSearch = !search || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.white_player.toLowerCase().includes(search.toLowerCase()) ||
      c.black_player.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = !difficultyFilter || c.difficulty === difficultyFilter;
    const matchesYear = !yearFilter || c.year.toString() === yearFilter;
    const matchesCategory = !categoryFilter || c.category === categoryFilter;
    const matchesPlayer = !playerFilter || 
      c.white_player.toLowerCase().includes(playerFilter.toLowerCase()) ||
      c.black_player.toLowerCase().includes(playerFilter.toLowerCase());
    return matchesSearch && matchesDifficulty && matchesYear && matchesCategory && matchesPlayer;
  });

  const activeFiltersCount = [difficultyFilter, yearFilter, categoryFilter, playerFilter].filter(Boolean).length;

  const handleLoadMore = async () => {
    if (!onLoadMore || isLoading) return;
    setIsLoading(true);
    try {
      const newCombinations = await onLoadMore();
      if (newCombinations && newCombinations.length > 0) {
        // Don't update state here, let the parent handle it
      }
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDifficultyFilter('');
    setYearFilter('');
    setCategoryFilter('');
    setPlayerFilter('');
  };

  const t = locale === 'es' ? {
    search: 'Buscar combinaciones...',
    filters: 'Filtros',
    difficulty: 'Dificultad',
    year: 'Año',
    category: 'Categoría',
    player: 'Jugador',
    sort: 'Ordenar',
    number: 'Número',
    clear: 'Limpiar filtros',
    noResults: 'No se encontraron combinaciones',
    loadMore: 'Cargar más',
    showing: 'Mostrando',
    of: 'de',
    combinations: 'combinaciones',
  } : {
    search: 'Search combinations...',
    filters: 'Filters',
    difficulty: 'Difficulty',
    year: 'Year',
    category: 'Category',
    player: 'Player',
    sort: 'Sort',
    number: 'Number',
    clear: 'Clear filters',
    noResults: 'No combinations found',
    loadMore: 'Load more',
    showing: 'Showing',
    of: 'of',
    combinations: 'combinations',
  };

  const difficulties = DIFFICULTIES.map(d => ({ value: d, label: locale === 'es' ? (
    d === 'Beginner' ? 'Principiante' :
    d === 'Easy' ? 'Fácil' :
    d === 'Intermediate' ? 'Intermedio' :
    d === 'Advanced' ? 'Avanzado' :
    d === 'Expert' ? 'Experto' : 'Maestro'
  ) : d }));

  const years = [...new Set(combinations.map(c => c.year))].sort((a, b) => b - a);
  const categories = [...new Set(combinations.map(c => c.category).filter(Boolean))].sort();

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-chess-text-muted" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-chess-surface/50 border-chess-border/50 focus:border-chess-gold focus:ring-chess-gold/20"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn('gap-2', activeFiltersCount > 0 && 'border-chess-gold/50 text-chess-gold bg-chess-gold/5')}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t.filters}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-chess-gold/20 text-chess-gold text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className={cn('overflow-hidden', showFilters ? 'block' : 'hidden')}
      >
        <div className="flex flex-wrap gap-4 p-5 glass rounded-2xl mb-6">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-chess-text-muted mb-1">{t.difficulty}</label>
            <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value ?? '')}>
              <SelectTrigger className="bg-chess-surface-elevated/50 border-chess-border/50">
                <SelectValue placeholder={t.difficulty} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{locale === 'es' ? 'Todas' : 'All'}</SelectItem>
                {difficulties.map(d => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-chess-text-muted mb-1">{t.year}</label>
            <Select value={yearFilter} onValueChange={(value) => setYearFilter(value ?? '')}>
              <SelectTrigger className="bg-chess-surface-elevated/50 border-chess-border/50">
                <SelectValue placeholder={t.year} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{locale === 'es' ? 'Todos' : 'All'}</SelectItem>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-chess-text-muted mb-1">{t.category}</label>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? '')}>
              <SelectTrigger className="bg-chess-surface-elevated/50 border-chess-border/50">
                <SelectValue placeholder={t.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{locale === 'es' ? 'Todas' : 'All'}</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-chess-text-muted mb-1">{t.player}</label>
            <Input
              placeholder={t.player}
              value={playerFilter}
              onChange={(e) => setPlayerFilter(e.target.value)}
              className="bg-chess-surface-elevated/50 border-chess-border/50"
            />
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="self-end text-chess-text-secondary hover:text-red-400">
              <X className="h-4 w-4 mr-1" />
              {t.clear}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Results */}
      {filteredCombinations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-chess-surface-elevated/50 border border-chess-border/50 flex items-center justify-center">
            <Search className="h-8 w-8 text-chess-text-muted/50" />
          </div>
          <p className="text-lg text-chess-text-secondary mb-1">{t.noResults}</p>
          <p className="text-sm text-chess-text-muted">{locale === 'es' ? 'Intenta ajustar los filtros' : 'Try adjusting filters'}</p>
        </motion.div>
      ) : (
        <>
          {/* Masonry Grid */}
          <div className="masonry-grid">
            {filteredCombinations.map((combination, index) => (
              <CombinationCard
                key={combination.id}
                combination={combination}
                locale={locale}
                variant="masonry"
              />
            ))}
          </div>

          {/* Load More */}
          {(hasMore || isLoading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-8"
            >
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full max-w-xs"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cargando...
                  </span>
                ) : t.loadMore}
              </Button>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-chess-text-muted pt-4"
          >
            {t.showing} {filteredCombinations.length} {t.of} {combinations.length} {t.combinations}
          </motion.p>
        </>
      )}
    </div>
  );
}