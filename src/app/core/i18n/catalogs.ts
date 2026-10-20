import { en } from './locales/en';
import { es } from './locales/es';
import { pt } from './locales/pt';
import type { LanguageCode } from './language.model';
import type { TranslationTree } from './translate';

export const catalogs: Record<LanguageCode, TranslationTree | null> = {
  pt,
  en,
  es,
};
