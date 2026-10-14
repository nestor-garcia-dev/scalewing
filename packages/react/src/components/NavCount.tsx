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
};

/** Fails closed on a count that is not a whole number or an empty label. */
function assertNavCount({ count, countLabel }: NavCountProps) {
  if (!Number.isInteger(count) || count < 0)
    throw new RangeError(
      `NavCount count must be a whole number from 0: ${String(count)}`,
    );
  if (
    countLabel !== undefined &&
    (typeof countLabel !== 'string' || !countLabel.trim())
  )
    throw new RangeError('NavCount countLabel must be non-empty text');
}

/**
 * A count after a Nav destination's words, placed inside its link or
 * Button: `<a href="/tasks">Tasks<NavCount count={8} /></a>`. It is the
 * pill SectionNav's item count draws, and it is part of the destination's
 * accessible name, as there.
 */
export function NavCount({ count, countLabel }: NavCountProps) {
  assertNavCount({ count, countLabel });
  if (count === 0) return null;
  // The space is its own text node, so every browser and the name's
  // computation keep it between the words and the count.
  return (
    <>
      {' '}
      {countLabel ? <span className="sw-sr-only">{countLabel}</span> : null}
      <span
        aria-hidden={countLabel ? true : undefined}
        className="sw-nav-count"
      >
        {count}
      </span>
    </>
  );
}
