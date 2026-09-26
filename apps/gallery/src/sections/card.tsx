import { Card, Inline, Stack, Text } from '@scalewing/react';
import { cardVariants, type CardVariant } from '@scalewing/tokens';

import { Section } from '../layout/Section.js';

const cardPurpose: Record<CardVariant, string> = {
  elevated: 'Solid surface with elevation.sm.',
  filled: 'Quiet subtle fill with no border, for plain information.',
  glass:
    'Default light surface is opaque white with a hairline. Dark glass stays translucent.',
  outlined: 'Solid surface with a hairline border.',
};

function CardDemo({ variant }: { variant: CardVariant }) {
  return (
    <Card padding={4} variant={variant}>
      <Stack gap={2}>
        <Text variant="title">{variant}</Text>
        <Text color="muted">{cardPurpose[variant]}</Text>
      </Stack>
    </Card>
  );
}

export function CardSection() {
  return (
    <Section
      id="card"
      purpose="Card defaults to glass. outlined and elevated are the exceptions; filled holds plain information apart from pressable rows. Toggle the gallery theme to inspect both palettes."
      title="Card"
      usage={`<Card padding={4}>Red fox den</Card>
<Card variant="outlined">…</Card>
<Card variant="elevated">…</Card>
<Card variant="filled">…</Card>`}
    >
      <Stack gap={3}>
        {cardVariants.map((variant) => (
          <CardDemo key={variant} variant={variant} />
        ))}
        <Inline gap={2} wrap>
          <Text color="muted" variant="caption">
            Inspect backdrop-filter on glass, then enable reduced transparency
            in the OS to confirm the solid fallback.
          </Text>
        </Inline>
      </Stack>
    </Section>
  );
}
