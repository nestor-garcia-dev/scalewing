export const noShrinkClass = 'sw-no-shrink';

export type FlexItemProps = {
  /**
   * `false` keeps this box at its natural width as an item of a flex row
   * (an `Inline`, a `Stack` laid out in a row) that is short of room: it
   * gives up no width, and its siblings give way instead, such as a
   * header's actions (a Button and an account menu in their own Inline)
   * beside a title or navigation that may wrap. The box can then be wider
   * than the row, so keep it for content that fits it. `true` (the
   * default) lets it shrink as any flex item.
   */
  shrink?: boolean;
};

export function flexItemClassNames({ shrink }: FlexItemProps): string[] {
  if (shrink === undefined || shrink) return [];
  return [noShrinkClass];
}
