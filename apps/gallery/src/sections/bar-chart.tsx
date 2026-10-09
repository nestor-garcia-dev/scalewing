import { BarChart, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { sampleSightingChanges, sampleTraitFactors } from '../sample-copy.js';

/** A count with its sign, a typographic minus for fewer. */
function signedCount(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '\u2212' : '';
  return `${sign}${Math.abs(value)}`;
}

export function BarChartSection() {
  return (
    <Section
      id="bar-chart"
      purpose="BarChart is a labeled horizontal magnitude chart. Accent fill is positive contribution; danger fill is negative. max keeps several charts on one scale. formatValue writes the axis and every value without its own label, such as a unit or a currency. diverging puts zero in the middle of each track, so a negative value's bar grows toward the start and a positive one's toward the end on the same scale, and the axis reads from minus max to max."
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
      </Stack>
    </Section>
  );
}
