export const noShrinkClass = 'sw-no-shrink';

export type FlexItemProps = {
  /**
   * `false` keeps this box at its natural size along its parent's main
   * axis when the parent is a flex container short of room (its width in
   * an `Inline` row, its height in a `Stack` column): it gives up none of
   * it, and its siblings give way instead, such as a header's actions (a
   * Button and an account menu in their own Inline) beside a title or
   * navigation that may wrap. The box can then be larger than its parent,
   * so keep it for content that fits. `true` (the default) lets it shrink
   * as any flex item.
   */
  shrink?: boolean;
};

export function flexItemClassNames({ shrink }: FlexItemProps): string[] {
  if (shrink === undefined || shrink) return [];
  return [noShrinkClass];
}
