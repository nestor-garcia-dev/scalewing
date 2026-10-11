import { coarsePointerQuery, touchTarget } from './touch-target.js';

/*
 * A search field is the adorned frame (the control surface, its focus
 * ring, its danger and disabled looks) with the consumer's glyph in the
 * muted colour at its start, a space-2 gap, and a clear button at its end:
 * a muted disc with a cross in the surface colour, centred in an xs control
 * square (the 44 px target on a coarse pointer) that reaches the frame's
 * edge. The browser's own clear button and search glyph are hidden, so the
 * field shows one of each.
 */
export function cssFieldSearchClasses(): string {
  return `.sw-field-adorned.sw-field-search {
  gap: var(--sw-space-2);
  padding-inline-end: 0;
}

.sw-field-search-leading {
  color: var(--sw-color-muted);
  display: inline-flex;
  flex: none;
}

[data-theme] .sw-field-search > input[type='search'] {
  appearance: none;
  -webkit-appearance: none;
}

.sw-field-search > input[type='search']::-webkit-search-cancel-button,
.sw-field-search > input[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}

.sw-field-search > input:last-child {
  margin-inline-end: var(--sw-control-md-padding-inline);
}

.sw-field-search-clear {
  align-items: center;
  align-self: stretch;
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-sm);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  flex: none;
  justify-content: center;
  margin: 0;
  min-width: var(--sw-control-xs-min-height);
  padding: 0 var(--sw-space-2);
}

.sw-field-search-clear:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: calc(-1 * var(--sw-focus-ring-width));
}

/* One ring at a time: the clear button's own while it has focus. */
.sw-field-search:has(.sw-field-search-clear:focus-visible) {
  outline: none;
}

.sw-field-search-clear:hover .sw-field-search-cross {
  background: var(--sw-color-text);
}

.sw-field-xs .sw-field-search > input:last-child {
  margin-inline-end: var(--sw-control-xs-padding-inline);
}

.sw-field-search-cross {
  background: var(--sw-color-muted);
  border-radius: var(--sw-radius-pill);
  display: inline-block;
  height: var(--sw-space-4);
  position: relative;
  width: var(--sw-space-4);
}

.sw-field-search-cross::before,
.sw-field-search-cross::after {
  background: var(--sw-color-surface);
  border-radius: 1px;
  content: '';
  height: 2px;
  inset: 0;
  margin: auto;
  position: absolute;
  width: calc(var(--sw-space-2) + 2px);
}

.sw-field-search-cross::before { transform: rotate(45deg); }
.sw-field-search-cross::after { transform: rotate(-45deg); }

@media ${coarsePointerQuery} {
  .sw-field-search-clear { min-width: ${touchTarget}; }
}

@media (forced-colors: active) {
  .sw-field-search-leading { color: FieldText; }
  /* Backgrounds are forced in this mode; the disc keeps its own system colours. */
  .sw-field-search-cross { background: ButtonText; forced-color-adjust: none; }
  .sw-field-search-cross::before,
  .sw-field-search-cross::after { background: ButtonFace; }
}`;
}

export function fieldSearchClassCatalog(): string[] {
  return [
    'sw-field-search-field',
    'sw-field-search',
    'sw-field-search-leading',
    'sw-field-search-clear',
    'sw-field-search-cross',
  ];
}
