import { type ReactNode } from 'react';

/**
 * Rows of a `ScreenPreview` that belong together: parted from the next
 * group by a hairline on a card, each a card of its own in a device frame.
 */
export function PreviewGroup({ children }: { children: ReactNode }) {
  return <div className="sw-preview-group">{children}</div>;
}
