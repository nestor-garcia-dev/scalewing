import { typographyVariants } from '@scalewing/tokens';

import {
  type Breakpoint,
  breakpointQuery,
  breakpoints,
} from './breakpoints.js';
import {
  actionBarSummaryClassCatalog,
  cssActionBarSummaryClasses,
} from './css-action-bar-summary.js';
import { zIndex } from './stacking.js';

const caption = typographyVariants.caption;

/* The bar floats a step above the bottom edge and clears the home indicator. */
function stuckToBottom(indent: string): string {
  return [
    'bottom: calc(var(--sw-space-2) + env(safe-area-inset-bottom, 0px));',
    'position: sticky;',
    zIndex('bottomChrome'),
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

/*
 * While a bar is stuck to the bottom, the document keeps a focused control
 * clear of it when the browser scrolls it into view (WCAG 2.4.11): the
 * bar's one-row height (an md control in its space-3 padding and hairline
 * border), its lift off the edge, and a space-2 gap. A bar that wraps to a
 * second row is taller than this.
 */
export const actionBarClearance =
  'calc(var(--sw-control-md-min-height) + 2 * var(--sw-space-3) + 2px + 2 * var(--sw-space-2) + env(safe-area-inset-bottom, 0px))';

function clearOf(stickyClass: string, indent: string): string {
  return `${indent}:root:has(.${stickyClass}) { scroll-padding-block-end: ${actionBarClearance}; }`;
}

function stickyRules(): string {
  const below = breakpoints
    .map(
      (breakpoint) => `@media ${breakpointQuery('below', breakpoint)} {
  .${actionBarStickyClass(breakpoint)} {
${stuckToBottom('    ')}
  }

${clearOf(actionBarStickyClass(breakpoint), '  ')}
}`,
    )
    .join('\n\n');
  return `.sw-action-bar-sticky {
${stuckToBottom('  ')}
}

${clearOf('sw-action-bar-sticky', '')}

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

/* A Badge and a short line sit on one row a small gap apart; a line that
   does not fit beside the badge wraps under it. */
.sw-action-bar-status {
  align-items: center;
  color: var(--sw-color-muted);
  column-gap: var(--sw-space-2);
  display: flex;
  flex: 1 1 auto;
  flex-wrap: wrap;
  font-family: var(--sw-font-sans);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
  margin: 0;
  min-width: 0;
  row-gap: var(--sw-space-1);
}

/* With no status the live region stays in the page, so a first status is
   still announced, but it takes no room in the bar. */
.sw-action-bar-status:empty {
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  width: 1px;
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

${cssActionBarSummaryClasses()}

${stickyRules()}`;
}

export function actionBarClassCatalog(): string[] {
  return [
    'sw-action-bar',
    'sw-action-bar-status',
    'sw-action-bar-actions',
    'sw-action-bar-sticky',
    ...actionBarSummaryClassCatalog(),
    ...breakpoints.map((breakpoint) => actionBarStickyClass(breakpoint)),
  ];
}
