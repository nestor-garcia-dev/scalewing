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
  if (color === 'onInverse') {
    return { backgroundColor: 'var(--sw-color-inverse)' };
  }
  if (color === 'background' || color === 'surface' || color === 'border') {
    return { backgroundColor: 'var(--sw-color-text)' };
  }
  if (color === 'inverse') {
    return { backgroundColor: 'var(--sw-color-onInverse)' };
  }
  return {};
}

export function TextSection() {
  return (
    <Section
      id="text"
      purpose="Text maps variant to generated sw-text-* classes and semantic color to CSS variables. Below the md breakpoint, hero, display, headline, heading and lead step down to their compact sizes; hero, headline and lead are a public page's opening title, section titles and the sentence under them. Alignment and truncation are opt-in. font mono sets the words in the platform's monospace face at the variant's size, for a code read character by character. Text keeps none of the browser's paragraph or heading margins, so the gap of the Stack or Inline around it alone sets the spacing."
      title="Text"
      usage={`<Text variant="title" color="accent">Snow leopard</Text>
<Text variant="headline" font="mono">R8M 3TW</Text>`}
    >
      <Stack gap={3}>
        <Text align="center" variant="heading">
          Centered heading that wraps on a narrow screen
        </Text>
        <Text align="end" color="muted" variant="caption">
          End-aligned caption
        </Text>
        <Stack gap={1}>
          <Text color="muted" variant="caption">
            Ring code for the Heron Marsh hide
          </Text>
          <Text as="p" font="mono" variant="headline">
            R8M 3TW
          </Text>
          <Text font="mono" variant="caption">
            Tag 0711 · 1180
          </Text>
        </Stack>
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
