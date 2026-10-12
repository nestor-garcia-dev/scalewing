/**
 * The controls a press on a pressable row leaves alone: a press on one of
 * them is that control's own, never the row's.
 */
const controlSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** The row's action: its first link or button. */
const actionSelector = 'a[href], button';

/** What `rowPressAction` reads of a click. */
export type RowPress = {
  button: number;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  defaultPrevented: boolean;
  target: EventTarget | null;
};

function isDisabled(action: HTMLElement): boolean {
  return (
    (action instanceof HTMLButtonElement && action.disabled) ||
    action.getAttribute('aria-disabled') === 'true'
  );
}

/** A selection the press ended, such as text dragged over in the row. */
function endsSelection(row: HTMLElement): boolean {
  const selection = row.ownerDocument.getSelection();
  if (selection === null || selection.isCollapsed) return false;
  for (let index = 0; index < selection.rangeCount; index += 1)
    if (selection.getRangeAt(index).intersectsNode(row)) return true;
  return false;
}

/**
 * The control a press on a pressable row activates, or none: a plain
 * primary press (no modifier key, not already handled) that lands on the
 * row but not on a control in it, and does not end a text selection, goes
 * to the row's first link or button, unless that is disabled.
 */
export function rowPressAction(
  row: HTMLElement,
  press: RowPress,
): HTMLElement | null {
  if (press.defaultPrevented || press.button !== 0) return null;
  if (press.altKey || press.ctrlKey || press.metaKey || press.shiftKey)
    return null;
  if (!(press.target instanceof Element) || !row.contains(press.target))
    return null;
  const control = press.target.closest(controlSelector);
  if (control !== null && control !== row && row.contains(control)) return null;
  if (endsSelection(row)) return null;
  const action = row.querySelector<HTMLElement>(actionSelector);
  if (action === null || isDisabled(action)) return null;
  return action;
}
