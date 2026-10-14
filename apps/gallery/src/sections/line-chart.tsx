import { Card, ChartLegend, LineChart, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';
import {
  flockDepartures,
  lastWeek,
  nestBoxesLent,
  roostKey,
  roostNights,
  roostTicks,
  shortDate,
} from './line-chart-data.js';

const birds = (value: number) => value.toLocaleString('en-US');
const thousands = (value: number) =>
  value === 0 ? '0' : `${Math.round(value / 100) / 10}k`;

function Roost({ name }: { name: string }) {
  return (
    <Stack gap={3}>
      <ChartLegend aria-label={`${name} key`} items={roostKey} />
      <LineChart
        area
        formatDate={shortDate}
        formatTick={thousands}
        formatValue={birds}
        highlight={lastWeek}
        label={name}
        markers={flockDepartures}
        markersLabel="A flock left"
        points={roostNights}
        ticks={roostTicks}
        valueLabel="Roosting"
      />
    </Stack>
  );
}

export function LineChartSection() {
  return (
    <Section
      id="line-chart"
      purpose="LineChart draws a value over time: a line through its points by date (YYYY-MM-DD), straight or in steps, optionally over a tinted area, in a stroke tone. markers put a downward triangle and words on chosen dates, highlight boxes a period, and the last value sits beside the plot's end. ticks choose the dates the time axis labels; a narrow chart drops the ones that would meet. It fills its container and is laid out for its width, never scrolling sideways. The drawing is hidden from assistive technology; a visually hidden table named by label carries every date, value and marker. Pair it with a ChartLegend above it."
      title="LineChart"
      usage={`<LineChart
  label="Birds roosting each night"
  points={[{ x: '2026-07-27', y: 1200 }, …]}
  area
  markers={[{ x: '2026-08-12', label: '1.7k', tone: 'warning' }]}
  markersLabel="A flock left"
  ticks={['2026-07-27', '2026-08-17', '2026-10-12']}
  highlight={{ from: '2026-10-06', to: '2026-10-12' }}
  formatDate={shortDate}
  formatValue={(value) => value.toLocaleString()}
/>

<LineChart label="Nest boxes lent" curve="step" tone="warning" points={steps} />`}
    >
      <Stack gap={4}>
        <Text variant="label">
          An area with markers, the last week boxed and the last value
        </Text>
        <Card padding={4}>
          <Roost name="Birds roosting at the reserve each night" />
        </Card>
        <Text variant="label">A step line in another tone</Text>
        <Card padding={4}>
          <Stack gap={3}>
            <ChartLegend
              aria-label="Nest boxes key"
              items={[
                { label: 'Nest boxes lent', swatch: 'line', tone: 'warning' },
              ]}
            />
            <LineChart
              curve="step"
              endLabel={false}
              formatDate={shortDate}
              label="Nest boxes lent to other reserves"
              points={nestBoxesLent}
              tone="warning"
            />
          </Stack>
        </Card>
        <Text variant="label">At a phone&apos;s width</Text>
        <div className="gallery-phone-frame">
          <Card padding={4}>
            <Roost name="Birds roosting, on a phone" />
          </Card>
        </div>
        <Text variant="label">One night counted: its dot</Text>
        <Card padding={4}>
          <LineChart
            formatDate={shortDate}
            label="The first night counted"
            points={roostNights.slice(0, 1)}
          />
        </Card>
        <Text variant="label">No data yet</Text>
        <Card padding={4}>
          <LineChart label="No nights counted" points={[]} />
        </Card>
        <Text variant="caption" color="muted">
          A marker&apos;s words give way where they would meet another&apos;s;
          the table still lists every one.
        </Text>
      </Stack>
    </Section>
  );
}
