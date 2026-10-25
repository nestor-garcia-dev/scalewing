'use client';

import {
  type SemanticColorKey,
  type TypographyVariant,
} from '@scalewing/tokens';
import { useEffect, useState } from 'react';

import { Text } from './Text.js';

/** `polite` waits for the reader to finish; `assertive` interrupts it. */
export const liveRegionPolitenesses = ['polite', 'assertive'] as const;
export type LiveRegionPoliteness = (typeof liveRegionPolitenesses)[number];

export type LiveRegionProps = {
  /**
   * The words to announce now, in the consumer's language. Empty (or none)
   * clears the region and announces nothing.
   */
  children?: string;
  /**
   * `polite` (the default) is a `status`, read when the reader is idle;
   * `assertive` is an `alert`, read at once: keep it for an error the
   * person must hear before they go on.
   */
  politeness?: LiveRegionPoliteness;
  /**
   * Changed to announce the same words again, such as a second "Copied".
   * New words are announced without it.
   */
  announceKey?: string | number;
  /**
   * Keeps the words for assistive technology only (`sw-sr-only`), for a
   * change the page already shows another way, such as a button's label
   * turning to "Copied". Default `false`: the words are drawn inline as
   * `Text` draws them.
   */
  visuallyHidden?: boolean;
  /** The drawn words' type, as `Text`'s (default `body`). Not with `visuallyHidden`. */
  variant?: TypographyVariant;
  /** The drawn words' colour, as `Text`'s (default `text`). Not with `visuallyHidden`. */
  color?: SemanticColorKey;
  /** The region's id, such as for a control's `aria-describedby`. */
  id?: string;
};

/*
 * Screen readers miss words put into a live region in the same moment the
 * region itself appears, so the first words wait until it has been in the
 * page this long, as common announcers do. Later changes show at once.
 */
const regionSettleMs = 100;

type Shown = {
  words: string;
  announceKey: LiveRegionProps['announceKey'];
  key: number;
};

function assertLiveRegionProps({
  color,
  politeness,
  variant,
  visuallyHidden,
}: Pick<
  LiveRegionProps,
  'color' | 'politeness' | 'variant' | 'visuallyHidden'
>): void {
  if (!liveRegionPolitenesses.includes(politeness as LiveRegionPoliteness))
    throw new RangeError(
      `Unknown LiveRegion politeness: ${String(politeness)}`,
    );
  if (visuallyHidden && (variant !== undefined || color !== undefined))
    throw new TypeError(
      'LiveRegion variant and color draw words; a visuallyHidden region draws none',
    );
}

/**
 * A status line whose words change and are announced: a region that is
 * always mounted and starts empty (`role="status"`, or `"alert"` when
 * assertive, with `aria-live` and `aria-atomic`), its words a keyed child
 * swapped in on each change of `children` or `announceKey`, so new words,
 * and the same words again, are read. Drawn inline in `Text`'s look, or
 * visually hidden.
 */
export function LiveRegion({
  announceKey,
  children = '',
  color,
  id,
  politeness = 'polite',
  variant,
  visuallyHidden = false,
}: LiveRegionProps) {
  assertLiveRegionProps({ color, politeness, variant, visuallyHidden });
  const [settled, setSettled] = useState(false);
  const [shown, setShown] = useState<Shown>({
    words: '',
    announceKey,
    key: 0,
  });
  // Words or a key that changed since the last swap are swapped in while
  // rendering (React's state from the previous render), once settled.
  if (
    settled &&
    (shown.words !== children || shown.announceKey !== announceKey)
  )
    setShown({ words: children, announceKey, key: shown.key + 1 });

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), regionSettleMs);
    return () => window.clearTimeout(timer);
  }, []);

  const region = {
    'aria-atomic': true,
    'aria-live': politeness,
    id,
    role: politeness === 'assertive' ? 'alert' : 'status',
  } as const;
  const words =
    shown.words === '' ? null : <span key={shown.key}>{shown.words}</span>;

  if (visuallyHidden)
    return (
      <span className="sw-sr-only" {...region}>
        {words}
      </span>
    );
  return (
    <Text as="span" color={color} variant={variant} {...region}>
      {words}
    </Text>
  );
}
