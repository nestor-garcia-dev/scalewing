import { selectChevronLayers, typedInputs } from './css-document.js';

/**
 * How much accent a changed control's fill takes: the share of the accent
 * layered over the control's own background (the glass fill, or the subtle
 * fill of a disabled control). The value keeps 4.5:1 or more on it in every
 * palette and scheme (`field-changed.test.tsx`).
 */
export const changedTintStrength = 0.12;

const tintColor = `color-mix(in srgb, var(--sw-color-accent) ${changedTintStrength * 100}%, transparent)`;

/**
 * The tint as one background image, so it lies over the control's background
 * color instead of replacing it.
 */
export const changedTintLayer = `linear-gradient(${tintColor}, ${tintColor})`;

/** An adorned frame that holds a value (no placeholder showing). */
const tintedFrame =
  '.sw-field-changed .sw-field-adorned:not(:has(> input:placeholder-shown))';

/*
 * A changed value: the accent border, a hairline thicker through an inset
 * shadow so nothing moves, and the accent tint over the fill, on the control
 * or on an adorned frame (whose input is transparent and draws no border, so
 * the tint shows once). Focus draws a ring and never tints, so "changed" and
 * "where I am" read apart. While a placeholder shows there is no value to
 * mark and the fill stays plain, so the muted placeholder keeps its contrast;
 * on the tint, an adorned frame's prefix and suffix take the text color. The
 * tint is for the text controls and select (not a range, color or file
 * input). A select lists its chevron above the tint, placed for its size by
 * `--sw-select-chevron-inset`. Forced colors drop the tint and the shadow
 * and keep the Highlight border.
 */
export function cssFieldChangedClasses(): string {
  return `[data-theme] .sw-field-changed > :is(input, select, textarea),
.sw-field-changed .sw-field-adorned {
  border-color: var(--sw-color-accent);
  box-shadow: inset 0 0 0 1px var(--sw-color-accent);
}

[data-theme] .sw-field-changed > :is(${typedInputs}):not(:placeholder-shown),
${tintedFrame} {
  background-image: ${changedTintLayer};
}

[data-theme] .sw-field-changed > select {
  background-image:
    ${selectChevronLayers.image},
    ${changedTintLayer};
  background-position:
    ${selectChevronLayers.position},
    0 0;
  background-size: ${selectChevronLayers.size},
    100% 100%;
}

${tintedFrame} > :is(.sw-field-prefix, .sw-field-suffix) {
  color: var(--sw-color-text);
}

@media (forced-colors: active) {
  [data-theme] .sw-field-changed > :is(input, select, textarea),
  .sw-field-changed .sw-field-adorned { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; }
  [data-theme] .sw-field-changed > :is(${typedInputs}):not(:placeholder-shown),
  ${tintedFrame} { background-image: none; }
  [data-theme] .sw-field-changed > select { background-image: ${selectChevronLayers.image}; }
}`;
}
