import { type MouseEvent } from 'react';

/**
 * Whether a press on a link is a plain one a client router may take: the
 * primary button, no modifier key (which opens a tab or a window) and not
 * already handled. Shared by SectionNav and ListRow.
 */
export function plainPress(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
