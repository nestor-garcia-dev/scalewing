import { typographyVariants } from '@scalewing/tokens';

import { toastMaxWidth } from './css-toast.js';

export const toastPlacements = ['bottom', 'top-end'] as const;

/** Where a toast that does not travel shows: centered at the bottom, or the top end corner. */
export type ToastPlacement = (typeof toastPlacements)[number];

const label = typographyVariants.label;
const body = typographyVariants.body;

/*
 * The toast as a card: a bold title over a muted detail, an action at the
 * end of the row, and a thin line that runs down with the time left.
 *
 * `top-end` puts it in the top corner at the end of the line, clear of the
 * safe area, at most a dialog's reading width; it drops in from above. A
 * toast with an action or the remaining line takes the pointer, so hover
 * can hold it (and the action can be pressed); the bottom toast stays
 * click-through. The line is a scale from full to empty over the toast's
 * duration (`--sw-toast-duration`), held while the toast is paused; it is
 * a measure of time, not decoration, so it runs under reduced motion too.
 */
export function cssToastCardClasses(): string {
  return `.sw-toast-title {
  display: block;
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

.sw-toast-detail {
  color: var(--sw-color-muted);
  font-size: ${label.fontSize}px;
  font-weight: ${body.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
}

.sw-toast-row:has(.sw-toast-title) { align-items: flex-start; }

.sw-toast-row .sw-toast-body { flex: 1 1 auto; }

.sw-button.sw-toast-action {
  flex: none;
  margin-block: calc((${label.lineHeight}px - var(--sw-control-sm-min-height)) / 2);
}

.sw-toast-interactive { pointer-events: auto; }

.sw-toast-top-end {
  bottom: auto;
  left: auto;
  max-width: min(var(--sw-dialog-max), ${toastMaxWidth});
  right: max(var(--sw-space-4), env(safe-area-inset-right, 0px));
  top: max(var(--sw-space-4), env(safe-area-inset-top, 0px));
  translate: none;
}

.sw-toast-top-end:dir(rtl) {
  left: max(var(--sw-space-4), env(safe-area-inset-left, 0px));
  right: auto;
}

.sw-toast-top-end:popover-open {
  animation: sw-toast-drop var(--sw-motion-default) var(--sw-motion-easing);
}

@keyframes sw-toast-drop {
  from {
    opacity: 0;
    translate: 0 calc(-1 * var(--sw-space-3));
  }
  to {
    opacity: 1;
    translate: none;
  }
}

.sw-toast-remaining {
  background: var(--sw-color-border);
  border-radius: var(--sw-radius-pill);
  display: block;
  height: var(--sw-space-1);
  margin-top: var(--sw-space-2);
  overflow: hidden;
  position: relative;
}

.sw-toast-remaining::after {
  animation: sw-toast-remaining var(--sw-toast-duration, 0ms) linear forwards;
  background: var(--sw-toast-tone, var(--sw-color-accent));
  content: '';
  inset: 0;
  position: absolute;
  transform-origin: left center;
}

.sw-toast-remaining:dir(rtl)::after { transform-origin: right center; }

.sw-toast-paused .sw-toast-remaining::after { animation-play-state: paused; }

@keyframes sw-toast-remaining {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .sw-toast-top-end:popover-open { animation: none; }
}

@media (forced-colors: active) {
  .sw-toast-remaining { background: Canvas; border: 1px solid CanvasText; }
  .sw-toast-remaining::after { background: CanvasText; }
}`;
}

export function toastCardClassCatalog(): string[] {
  return [
    'sw-toast-title',
    'sw-toast-detail',
    'sw-toast-action',
    'sw-toast-interactive',
    'sw-toast-top-end',
    'sw-toast-remaining',
    'sw-toast-paused',
  ];
}
