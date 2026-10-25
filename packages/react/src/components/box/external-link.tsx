import { type ReactNode } from 'react';

import { externalLinkMarkClass } from '../../css/css-box-link.js';

/** What a `Box` passes to check and draw its external link. */
export type BoxExternalOptions = {
  as: string;
  external: boolean | undefined;
  newTabLabel: string | undefined;
};

/** The `rel` words a link that opens a new tab always carries. */
const newTabRelWords = ['noopener', 'noreferrer'] as const;

/**
 * Refuses an external box that is not a link or has no words for its new
 * tab, and new-tab words on a box that is not external.
 */
export function assertBoxExternal({
  as,
  external,
  newTabLabel,
}: BoxExternalOptions): void {
  if (external === undefined || external === false) {
    if (newTabLabel !== undefined)
      throw new TypeError('Box newTabLabel is for an external link');
    return;
  }
  if (external !== true) throw new RangeError('Box external must be a boolean');
  if (as !== 'a') throw new TypeError('Box external is for a link (as="a")');
  if (typeof newTabLabel !== 'string' || newTabLabel.trim() === '')
    throw new RangeError('Box external needs a non-empty newTabLabel');
}

/** The consumer's `rel` words with `noopener noreferrer`, each once. */
export function externalLinkRel(rel: string | undefined): string {
  const words = (rel ?? '').split(/\s+/).filter((word) => word !== '');
  for (const word of newTabRelWords)
    if (!words.includes(word)) words.push(word);
  return words.join(' ');
}

/**
 * An external link's content: its words, the decorative new-tab mark
 * right after them (no space, so it never wraps alone) and the hidden
 * words read after the name, such as "(opens in a new tab)".
 */
export function externalLinkContent(
  children: ReactNode,
  newTabLabel: string,
): ReactNode {
  return (
    <>
      {children}
      <span aria-hidden="true" className={externalLinkMarkClass} />
      <span className="sw-sr-only"> {newTabLabel}</span>
    </>
  );
}
