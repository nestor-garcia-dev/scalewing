/** iOS accessibility text sizes start near this font scale. */
export const accessibilityTextScale = 1.35;

/**
 * Whether text is at an accessibility size, where side-by-side layouts
 * leave each column too narrow and should stack or drop to a plain list.
 */
export function isAccessibilityTextScale(fontScale: number): boolean {
  return fontScale >= accessibilityTextScale;
}
