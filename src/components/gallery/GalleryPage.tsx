'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List, X, Maximize2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  year: string;
  author: string;
  description: string;
  tags: string[];
  type: string;
}

interface GalleryPageProps {
  items: GalleryItem[];
  categoryKey: 'art' | 'books' | 'cinema' | 'music';
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  filters: { value: string; label: string }[];
  locale?: 'es' | 'en';
}

function fallbackImage(e: React.SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget;
  if (!el.dataset.fbk) {
    el.dataset.fbk = '1';
    el.src = '/artworks/placeholder.svg';
  }
}

function FilterLabel(filters: { value: string; label: string }[], value: string): string {
  return filters.find((f) => f.value === value)?.label ?? value;
}

export function GalleryPage({
  items: itemsProp,
  title,
  subtitle,
  searchPlaceholder,
  filters,
  locale: localeProp = 'es',
}: GalleryPageProps) {
  const [locale, setLocale] = useState<'es' | 'en'>(localeProp);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  useEffect(() => {
    setExpanded(false);
  }, [selectedItem]);

  const allItems = itemsProp ?? [];

  const filteredItems = allItems.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q));
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-chess-surface/50 border border-chess-border/50 rounded-full text-sm font-medium text-chess-gold mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chess-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chess-gold" />
              </span>
              <span className="font-display text-chess-gold">{title}</span>
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-chess-text-primary">
              {subtitle}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-chess-text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-chess-surface/60 border border-chess-border/50 rounded-xl text-sm text-chess-text-primary placeholder:text-chess-text-muted focus:outline-none focus:border-chess-gold/60 focus:ring-2 focus:ring-chess-gold/20"
              />
            </div>

            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                aria-label={locale === 'es' ? 'Filtrar por categoría' : 'Filter by category'}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 bg-chess-surface/60 border border-chess-border/50 rounded-xl text-sm text-chess-text-primary focus:outline-none focus:border-chess-gold/60 cursor-pointer"
              >
                {filters.map((f) => (
                  <option key={f.value} value={f.value} className="bg-chess-surface text-chess-text-primary">
                    {f.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-chess-text-muted pointer-events-none" />
            </div>

            <div className="flex items-center gap-1 border border-chess-border/50 rounded-xl p-1 self-start">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid'
                    ? 'bg-chess-gold/10 text-chess-gold'
                    : 'text-chess-text-secondary hover:text-chess-text-primary'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list'
                    ? 'bg-chess-gold/10 text-chess-gold'
                    : 'text-chess-text-secondary hover:text-chess-text-primary'
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsSearchOpen((v) => !v);
                  setIsFilterOpen((v) => !v);
                }}
                aria-label={locale === 'es' ? 'Filtros' : 'Filters'}
                className="p-2 rounded-lg text-chess-text-secondary hover:text-chess-gold transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {(isSearchOpen || isFilterOpen) && (
          <p className="text-xs text-chess-text-muted mb-2">
            {locale === 'es'
              ? 'Usa el buscador y el menú desplegable para explorar la colección.'
              : 'Use the search box and dropdown menu to explore the collection.'}
          </p>
        )}

        <p className="text-sm text-chess-text-muted">
          {filteredItems.length} {locale === 'es' ? 'resultados' : 'results'}
        </p>
      </motion.div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-chess-text-secondary mb-1">
            {locale === 'es' ? 'No se encontraron resultados' : 'No results found'}
          </p>
          <p className="text-sm text-chess-text-muted">
            {locale === 'es' ? 'Intenta ajustar los filtros o la búsqueda' : 'Try adjusting filters or search'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <GalleryRow key={item.id} item={item} index={index} onClick={() => setSelectedItem(item)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
            onClick={() => setSelectedItem(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="relative w-full sm:max-w-3xl max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-chess-surface border border-chess-border/60 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-60 sm:h-80 bg-chess-surface-elevated">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  onError={fallbackImage}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chess-surface via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  aria-label={locale === 'es' ? 'Cerrar' : 'Close'}
                  className="absolute top-4 right-4 p-2 rounded-full bg-chess-bg/70 border border-chess-border/60 text-chess-text-primary hover:text-chess-gold transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-chess-gold bg-chess-bg/80 px-2 py-1 rounded">
                      {selectedItem.year}
                    </span>
                    <span className="text-xs text-chess-text-secondary bg-chess-bg/80 px-2 py-1 rounded">
                      {FilterLabel(filters, selectedItem.category)}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-chess-text-primary">
                    {selectedItem.title}
                  </h2>
                  <p className="text-sm text-chess-text-secondary mt-1">{selectedItem.author}</p>
                </div>
              </div>

              <div className="p-5 sm:p-7 space-y-4">
                <p className={cn('text-chess-text-secondary leading-relaxed', !expanded && 'line-clamp-4')}>
                  {selectedItem.description}
                </p>
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="text-sm font-medium text-chess-gold hover:text-chess-gold-light transition-colors"
                >
                  {expanded
                    ? locale === 'es' ? 'Leer menos' : 'Read less'
                    : locale === 'es' ? 'Leer más' : 'Read more'}
                </button>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-chess-border/40">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 bg-chess-surface-elevated/60 border border-chess-border/50 rounded-full text-chess-text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryCard({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.06 }}
      className="card-interactive group relative overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-chess-surface-elevated">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={fallbackImage}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chess-bg/85 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-lg font-semibold text-chess-text-primary group-hover:text-chess-gold transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-sm text-chess-text-secondary line-clamp-1">{item.author}</p>
        </div>
      </div>
    </motion.article>
  );
}

function GalleryRow({ item, index, onClick }: { item: GalleryItem; index: number; onClick: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 10) * 0.04 }}
      className="card-interactive group flex gap-4 p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-28 h-20 md:w-36 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-chess-surface-elevated">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={fallbackImage}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-chess-gold">{item.year}</span>
          <span className="text-xs text-chess-text-muted">{item.type}</span>
        </div>
        <h3 className="font-medium text-chess-text-primary group-hover:text-chess-gold transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-chess-text-secondary line-clamp-1">{item.author}</p>
        <p className="text-xs text-chess-text-muted line-clamp-2 mt-1">{item.description}</p>
      </div>
      <Maximize2 className="h-5 w-5 text-chess-text-muted group-hover:text-chess-gold transition-colors flex-shrink-0 mt-1" />
    </motion.article>
  );
}
