import { BarChart, type BarChartItem, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import {
  sampleFeedVariance,
  sampleSightingChanges,
  sampleTraitFactors,
} from '../sample-copy.js';

/** A count with its sign, a typographic minus for fewer. */
function signedCount(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '\u2212' : '';
  return `${sign}${Math.abs(value)}`;
}

/** A signed count of kilograms. */
function signedKilograms(value: number): string {
  return `${signedCount(value)} kg`;
}

/** Over the plan is a warning and short of it is danger. */
const feedVariance: BarChartItem[] = sampleFeedVariance.map((item) => ({
  ...item,
  tone: item.value > 0 ? 'warning' : 'danger',
}));

export function BarChartSection() {
  return (
    <Section
      id="bar-chart"
      purpose="BarChart is a labeled horizontal magnitude chart. Accent fill is positive contribution; danger fill is negative. max keeps several charts on one scale. formatValue writes the axis and every value without its own label, such as a unit or a currency. diverging puts zero in the middle of each track, so a negative value's bar grows toward the start and a positive one's toward the end on the same scale, and the axis reads from minus max to max. An item's tone (accent, success, warning or danger) colors its bar by what it means in place of its sign's default, such as an overage in warning and a shortage in danger; the value and its side of zero still say it."
      title="BarChart"
      usage={`<BarChart
  aria-label="Trait contributions"
  max={6}
  items={[
    { label: 'Speed', value: 5 },
    { label: 'Habitat loss', value: -1.5 },
  ]}
/>

<BarChart
  aria-label="Change in sightings"
  diverging
  formatValue={(value) => \`\${value > 0 ? '+' : value < 0 ? '−' : ''}\${Math.abs(value)}\`}
  items={[{ label: 'Red fox', value: 6 }, { label: 'Curlew', value: -4 }]}
/>

<BarChart
  aria-label="Feed against plan"
  diverging
  items={[
    { label: 'Otter pool', value: 3, tone: 'warning' },
    { label: 'Owl barn', value: -4, tone: 'danger' },
  ]}
/>`}
    >
      <Stack gap={3}>
        <BarChart
          aria-label="Trait contributions"
          items={[...sampleTraitFactors]}
          max={6}
        />
        <Text variant="caption" color="muted">
          Source: gallery example · contribution = weight × trait value. Labels
          truncate. Values sit at the end of each track.
        </Text>
        <BarChart
          aria-label="Change in sightings"
          diverging
          formatValue={signedCount}
          items={[...sampleSightingChanges]}
        />
        <Text variant="caption" color="muted">
          diverging: sightings this season against last, by species. Fewer
          sightings run left of zero, more run right.
        </Text>
        <BarChart
          aria-label="Feed against plan"
          diverging
          formatValue={signedKilograms}
          items={feedVariance}
        />
        <Text variant="caption" color="muted">
          tone: feed put out against the plan, by enclosure. Over the plan runs
          right in warning, short of it runs left in danger.
        </Text>
      </Stack>
    </Section>
  );
}
