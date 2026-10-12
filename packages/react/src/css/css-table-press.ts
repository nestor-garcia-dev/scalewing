import { typographyVariants } from '@scalewing/tokens';

import { quietFill } from './quiet-fill.js';

const row = '.sw-table-row-press';
const action = '.sw-table-action';

/*
 * A pressable row: the pointer cursor over all of it, and the quiet fill
 * on its cells while it is hovered (on a pointer that hovers), pressed, or
 * while its action has keyboard focus, so a keyboard user sees the row the
 * focused name belongs to. The fill sits under the cells' text, so text,
 * muted text and toned figures keep their contrast as on any quiet-filled
 * row (an open menu's). Its action is underlined with it, so the row reads
 * as that one action. Forced colours drop fills, so the row is outlined in
 * the system highlight instead.
 */
function pressableRowRules(): string {
  return `${row} {
  cursor: pointer;
}

@media (hover: hover) {
  ${row}:hover > :is(td, th) {
    background: ${quietFill};
  }

  ${row}:hover ${action} {
    text-decoration-line: underline;
  }
}

${row}:active > :is(td, th),
${row}:has(:focus-visible) > :is(td, th) {
  background: ${quietFill};
}

@media (forced-colors: active) {
  ${row}:hover,
  ${row}:has(:focus-visible) {
    outline: var(--sw-focus-ring-width) solid Highlight;
    outline-offset: calc(-1 * var(--sw-focus-ring-width));
  }
}`;
}

/*
 * A cell's action keeps the cell's own text (its colour, size and
 * alignment) at weight 600, the label weight, as a quiet link does: the
 * weight, not a colour, sets the name apart from the row's other text.
 * Hover and keyboard focus underline it; focus draws the accent ring.
 * Forced colours paint it as any button's text.
 */
function actionRules(): string {
  return `${action} {
  appearance: none;
  background: transparent;
  border: 0;
  border-radius: var(--sw-radius-sm);
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-weight: ${typographyVariants.label.fontWeight};
  letter-spacing: inherit;
  margin: 0;
  padding: 0;
  text-align: inherit;
}

${action}:hover,
${action}:focus-visible {
  text-decoration-line: underline;
}

${action}:focus-visible {
  outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);
  outline-offset: var(--sw-focus-ring-offset);
}

@media (forced-colors: active) {
  ${action} { color: ButtonText; }
}`;
}

export function cssTablePressClasses(): string {
  return `${pressableRowRules()}

${actionRules()}`;
}

export function tablePressClassCatalog(): string[] {
  return ['sw-table-row-press', 'sw-table-action'];
}
