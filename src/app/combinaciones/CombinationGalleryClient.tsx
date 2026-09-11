'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CombinationGallery } from '@/components/combinations/CombinationGallery';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { getTranslations } from '@/lib/i18n';
import Link from 'next/link';
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
  const [total, setTotal] = useState(0);

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
        setTotal(data.pagination.total);
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

  useEffect(() => {
    fetch(`/api/combinations?page=1&limit=1`)
      .then(res => res.json())
      .then(data => setTotal(data.pagination.total))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-xl text-white tracking-tight">
                CHESS ART
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/combinaciones" className="text-sm text-blue-400 font-medium">
                  {translations.nav.top100}
                </Link>
                <Link href="/visor" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {translations.nav.pgn}
                </Link>
                <Link href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  {translations.nav.about}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocale(l => l === 'es' ? 'en' : 'es')}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition-colors"
              >
                {locale === 'es' ? 'EN' : 'ES'}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {translations.gallery.title}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>Chess Art & AI Academy · {new Date().getFullYear()} · {translations.footer.rights}</p>
        </div>
      </footer>

      <AIChatWidget locale={locale} />
    </div>
  );
}