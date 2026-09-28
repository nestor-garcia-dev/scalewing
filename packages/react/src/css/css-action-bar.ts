import { typographyVariants } from '@scalewing/tokens';

import {
  type Breakpoint,
  breakpointQuery,
  breakpoints,
} from './breakpoints.js';

const caption = typographyVariants.caption;

/* The bar floats a step above the bottom edge and clears the home indicator. */
function stuckToBottom(indent: string): string {
  return [
    'bottom: calc(var(--sw-space-2) + env(safe-area-inset-bottom, 0px));',
    'position: sticky;',
    'z-index: 2;',
  ]
    .map((declaration) => `${indent}${declaration}`)
    .join('\n');
}

export function actionBarStickyClass(
  stickyBelow: Breakpoint | undefined,
): string {
  return stickyBelow
    ? `sw-action-bar-sticky-below-${stickyBelow}`
    : 'sw-action-bar-sticky';
}

function stickyRules(): string {
  const below = breakpoints
    .map(
      (breakpoint) => `@media ${breakpointQuery('below', breakpoint)} {
  .${actionBarStickyClass(breakpoint)} {
${stuckToBottom('    ')}
  }
}`,
    )
    .join('\n\n');
  return `.sw-action-bar-sticky {
${stuckToBottom('  ')}
}

${below}`;
}

export function cssActionBarClasses(): string {
  return `.sw-action-bar {
  align-items: center;
  background: var(--sw-glass-fill);
  border: 1px solid var(--sw-glass-border);
  border-radius: var(--sw-radius-lg);
  box-shadow: inset 0 1px 0 var(--sw-glass-specular);
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  box-sizing: border-box;
  color: var(--sw-color-text);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2) var(--sw-space-4);
  padding-block: var(--sw-space-3);
  padding-left: max(var(--sw-space-4), env(safe-area-inset-left, 0px));
  padding-right: max(var(--sw-space-4), env(safe-area-inset-right, 0px));
}

.sw-action-bar-status {
  color: var(--sw-color-muted);
  flex: 1 1 auto;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
  margin: 0;
  min-width: 0;
}

.sw-action-bar-actions {
  align-items: center;
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  justify-content: flex-end;
  margin-inline-start: auto;
}

@media ${breakpointQuery('below', 'md')} {
  .sw-action-bar-status,
  .sw-action-bar-actions { flex-basis: 100%; }
  .sw-action-bar-actions > * { flex: 1 1 auto; }
}

${stickyRules()}`;
}

export function actionBarClassCatalog(): string[] {
  return [
    'sw-action-bar',
    'sw-action-bar-status',
    'sw-action-bar-actions',
    'sw-action-bar-sticky',
    ...breakpoints.map((breakpoint) => actionBarStickyClass(breakpoint)),
  ];
}
