import {
  BarChart,
  type BarChartItem,
  Card,
  Stack,
  Text,
} from '@scalewing/react';

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

/** The two busiest nights keep the accent; the others are neutral. */
const owlNights: BarChartItem[] = [
  { label: 'Mon', value: 3 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 4 },
  { label: 'Thu', value: 3 },
  { label: 'Fri', value: 9 },
  { label: 'Sat', value: 11 },
  { label: 'Sun', value: 5 },
].map((night) =>
  night.value > 8 ? night : { ...night, tone: 'neutral' as const },
);

export function BarChartSection() {
  return (
    <Section
      id="bar-chart"
      purpose="BarChart is a labeled horizontal magnitude chart. Accent fill is positive contribution; danger fill is negative. max keeps several charts on one scale. formatValue writes the axis and every value without its own label, such as a unit or a currency. diverging puts zero in the middle of each track, so a negative value's bar grows toward the start and a positive one's toward the end on the same scale, and the axis reads from minus max to max. appearance bare draws the bars alone, with no track and no axis, for bars whose values are all written beside them. An item's tone (accent, success, warning, danger or neutral, the muted grey for a bar that is counted but not the point) colors its bar by what it means in place of its sign's default, such as an overage in warning and a shortage in danger; the value and its side of zero still say it."
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
/>

<BarChart
  aria-label="Owls heard by night"
  appearance="bare"
  items={[
    { label: 'Thu', value: 3, tone: 'neutral' },
    { label: 'Fri', value: 9 },
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
        <Card padding={4}>
          <Stack gap={2}>
            <Text variant="label">Owls heard by night</Text>
            <BarChart
              appearance="bare"
              aria-label="Owls heard by night"
              items={owlNights}
            />
          </Stack>
        </Card>
        <Text variant="caption" color="muted">
          appearance bare: no track and no axis, each value beside its bar. The
          usual nights are neutral and the two busiest keep the accent.
        </Text>
      </Stack>
    </Section>
  );
}
