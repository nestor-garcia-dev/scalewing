import {
  compactTypographyVariants,
  typographyVariants,
} from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';

function textClassNames(): string[] {
  return Object.keys(typographyVariants).map((name) => `.sw-text-${name}`);
}

/*
 * Text renders `p` and `h1`–`h4` by default. The browser gives those a
 * block margin, which a flex Stack or Inline does not collapse, so it would
 * add to every gap. `:where()` keeps the reset at zero specificity: it beats
 * the browser's margins (author styles win over the user agent's) and loses
 * to any authored margin, such as `sw-sr-only` or a consumer's class.
 */
function textMarginReset(): string {
  return `:where(${textClassNames().join(', ')}) { margin: 0; }`;
}

function textVariantRules(): string {
  return Object.entries(typographyVariants)
    .map(([name, variant]) => {
      const tabular =
        'tabularNums' in variant && variant.tabularNums
          ? ' font-variant-numeric: tabular-nums;'
          : '';
      return `.sw-text-${name} { font-family: var(--sw-font-sans); font-size: ${variant.fontSize}px; line-height: ${variant.lineHeight}px; font-weight: ${variant.fontWeight}; letter-spacing: ${variant.letterSpacing}px;${tabular} }`;
    })
    .join('\n');
}

function compactTextVariantRules(): string {
  const rules = Object.entries(compactTypographyVariants)
    .map(
      ([name, variant]) =>
        `  .sw-text-${name} { font-size: ${variant.fontSize}px; line-height: ${variant.lineHeight}px; letter-spacing: ${variant.letterSpacing}px; }`,
    )
    .join('\n');
  return `@media ${breakpointQuery('below', 'md')} {\n${rules}\n}`;
}

export function cssTextClasses(): string {
  return `.sw-text-align-start { text-align: start; }
.sw-text-align-center { text-align: center; }
.sw-text-align-end { text-align: end; }

${textMarginReset()}

${textVariantRules()}

${compactTextVariantRules()}`;
}
