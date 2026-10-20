/** Manter o valor igual ao script de `src/index.html`. */
export const LANGUAGE_STORAGE_KEY = 'portfolio.language';

export const LANGUAGE_CODES = ['pt', 'en', 'es'] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export interface LanguageOption {
  code: LanguageCode;
  nativeLabel: string;
  /** Só idiomas com catálogo pronto podem ser escolhidos. */
  available: boolean;
}

export const DEFAULT_LANGUAGE: LanguageCode = 'pt';

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'pt', nativeLabel: 'Português', available: true },
  { code: 'en', nativeLabel: 'English', available: false },
  { code: 'es', nativeLabel: 'Español', available: false },
];

export function isLanguageCode(value: string): value is LanguageCode {
  return (LANGUAGE_CODES as readonly string[]).includes(value);
}

export function isLanguageAvailable(code: LanguageCode): boolean {
  return LANGUAGES.some((language) => language.code === code && language.available);
}
