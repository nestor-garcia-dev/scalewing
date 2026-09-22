import {
  Badge,
  Inline,
  Stack,
  Text,
  badgeSizes,
  badgeTones,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function BadgeSection() {
  return (
    <Section
      id="badge"
      purpose="Badge is the non-interactive chicklet for status, class, and why chips. size sm fits several chips in one table cell. Use Button for press actions."
      title="Badge"
      usage={`<Badge size="sm">Nocturnal</Badge>`}
    >
      <Stack gap={3}>
        <Inline gap={2} wrap>
          <Badge tone="accent">Fox</Badge>
          {badgeTones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </Inline>
        <Inline gap={2} wrap>
          {badgeSizes.map((size) => (
            <Badge key={size} size={size}>
              {size} Nocturnal
            </Badge>
          ))}
        </Inline>
        <Text variant="caption" color="muted">
          Neutral sits on glass. Accent, success, danger, and warning are
          outlined; warning is the caution between success and danger, for a
          sighting to confirm or a count that drifted. sm drops the 28px control
          min-height so why chips stay dense.
        </Text>
      </Stack>
    </Section>
  );
}
