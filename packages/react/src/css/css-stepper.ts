import { typographyVariants } from '@scalewing/tokens';

import { changedTintLayer } from './css-field-changed.js';
import {
  cssStepperUnitClasses,
  stepperUnitClassCatalog,
} from './css-stepper-unit.js';

const body = typographyVariants.body;
const label = typographyVariants.label;
const title = typographyVariants.title;

/*
 * The count is a text input, so the canvas already draws it as a control
 * (`[data-theme] :is(input[type='text'], …)`). `input.sw-stepper-input`
 * matches that rule's specificity and comes later in the sheet, so the
 * stepper's own centering and type win while the canvas keeps the surface,
 * the focus ring and the disabled look.
 */
const input = '[data-theme] input.sw-stepper-input';

function stateRules(): string {
  return `[data-theme] .sw-stepper-invalid input.sw-stepper-input {
  border-color: var(--sw-color-danger);
}

[data-theme] .sw-stepper-changed input.sw-stepper-input {
  border-color: var(--sw-color-accent);
  box-shadow: inset 0 0 0 1px var(--sw-color-accent);
}

[data-theme] .sw-stepper-changed input.sw-stepper-input:not(:placeholder-shown) {
  background-image: ${changedTintLayer};
}

/* A plain limit: − at min and + at max keep their look, still disabled. */
.sw-stepper-limit-plain .sw-stepper-button:disabled {
  cursor: default;
  opacity: 1;
}

/* Read-only: the buttons keep their room, so the count lines up with an editable one. */
.sw-stepper-readonly .sw-stepper-button { visibility: hidden; }

@media (forced-colors: active) {
  .sw-stepper-button { border-color: ButtonText; }
  .sw-stepper-button:disabled { border-color: GrayText; color: GrayText; opacity: 1; }
  [data-theme] .sw-stepper-invalid input.sw-stepper-input { border-color: Mark; }
  [data-theme] .sw-stepper-changed input.sw-stepper-input { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; background-image: none; }
}`;
}

/**
 * The web Stepper: a label over a track of − count +. The count is a few
 * digits wide by default, the track at its own width even under a wider label
 * or message (`5ch` plus its padding, so its width never follows
 * its value), or fills its container with `sw-stepper-full`. The buttons are
 * spacing step 6 wide on the subtle fill and every part is the `md` control
 * height.
 */
export function cssStepperClasses(): string {
  return `.sw-stepper {
  align-items: flex-start;
  display: inline-flex;
  flex-direction: column;
  gap: var(--sw-space-1);
  min-width: 0;
  /* Holds its hidden label and empty error region, which leave the flow,
     so inside a scroll region they never widen the page. */
  position: relative;
}

.sw-stepper-full { align-items: stretch; display: flex; }

.sw-stepper-track {
  display: inline-grid;
  gap: var(--sw-space-1);
  grid-template-columns: var(--sw-space-6) auto var(--sw-space-6);
}

.sw-stepper-full .sw-stepper-track {
  display: grid;
  grid-template-columns: var(--sw-space-6) minmax(0, 1fr) var(--sw-space-6);
}

.sw-stepper-button {
  align-items: center;
  appearance: none;
  background: var(--sw-color-subtle);
  border: 1px solid transparent;
  border-radius: var(--sw-radius-sm);
  color: var(--sw-color-text);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--sw-font-sans);
  font-size: ${title.fontSize}px;
  font-weight: ${title.fontWeight};
  justify-content: center;
  line-height: ${title.lineHeight}px;
  margin: 0;
  min-height: var(--sw-control-md-min-height);
  padding: 0;
  touch-action: manipulation;
}

.sw-stepper-button:hover:not(:disabled) {
  background: var(--sw-color-border);
}

.sw-stepper-button:disabled {
  cursor: not-allowed;
  opacity: var(--sw-disabled-opacity);
}

${input} {
  font-size: ${body.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: ${label.fontWeight};
  inline-size: calc(5ch + 2 * var(--sw-space-1));
  line-height: ${body.lineHeight}px;
  min-width: 0;
  padding-inline: var(--sw-space-1);
  text-align: center;
}

.sw-stepper-full input.sw-stepper-input { inline-size: 100%; }

${stateRules()}

${cssStepperUnitClasses()}`;
}

export function stepperClassCatalog(): string[] {
  return [
    'sw-stepper',
    'sw-stepper-full',
    'sw-stepper-track',
    'sw-stepper-button',
    'sw-stepper-input',
    'sw-stepper-invalid',
    'sw-stepper-changed',
    'sw-stepper-readonly',
    'sw-stepper-limit-plain',
    ...stepperUnitClassCatalog(),
  ];
}
