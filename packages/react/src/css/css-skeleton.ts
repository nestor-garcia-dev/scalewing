import { typographyVariants } from '@scalewing/tokens';

import { quietFill } from './quiet-fill.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const body = typographyVariants.body;

export const skeletonVariants = ['lines', 'rows'] as const;

/** `lines` is bars of text in a column; `rows` is list rows with hairlines. */
export type SkeletonVariant = (typeof skeletonVariants)[number];

/** How many bars or rows a Skeleton draws. */
export const skeletonLineRange = { min: 1, max: 6 } as const;

/*
 * The widths the bars take in turn, so a column reads as text with ragged
 * ends rather than a grid; the last bar of `lines` is shorter still.
 */
const barWidths = ['100%', '92%', '84%', '96%', '88%', '80%'] as const;

function barWidthRules(parent: string): string {
  return barWidths
    .map(
      (width, index) =>
        `${parent} > .sw-skeleton-bar:nth-of-type(${index + 1}) { width: ${width}; }`,
    )
    .join('\n');
}

/*
 * Skeleton: grey placeholder bars in the quiet fill, rounded, a text
 * line's height apart. `rows` draws each as a list row: a mark (space-6,
 * the small radius) and a bar at the control height (44 px on a coarse
 * pointer, as a pressable row there), hairlines between. The bars pulse
 * between full and 60 % opacity over the travel duration, and stay still
 * under reduced motion. Forced colours, which drop fills, draw each bar's
 * edge in GrayText so the shape stays.
 */
export function cssSkeletonClasses(): string {
  return `.sw-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-3);
  width: 100%;
}

.sw-skeleton-bar,
.sw-skeleton-mark {
  animation: sw-skeleton-pulse calc(2 * var(--sw-motion-travel)) var(--sw-motion-travel-easing) infinite alternate;
  background: ${quietFill};
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
  display: block;
  flex: none;
}

.sw-skeleton-bar {
  height: calc(${body.fontSize}px * 0.8);
}

${barWidthRules('.sw-skeleton-lines')}
.sw-skeleton-lines > .sw-skeleton-bar:last-of-type:not(:first-of-type) { width: 60%; }

.sw-skeleton-rows {
  gap: 0;
}

.sw-skeleton-row {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  gap: var(--sw-space-3);
  min-height: var(--sw-control-md-min-height);
  padding-block: var(--sw-space-2);
}

.sw-skeleton-row + .sw-skeleton-row {
  border-top: 1px solid var(--sw-color-border);
}

.sw-skeleton-row .sw-skeleton-bar {
  flex: 0 1 60%;
}

.sw-skeleton-row:nth-of-type(even) .sw-skeleton-bar {
  flex-basis: 45%;
}

.sw-skeleton-mark {
  height: var(--sw-space-6);
  width: var(--sw-space-6);
}

@keyframes sw-skeleton-pulse {
  from { opacity: 1; }
  to { opacity: 0.6; }
}

@media ${coarsePointerQuery} {
  .sw-skeleton-row { min-height: ${touchTarget}; }
}

@media (prefers-reduced-motion: reduce) {
  .sw-skeleton-bar,
  .sw-skeleton-mark { animation: none; }
}

@media (forced-colors: active) {
  .sw-skeleton-bar,
  .sw-skeleton-mark { border: 1px solid GrayText; }
  .sw-skeleton-row + .sw-skeleton-row { border-color: GrayText; }
}`;
}

export function skeletonClassCatalog(): string[] {
  return [
    'sw-skeleton',
    ...skeletonVariants.map((variant) => `sw-skeleton-${variant}`),
    'sw-skeleton-bar',
    'sw-skeleton-row',
    'sw-skeleton-mark',
  ];
}
