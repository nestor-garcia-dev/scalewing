import { quietFill } from './quiet-fill.js';

export const buttonGroupAppearances = ['default', 'track'] as const;

/**
 * How an attached ButtonGroup is drawn: `default` keeps each button's own
 * fill and outline, joined; `track` sets the buttons as words on one
 * quiet grey track, a hairline between them, such as Previous, Today and
 * Next above a day.
 */
export type ButtonGroupAppearance = (typeof buttonGroupAppearances)[number];

export const buttonGroupTrackClass = 'sw-button-group-track';

const track = `.sw-button-group.sw-button-group-attached.${buttonGroupTrackClass}`;

/*
 * The track: the attached group takes the quiet fill and the sm radius
 * (its buttons' outer corners already are), and every button in it loses
 * its own fill and outline to take its words in the text color. The
 * divider between two buttons is a border hairline at full height, after
 * the attached group's tinted divider (one more class, so it wins at the
 * same place); it is the second button's start border, so the one before
 * a disabled button fades with it. The divider is the canvas hairline
 * (about 1.2:1 on the track, as the board draws it; fainter on a dark
 * card). A pressed button keeps its ring and a focused one its outline,
 * over the track. A disabled button fades, `disabledAppearance="neutral"`
 * included (its muted words would read as enabled ones here). Forced
 * colors outline the track, keep every border and draw a pressed button's
 * border in Highlight. A track is for equal-weight navigation: every
 * variant's meaning goes, so keep a primary or destructive action out of it.
 */
export function cssButtonGroupTrackClasses(): string {
  return `${track} {
  background: ${quietFill};
  border-radius: var(--sw-radius-sm);
}

${track} > .sw-button {
  background: transparent;
  border-color: transparent;
  color: var(--sw-color-text);
}

${track} > .sw-button + .sw-button {
  border-inline-start-color: var(--sw-color-border);
}

${track} > .sw-button:disabled {
  opacity: var(--sw-disabled-opacity);
}

@media (forced-colors: active) {
  ${track} { outline: 1px solid CanvasText; }
  ${track} > .sw-button[aria-pressed='true'] { border-color: Highlight; }
}`;
}

export function buttonGroupTrackClassCatalog(): string[] {
  return [buttonGroupTrackClass];
}
