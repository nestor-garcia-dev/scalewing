import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { quietFill } from './quiet-fill.js';

const label = typographyVariants.label;

/** How much accent tints a selection of the page's text, in percent. */
const selectionTint = 30;

/*
 * The viewer: a quiet grey stage at the large radius holding the page,
 * and under it the page steps around "Page n of m". The stage scrolls
 * sideways when the page is zoomed past its width; it only pans, so two
 * fingers zoom the page, not the screen. The page is centred in it with a
 * space-5 margin (space-3 on a phone), on the surface with the small
 * elevation until PDF.js paints it.
 */
function stageRules(): string {
  return `.sw-document-viewer {
  background: ${quietFill};
  border-radius: var(--sw-radius-lg);
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-block-end: var(--sw-space-4);
}

.sw-document-viewer-stage {
  box-sizing: border-box;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: var(--sw-space-5);
  touch-action: pan-x pan-y;
}

@media ${breakpointQuery('below', 'md')} {
  .sw-document-viewer-stage { padding: var(--sw-space-3); }
}

.sw-document-viewer-stage:focus { outline: none; }

.sw-document-viewer-stage:focus-visible {
  border-radius: var(--sw-radius-lg);
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-document-viewer-page {
  aspect-ratio: 1 / var(--sw-document-page-aspect);
  background: var(--sw-color-surface);
  box-shadow: var(--sw-elevation-sm);
  margin-inline: auto;
  position: relative;
  width: var(--sw-document-page-width);
}

.sw-document-viewer-page > canvas {
  display: block;
  height: 100%;
  width: 100%;
}`;
}

/*
 * The page's text, laid over the drawing by PDF.js's TextLayer: each run
 * transparent at its place and size, so it is read by assistive
 * technology and selected, never seen. These are the rules PDF.js's own
 * viewer gives its text layer, at the scale the viewer sets
 * (--total-scale-factor) with whole-pixel rounding; a selection shows in a
 * tint of the accent.
 */
function textLayerRules(): string {
  return `.sw-document-viewer-text {
  --scale-round-x: 1px;
  --scale-round-y: 1px;
  --min-font-size: 1;
  --text-scale-factor: calc(var(--total-scale-factor) * var(--min-font-size));
  --min-font-size-inv: calc(1 / var(--min-font-size));
  forced-color-adjust: none;
  inset: 0;
  letter-spacing: normal;
  line-height: 1;
  overflow: clip;
  position: absolute;
  text-align: initial;
  text-size-adjust: none;
  transform-origin: 0 0;
  word-spacing: normal;
}

.sw-document-viewer-text :is(span, br) {
  color: transparent;
  cursor: text;
  position: absolute;
  transform-origin: 0% 0%;
  user-select: text;
  white-space: pre;
}

.sw-document-viewer-text > :not(.markedContent),
.sw-document-viewer-text .markedContent span:not(.markedContent) {
  --font-height: 0;
  --scale-x: 1;
  --rotate: 0deg;
  font-size: calc(var(--text-scale-factor) * var(--font-height));
  transform: rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv));
}

.sw-document-viewer-text .markedContent { display: contents; }

.sw-document-viewer-text ::selection {
  background: color-mix(in srgb, var(--sw-color-accent) ${selectionTint}%, transparent);
  color: transparent;
}`;
}

/*
 * The steps are 48-point round neutral Buttons (spacing step 8) with the
 * pager's private chevron, around the page words in label type; with one
 * page only the words show. Loading and a failed page centre their words
 * (and the consumer's actions) in the stage.
 */
function barRules(): string {
  return `.sw-document-viewer-bar {
  align-items: center;
  display: flex;
  gap: var(--sw-space-3);
  justify-content: center;
  padding-inline: var(--sw-space-3);
}

.sw-button.sw-document-viewer-step {
  border-radius: var(--sw-radius-pill);
  flex: none;
  min-height: var(--sw-space-8);
  min-width: var(--sw-space-8);
  padding-inline: 0;
}

.sw-document-viewer-status {
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-variant-numeric: tabular-nums;
  line-height: ${label.lineHeight}px;
  text-align: center;
}

.sw-document-viewer-message {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  justify-content: center;
  min-height: calc(4 * var(--sw-space-8));
  text-align: center;
}

.sw-document-viewer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  justify-content: center;
  margin-block-start: var(--sw-space-2);
}

@media (forced-colors: active) {
  .sw-document-viewer { border: 1px solid CanvasText; }
  .sw-document-viewer-page { outline: 1px solid CanvasText; }
}`;
}

export function cssDocumentViewerClasses(): string {
  return `${stageRules()}

${textLayerRules()}

${barRules()}`;
}

export function documentViewerClassCatalog(): string[] {
  return [
    'sw-document-viewer',
    'sw-document-viewer-stage',
    'sw-document-viewer-page',
    'sw-document-viewer-text',
    'sw-document-viewer-bar',
    'sw-document-viewer-step',
    'sw-document-viewer-status',
    'sw-document-viewer-message',
    'sw-document-viewer-actions',
  ];
}
