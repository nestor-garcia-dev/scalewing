import { Progress, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function ProgressSection() {
  return (
    <Section
      id="progress"
      purpose="Progress shows a known value and maximum through native progressbar semantics. showCount false hides the visible value / max count when the page shows its own caption, so the count appears once. tone is accent, success, warning (time running out) or danger. Spinner remains the indeterminate loading indicator."
      title="Progress"
      usage={`<Progress label="Habitats surveyed" value={2} max={4} />

<Progress label="Daylight left" value={102} max={120} tone="warning" showCount={false} />
<Text variant="caption" color="muted">The light fades in 1:42</Text>

<Progress label="Transects walked" value={2} max={4} showCount={false} />
<Text variant="caption" color="muted">2 of 4 transects walked</Text>`}
    >
      <Stack gap={4}>
        <Progress label="Habitats surveyed" max={4} value={0} />
        <Progress
          label="Field guides reviewed"
          max={4}
          tone="success"
          value={2}
        />
        <Stack gap={1}>
          <Progress
            label="Daylight left for the count"
            max={120}
            showCount={false}
            tone="warning"
            value={102}
          />
          <Text color="muted" variant="caption">
            The light fades in 1:42; finish the heron count first.
          </Text>
        </Stack>
        <Progress
          label="Species records checked"
          max={4}
          tone="danger"
          value={4}
        />
        <Stack gap={1}>
          <Progress
            label="Transects walked"
            max={4}
            showCount={false}
            value={2}
          />
          <Text color="muted" variant="caption">
            2 of 4 transects walked
          </Text>
        </Stack>
      </Stack>
    </Section>
  );
}
