import {
  defaultPaletteId,
  isPaletteId,
  type PaletteId,
} from '@scalewing/tokens';

export const paletteStorageKey = 'scalewing-gallery-palette';

export function readPalettePreference(): PaletteId {
  if (typeof window === 'undefined') {
    return defaultPaletteId;
  }

  try {
    const stored = window.localStorage.getItem(paletteStorageKey);
    if (stored && isPaletteId(stored)) {
      return stored;
    }
  } catch {
    return defaultPaletteId;
  }

  return defaultPaletteId;
}

export function writePalettePreference(palette: PaletteId): void {
  try {
    window.localStorage.setItem(paletteStorageKey, palette);
  } catch {
    return;
  }
}
