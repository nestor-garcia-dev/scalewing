import { typographyVariants } from '@scalewing/tokens';

import { coarsePointerQuery, touchTarget } from './touch-target.js';

const caption = typographyVariants.caption;
const label = typographyVariants.label;

/** How a section navigation marks its current item. */
export const sectionNavAppearances = ['underline', 'filled'] as const;
export type SectionNavAppearance = (typeof sectionNavAppearances)[number];

export function assertSectionNavAppearance(appearance: unknown): void {
  if (!sectionNavAppearances.includes(appearance as SectionNavAppearance))
    throw new RangeError(
      `SectionNav appearance must be one of ${sectionNavAppearances.join(', ')}`,
    );
}

/*
 * `filled`: a quiet bar of page buttons, as an area's sub-navigation beside
 * its name. No hairline under the row and no underline or start bar, in
 * the row and the side list; every link is the sm control (32; the 44 px
 * target on a coarse pointer) with the sm radius and the control's
 * padding at weight 500, and the current one takes a soft muted fill in
 * the text colour at the label weight (600), so it reads apart from a
 * hovered link. A 2 px transparent border keeps room for forced colours,
 * where the current link's border turns Highlight.
 *
 * A count after a label (a number waiting there) is a filled pill: the
 * danger colour with its on-colour figures (4.5:1 in every palette, as a
 * danger Button's label), caption size at weight 700, a space-5 less
 * space-1 (20) high and at least as wide. Forced colours draw its edge.
 */
export function cssSectionNavFilledClasses(): string {
  // Two classes, so every filled rule outranks the side list's (one class
  // and :dir), not by source order alone.
  const filled = '.sw-section-nav.sw-section-nav-filled';
  return `${filled} .sw-section-nav-list {
  border-bottom: 0;
}

/* (0,4,0): outranks the underline and the side list's start bar. */
[data-theme] ${filled} .sw-section-nav-link {
  border: 2px solid transparent;
  border-radius: var(--sw-radius-sm);
  font-weight: 500;
  margin-bottom: 0;
  min-height: var(--sw-control-sm-min-height);
  padding-inline: var(--sw-control-sm-padding-inline);
}

[data-theme] ${filled} .sw-section-nav-link[aria-current] {
  background: color-mix(in srgb, var(--sw-color-muted) 18%, transparent);
  border-color: transparent;
  color: var(--sw-color-text);
  font-weight: ${label.fontWeight};
}

[data-theme] .sw-section-nav-count {
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

@media ${coarsePointerQuery} {
  [data-theme] ${filled} .sw-section-nav-link { min-height: ${touchTarget}; }
}

@media (forced-colors: active) {
  [data-theme] ${filled} .sw-section-nav-link[aria-current] { border-color: Highlight; }
  [data-theme] .sw-section-nav-count { border: 1px solid CanvasText; }
}`;
}

export function sectionNavFilledClassCatalog(): string[] {
  return ['sw-section-nav-filled', 'sw-section-nav-count'];
}
