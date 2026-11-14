/**
 * How a Checkbox is drawn: `plain` (the box beside its words) or `tile`
 * (the box and its words inside a bordered tile that is one press target).
 */
export const checkboxAppearances = ['plain', 'tile'] as const;
export type CheckboxAppearance = (typeof checkboxAppearances)[number];

/**
 * Fails closed on a Checkbox it cannot draw: an unknown appearance, or a
 * tile whose words are hidden (a tile is a press target named by the words
 * it draws).
 */
export function assertCheckboxAppearance(
  appearance: CheckboxAppearance,
  labelVisuallyHidden: boolean,
): void {
  if (!(checkboxAppearances as readonly unknown[]).includes(appearance))
    throw new RangeError(`Unknown Checkbox appearance: ${String(appearance)}`);
  if (appearance === 'tile' && labelVisuallyHidden)
    throw new RangeError('A tile Checkbox draws its label');
}
