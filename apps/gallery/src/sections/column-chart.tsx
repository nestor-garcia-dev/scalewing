import { Card, ChartLegend, ColumnChart, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import {
  corrections,
  lakeCallouts,
  lakeChange,
  lakeKey,
  lakeRunningTotal,
  sightings,
  surveyWeeks,
} from './column-chart-data.js';

/** A signed count of birds, a typographic minus for fewer. */
function signedBirds(value: number): string {
  if (value === 0) return '0';
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}`;
}

function LakeChange({ name }: { name: string }) {
  return (
    <Stack gap={3}>
      <ChartLegend aria-label={`${name} key`} items={lakeKey} />
      <ColumnChart
        callouts={lakeCallouts}
        categories={surveyWeeks}
        formatValue={signedBirds}
        highlight={surveyWeeks.length - 1}
        label={name}
        line={{ label: 'Running total', values: lakeRunningTotal }}
        series={lakeChange}
      />
    </Stack>
  );
}

export function ColumnChartSection() {
  return (
    <Section
      id="column-chart"
      purpose="ColumnChart draws columns for each category (a week, a month), stacked or grouped by series in the categorical hues, with an optional line on its own right-hand scale (a running total) whose zero and grid lines are level with the columns'. Negative values run below the zero line. highlight boxes the current period and callouts pin words above a column with a dashed leader. It fills its container and is laid out for its width: a narrow chart labels fewer categories and lists its callouts under the plot, never scrolling sideways. The drawing is hidden from assistive technology; a visually hidden table named by label carries every figure. Pair it with a ChartLegend above it."
      title="ColumnChart"
      usage={`<ChartLegend aria-label="Key" items={[
  { label: 'Herons', swatch: 'bar', tone: 'blue' },
  { label: 'Running total', swatch: 'line', tone: 'accent' },
  { label: 'This week', swatch: 'box', tone: 'accent' },
]} />
<ColumnChart
  label="Change in birds, last 13 weeks"
  categories={weeks}
  series={[{ id: 'herons', label: 'Herons', tone: 'blue', values }]}
  mode="stacked"
  line={{ label: 'Running total', values: runningTotal }}
  highlight={12}
  callouts={[{ index: 3, text: 'Aug 4 · Roost found +50', tone: 'blue' }]}
  formatValue={(value) => \`\${value > 0 ? '+' : ''}\${value}\`}
/>`}
    >
      <Stack gap={4}>
        <Text variant="label">
          Stacked, either side of zero, with a running total, this week boxed
          and two callouts
        </Text>
        <Card padding={4}>
          <LakeChange name="Change in birds at the lake, last 13 weeks" />
        </Card>
        <Text variant="label">Grouped</Text>
        <Card padding={4}>
          <Stack gap={3}>
            <ChartLegend
              aria-label="Sightings key"
              items={[
                { label: 'By day', swatch: 'bar', tone: 'neutral' },
                { label: 'By night', swatch: 'bar', tone: 'teal' },
                { label: 'This week', swatch: 'box', tone: 'accent' },
              ]}
            />
            <ColumnChart
              categories={surveyWeeks}
              highlight={surveyWeeks.length - 1}
              label="Sightings each week"
              mode="grouped"
              series={sightings}
            />
          </Stack>
        </Card>
        <Text variant="label">Stacked counts</Text>
        <Card padding={4}>
          <Stack gap={3}>
            <ChartLegend
              aria-label="Corrections key"
              items={[
                { label: 'Removed', swatch: 'bar', tone: 'rose' },
                { label: 'Corrected or added', swatch: 'bar', tone: 'blue' },
                { label: 'Recounts accepted', swatch: 'bar', tone: 'orange' },
              ]}
            />
            <ColumnChart
              categories={surveyWeeks}
              label="Records corrected each week"
              series={corrections}
            />
          </Stack>
        </Card>
        <Text variant="label">At a phone&apos;s width</Text>
        <div className="gallery-phone-frame">
          <Card padding={4}>
            <LakeChange name="Change in birds, on a phone" />
          </Card>
        </div>
        <Text variant="label">No data yet</Text>
        <Card padding={4}>
          <ColumnChart categories={[]} label="No weeks surveyed" series={[]} />
        </Card>
        <Text variant="caption" color="muted">
          The table that carries the figures is hidden from view, not from a
          screen reader; the callouts stay a list.
        </Text>
      </Stack>
    </Section>
  );
}
