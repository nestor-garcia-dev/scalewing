import { pinnedEndShadeRules } from './css-scroll-region.js';
import { zIndex } from './stacking.js';

const region = '.sw-denomination-scroll-pin-end';
const end = '.sw-denomination-transposed-end';

/*
 * A transposed strip with `pinEnd`: the last column stays in view at the
 * inline end, on the glass fill as the pinned denomination column is (its
 * value cells and a quiet row's cells keep their subtle fill over the
 * blur), and casts the end shade just before it while there is more to
 * scroll to. A disabled last row cannot fade its pinned cells (the columns
 * scrolling under them would show through), so they stay opaque and their
 * words take the muted colour instead.
 */
export function cssDenominationPinEndClasses(): string {
  return `${region} ${end} {
  backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  -webkit-backdrop-filter: blur(var(--sw-glass-blur)) saturate(var(--sw-glass-saturate));
  inset-inline-end: 0;
  position: sticky;
  ${zIndex('stickyCell')}
}

${region} ${end}:not(.sw-denomination-transposed-value, .sw-denomination-transposed-quiet) {
  background-color: var(--sw-glass-fill);
}

${region} .sw-denomination-grid.sw-denomination-transposed ${end}.sw-denomination-transposed-disabled {
  color: var(--sw-color-muted);
  opacity: 1;
}

${pinnedEndShadeRules(region, [end])}`;
}

export function denominationPinEndClassCatalog(): string[] {
  return ['sw-denomination-scroll-pin-end', 'sw-denomination-transposed-end'];
}
