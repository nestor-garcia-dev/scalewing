import {
  Badge,
  Box,
  Button,
  Card,
  Field,
  Inline,
  SegmentedControl,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';
import {
  defaultPaletteId,
  familyLabel,
  paletteById,
  paletteFamilies,
  paletteHasStylesheet,
  palettes,
  type PaletteFamily,
  type PaletteId,
} from '@scalewing/tokens';
import { useState } from 'react';

import { CodeSample, Section } from '../layout/Section.js';
import { useGalleryPalette } from '../palette-context.js';
import { sampleHabitats } from '../sample-copy.js';

type FamilyFilter = PaletteFamily | 'all';

function palettesFor(filter: FamilyFilter) {
  if (filter === 'all') {
    return palettes;
  }

  return palettes.filter((palette) => palette.family === filter);
}

function usageSnippet(palette: PaletteId): string {
  if (palette === defaultPaletteId) {
    return `<ThemeProvider colorScheme="system">
  {children}
</ThemeProvider>`;
  }

  const file = paletteHasStylesheet(palette)
    ? `\nimport '@scalewing/react/palette/${palette}.css';`
    : '';

  return `import '@scalewing/react/styles.css';${file}

<ThemeProvider colorScheme="system" palette="${palette}">
  {children}
</ThemeProvider>

<html data-theme="light" data-palette="${palette}">`;
}

export function PalettesSection() {
  const { palette, setPalette } = useGalleryPalette();
  const [family, setFamily] = useState<FamilyFilter>('all');
  const selected = paletteById(palette);
  const visible = palettesFor(family);

  return (
    <Section
      id="palettes"
      purpose="Named palettes overlay semantic colors for both light and dark. React apps set ThemeProvider palette and colorScheme (light, dark, or system) so end users can switch. CSS-only apps set data-theme and optional data-palette, or import one generated palette file after styles.css. The default is indigo; it needs no extra file. Retro palettes also retint background. A colors overlay may be flat or a light/dark map."
      title="Palettes"
      usage={usageSnippet(palette)}
    >
      <Stack gap={4}>
        <Text>
          The header Palette control applies the catalog to this gallery. Light,
          Dark, and System switch the matching pair for that palette. A colors
          overlay on ThemeProvider still wins, and may be a light/dark map.
        </Text>
        <SegmentedControl
          aria-label="Palette family"
          items={[
            { id: 'all', label: 'All' },
            ...paletteFamilies.map((id) => ({
              id,
              label: familyLabel[id],
            })),
          ]}
          onChange={(id) => setFamily(id as FamilyFilter)}
          value={family}
        />
        <Inline gap={2} wrap>
          {visible.map((item) => (
            <Button
              aria-pressed={item.id === palette}
              key={item.id}
              onPress={() => setPalette(item.id)}
              size="sm"
              variant={item.id === palette ? 'primary' : 'secondary'}
            >
              {item.name}
            </Button>
          ))}
        </Inline>
        <Text color="muted" variant="caption">
          {selected.name}. {selected.summary}
        </Text>
        {palette !== defaultPaletteId ? (
          <CodeSample>{`import '@scalewing/react/palette/${palette}.css';`}</CodeSample>
        ) : null}
        <Card padding={4}>
          <Stack gap={3}>
            <Inline align="center" justify="between" wrap>
              <Text variant="title">Sightings</Text>
              <Box as="a" href="#palettes">
                Add habitat
              </Box>
            </Inline>
            <Inline gap={2} wrap>
              <Badge tone="accent">Mammal</Badge>
              <Badge>Nocturnal</Badge>
            </Inline>
            <Table aria-label="Palette preview census" density="compact">
              <TableHeader>
                <TableRow>
                  <TableCell as="th">Species</TableCell>
                  <TableCell as="th" numeric>
                    Δ
                  </TableCell>
                  <TableCell as="th">Log</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow selected>
                  <TableCell>
                    <Text color="accent" variant="label">
                      Red fox
                    </Text>
                  </TableCell>
                  <TableCell numeric>
                    <Text color="success" variant="data">
                      0
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Button onPress={() => undefined} size="xs">
                      Log
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Text color="accent" variant="label">
                      Snow leopard
                    </Text>
                  </TableCell>
                  <TableCell numeric>
                    <Text color="danger" variant="data">
                      -5
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Button onPress={() => undefined} size="xs">
                      Log
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Field label="Preview habitat" size="xs">
              <select defaultValue="forest" name="palette-preview-habitat">
                {sampleHabitats.map((habitat) => (
                  <option key={habitat.value} value={habitat.value}>
                    {habitat.label}
                  </option>
                ))}
              </select>
            </Field>
          </Stack>
        </Card>
      </Stack>
    </Section>
  );
}
