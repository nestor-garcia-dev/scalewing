import { typographyVariants } from '@scalewing/tokens';

import { disabledControlSurface } from './css-document.js';
import {
  cssFileFieldCompactClasses,
  fileFieldCompactClassCatalog,
} from './css-file-field-compact.js';
import { coarsePointerQuery, touchTarget } from './touch-target.js';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

/*
 * The frame holds the field's one file: empty, a wide zone on the subtle
 * fill that opens the picker (the choose words in the text colour at
 * label weight, as the accent falls under 4.5:1 on the subtle fill in
 * some palettes, the drop words muted after them); chosen, a row on the surface
 * with the consumer's mark, the file's name over its detail and the
 * change button at the end. Both are a hairline frame at the medium
 * radius. A file dragged over either draws the accent edge and tint. A
 * chosen row too narrow for a long name and the button wraps the button
 * under the name, at the row's end.
 */
function frameRules(): string {
  return `.sw-file-field-frame {
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-md);
  box-sizing: border-box;
  min-width: 0;
}

.sw-file-field-empty { background: var(--sw-color-subtle); }

.sw-file-field-chosen {
  align-items: center;
  background: var(--sw-color-surface);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2) var(--sw-space-3);
  padding: var(--sw-space-2) var(--sw-space-2) var(--sw-space-2) var(--sw-space-4);
}

.sw-field-invalid .sw-file-field-frame { border-color: var(--sw-color-danger); }

/* A drag wins over an error's edge: it says where the file goes. */
.sw-file-field-frame.sw-file-field-dragging {
  background: var(--sw-color-accentSubtle);
  border-color: var(--sw-color-accent);
  outline: 1px solid var(--sw-color-accent);
}

/* On the tint, muted words fall under 4.5:1 in light palettes: every word takes the text colour. */
.sw-file-field-dragging :is(.sw-file-field-choose, .sw-file-field-drop, .sw-file-field-detail, .sw-file-field-icon) {
  color: var(--sw-color-text);
}

/* Disabled, the frame's hairline is dashed, as a disabled text control's. */
.sw-file-field-disabled { border-style: dashed; }`;
}

/*
 * The empty zone is one button filling the frame, a space-6 of padding
 * above and below its words, its focus ring inside the frame's edge. On a
 * coarse pointer, where nothing is dragged, the drop words are left out.
 */
function zoneRules(): string {
  return `.sw-file-field-zone {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: inherit;
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-family: var(--sw-font-sans);
  font-size: ${label.fontSize}px;
  gap: var(--sw-space-1);
  justify-content: center;
  line-height: ${label.lineHeight}px;
  margin: 0;
  min-height: ${touchTarget};
  padding: var(--sw-space-6) var(--sw-space-4);
  text-align: center;
  width: 100%;
}

.sw-file-field-zone:focus { outline: none; }

.sw-file-field-zone:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-file-field-choose {
  color: var(--sw-color-text);
  font-weight: ${label.fontWeight};
}

.sw-file-field-drop { color: var(--sw-color-muted); }

.sw-file-field-zone:disabled {
  ${disabledControlSurface}
  border-radius: inherit;
}

.sw-file-field-zone:disabled .sw-file-field-choose { color: var(--sw-color-muted); }

@media ${coarsePointerQuery} {
  .sw-file-field-drop { display: none; }
}`;
}

/*
 * The chosen file: the mark, then the name over its detail (at least four
 * space-8 wide before the button wraps under it), then the button. A
 * photo's preview takes the mark's place: a 3:2 thumbnail a space-8 wide
 * and a space-6 tall, cropped to fill, at the small radius, on the subtle
 * fill while it loads.
 */
function fileRules(): string {
  return `.sw-file-field-icon {
  align-items: center;
  color: var(--sw-color-muted);
  display: flex;
  flex: none;
}

.sw-file-field-preview {
  background: var(--sw-color-subtle);
  border-radius: var(--sw-radius-sm);
  display: block;
  flex: none;
  height: var(--sw-space-6);
  object-fit: cover;
  width: var(--sw-space-8);
}

.sw-file-field-file {
  display: flex;
  flex: 1 1 calc(4 * var(--sw-space-8));
  flex-direction: column;
  min-width: 0;
}

.sw-file-field-name {
  font-size: ${label.fontSize}px;
  font-weight: ${label.fontWeight};
  line-height: ${label.lineHeight}px;
  overflow-wrap: anywhere;
}

.sw-file-field-detail {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  line-height: ${caption.lineHeight}px;
}

.sw-file-field-chosen > .sw-button {
  flex: none;
  margin-inline-start: auto;
}`;
}

/* Forced colours: system edges, Highlight for a drag, the button text colour for the words. */
function forcedColorRules(): string {
  return `@media (forced-colors: active) {
  .sw-file-field-frame { border-color: CanvasText; }
  .sw-field-invalid .sw-file-field-frame { border-color: Mark; }
  .sw-file-field-frame.sw-file-field-dragging { border-color: Highlight; outline-color: Highlight; }
  .sw-file-field-choose { color: ButtonText; }
  .sw-file-field-zone:disabled,
  .sw-file-field-zone:disabled .sw-file-field-choose { color: GrayText; }
}`;
}

export function cssFileFieldClasses(): string {
  return `${frameRules()}

${zoneRules()}

${fileRules()}

${cssFileFieldCompactClasses()}

${forcedColorRules()}`;
}

export function fileFieldClassCatalog(): string[] {
  return [
    'sw-file-field',
    'sw-file-field-frame',
    'sw-file-field-empty',
    'sw-file-field-chosen',
    'sw-file-field-dragging',
    'sw-file-field-disabled',
    'sw-file-field-zone',
    'sw-file-field-choose',
    'sw-file-field-drop',
    'sw-file-field-icon',
    'sw-file-field-preview',
    'sw-file-field-file',
    'sw-file-field-name',
    'sw-file-field-detail',
    ...fileFieldCompactClassCatalog(),
  ];
}
