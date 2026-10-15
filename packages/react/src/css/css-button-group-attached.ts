import { breakpointQuery, type Breakpoint } from './breakpoints.js';
import {
  buttonGroupTrackClassCatalog,
  cssButtonGroupTrackClasses,
} from './css-button-group-track.js';
import { joinedZIndex } from './stacking.js';

/** The class that stretches an attached group below a breakpoint. */
export function buttonGroupFullWidthClass(breakpoint: Breakpoint): string {
  return `sw-button-group-full-below-${breakpoint}`;
}

/*
 * An attached ButtonGroup is one joined control, such as Previous, Today
 * and Next: its direct Button children side by side with no gap and one
 * height, their borders overlapping into single dividers, the inner
 * corners square and the outer ones the sm radius. It keeps its row on a
 * phone (it never stacks) and sizes to its buttons, even in a Stack that
 * would stretch it, so `justify` does not apply.
 *
 * A borderless variant (primary, tertiary, ghost, danger) draws its
 * divider in its own text colour at low strength, so a joined row of them
 * still reads as separate buttons; forced colours draw every border.
 *
 * The buttons are found by type, not by place, so an open calendar a
 * button renders beside itself (CalendarButton, DateRangeButton) does not
 * cost the next button its divider or the last one its rounded corners.
 *
 * With `fullWidthBelow`, below that breakpoint the group fills its column
 * and its buttons share the width equally.
 *
 * The group is its own stacking context: a pressed button's ring paints
 * over its neighbours and the focused button's standard outer ring over
 * both, so neither is covered by the next button.
 */
export function cssButtonGroupAttachedClasses(): string {
  const group = '.sw-button-group.sw-button-group-attached';
  return `${group} {
  align-items: stretch;
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 0;
  isolation: isolate;
  max-width: 100%;
  width: fit-content;
}

${group} > .sw-button {
  border-radius: 0;
}

${group} > .sw-button ~ .sw-button {
  margin-inline-start: -1px;
}

${group} > .sw-button:first-of-type {
  border-end-start-radius: var(--sw-radius-sm);
  border-start-start-radius: var(--sw-radius-sm);
}

${group} > .sw-button:last-of-type {
  border-end-end-radius: var(--sw-radius-sm);
  border-start-end-radius: var(--sw-radius-sm);
}

${group} > .sw-button ~ .sw-button:not(.sw-button-secondary) {
  border-inline-start-color: color-mix(in srgb, currentColor 30%, transparent);
}

${group} > .sw-button[aria-pressed='true'] {
  position: relative;
  ${joinedZIndex('pressed')}
}

${group} > .sw-button:focus-visible {
  position: relative;
  ${joinedZIndex('focused')}
}

@media ${breakpointQuery('below', 'md')} {
  ${group} { align-items: stretch; flex-direction: row; }
  ${group} > * { width: auto; }
}

/* Its own block, after the phone row's, so a group that does not fill is unchanged. */
@media ${breakpointQuery('below', 'md')} {
  ${group}.${buttonGroupFullWidthClass('md')} { width: 100%; }
  ${group}.${buttonGroupFullWidthClass('md')} > .sw-button { flex: 1 1 0; min-width: 0; }
}

${cssButtonGroupTrackClasses()}`;
}

export function buttonGroupAttachedClassCatalog(): string[] {
  return [
    'sw-button-group-attached',
    buttonGroupFullWidthClass('md'),
    ...buttonGroupTrackClassCatalog(),
  ];
}
