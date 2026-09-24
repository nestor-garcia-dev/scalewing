import { Button, Card, Field, Grid, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

const surveyActions = [
  'Log a sighting',
  'Open the field guide',
  'Plan a survey route',
  'Record a habitat note',
  'Registrar una observación nocturna',
  'Export the season census',
] as const;

export function GridSection() {
  return (
    <Section
      id="grid"
      purpose="Grid lays children out in equal-width columns. Choose one to four columns, or six for a wide count row, a gap step, and optionally fewer columns below the md breakpoint so tiles and cards stay readable on a phone. A direct child can take columnSpan to cover several columns, so three columns with a two-column form give a two-to-one page; a span never exceeds the columns the grid has at the current width, so the same page stacks on a phone."
      title="Grid"
      usage={`<Grid columns={3} columnsBelow={{ md: 2 }} gap={2}>
  <Button variant="secondary" onPress={logSighting}>Log a sighting</Button>
  <Button variant="secondary" onPress={openGuide}>Open the field guide</Button>
  <Button variant="secondary" onPress={planSurvey}>Plan a survey route</Button>
</Grid>

<Grid columns={3} columnsBelow={{ md: 1 }} gap={4}>
  <Stack columnSpan={2} gap={3}>{sightingForm}</Stack>
  <Card variant="outlined">{habitatLookup}</Card>
</Grid>`}
    >
      <Stack gap={4}>
        <Grid
          aria-label="Survey actions"
          as="section"
          columns={3}
          columnsBelow={{ md: 2 }}
          gap={2}
        >
          {surveyActions.map((action) => (
            <Button key={action} onPress={() => undefined} variant="secondary">
              {action}
            </Button>
          ))}
        </Grid>
        <Grid aria-label="Season totals" as="section" columns={3} gap={3}>
          {[
            ['42', 'Sightings'],
            ['7', 'Habitats surveyed'],
            ['3', 'New species'],
          ].map(([value, label]) => (
            <Card key={label} padding={4} variant="outlined">
              <Stack align="center" gap={1}>
                <Text className="sw-tabular" variant="heading">
                  {value}
                </Text>
                <Text color="muted" variant="caption">
                  {label}
                </Text>
              </Stack>
            </Card>
          ))}
        </Grid>
        <Grid
          aria-label="Sighting entry"
          as="section"
          columns={3}
          columnsBelow={{ md: 1 }}
          gap={4}
        >
          <Card aria-label="Sighting form" columnSpan={2} padding={4}>
            <Stack gap={3}>
              <Field label="Species">
                <input defaultValue="Red fox" name="grid-species" />
              </Field>
              <Field label="Field notes">
                <input
                  defaultValue="Two adults crossing the forest edge at dusk"
                  name="grid-notes"
                />
              </Field>
            </Stack>
          </Card>
          <Card aria-label="Habitat lookup" padding={4} variant="outlined">
            <Stack gap={1}>
              <Text variant="label">Forest</Text>
              <Text color="muted" variant="caption">
                42 sightings this season, last one two days ago.
              </Text>
            </Stack>
          </Card>
        </Grid>
        <Grid aria-label="Full-width action" columns={1} gap={2}>
          <Button onPress={() => undefined} variant="secondary">
            Start the evening count
          </Button>
        </Grid>
      </Stack>
    </Section>
  );
}
