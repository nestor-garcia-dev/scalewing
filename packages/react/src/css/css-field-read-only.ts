/*
 * A read-only Field: a value shown, not typed. The control keeps its size
 * and padding but drops the edge for the subtle fill, in the text colour
 * with a plain cursor, so it reads apart from an editable field (an edge
 * on the glass fill) and a disabled one (a dashed edge). Focus keeps the
 * canvas ring. Forced colours drop the fill, so the edge stays, dotted, in
 * CanvasText.
 */
export function cssFieldReadOnlyClasses(): string {
  return `[data-theme] .sw-field-read-only > :is(input, textarea) {
  background-color: var(--sw-color-subtle);
  border-color: transparent;
  color: var(--sw-color-text);
  cursor: default;
}

@media (forced-colors: active) {
  [data-theme] .sw-field-read-only > :is(input, textarea) {
    border-color: CanvasText;
    border-style: dotted;
  }
}`;
}

export function fieldReadOnlyClassCatalog(): string[] {
  return ['sw-field-read-only'];
}
