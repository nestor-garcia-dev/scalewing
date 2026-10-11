import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;

export const navAppearances = ['default', 'words'] as const;

/**
 * How a Nav draws its destinations: `default` keeps each link or Button's
 * own look; `words` sets every destination as plain words, the others in
 * the muted color at medium weight and the current one (`aria-current`)
 * in the text color at label weight, with no fill, visible border or
 * underline. The words must be visible: a glyph-only destination keeps
 * `default`.
 */
export type NavAppearance = (typeof navAppearances)[number];

export const navWordsClass = 'sw-nav-words';

const words = `.sw-nav.${navWordsClass}`;
const destinations = `:is(a, .sw-button)`;
const current = `[aria-current]:not([aria-current='false'])`;

/*
 * Words-only destinations. A Button keeps its size, padding, touch target
 * and focus ring; only its fill, border color and color go, so a primary
 * or ghost Button in the Nav reads the same. Links lose the canvas's accent
 * and underline, and take a transparent hairline border like a Button's.
 * `:is()` counts as its most specific argument, so the selector is three
 * classes (0,3,0): it outranks a Button's variant and the canvas's link
 * rules. The current destination differs by color and weight, so the
 * words must be visible: a glyph-only destination has no weight to change
 * (keep `default` for those). Hover lifts the color only where the pointer
 * hovers, and never on a disabled destination. Forced colors draw the
 * current one's border in Highlight and underline its words, since color
 * and weight may not show there.
 */
export function cssNavWordsClasses(): string {
  return `${words} ${destinations} {
  background: transparent;
  border: 1px solid transparent;
  color: var(--sw-color-muted);
  font-size: ${label.fontSize}px;
  font-weight: 500;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  text-decoration: none;
}

@media (hover: hover) {
  ${words} ${destinations}:hover:not(:disabled, [aria-disabled='true']) {
    color: var(--sw-color-text);
  }
}

${words} ${destinations}${current} {
  color: var(--sw-color-text);
  font-weight: ${label.fontWeight};
}

@media (forced-colors: active) {
  ${words} ${destinations}${current} { border-color: Highlight; text-decoration: underline; }
}`;
}

export function navWordsClassCatalog(): string[] {
  return [navWordsClass];
}
