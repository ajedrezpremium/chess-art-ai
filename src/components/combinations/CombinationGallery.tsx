'use client';

import { useState } from 'react';
import { CombinationCard } from './CombinationCard';
import type { Combination } from '@/types/combination';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ChevronDown, X, LayoutGrid, Palette, List, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const [viewMode, setViewMode] = useState<'diagram' | 'artwork' | 'compact'>('diagram');
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
    search: 'Buscar por título o maestro...',
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
    combinations: 'obras maestras',
  } : {
    search: 'Search by title or player...',
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
    combinations: 'masterpieces',
  };

  const difficulties = DIFFICULTIES.map(d => ({ value: d, label: locale === 'es' ? (
    d === 'Beginner' ? 'Principiante' :
    d === 'Easy' ? 'Fácil' :
    d === 'Intermediate' ? 'Intermedio' :
    d === 'Advanced' ? 'Avanzado' :
    d === 'Expert' ? 'Experto' : 'Maestro'
  ) : d }));

  const years = [...new Set(combinations.map(c => c.year))].sort((a, b) => b - a);
  const categories = Array.from(new Set(combinations.map(c => c.category).filter((cat): cat is string => Boolean(cat)))).sort();

  return (
    <div className="space-y-6">
      {/* Top Search & View Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900/60 border-slate-800 focus:border-blue-500 rounded-xl"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('diagram')}
              className={cn('px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all', viewMode === 'diagram' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white')}
              title="Vista Diagrama Táctico"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Diagramas</span>
            </button>
            <button
              onClick={() => setViewMode('artwork')}
              className={cn('px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all', viewMode === 'artwork' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white')}
              title="Vista Obras de Arte"
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Arte</span>
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={cn('px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all', viewMode === 'compact' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white')}
              title="Vista Lista Compacta"
            >
              <List className="h-3.5 w-3.5" />
              <span>Lista</span>
            </button>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn('gap-2 rounded-xl border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white', activeFiltersCount > 0 && 'border-blue-500/50 text-blue-400')}
          >
            <Filter className="h-4 w-4" />
            <span>{t.filters}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')} 
            className="gap-1 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl"
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform', sortOrder === 'desc' && 'rotate-180')} />
            <span className="text-xs uppercase font-mono">{sortOrder}</span>
          </Button>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setCategoryFilter('')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
            !categoryFilter 
              ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20' 
              : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          )}
        >
          ✨ Todas las categorías
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
              categoryFilter === cat 
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20' 
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl animate-slide-down">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.difficulty}</label>
            <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value ?? '')}>
              <SelectTrigger className="bg-slate-800/60 border-slate-700 rounded-xl">
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
              <SelectTrigger className="bg-slate-800/60 border-slate-700 rounded-xl">
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
            <label className="block text-xs font-medium text-slate-400 mb-1">{t.player}</label>
            <Input
              placeholder={t.player}
              value={playerFilter}
              onChange={(e) => setPlayerFilter(e.target.value)}
              className="bg-slate-800/60 border-slate-700 rounded-xl"
            />
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="self-end text-rose-400 hover:text-rose-300">
              <X className="h-4 w-4 mr-1" />
              {t.clear}
            </Button>
          )}
        </div>
      )}

      {/* Grid or List View */}
      {sortedCombinations.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-slate-900/20 border border-slate-800/60 rounded-2xl">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30 text-blue-400" />
          <p className="text-lg text-slate-300 font-medium">{t.noResults}</p>
          <p className="text-sm text-slate-500 mt-1">{locale === 'es' ? 'Intenta ajustar los filtros de búsqueda' : 'Try adjusting your search filters'}</p>
        </div>
      ) : viewMode === 'compact' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedCombinations.map((combination) => (
            <CombinationCard
              key={combination.slug || combination.id}
              combination={combination}
              locale={locale}
              variant="compact"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedCombinations.map((combination) => (
              <CombinationCard
                key={combination.slug || combination.id}
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
                className="w-full max-w-xs rounded-xl border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200"
              >
                {isLoading ? 'Cargando...' : t.loadMore}
              </Button>
            </div>
          )}

          <p className="text-center text-xs text-slate-500 font-mono">
            {t.showing} {sortedCombinations.length} {t.of} {combinations.length} {t.combinations}
          </p>
        </>
      )}
    </div>
  );
}