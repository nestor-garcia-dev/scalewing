import { typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;

/** The counts drawn as the pill: SectionNav's and a Nav word's. */
const pills = ['sw-section-nav-count', 'sw-nav-count'] as const;

/*
 * A count after a destination's words (a number waiting there, such as
 * tasks to do) is a filled pill: the danger colour with its on-colour
 * figures (4.5:1 in every palette, as a danger Button's label), caption
 * size at weight 700, a space-5 less space-1 (20) high and at least as
 * wide. Forced colours draw its edge. SectionNav's item count and Nav's
 * NavCount share it, so an area's count reads the same in both.
 */
export function cssCountPillClasses(): string {
  const selector = pills.map((name) => `[data-theme] .${name}`).join(',\n');
  return `${selector} {
  align-items: center;
  background: var(--sw-color-danger);
  border-radius: var(--sw-radius-pill);
  box-sizing: border-box;
  color: var(--sw-color-onDanger);
  display: inline-flex;
  font-size: ${caption.fontSize}px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  justify-content: center;
  letter-spacing: ${caption.letterSpacing}px;
  line-height: 1;
  min-height: calc(var(--sw-space-5) - var(--sw-space-1));
  min-width: calc(var(--sw-space-5) - var(--sw-space-1));
  padding-inline: var(--sw-space-1);
}

/*
 * A Nav link holding a count lays out as SectionNav's link does: the words
 * and the pill centred on one line a space-2 apart (the space text node
 * that keeps the name collapses), so the link is as tall as its siblings
 * and its words stay level with theirs. A Button already does this. At
 * zero specificity, so a link's \`hideBelow\` or \`hideFrom\` still hides it.
 * In forced colours a current link's underline runs under the pill's
 * figure too, as the pill is a flex item of the link.
 */
:where(.sw-nav a:has(> .sw-nav-count)) {
  align-items: center;
  display: inline-flex;
  gap: var(--sw-space-2);
}

@media (forced-colors: active) {
  ${selector.replaceAll('\n', '\n  ')} { border: 1px solid CanvasText; }
}`;
}

export function countPillClassCatalog(): string[] {
  return [...pills];
}
