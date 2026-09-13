'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { CombinationGallery } from '@/components/combinations/CombinationGallery';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import type { Combination } from '@/types/combination';

interface CombinationGalleryClientProps {
  initialCombinations: Combination[];
}

export function CombinationGalleryClient({ initialCombinations }: CombinationGalleryClientProps) {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [combinations, setCombinations] = useState(initialCombinations);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const translations = getTranslations(locale);

  const loadMore = useCallback(async (): Promise<Combination[]> => {
    if (isLoadingMore || !hasMore) return [];
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/combinations?page=${nextPage}&limit=20`);
      const data = await res.json();
      if (data.combinations.length > 0) {
        setCombinations(prev => [...prev, ...data.combinations]);
        setPage(nextPage);
        setHasMore(data.pagination.page < data.pagination.totalPages);
        return data.combinations;
      } else {
        setHasMore(false);
        return [];
      }
    } catch (error) {
      console.error('Error loading more:', error);
      return [];
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoadingMore]);

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      
      <main className="pt-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12"
        >
          {/* Header with search and filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="mb-8">
              <h1 className="font-display text-display-sm text-chess-text-primary mb-2">
                {translations.gallery.title}
              </h1>
              <p className="text-chess-text-secondary max-w-2xl">
                {translations.gallery.subtitle}
              </p>
            </div>

            <CombinationGallery
              initialCombinations={combinations}
              locale={locale}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          </motion.div>
        </motion.div>
      </main>

      <footer className="border-t border-chess-border/30 bg-chess-surface/50 py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-chess-text-muted text-sm">
            Chess Art & AI Academy · {new Date().getFullYear()} · {translations.footer.rights}
          </p>
        </div>
      </footer>

      <AIChatWidget locale={locale} />
    </div>
  );
}