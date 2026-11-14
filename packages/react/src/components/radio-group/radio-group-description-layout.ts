/**
 * Where a RadioGroup option's description goes: `auto` (at the row's end
 * while it fits, under the label otherwise and below md) or `stacked`
 * (always under the label).
 */
export const radioGroupDescriptionLayouts = ['auto', 'stacked'] as const;
export type RadioGroupDescriptionLayout =
  (typeof radioGroupDescriptionLayouts)[number];

/** Fails closed on a description layout RadioGroup does not have. */
export function assertRadioGroupDescriptionLayout(
  layout: RadioGroupDescriptionLayout,
): void {
  if (!(radioGroupDescriptionLayouts as readonly unknown[]).includes(layout))
    throw new RangeError(
      `Unknown RadioGroup descriptionLayout: ${String(layout)}`,
    );
}
