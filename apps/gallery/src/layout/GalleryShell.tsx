import {
  Box,
  Field,
  Inline,
  SegmentedControl,
  Stack,
  Text,
} from '@scalewing/react';
import {
  familyLabel,
  isPaletteId,
  paletteFamilies,
  palettes,
} from '@scalewing/tokens';
import { type ReactNode } from 'react';

import { useGalleryPalette } from '../palette-context.js';
import {
  isThemePreference,
  type ThemePreference,
} from '../theme-preference.js';
import { GalleryNav } from './GalleryNav.js';

const themeItems = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
] as const;

export function GalleryShell({
  children,
  onPreferenceChange,
  preference,
}: {
  children: ReactNode;
  onPreferenceChange: (preference: ThemePreference) => void;
  preference: ThemePreference;
}) {
  const { palette, setPalette } = useGalleryPalette();

  return (
    <>
      <Box as="a" className="gallery-skip" href="#gallery-main">
        Skip to catalog
      </Box>
      <Box as="header" className="gallery-header" paddingY={3}>
        <Box className="gallery-frame" paddingX={4}>
          <Inline align="center" gap={3} justify="between" wrap>
            <Inline align="center" gap={3} wrap>
              <Text variant="title">Scalewing</Text>
              <Text color="accent" variant="label">
                Workspace preview
              </Text>
            </Inline>
            <Inline align="end" gap={3} wrap>
              <SegmentedControl
                aria-label="Color scheme"
                items={themeItems}
                onChange={(id) => {
                  if (isThemePreference(id)) {
                    onPreferenceChange(id);
                  }
                }}
                value={preference}
              />
              <Field label="Palette" size="xs">
                <select
                  name="gallery-palette"
                  onChange={(event) => {
                    const next = event.currentTarget.value;
                    if (isPaletteId(next)) {
                      setPalette(next);
                    }
                  }}
                  value={palette}
                >
                  {paletteFamilies.map((family) => (
                    <optgroup key={family} label={familyLabel[family]}>
                      {palettes
                        .filter((item) => item.family === family)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
            </Inline>
          </Inline>
        </Box>
      </Box>
      <Box className="gallery-frame" padding={4} paddingTop={5}>
        <div className="gallery-body">
          <GalleryNav />
          <Box as="main" id="gallery-main">
            <Stack gap={8}>{children}</Stack>
          </Box>
        </div>
      </Box>
    </>
  );
}
