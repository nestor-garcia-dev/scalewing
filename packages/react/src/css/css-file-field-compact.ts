import { typographyVariants } from '@scalewing/tokens';

import { touchTarget } from './touch-target.js';

const body = typographyVariants.body;

/*
 * Remove beside a chosen file in the full field: the change button and
 * Remove together at the row's end, a space-2 apart.
 */
function actionsRules(): string {
  return `.sw-file-field-actions {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: var(--sw-space-2);
  margin-inline-start: auto;
}`;
}

/*
 * A compact field is a text field's height (the md control, 44 px), on
 * one line. Empty, its zone holds the choose words at its start. Chosen,
 * the row is the change button (the thumbnail or mark a space-1 from the
 * frame's start, then the name in the body weight cut to one line) and a
 * quiet Remove at its end. The button's focus ring sits inside the frame.
 */
function compactRules(): string {
  return `.sw-file-field-compact.sw-file-field-chosen {
  flex-wrap: nowrap;
  gap: var(--sw-space-1);
  min-height: ${touchTarget};
  padding-block: 0;
  padding-inline: 0 var(--sw-space-1);
}

.sw-file-field-compact .sw-file-field-zone {
  justify-content: flex-start;
  padding: var(--sw-space-2) var(--sw-space-4);
  text-align: start;
}

.sw-file-field-pick {
  align-items: center;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: inherit;
  box-sizing: border-box;
  color: var(--sw-color-text);
  cursor: pointer;
  display: flex;
  flex: 1 1 auto;
  font-family: var(--sw-font-sans);
  gap: var(--sw-space-3);
  margin: 0;
  min-height: ${touchTarget};
  min-width: 0;
  padding-block: var(--sw-space-1);
  padding-inline: var(--sw-space-1) var(--sw-space-2);
  text-align: start;
}

.sw-file-field-pick:focus { outline: none; }

.sw-file-field-pick:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

.sw-file-field-pick:disabled { cursor: not-allowed; }

.sw-file-field-pick .sw-file-field-name {
  font-weight: ${body.fontWeight};
  min-width: 0;
  overflow: hidden;
  overflow-wrap: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* With no thumbnail or mark, the name starts where a text field's words do. */
.sw-file-field-pick > .sw-file-field-name:first-child { margin-inline-start: var(--sw-space-3); }

.sw-file-field-compact .sw-file-field-preview,
.sw-file-field-compact .sw-file-field-icon { margin-inline-start: var(--sw-space-1); }

.sw-file-field-remove { flex: none; }

@media (forced-colors: active) {
  .sw-file-field-pick { color: ButtonText; }
  .sw-file-field-pick:disabled { color: GrayText; }
}

/* Disabled, the row fades as its Remove does. */
.sw-file-field-pick:disabled { opacity: var(--sw-disabled-opacity); }`;
}

export function cssFileFieldCompactClasses(): string {
  return `${actionsRules()}

${compactRules()}`;
}

export function fileFieldCompactClassCatalog(): string[] {
  return [
    'sw-file-field-actions',
    'sw-file-field-compact',
    'sw-file-field-pick',
    'sw-file-field-remove',
  ];
}
