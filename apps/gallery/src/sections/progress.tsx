import { Progress, Stack } from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function ProgressSection() {
  return (
    <Section
      id="progress"
      purpose="Progress shows a known value and maximum through native progressbar semantics. Spinner remains the indeterminate loading indicator."
      title="Progress"
      usage={`<Progress label="Habitats surveyed" value={2} max={4} />`}
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
      </Stack>
    </Section>
  );
}
