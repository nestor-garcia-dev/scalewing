import { Progress, Stack, Text } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function ProgressSection() {
  return (
    <Section
      id="progress"
      purpose="Progress shows a known value and maximum through native progressbar semantics. showCount false hides the visible value / max count when the page shows its own caption, so the count appears once. Spinner remains the indeterminate loading indicator."
      title="Progress"
      usage={`<Progress label="Habitats surveyed" value={2} max={4} />

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
