import { type KeyboardEvent } from 'react';

/** A calendar popover's tab stops: enabled buttons and a grid's roving day. */
function isTabStop(node: HTMLElement): boolean {
  if (node instanceof HTMLButtonElement) return !node.disabled;
  return node.getAttribute('tabindex') === '0';
}

/**
 * Keeps Tab and Shift+Tab inside a calendar popover, as a modal dialog
 * does: from the last stop to the first, and back. Shared by DateField's
 * calendar and DateRangeButton's popover.
 */
export function wrapTab(event: KeyboardEvent<HTMLElement>) {
  // One universal selector keeps document order in every DOM implementation.
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLElement>('*'),
  ].filter(isTabStop);
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
