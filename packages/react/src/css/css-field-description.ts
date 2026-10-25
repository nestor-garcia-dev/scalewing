import { spacingScale, typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;
const glyphStep = 4;

/*
 * A warning description (`descriptionTone="warning"`): the description's
 * caption type in the warning colour (4.5:1 on the canvas in both schemes),
 * led by a space-4 alert glyph centred on its first line, so the hint reads
 * apart from a muted one without colour too. It never touches the control:
 * no invalid border, no ARIA state. In forced colours the words and the
 * glyph take CanvasText, apart from an error's Mark.
 */
export function cssFieldDescriptionClasses(): string {
  const glyphInset = (caption.lineHeight - spacingScale[glyphStep]) / 2;
  return `.sw-field-description-warning {
  align-items: flex-start;
  color: var(--sw-color-warning);
  display: flex;
  gap: var(--sw-space-1);
}

.sw-field-description-glyph {
  fill: none;
  flex: none;
  height: var(--sw-space-${glyphStep});
  margin-block: ${glyphInset}px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
  width: var(--sw-space-${glyphStep});
}

@media (forced-colors: active) {
  .sw-field-description-warning { color: CanvasText; }
}`;
}

export function fieldDescriptionClassCatalog(): string[] {
  return ['sw-field-description-warning', 'sw-field-description-glyph'];
}
