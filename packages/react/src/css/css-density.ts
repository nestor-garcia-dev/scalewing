import {
  compactControlScale,
  compactFilterChipMinHeight,
  typographyVariants,
} from '@scalewing/tokens';

import { tableRowLineVariable } from './css-table-metrics.js';
import { finePointerQuery } from './touch-target.js';

/**
 * How tightly the themed root draws its controls: `comfortable` (the
 * default) is the touch-sized scale; `compact` (opt-in, on a fine pointer
 * only) is a desktop data tool's smaller controls and reading text.
 */
export const themeDensities = ['comfortable', 'compact'] as const;

export type ThemeDensity = (typeof themeDensities)[number];

export function assertThemeDensity(
  density: unknown,
): asserts density is ThemeDensity {
  if (!(themeDensities as readonly unknown[]).includes(density))
    throw new RangeError(`Unknown ThemeProvider density: ${String(density)}`);
}

/**
 * The compact themed root. Two attributes outrank the `[data-theme]` block
 * that declares the comfortable values, in any order.
 */
const compactRoot = "[data-theme][data-density='compact']";

/*
 * The controls that state the body size for their own words rather than
 * inherit it, which would otherwise stand 2 px over a compact Field beside
 * them. An xs segmented track states its own caption size and stays.
 */
const statedBodyControls = [
  '.sw-date-field-input',
  '.sw-fixture-score-box',
  '.sw-segmented-filled .sw-segmented-item',
  '.sw-stepper-input',
  '.sw-stepper-unit',
].join(', ');

function compactControlDeclarations(): string {
  return Object.entries(compactControlScale)
    .flatMap(([size, value]) => [
      `    --sw-control-${size}-min-height: ${value.minHeight}px;`,
      `    --sw-control-${size}-padding-inline: ${value.paddingInline}px;`,
    ])
    .join('\n');
}

function bodySmDeclarations(indent: string): string {
  const { fontSize, letterSpacing, lineHeight } = typographyVariants.bodySm;
  return [
    `font-size: ${fontSize}px;`,
    `letter-spacing: ${letterSpacing}px;`,
    `line-height: ${lineHeight}px;`,
  ]
    .map((line) => `${indent}${line}`)
    .join('\n');
}

/*
 * `ThemeProvider density="compact"`, and everything it changes, on a fine
 * pointer only: a touch screen keeps the comfortable scale, its 44 px
 * targets (`touchTarget` reads the md variable) included, and a coarse rule
 * never runs where these do.
 *
 * Every size-aware rule reads the control variables, so restating them here
 * moves them all, and geometry derived from them (the rail's width, a page
 * bar's clearance, a calendar's days) moves in step. The themed root's own
 * type steps to `bodySm`, so what inherits it follows: a table's cells, a
 * field's label and its control's words (the same in a Card and outside
 * one). `Text`'s default `body` variant states its own size, so it follows
 * only where the reading text is asked for: in a Card, a Table and a
 * DescriptionList. A rail's smaller link would bury its glyph under the count
 * pill, so the pill moves out into the gutter (the full sidebar's is in flow,
 * where this has no effect).
 */
export function cssDensityClasses(): string {
  return `@media ${finePointerQuery} {
  ${compactRoot} {
${compactControlDeclarations()}
    --sw-filter-chip-min-height: ${compactFilterChipMinHeight}px;
${bodySmDeclarations('    ')}
  }

  ${compactRoot} :is(.sw-card, .sw-table, .sw-description-list) .sw-text-body {
${bodySmDeclarations('    ')}
  }

  ${compactRoot} :is(${statedBodyControls}) {
${bodySmDeclarations('    ')}
  }

  ${compactRoot} .sw-table-bounded {
    ${tableRowLineVariable}: ${typographyVariants.bodySm.lineHeight}px;
  }

  ${compactRoot} .sw-card {
    border-radius: var(--sw-radius-md);
  }

  ${compactRoot} .sw-app-shell-sidebar .sw-app-shell-count {
    inset-block-start: calc(-1 * var(--sw-space-1));
    inset-inline-end: calc(-1 * var(--sw-space-2));
  }
}`;
}
