import {
  Badge,
  Button,
  Inline,
  Stack,
  Text,
  badgeSizes,
  badgeTones,
} from '@scalewing/react';

import { useState } from 'react';

import { Section } from '../layout/Section.js';

const nestCounts = [
  { value: 'marsh', label: 'Marsh', nests: 2, tone: 'warning' },
  { value: 'reef', label: 'Reef', nests: 0, tone: 'success' },
] as const;

export function BadgeSection() {
  const [site, setSite] = useState<string>(nestCounts[0].value);

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
        <Inline aria-label="Nesting site" gap={2} role="group" wrap>
          {nestCounts.map((option) => (
            <Button
              aria-pressed={option.value === site}
              key={option.value}
              onPress={() => setSite(option.value)}
              variant={option.value === site ? 'primary' : 'secondary'}
            >
              <Inline gap={2}>
                <span>{option.label}</span>
                <Badge size="sm" tone={option.tone}>
                  {option.nests} nests
                </Badge>
              </Inline>
            </Button>
          ))}
        </Inline>
        <Text variant="caption" color="muted">
          Neutral sits on glass. Accent, success, danger, and warning are
          outlined; warning is the caution between success and danger, for a
          sighting to confirm or a count that drifted. sm drops the 28px control
          min-height so why chips stay dense. Inside a filled button a badge
          sits on the surface in the text color, its tone on its border, so it
          reads on any fill in every palette.
        </Text>
      </Stack>
    </Section>
  );
}
