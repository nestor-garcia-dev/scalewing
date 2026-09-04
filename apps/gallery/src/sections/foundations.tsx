import { Box, Inline, Stack, Text } from '@scalewing/react';
import {
  darkGlass,
  darkTheme,
  fontFamily,
  lightGlass,
  lightTheme,
  radiusScale,
  semanticColorKeys,
  spacingScale,
  spacingSteps,
  typographyVariants,
  type SemanticColorKey,
  type TypographyVariant,
} from '@scalewing/tokens';

import { Section } from '../layout/Section.js';

const typeNames = Object.keys(typographyVariants) as TypographyVariant[];
const radiusNames = Object.keys(radiusScale) as Array<keyof typeof radiusScale>;
const elevationNames = Object.keys(lightTheme.elevation) as Array<
  keyof typeof lightTheme.elevation
>;

function ColorRow({
  colorKey,
  palette,
  scheme,
}: {
  colorKey: SemanticColorKey;
  palette: typeof lightTheme.colors;
  scheme: 'light' | 'dark';
}) {
  return (
    <Inline gap={2} wrap>
      <Box
        as="span"
        aria-label={`${scheme} ${colorKey} ${palette[colorKey]}`}
        className="gallery-swatch"
        style={{ backgroundColor: palette[colorKey] }}
      />
      <Text variant="caption">
        {scheme} {colorKey} {palette[colorKey]}
      </Text>
    </Inline>
  );
}

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      purpose="Semantic color, type, space, radius, elevation, glass, and motion live in @scalewing/tokens. The gallery reads those exports; it does not redefine them."
      title="Foundations"
      usage={`import { lightTheme, spacingScale } from '@scalewing/tokens';`}
    >
      <Stack gap={4}>
        <Text variant="title">Color</Text>
        <Stack gap={2}>
          {semanticColorKeys.map((colorKey) => (
            <Stack gap={1} key={colorKey}>
              <ColorRow
                colorKey={colorKey}
                palette={lightTheme.colors}
                scheme="light"
              />
              <ColorRow
                colorKey={colorKey}
                palette={darkTheme.colors}
                scheme="dark"
              />
            </Stack>
          ))}
        </Stack>
        <Text variant="title">Typography</Text>
        <Text color="muted" variant="caption">
          {fontFamily}
        </Text>
        {typeNames.map((variant) => {
          const spec = typographyVariants[variant];
          return (
            <Text key={variant} variant={variant}>
              {variant} {spec.fontSize}/{spec.lineHeight} {spec.fontWeight}
            </Text>
          );
        })}
        <Text variant="title">Spacing</Text>
        <Inline align="end" gap={2} wrap>
          {spacingSteps.map((step) => (
            <Box
              background="surface"
              border
              key={step}
              padding={step}
              radius="sm"
            >
              <Text variant="caption">
                {step} · {spacingScale[step]}px
              </Text>
            </Box>
          ))}
        </Inline>
        <Text variant="title">Radius</Text>
        <Inline gap={3} wrap>
          {radiusNames.map((name) => (
            <Box
              background="surface"
              border
              key={name}
              padding={3}
              radius={name}
            >
              <Text variant="caption">
                {name} {radiusScale[name]}
              </Text>
            </Box>
          ))}
        </Inline>
        <Text variant="title">Elevation</Text>
        {elevationNames.map((name) => (
          <Text key={name} variant="caption">
            {name}: {lightTheme.elevation[name]}
          </Text>
        ))}
        <Text variant="title">Glass</Text>
        <Text variant="caption">
          light fill {lightGlass.fill}, blur {lightGlass.blur}, saturate{' '}
          {lightGlass.saturate}
        </Text>
        <Text variant="caption">
          dark fill {darkGlass.fill}, border {darkGlass.border}
        </Text>
        <Text variant="title">Motion</Text>
        <Text variant="caption">
          {lightTheme.motion.duration.fast} /{' '}
          {lightTheme.motion.duration.default}{' '}
          {lightTheme.motion.easing.standard}
        </Text>
      </Stack>
    </Section>
  );
}
