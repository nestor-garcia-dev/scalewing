import { BarChart, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import { sampleTraitFactors } from '../sample-copy.js';

export function BarChartSection() {
  return (
    <Section
      id="bar-chart"
      purpose="BarChart is a labeled horizontal magnitude chart. Accent fill is positive contribution; danger fill is negative. max keeps several charts on one scale."
      title="BarChart"
      usage={`<BarChart
  aria-label="Trait contributions"
  max={6}
  items={[
    { label: 'Speed', value: 5 },
    { label: 'Habitat loss', value: -1.5 },
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
      </Stack>
    </Section>
  );
}
