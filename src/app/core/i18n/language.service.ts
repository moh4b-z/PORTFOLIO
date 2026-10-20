import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { readLocalStorage, writeLocalStorage } from '../storage';
import { catalogs } from './catalogs';
import {
  DEFAULT_LANGUAGE,
  isLanguageAvailable,
  isLanguageCode,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  type LanguageCode,
} from './language.model';
import { translate, type TranslationKey } from './translate';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  readonly languages = LANGUAGES;
  readonly language = signal<LanguageCode>(DEFAULT_LANGUAGE);

  constructor() {
    const stored = this.readStoredLanguage();
    if (stored) {
      this.language.set(stored);
    }

    effect(() => {
      const code = this.language();
      this.document.documentElement.lang = code;
      writeLocalStorage(this.document, LANGUAGE_STORAGE_KEY, code);
    });
  }

  t(key: TranslationKey): string {
    const code = this.language();
    const tree = catalogs[code] ?? catalogs[DEFAULT_LANGUAGE];
    if (!tree) {
      return key;
    }

    return translate(tree, key);
  }

  setLanguage(code: string): void {
    if (!isLanguageCode(code) || !isLanguageAvailable(code) || !catalogs[code]) {
      return;
    }

    this.language.set(code);
  }

  private readStoredLanguage(): LanguageCode | null {
    const stored = readLocalStorage(this.document, LANGUAGE_STORAGE_KEY);
    if (!stored || !isLanguageCode(stored) || !isLanguageAvailable(stored) || !catalogs[stored]) {
      return null;
    }

    return stored;
  }
}
