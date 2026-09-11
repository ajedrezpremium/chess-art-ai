'use client';

import { useState, useCallback } from 'react';
import { CombinationCard } from './CombinationCard';
import type { Combination } from '@/types/combination';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CombinationGalleryProps {
  initialCombinations: Combination[];
  locale?: 'es' | 'en';
  onLoadMore?: () => Promise<Combination[] | void>;
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
  const [sortBy, setSortBy] = useState<'number' | 'year' | 'title'>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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

  const sortedCombinations = [...filteredCombinations].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'number') {
      comparison = a.number - b.number;
    } else if (sortBy === 'year') {
      comparison = a.year - b.year;
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const activeFiltersCount = [difficultyFilter, yearFilter, categoryFilter, playerFilter].filter(Boolean).length;

  const handleLoadMore = async () => {
    if (!onLoadMore || isLoading) return;
    setIsLoading(true);
    try {
      const newCombinations = await onLoadMore();
      if (newCombinations && newCombinations.length > 0) {
        setCombinations(prev => [...prev, ...newCombinations]);
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn('gap-2', activeFiltersCount > 0 && 'border-blue-500/50 text-blue-400')}
          >
            <Filter className="h-4 w-4" />
            <span>{t.filters}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')} className="gap-1">
            <ChevronDown className="h-4 w-4" />
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-slate-900/30 border border-slate-700/50 rounded-xl animate-slide-down">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.difficulty}</label>
            <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value ?? '')}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700">
                <SelectValue placeholder={t.difficulty} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {difficulties.map(d => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.year}</label>
            <Select value={yearFilter} onValueChange={(value) => setYearFilter(value ?? '')}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700">
                <SelectValue placeholder={t.year} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.category}</label>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? '')}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700">
                <SelectValue placeholder={t.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.player}</label>
            <Input
              placeholder={t.player}
              value={playerFilter}
              onChange={(e) => setPlayerFilter(e.target.value)}
              className="bg-slate-800/50 border-slate-700"
            />
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="self-end text-red-400 hover:text-red-300">
              <X className="h-4 w-4 mr-1" />
              {t.clear}
            </Button>
          )}
        </div>
      )}

      {sortedCombinations.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">{t.noResults}</p>
          <p className="text-sm mt-1">{locale === 'es' ? 'Intenta ajustar los filtros' : 'Try adjusting filters'}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedCombinations.map((combination, index) => (
              <CombinationCard
                key={combination.id}
                combination={combination}
                locale={locale}
                variant="default"
              />
            ))}
          </div>

          {(hasMore || isLoading) && (
            <div className="text-center pt-4">
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full max-w-xs"
              >
                {isLoading ? 'Cargando...' : t.loadMore}
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-slate-500">
            {t.showing} {sortedCombinations.length} {t.of} {combinations.length} {t.combinations}
          </p>
        </>
      )}
    </div>
  );
}