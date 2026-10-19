import { quietFill } from './quiet-fill.js';

/*
 * The unread dot: an accent circle a space-2 across after the title's last
 * word, on its line. It is drawn as a border, so forced colours keep it
 * (in the text colour); the hidden words beside the title say what it is.
 * Centred on the words' middle, as an inline mark.
 */
function unreadRules(): string {
  return `.sw-list-row-unread {
  border: calc(var(--sw-space-2) / 2) solid var(--sw-color-accent);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  display: inline-block;
  height: var(--sw-space-2);
  margin-inline-start: var(--sw-space-2);
  vertical-align: middle;
  width: var(--sw-space-2);
}

@media (forced-colors: active) {
  .sw-list-row-unread { border-color: CanvasText; }
}`;
}

/*
 * The tag (a Badge, "Only in English") sits before the accessory, centred
 * on the row's height and never shrunk or wrapped.
 */
function tagRules(): string {
  return `.sw-list-row-tag {
  align-self: center;
  display: inline-flex;
  flex: none;
  white-space: nowrap;
}`;
}

/*
 * A row with an action is the row's button or link followed by the
 * action's control in one list item, the control centred on the row's
 * height after it and outside its press area. The row ends a space-2
 * before the control, and the control keeps the row's inline end padding
 * after it (a space-4 in a panel, none in a plain list). Where :has() is
 * supported, the hover fill spans the whole item, so the row and its
 * control read as one line; elsewhere the row keeps its own fill.
 */
function actionRules(): string {
  return `.sw-list-item-action {
  align-items: center;
  display: flex;
}

.sw-list-item-action > .sw-list-row {
  flex: 1 1 auto;
  min-width: 0;
  padding-inline-end: var(--sw-space-2);
}

.sw-list-row-action {
  display: inline-flex;
  flex: none;
  padding-inline-end: var(--sw-space-4);
}

.sw-list-group-plain .sw-list-row-action { padding-inline-end: 0; }

@supports selector(:has(*)) {
  @media (hover: hover) {
    .sw-list-item-action:has(> .sw-list-row-pressable:hover:not(.sw-list-row-disabled)) {
      background: ${quietFill};
    }

    .sw-list-item-action > .sw-list-row-pressable:hover:not(.sw-list-row-disabled) {
      background: transparent;
    }
  }
}`;
}

export function cssListRowTrailingClasses(): string {
  return `${unreadRules()}

${tagRules()}

${actionRules()}`;
}

export function listRowTrailingClassCatalog(): string[] {
  return [
    'sw-list-row-unread',
    'sw-list-row-tag',
    'sw-list-item-action',
    'sw-list-row-action',
  ];
}
