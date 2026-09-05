import { ThemeProvider } from '@scalewing/react';
import { type PaletteId } from '@scalewing/tokens';
import { useState } from 'react';

import { catalog } from './catalog.js';
import { GalleryHero } from './layout/GalleryHero.js';
import { GalleryShell } from './layout/GalleryShell.js';
import { GalleryPaletteProvider } from './palette-context.js';
import {
  readPalettePreference,
  writePalettePreference,
} from './palette-preference.js';
import {
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from './theme-preference.js';

export function App() {
  const [preference, setPreference] =
    useState<ThemePreference>(readThemePreference);
  const [palette, setPalette] = useState<PaletteId>(readPalettePreference);

  function onPreferenceChange(next: ThemePreference) {
    writeThemePreference(next);
    setPreference(next);
  }

  function onPaletteChange(next: PaletteId) {
    writePalettePreference(next);
    setPalette(next);
  }

  return (
    <ThemeProvider colorScheme={preference} palette={palette}>
      <GalleryPaletteProvider palette={palette} setPalette={onPaletteChange}>
        <GalleryShell
          onPreferenceChange={onPreferenceChange}
          preference={preference}
        >
          <GalleryHero />
          {catalog.map((entry) => (
            <entry.Section key={entry.id} />
          ))}
        </GalleryShell>
      </GalleryPaletteProvider>
    </ThemeProvider>
  );
}
