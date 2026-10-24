import { typographyVariants } from '@scalewing/tokens';

import { breakpointQuery } from './breakpoints.js';
import { toneTintFill, toneTintInk } from './tone-tint.js';

const { caption, label, title } = typographyVariants;

/** How a drawn screen is framed: a plain card, or a phone from `md`. */
export const screenPreviewFrames = ['card', 'device'] as const;

export type ScreenPreviewFrame = (typeof screenPreviewFrames)[number];

/** What a drawn row shows: a figure, a total, a note, a filled or an alert row. */
export const previewRowKinds = [
  'plain',
  'total',
  'note',
  'filled',
  'alert',
] as const;

export type PreviewRowKind = (typeof previewRowKinds)[number];

export function screenPreviewFrameClass(frame: ScreenPreviewFrame): string {
  return `sw-screen-preview-${frame}`;
}

export function previewRowKindClass(kind: PreviewRowKind): string {
  return `sw-preview-row-${kind}`;
}

/*
 * The card frame, and the device frame below `md`: one surface card whose
 * groups are parted by hairlines. Rows set their label at the start and
 * their figure at the end in tabular numerals.
 */
function cardRules(): string {
  return `.sw-screen-preview {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
  margin: 0;
  max-width: 100%;
  min-width: 0;
}

.sw-screen-preview-screen {
  background: var(--sw-color-surface);
  border-radius: var(--sw-radius-md);
  color: var(--sw-color-text);
  display: flex;
  flex-direction: column;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  font-variant-numeric: tabular-nums;
  gap: var(--sw-space-3);
  line-height: ${label.lineHeight}px;
  padding: var(--sw-space-4);
}

.sw-screen-preview-header {
  display: flex;
  flex-direction: column;
}

.sw-screen-preview-eyebrow {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-screen-preview-title {
  font-size: ${title.fontSize}px;
  font-weight: ${title.fontWeight};
  line-height: ${title.lineHeight}px;
}

.sw-screen-preview-body {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
}

.sw-preview-group {
  display: flex;
  flex-direction: column;
  gap: var(--sw-space-2);
}

.sw-preview-group + .sw-preview-group {
  border-top: 1px solid var(--sw-color-border);
  padding-top: var(--sw-space-2);
}

.sw-screen-preview-caption {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}`;
}

function rowRules(): string {
  return `.sw-preview-row {
  display: flex;
  gap: var(--sw-space-3);
  justify-content: space-between;
  min-width: 0;
}

.sw-preview-row-value {
  text-align: end;
}

.${previewRowKindClass('total')} {
  border-top: 1px solid var(--sw-color-border);
  font-weight: ${label.fontWeight};
  padding-top: var(--sw-space-2);
}

.${previewRowKindClass('note')} {
  flex-direction: column;
  gap: 0;
}

.${previewRowKindClass('note')} .sw-preview-row-label {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.${previewRowKindClass('note')} .sw-preview-row-value {
  text-align: start;
}

.${previewRowKindClass('filled')},
.${previewRowKindClass('alert')} {
  border-radius: var(--sw-radius-sm);
  padding: var(--sw-space-2) var(--sw-space-3);
}

.${previewRowKindClass('filled')} {
  background: var(--sw-color-subtle);
}

.${previewRowKindClass('alert')} {
  background: ${toneTintFill('danger')};
  color: ${toneTintInk('danger')};
}

.sw-preview-tiles {
  display: grid;
  gap: var(--sw-space-2);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sw-preview-tile {
  align-items: center;
  background: var(--sw-color-subtle);
  border-radius: var(--sw-radius-sm);
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: var(--sw-space-2);
}

.sw-preview-tile-label {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}`;
}

/*
 * From `md` the device frame draws a phone: a dark bezel (the text colour)
 * round a quiet screen whose header is a surface strip and whose groups
 * are surface cards. Below `md` it is the card, since the page is already
 * a phone.
 */
function wideRules(): string {
  const device = `.${screenPreviewFrameClass('device')}`;
  return `@media ${breakpointQuery('from', 'md')} {
  .${screenPreviewFrameClass('card')} .sw-screen-preview-screen { padding: var(--sw-space-5); }
  .sw-preview-tiles { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  ${device} { width: 20rem; }
  ${device} .sw-screen-preview-bezel {
    background: var(--sw-color-text);
    border-radius: calc(var(--sw-radius-lg) + var(--sw-space-3));
    padding: var(--sw-space-3);
  }
  ${device} .sw-screen-preview-screen {
    background: var(--sw-color-subtle);
    border-radius: var(--sw-radius-lg);
    gap: 0;
    overflow: hidden;
    padding: 0;
  }
  ${device} .sw-screen-preview-header {
    background: var(--sw-color-surface);
    border-bottom: 1px solid var(--sw-color-border);
    padding: var(--sw-space-4);
  }
  ${device} .sw-screen-preview-body { gap: var(--sw-space-3); padding: var(--sw-space-3); }
  ${device} .sw-preview-group {
    background: var(--sw-color-surface);
    border-radius: var(--sw-radius-md);
    padding: var(--sw-space-3);
  }
  ${device} .sw-preview-group + .sw-preview-group { border-top: 0; }
  ${device} .sw-screen-preview-caption { text-align: center; }
}

@media (forced-colors: active) {
  .sw-screen-preview-screen { border: 1px solid CanvasText; }
}

@media (forced-colors: active) and ${breakpointQuery('from', 'md')} {
  .${screenPreviewFrameClass('device')} .sw-screen-preview-screen { border: 0; }
  .${screenPreviewFrameClass('device')} .sw-screen-preview-bezel { border: 1px solid CanvasText; }
}`;
}

export function cssScreenPreviewClasses(): string {
  return [cardRules(), rowRules(), wideRules()].join('\n\n');
}

export function screenPreviewClassCatalog(): string[] {
  return [
    'sw-screen-preview',
    ...screenPreviewFrames.map(screenPreviewFrameClass),
    'sw-screen-preview-bezel',
    'sw-screen-preview-screen',
    'sw-screen-preview-header',
    'sw-screen-preview-eyebrow',
    'sw-screen-preview-title',
    'sw-screen-preview-body',
    'sw-screen-preview-caption',
    'sw-preview-group',
    'sw-preview-row',
    ...previewRowKinds.map(previewRowKindClass),
    'sw-preview-row-label',
    'sw-preview-row-value',
    'sw-preview-tiles',
    'sw-preview-tile',
    'sw-preview-tile-label',
    'sw-preview-tile-value',
  ];
}
