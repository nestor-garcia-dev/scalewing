/*
 * The comfortable touch target on a coarse pointer: the md control height,
 * 44 px, both ways. Controls drawn smaller for a fine pointer (CalendarButton
 * at sm and xs, the ActionMenu trigger and commands) grow to it on touch.
 * The compact density restates the md height on a fine pointer only, so it
 * is never in force where a coarse rule runs; a rule that reads this outside
 * a coarse query (a FixtureRow's height, the rail's links) follows it to 36.
 */
export const touchTarget = 'var(--sw-control-md-min-height)';

export const coarsePointerQuery = '(pointer: coarse)';

export const finePointerQuery = '(pointer: fine)';
