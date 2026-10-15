import {
  Box,
  Button,
  Card,
  Inline,
  Stack,
  Text,
  ThemeProvider,
  useTheme,
} from '@scalewing/react';
import { useEffect, useRef, useState } from 'react';

import { Section } from '../layout/Section.js';
import { useGalleryPalette } from '../palette-context.js';

/**
 * A page on the grouped canvas: a nested ThemeProvider with the gallery's
 * scheme and palette (a product with a `colors` overlay passes it too), its
 * white cards set apart by the grey around them.
 */
function GroupedPage() {
  const { colorScheme } = useTheme();
  const { palette } = useGalleryPalette();
  return (
    <ThemeProvider canvas="grouped" colorScheme={colorScheme} palette={palette}>
      <Box padding={4} radius="lg">
        <Stack gap={3}>
          <Stack gap={1}>
            <Text as="h3" variant="title">
              Marsh survey
            </Text>
            <Text color="muted" variant="caption">
              6 nights counted · 2 herons left to band
            </Text>
          </Stack>
          <Card padding={4}>
            <Stack gap={1}>
              <Text variant="label">North colony</Text>
              <Text color="muted" variant="caption">
                812 grey herons on the last count
              </Text>
            </Stack>
          </Card>
          <Card padding={4}>
            <Stack gap={1}>
              <Text variant="label">South reeds</Text>
              <Text color="muted" variant="caption">
                472 grey herons on the last count
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

/**
 * A notice a script focuses after a save: the whole card takes focus, so the
 * canvas's accent ring goes round it, not the browser's outline.
 */
function SavedNotice() {
  const [saved, setSaved] = useState(false);
  const notice = useRef<HTMLElement>(null);
  useEffect(() => {
    if (saved) notice.current?.focus();
  }, [saved]);
  return (
    <Stack gap={2}>
      <Inline gap={2} wrap>
        <Button onPress={() => setSaved(true)} size="sm" variant="secondary">
          Save den notes
        </Button>
        <Button onPress={() => setSaved(false)} size="sm" variant="ghost">
          Clear
        </Button>
      </Inline>
      {saved ? (
        <Box radius="lg" ref={notice} role="status" tabIndex={-1}>
          <Card padding={4} variant="outlined">
            <Text as="p">Den notes saved for the red fox burrow.</Text>
          </Card>
        </Box>
      ) : null}
    </Stack>
  );
}

export function CanvasSection() {
  return (
    <Section
      id="canvas"
      purpose="ThemeProvider writes data-theme. Generated CSS sets page background, type, links, native text controls, and the focus ring of a programmatic focus target (tabIndex -1). prefers-reduced-transparency falls back to solid surface. canvas grouped (opt-in) paints the page a quiet grey in the light scheme, so white cards stand apart; links and accent words belong in the cards."
      title="Canvas"
      usage={`<ThemeProvider colorScheme="system">
  <Box as="a" href="#layout">Layout</Box>
</ThemeProvider>

<Box ref={notice} tabIndex={-1} radius="lg">
  <Card variant="outlined">Den notes saved.</Card>
</Box>

<ThemeProvider canvas="grouped" colorScheme="system">
  <Card padding={4}>North colony</Card>
  <Card padding={4}>South reeds</Card>
</ThemeProvider>`}
    >
      <Stack gap={3}>
        <Text>
          Body copy uses the canvas type. Links in this gallery should not look
          like user-agent chrome.
        </Text>
        <Inline gap={3} wrap>
          <Box as="a" href="#layout">
            In-page canvas link
          </Box>
          <Box as="a" href="#button">
            Another canvas link
          </Box>
        </Inline>
        <Stack gap={2}>
          <input
            aria-label="Canvas text input"
            defaultValue="Native text control"
          />
          <select aria-label="Canvas select">
            <option>Native select</option>
            <option>Second option</option>
          </select>
        </Stack>
        <SavedNotice />
        <Text color="muted" variant="caption">
          A notice a script focuses after a save (tabIndex -1) takes the accent
          ring past the ring offset when the browser would show a ring, as after
          a keyboard press; give the Box the card&apos;s radius so the ring
          follows its corners.
        </Text>
        <GroupedPage />
        <Text color="muted" variant="caption">
          If the OS requests reduced transparency, glass fills become
          colors.surface and backdrop-filter is disabled.
        </Text>
      </Stack>
    </Section>
  );
}
