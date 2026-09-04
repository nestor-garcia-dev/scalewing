import { Box, Stack, Text } from '@scalewing/react';
import {
  semanticColorKeys,
  typographyVariants,
  type SemanticColorKey,
  type TypographyVariant,
} from '@scalewing/tokens';

import { Section } from '../layout/Section.js';

const typeNames = Object.keys(typographyVariants) as TypographyVariant[];

function textPreviewStyle(color: SemanticColorKey): {
  backgroundColor?: string;
} {
  if (color === 'onAccent') {
    return { backgroundColor: 'var(--sw-color-accent)' };
  }
  if (color === 'onDanger') {
    return { backgroundColor: 'var(--sw-color-danger)' };
  }
  if (color === 'background' || color === 'surface' || color === 'border') {
    return { backgroundColor: 'var(--sw-color-text)' };
  }
  return {};
}

export function TextSection() {
  return (
    <Section
      id="text"
      purpose="Text maps variant to generated sw-text-* classes and semantic color to CSS variables. Truncation is opt-in."
      title="Text"
      usage={`<Text variant="title" color="accent">Sunday kickoff</Text>`}
    >
      <Stack gap={3}>
        {typeNames.map((variant) => (
          <Text key={variant} variant={variant}>
            {variant}
          </Text>
        ))}
        <Stack gap={1}>
          {semanticColorKeys.map((color) => (
            <Box
              key={color}
              padding={2}
              radius="sm"
              style={textPreviewStyle(color)}
            >
              <Text color={color} variant="label">
                {color}
              </Text>
            </Box>
          ))}
        </Stack>
        <Box className="gallery-truncate-demo">
          <Text truncate variant="body">
            Truncated line that should not wrap past the demo width in this row.
          </Text>
        </Box>
      </Stack>
    </Section>
  );
}
