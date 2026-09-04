import { type ColorScheme } from '@scalewing/tokens';

export const themeStorageKey = 'scalewing-gallery-color-scheme';

export type ThemePreference = ColorScheme | 'system';

export function isThemePreference(value: string): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readThemePreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (stored && isThemePreference(stored)) {
      return stored;
    }
  } catch {
    return 'system';
  }

  return 'system';
}

export function writeThemePreference(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(themeStorageKey, preference);
  } catch {
    return;
  }
}
