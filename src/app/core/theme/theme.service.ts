import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { readLocalStorage, writeLocalStorage } from '../storage';
import {
  COLOR_SCHEME_QUERY,
  DEFAULT_THEME_PREFERENCE,
  isThemePreference,
  resolveTheme,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  type ThemeName,
  type ThemePreference,
} from './theme.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly preferences = THEME_PREFERENCES;

  private readonly preferenceState = signal<ThemePreference>(DEFAULT_THEME_PREFERENCE);
  private readonly systemTheme = signal<ThemeName>('dark');

  readonly preference = this.preferenceState.asReadonly();
  readonly theme = computed(() => resolveTheme(this.preference(), this.systemTheme()));

  constructor() {
    this.preferenceState.set(this.readStoredPreference());
    this.bindSystemTheme();

    effect(() => {
      const preference = this.preference();
      const theme = this.theme();
      writeLocalStorage(this.document, THEME_STORAGE_KEY, preference);
      this.apply(theme);
    });
  }

  setPreference(value: string): void {
    if (!isThemePreference(value)) {
      return;
    }

    this.preferenceState.set(value);
  }

  private readStoredPreference(): ThemePreference {
    const stored = readLocalStorage(this.document, THEME_STORAGE_KEY);
    if (!stored || !isThemePreference(stored)) {
      return DEFAULT_THEME_PREFERENCE;
    }

    return stored;
  }

  private bindSystemTheme(): void {
    const view = this.document.defaultView;
    if (!view?.matchMedia) {
      return;
    }

    const media = view.matchMedia(COLOR_SCHEME_QUERY);
    this.systemTheme.set(media.matches ? 'light' : 'dark');

    if (typeof media.addEventListener !== 'function') {
      return;
    }

    const onChange = (event: MediaQueryListEvent) => {
      this.systemTheme.set(event.matches ? 'light' : 'dark');
    };

    media.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => media.removeEventListener('change', onChange));
  }

  private apply(theme: ThemeName): void {
    const root = this.document.documentElement;
    root.dataset['theme'] = theme;
    root.style.colorScheme = theme;
  }
}
