import {
  Badge,
  Button,
  Card,
  DescriptionItem,
  DescriptionList,
  Field,
  FilterChips,
  Grid,
  Inline,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  ThemeProvider,
  useTheme,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { useGalleryPalette } from '../palette-context.js';

const habitats = [
  { value: 'forest', label: 'Forest' },
  { value: 'wetland', label: 'Wetland' },
] as const;

const sightings = [
  { species: 'Grey heron', place: 'Reed bed edge', count: 12 },
  { species: 'Eurasian otter', place: 'River mouth', count: 2 },
] as const;

/** One set of controls, drawn by whichever density its ThemeProvider sets. */
function DensitySample({ id }: { id: string }) {
  const [chip, setChip] = useState('open');
  const [habitat, setHabitat] = useState('forest');
  return (
    <Stack data-testid={`density-${id}`} gap={3}>
      <Inline align="center" gap={2}>
        <Button onPress={() => undefined}>Log a sighting</Button>
        <Button onPress={() => undefined} size="sm" variant="secondary">
          Export
        </Button>
        <Button onPress={() => undefined} size="xs" variant="neutral">
          Move
        </Button>
        <Badge tone="success">Counted</Badge>
      </Inline>
      <FilterChips
        label="Sightings"
        labelVisuallyHidden
        onChange={setChip}
        options={[
          { value: 'open', label: 'Open', count: 4 },
          { value: 'closed', label: 'Closed', count: 12 },
        ]}
        selectedStyle="subtle"
        value={chip}
      />
      <Grid columns={2} columnsBelow={{ md: 1 }} gap={3}>
        <Field label="Species">
          <input defaultValue="Grey heron" />
        </Field>
        <Select
          label="Habitat"
          onChange={setHabitat}
          options={habitats}
          value={habitat}
        />
      </Grid>
      <Card padding={4} variant="outlined">
        <Stack gap={3}>
          <Text>A card's reading text takes the 15/22 size.</Text>
          <DescriptionList termWidth="md">
            <DescriptionItem term={<Text color="muted">Station</Text>}>
              <Text>Heron Marsh</Text>
            </DescriptionItem>
          </DescriptionList>
        </Stack>
      </Card>
      <Table aria-label={`Sightings, ${id}`}>
        <TableHeader>
          <TableRow>
            <TableCell as="th">Species</TableCell>
            <TableCell as="th">Place</TableCell>
            <TableCell as="th" numeric>
              Count
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sightings.map((sighting) => (
            <TableRow key={sighting.species}>
              <TableCell>{sighting.species}</TableCell>
              <TableCell>{sighting.place}</TableCell>
              <TableCell numeric>{sighting.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}

export function DensitySection() {
  const { colorScheme } = useTheme();
  const { palette } = useGalleryPalette();
  return (
    <Section
      id="density"
      purpose="ThemeProvider density compact is a desktop data tool's scale, opt-in and on a fine pointer only: a touch screen keeps its 44 px targets, whatever the density. md controls are 36 px high with 14 px side padding (sm 28/10, xs 24/8), FilterChips 32 px, a Card's corners the md radius, and a Card's, a Table's and a DescriptionList's reading text bodySm (15/22/400), as is everything that inherits the themed root's type: a field's label and its control's words. The default, comfortable, is today's output: no attribute and no rule. A ThemeProvider nested in a compact one is compact too."
      title="ThemeProvider density"
      usage={`<ThemeProvider density="compact" palette="cerulean">
  {children}
</ThemeProvider>`}
    >
      <Grid columns={2} columnsBelow={{ md: 1 }} gap={4}>
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            comfortable, the default
          </Text>
          <DensitySample id="comfortable" />
        </Stack>
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            compact
          </Text>
          <ThemeProvider
            colorScheme={colorScheme}
            density="compact"
            palette={palette}
          >
            <DensitySample id="compact" />
          </ThemeProvider>
        </Stack>
      </Grid>
    </Section>
  );
}
