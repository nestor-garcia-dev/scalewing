import { typographyVariants } from '@scalewing/tokens';

import {
  controlSurface,
  disabledControlForcedColors,
  disabledControlSurface,
} from './css-document.js';
import { changedTintLayer } from './css-field-changed.js';

const body = typographyVariants.body;

/*
 * Outranks the stepper's own input rules and state rules (the invalid
 * border, the changed shadow and tint), which the frame draws instead.
 */
const framedInput =
  '[data-theme] .sw-stepper .sw-stepper-count > input.sw-stepper-input';
const tintedFrame =
  '.sw-stepper-changed .sw-stepper-count:not(:has(> input:placeholder-shown))';

/**
 * A Stepper with a `unit`: the count and its muted word ("90 min") inside
 * one control frame, as Field's suffix. The frame draws the canvas control
 * surface, the focus ring and the states; the input inside drops its own and
 * keeps its few-digit width, its digits against the unit, so the frame never
 * follows the count. The pair is centred, also in a full-width stepper.
 */
export function cssStepperUnitClasses(): string {
  return `.sw-stepper-count {
  ${controlSurface}
  align-items: center;
  box-sizing: border-box;
  cursor: text;
  display: inline-flex;
  gap: var(--sw-space-1);
  justify-content: center;
  min-height: var(--sw-control-md-min-height);
  min-width: 0;
  padding-inline: var(--sw-space-2);
}

.sw-stepper-full .sw-stepper-count { display: flex; }

${framedInput} {
  align-self: stretch;
  background: transparent;
  background-image: none;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  inline-size: 5ch;
  min-height: 0;
  padding-inline: 0;
  text-align: end;
}

${framedInput}:focus-visible { outline: none; }

.sw-stepper-count:focus-within {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

.sw-stepper-unit {
  color: var(--sw-color-muted);
  flex: none;
  font-size: ${body.fontSize}px;
  line-height: ${body.lineHeight}px;
  user-select: none;
  white-space: nowrap;
}

.sw-stepper-invalid .sw-stepper-count { border-color: var(--sw-color-danger); }

.sw-stepper-changed .sw-stepper-count {
  border-color: var(--sw-color-accent);
  box-shadow: inset 0 0 0 1px var(--sw-color-accent);
}

${tintedFrame} { background-image: ${changedTintLayer}; }

${tintedFrame} > .sw-stepper-unit { color: var(--sw-color-text); }

/*
 * The frame draws the surface, so it carries the disabled look for its count,
 * and only that look: a locked count drops the invalid and changed edges and
 * tint, which name nothing a person can act on.
 */
.sw-stepper .sw-stepper-count:has(> input:disabled) {
  ${disabledControlSurface}
  background-image: none;
  border-color: var(--sw-color-border);
  box-shadow: none;
}

.sw-stepper .sw-stepper-count:has(> input:disabled) > .sw-stepper-unit {
  color: var(--sw-color-muted);
}

@media (forced-colors: active) {
  .sw-stepper-unit { color: CanvasText; }
  .sw-stepper-invalid .sw-stepper-count { border-color: Mark; }
  .sw-stepper-changed .sw-stepper-count { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; background-image: none; }
  .sw-stepper .sw-stepper-count:has(> input:disabled) {
    ${disabledControlForcedColors}
    box-shadow: none;
  }
}`;
}

export function stepperUnitClassCatalog(): string[] {
  return ['sw-stepper-count', 'sw-stepper-unit'];
}
