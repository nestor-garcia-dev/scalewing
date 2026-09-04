import { ThemeProvider } from '@scalewing/react';
import { useState } from 'react';

import { catalog } from './catalog.js';
import { GalleryHero, GalleryShell } from './layout/GalleryShell.js';
import {
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from './theme-preference.js';

export function App() {
  const [preference, setPreference] =
    useState<ThemePreference>(readThemePreference);

  function onPreferenceChange(next: ThemePreference) {
    writeThemePreference(next);
    setPreference(next);
  }

  return (
    <ThemeProvider colorScheme={preference}>
      <GalleryShell
        onPreferenceChange={onPreferenceChange}
        preference={preference}
      >
        <GalleryHero />
        {catalog.map((entry) => (
          <entry.Section key={entry.id} />
        ))}
      </GalleryShell>
    </ThemeProvider>
  );
}
