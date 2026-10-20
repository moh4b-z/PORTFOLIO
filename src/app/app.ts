import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './core/i18n/language.service';
import type { TranslationKey } from './core/i18n/translate';
import { ThemeService } from './core/theme/theme.service';
import type { ThemePreference } from './core/theme/theme.model';

const THEME_LABEL_KEYS = {
  dark: 'theme.dark',
  light: 'theme.light',
  system: 'theme.system',
} as const satisfies Record<ThemePreference, TranslationKey>;

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly i18n = inject(LanguageService);
  protected readonly theme = inject(ThemeService);

  protected themeLabel(preference: ThemePreference): TranslationKey {
    return THEME_LABEL_KEYS[preference];
  }

  protected onLanguageChange(event: Event): void {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }

    this.i18n.setLanguage(select.value);
  }

  protected onThemeChange(event: Event): void {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }

    this.theme.setPreference(select.value);
  }
}
