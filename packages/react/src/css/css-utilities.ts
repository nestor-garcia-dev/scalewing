import { type SpacingStep, spacingSteps } from '@scalewing/tokens';
import {
  type GapAxis,
  type PaddingAxis,
  gapAxes,
  layoutClassNames,
  paddingAxes,
  spacingClass,
} from './spacing-classes.js';

function paddingRule(axis: PaddingAxis, step: SpacingStep): string {
  const className = spacingClass('padding', axis, step);
  const value = `var(--sw-space-${step})`;

  switch (axis) {
    case 'all':
      return `.${className} { padding: ${value}; }`;
    case 'x':
      return `.${className} { padding-inline: ${value}; }`;
    case 'y':
      return `.${className} { padding-block: ${value}; }`;
    case 'top':
      return `.${className} { padding-top: ${value}; }`;
    case 'right':
      return `.${className} { padding-right: ${value}; }`;
    case 'bottom':
      return `.${className} { padding-bottom: ${value}; }`;
    case 'left':
      return `.${className} { padding-left: ${value}; }`;
  }
}

function gapRule(axis: GapAxis, step: SpacingStep): string {
  const className = spacingClass('gap', axis, step);
  const value = `var(--sw-space-${step})`;

  switch (axis) {
    case 'all':
      return `.${className} { gap: ${value}; }`;
    case 'x':
      return `.${className} { column-gap: ${value}; }`;
    case 'y':
      return `.${className} { row-gap: ${value}; }`;
  }
}

const layoutRules: Record<(typeof layoutClassNames)[number], string> = {
  'sw-stack':
    '.sw-stack { display: flex; flex-direction: column; min-width: 0; }',
  'sw-inline':
    '.sw-inline { display: flex; flex-direction: row; align-items: center; min-width: 0; }',
  'sw-wrap': '.sw-wrap { flex-wrap: wrap; }',
  'sw-grow': '.sw-grow { flex-grow: 1; }',
  'sw-full-width': '.sw-full-width { width: 100%; }',
  'sw-container':
    '.sw-container { width: 100%; max-width: var(--sw-container-max); margin-inline: auto; }',
  'sw-sr-only':
    '.sw-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }',
  'sw-align-start': '.sw-align-start { align-items: flex-start; }',
  'sw-align-center': '.sw-align-center { align-items: center; }',
  'sw-align-end': '.sw-align-end { align-items: flex-end; }',
  'sw-align-stretch': '.sw-align-stretch { align-items: stretch; }',
  'sw-justify-start': '.sw-justify-start { justify-content: flex-start; }',
  'sw-justify-center': '.sw-justify-center { justify-content: center; }',
  'sw-justify-end': '.sw-justify-end { justify-content: flex-end; }',
  'sw-justify-between':
    '.sw-justify-between { justify-content: space-between; }',
};

export function cssUtilities(): string {
  const padding = paddingAxes.flatMap((axis) =>
    spacingSteps.map((step) => paddingRule(axis, step)),
  );
  const gap = gapAxes.flatMap((axis) =>
    spacingSteps.map((step) => gapRule(axis, step)),
  );
  const layout = layoutClassNames.map((name) => layoutRules[name]);

  return [...padding, ...gap, ...layout].join('\n');
}
