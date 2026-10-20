import { typographyVariants } from '@scalewing/tokens';

const body = typographyVariants.body;
const label = typographyVariants.label;

/*
 * An open step's muted words after its title ("Optional", "Wetlands done ·
 * Woodlands empty"): the title and the words share one line that wraps, the
 * words on the title's baseline a space-2 after it, or on a line of their
 * own under the title when they do not fit beside it. The line gives way
 * to a done step's summary and Edit in an open list, as the title does.
 * The words are the label size at the body's weight in the muted colour,
 * a skipped step's reason's colour beside its title; a long word breaks
 * rather than pass the panel.
 */
export function cssStepsTitleDetailClasses(): string {
  return `.sw-steps-title-line {
  align-items: baseline;
  column-gap: var(--sw-space-2);
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  min-width: 0;
}

.sw-steps-title-detail {
  color: var(--sw-color-muted);
  font-size: ${label.fontSize}px;
  font-weight: ${body.fontWeight};
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-width: 0;
  overflow-wrap: anywhere;
}`;
}

export function stepsTitleDetailClassCatalog(): string[] {
  return ['sw-steps-title-line', 'sw-steps-title-detail'];
}
