import esTranslations from '@/locales/es/common.json';
import enTranslations from '@/locales/en/common.json';

type Locale = 'es' | 'en';

export interface Translations {
  header: {
    logo: string;
    ai: string;
    nav: {
      chess: string;
      art: string;
      books: string;
      cinema: string;
      music: string;
      gallery: string;
      pgn: string;
      [key: string]: string;
    };
    language: string;
  };
  [key: string]: unknown;
  hero: {
    title1: string;
    title2: string;
    title3: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      chess: string;
      art: string;
      ai: string;
      artist: string;
    };
  };
  nav: {
    chess: string;
    art: string;
    books: string;
    cinema: string;
    music: string;
    gallery: string;
    pgn: string;
    [key: string]: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    contact: string;
  };
  combinations: {
    title: string;
    subtitle: string;
    search: string;
    filters: string;
    difficulty: string;
    year: string;
    category: string;
    player: string;
    noResults: string;
    loadMore: string;
    showing: string;
    of: string;
    combinations: string;
  };
  combination: {
    number: string;
    title: string;
    players: string;
    event: string;
    year: string;
    difficulty: string;
    result: string;
    opening: string;
    category: string;
    description: string;
    artwork: string;
    board: string;
    analysis: string;
    related: string;
    play: string;
    solve: string;
    reveal: string;
    analyze: string;
  };
  difficulty: {
    Beginner: string;
    Easy: string;
    Intermediate: string;
    Advanced: string;
    Expert: string;
    Master: string;
  };
  pgnViewer: {
    title: string;
    subtitle: string;
    loadPgn: string;
    clear: string;
    controls: string;
    moveList: string;
    copyPgn: string;
    copyFen: string;
    flipBoard: string;
    coordinates: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    cta: string;
  };
  art: {
    title: string;
    subtitle: string;
    cta: string;
    search: string;
    filters: string;
    all: string;
    painting: string;
    sculpture: string;
    digital: string;
    photography: string;
  };
  books: {
    title: string;
    subtitle: string;
    cta: string;
    search: string;
    filters: string;
    all: string;
    strategy: string;
    tactics: string;
    endgame: string;
    openings: string;
    history: string;
    biography: string;
    fiction: string;
  };
  cinema: {
    title: string;
    subtitle: string;
    cta: string;
    search: string;
    filters: string;
    all: string;
    movie: string;
    documentary: string;
    series: string;
    short: string;
  };
  music: {
    title: string;
    subtitle: string;
    cta: string;
    search: string;
    filters: string;
    all: string;
    classical: string;
    jazz: string;
    contemporary: string;
    soundtrack: string;
  };
  pgn: {
    title: string;
    subtitle: string;
    cta: string;
  };
  ai: {
    title: string;
    placeholder: string;
    thinking: string;
    welcome: string;
    capabilities: string;
    chess: string;
    art: string;
    combinations: string;
    analysis: string;
    training: string;
  };
  artist: {
    name: string;
    title: string;
    bio: string;
    contact: string;
    email: string;
    portfolio: string;
    social: string;
  };
}

const translations: Record<'es' | 'en', Translations> = {
  es: (await import('@/locales/es/common.json')).default,
  en: (await import('@/locales/en/common.json')).default,
};

export function useTranslations(locale: 'es' | 'en' = 'es'): Translations {
  return translations[locale];
}

export function getTranslations(locale: 'es' | 'en' = 'es'): Translations {
  return translations[locale];
}

export function t(locale: 'es' | 'en', key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}