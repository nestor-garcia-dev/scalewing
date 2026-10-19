import { cx } from '../class-names.js';
import { isOneOf } from '../is-one-of.js';

/** The pill's colours: `danger` for work waiting, `accent` for news. */
export const navCountTones = ['danger', 'accent'] as const;
export type NavCountTone = (typeof navCountTones)[number];

export type NavCountProps = {
  /**
   * How many things wait behind the destination, such as tasks to do: a
   * filled pill after its words, read in the link's name ("Tasks 8"). A
   * whole number; 0 shows nothing.
   */
  count: number;
  /**
   * What the count means, in the consumer's words ("8 tasks to do"): read
   * in the name in place of the bare number ("Tasks 8 tasks to do"), the
   * pill then hidden from assistive technology.
   */
  countLabel?: string;
  /**
   * The pill's colour. `danger` (the default) is work waiting there, such
   * as tasks to do; `accent` is news, such as what was added since the
   * person last looked, where nothing is overdue. Give an accent count a
   * `countLabel` ("3 new"), so its words, not its colour, say it is news.
   * Place either tone on a neutral or ghost destination: a filled one of
   * the same colour would hide it.
   */
  tone?: NavCountTone;
};

/**
 * Fails closed on a count that is not a whole number, an empty label or an
 * unknown tone.
 */
function assertNavCount({ count, countLabel, tone }: NavCountProps) {
  if (!Number.isInteger(count) || count < 0)
    throw new RangeError(
      `NavCount count must be a whole number from 0: ${String(count)}`,
    );
  if (
    countLabel !== undefined &&
    (typeof countLabel !== 'string' || !countLabel.trim())
  )
    throw new RangeError('NavCount countLabel must be non-empty text');
  if (tone !== undefined && !isOneOf(navCountTones, tone))
    throw new RangeError(`Unknown NavCount tone: ${String(tone)}`);
}

/**
 * A count after a Nav destination's words, placed inside its link or
 * Button: `<a href="/tasks">Tasks<NavCount count={8} /></a>`. It is the
 * pill SectionNav's item count draws, and it is part of the destination's
 * accessible name, as there. `tone="accent"` draws it in the accent colour,
 * for news rather than work.
 */
export function NavCount({
  count,
  countLabel,
  tone = 'danger',
}: NavCountProps) {
  assertNavCount({ count, countLabel, tone });
  if (count === 0) return null;
  // The space is its own text node, so every browser and the name's
  // computation keep it between the words and the count.
  return (
    <>
      {' '}
      {countLabel ? <span className="sw-sr-only">{countLabel}</span> : null}
      <span
        aria-hidden={countLabel ? true : undefined}
        className={cx(
          'sw-nav-count',
          tone === 'accent' && 'sw-nav-count-accent',
        )}
      >
        {count}
      </span>
    </>
  );
}
