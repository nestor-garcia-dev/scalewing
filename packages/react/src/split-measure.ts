// DOM reads for Split: the split's token metrics from its computed custom
// properties, and its container's content width (what the stylesheet's
// percentage cap resolves against). The range math stays pure in
// `split-size.ts`.

import {
  cssLengthToPx,
  readSplitMetrics,
  type SplitMetrics,
} from './split-size.js';

/** The container's content width, which the split's percentage cap uses. */
export function containerContentWidth(node: HTMLElement): number {
  const parent = node.parentElement;
  if (!parent) {
    return 0;
  }
  const styles = getComputedStyle(parent);
  const padding =
    cssLengthToPx(styles.paddingLeft) + cssLengthToPx(styles.paddingRight);
  return Math.max(0, parent.clientWidth - padding);
}

/** The split's token range, step and default width, in px. */
export function splitTokenMetrics(
  node: HTMLElement,
): SplitMetrics & { defaultWidth: number } {
  const styles = getComputedStyle(node);
  const remPx =
    cssLengthToPx(getComputedStyle(document.documentElement).fontSize) || 16;
  return readSplitMetrics((name) => styles.getPropertyValue(name), remPx);
}
