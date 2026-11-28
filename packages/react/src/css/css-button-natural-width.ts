/*
 * A Button keeps its natural width as an item of a flex row (an Inline
 * that does not wrap, a header's actions): it gives up none of it
 * (`flex-shrink: 0`), so a crowded row's other items give way first and
 * its words stay on the one line they take at that width. It is never
 * wider than its container (`max-width: 100%`): where its words are
 * longer than the whole row or column it is in, they wrap inside the
 * pill, every word shown, never cut. A full button's own rules
 * (css-button-width.ts) still let it shrink and grow in an Inline.
 */
export function cssButtonNaturalWidthClasses(): string {
  return `.sw-button {
  flex-shrink: 0;
  max-width: 100%;
}`;
}
