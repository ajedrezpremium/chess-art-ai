import esTranslations from '@/locales/es/common.json';
import enTranslations from '@/locales/en/common.json';

type Locale = 'es' | 'en';
type Translations = typeof esTranslations;

const translations: Record<Locale, Translations> = {
  es: esTranslations,
  en: enTranslations,
};

export function useTranslations(locale: Locale = 'es'): Translations {
  return translations[locale];
}

export function getTranslations(locale: Locale = 'es'): Translations {
  return translations[locale];
}

export function t(locale: Locale, key: string): string {
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