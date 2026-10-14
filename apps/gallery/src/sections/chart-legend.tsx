import {
  Card,
  ChartLegend,
  type ChartLegendItem,
  Stack,
  Text,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';

/** A count of birds at the lake: two series, a running total and this week. */
const lakeCount: readonly ChartLegendItem[] = [
  { label: 'Herons', swatch: 'bar', tone: 'blue' },
  { label: 'Egrets, with the dawn recount', swatch: 'bar', tone: 'purple' },
  { label: 'Running total', swatch: 'line', tone: 'accent' },
  { label: 'This week', swatch: 'box', tone: 'accent' },
];

/** A reed bed's water level, with each flood marked. */
const waterLevel: readonly ChartLegendItem[] = [
  { label: 'Water level', swatch: 'line', tone: 'accent' },
  { label: 'Flood', swatch: 'marker', tone: 'danger' },
  { label: 'Owed to the next season', swatch: 'line', tone: 'warning' },
];

/** Every series hue, and the quieter strokes. */
const everyTone: readonly ChartLegendItem[] = [
  { label: 'Moorland', swatch: 'bar', tone: 'green' },
  { label: 'Lake', swatch: 'bar', tone: 'blue' },
  { label: 'Desert', swatch: 'bar', tone: 'orange' },
  { label: 'Heath', swatch: 'bar', tone: 'purple' },
  { label: 'Estuary', swatch: 'bar', tone: 'teal' },
  { label: 'Orchard', swatch: 'bar', tone: 'rose' },
  { label: 'Unsurveyed', swatch: 'bar', tone: 'neutral' },
  { label: 'Nesting season', swatch: 'line', tone: 'success' },
  { label: 'Last year', swatch: 'line', tone: 'neutral' },
];

/** The statement bars' tones, as DataBar draws them. */
const colonyDay: readonly ChartLegendItem[] = [
  { label: 'Counted at dawn', swatch: 'bar', tone: 'neutral' },
  { label: 'Flew in', swatch: 'bar', tone: 'success' },
  { label: 'Flew off', swatch: 'bar', tone: 'muted' },
  { label: 'Expected at dusk', swatch: 'bar', tone: 'strong' },
  { label: 'Counted at dusk', swatch: 'bar', tone: 'accent' },
  { label: 'Short of the count', swatch: 'bar', tone: 'danger' },
];

export function ChartLegendSection() {
  return (
    <Section
      id="chart-legend"
      purpose="ChartLegend is a chart's key: a list of its marks, each a swatch and its words, in a wrapping row in the caption type, placed above the chart or the statement bars it names. A bar swatch is a filled mark in a fill tone: a categorical colour for a chart's series, or one of DataBar's statement tones. A line, a marker (a downward triangle) and a box (the boxed current period) are strokes in a stroke tone: accent, success, warning, danger or neutral. Each swatch is the colour of the mark it names in the same tone. The swatches are hidden from assistive technology, so each item reads as its words, and the list keeps its role. Forced colors draw every swatch in the system text color."
      title="ChartLegend"
      usage={`<ChartLegend
  aria-label="Key"
  items={[
    { label: 'Herons', swatch: 'bar', tone: 'blue' },
    { label: 'Running total', swatch: 'line', tone: 'accent' },
    { label: 'Flood', swatch: 'marker', tone: 'danger' },
    { label: 'This week', swatch: 'box', tone: 'accent' },
  ]}
/>`}
    >
      <Stack gap={4}>
        <Text variant="label">Above a column chart</Text>
        <Card padding={4}>
          <ChartLegend aria-label="Lake count key" items={lakeCount} />
        </Card>
        <Text variant="label">Above a line chart</Text>
        <Card padding={4}>
          <ChartLegend aria-label="Water level key" items={waterLevel} />
        </Card>
        <Text variant="label">Above a statement&apos;s range bars</Text>
        <Card padding={4}>
          <ChartLegend aria-label="Colony day key" items={colonyDay} />
        </Card>
        <Text variant="label">Every series hue and the quieter lines</Text>
        <Card padding={4}>
          <ChartLegend aria-label="Every tone key" items={everyTone} />
        </Card>
        <Text variant="caption" color="muted">
          The words wrap within their item on a narrow screen; the swatch stays
          centred on their first line.
        </Text>
      </Stack>
    </Section>
  );
}
