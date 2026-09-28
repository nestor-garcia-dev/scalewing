/*
 * The comfortable touch target on a coarse pointer: the md control height,
 * 44 px, both ways. Controls drawn smaller for a fine pointer (CalendarButton
 * at sm and xs, the ActionMenu trigger and commands) grow to it on touch.
 */
export const touchTarget = 'var(--sw-control-md-min-height)';

export const coarsePointerQuery = '(pointer: coarse)';
