/**
 * The `tabIndex` every Scalewing press control and link renders by default.
 *
 * Safari leaves a `<button>`, a link, a checkbox and a radio out of the Tab
 * order unless the element carries an explicit `tabindex` (its "Press Tab to
 * highlight each item" setting is off by default), so a keyboard user there
 * Tabs past them to the address bar. An explicit `0` puts them in the same
 * order every other browser already gives them. A control that is
 * deliberately not a tab stop (a Stepper's − and +, a roving item) keeps its
 * own `-1`, and a consumer's `tabIndex` always wins.
 */
export const tabStop = 0;

/**
 * Which radio of a group carries the explicit tab stop: the checked one, or
 * the first enabled one while none is. Browsers move between a group's
 * radios with the arrow keys and Tab only into the group, so the others keep
 * no `tabindex` and each browser's own group rule stands.
 */
export function radioTabStopValue(
  options: readonly { value: string; disabled?: boolean }[],
  value: string | undefined,
): string | undefined {
  const enabled = options.filter((option) => !option.disabled);
  return (enabled.find((option) => option.value === value) ?? enabled[0])
    ?.value;
}
