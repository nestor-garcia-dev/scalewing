/**
 * A trigger that acts when pressed: a link, a button, a form control or an
 * element with a widget role. A tap on it does what it does and does not
 * also open the tooltip, which would stay over the result (or, after a
 * link, over the next page).
 */
const actingTrigger = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
].join(', ');

/** Whether a tap at `target` lands on a control inside the tooltip's anchor. */
export function tapActs(target: EventTarget | null, anchor: Element): boolean {
  if (!(target instanceof Element)) return false;
  const control = target.closest(actingTrigger);
  return control !== null && anchor.contains(control);
}

/**
 * Whether the focus that just landed on `target` is visible: from the
 * keyboard or a script, not a click or a tap, which hover and the tap's own
 * rule already cover. A browser without `:focus-visible` counts it visible.
 */
export function focusIsVisible(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return true;
  try {
    return target.matches(':focus-visible');
  } catch {
    return true;
  }
}
