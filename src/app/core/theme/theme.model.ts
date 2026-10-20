/** Manter o valor igual ao script de `src/index.html`. */
export const THEME_STORAGE_KEY = 'portfolio.theme';

export const THEME_NAMES = ['light', 'dark'] as const;
export const THEME_PREFERENCES = ['dark', 'light', 'system'] as const;

export type ThemeName = (typeof THEME_NAMES)[number];
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

/** Preferência inicial. `system` passa a seguir `prefers-color-scheme`. */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark';

export const COLOR_SCHEME_QUERY = '(prefers-color-scheme: light)';

export function isThemePreference(value: string): value is ThemePreference {
  return (THEME_PREFERENCES as readonly string[]).includes(value);
}

export function resolveTheme(preference: ThemePreference, systemTheme: ThemeName): ThemeName {
  return preference === 'system' ? systemTheme : preference;
}
