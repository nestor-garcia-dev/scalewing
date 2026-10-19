import { type CSSProperties } from 'react';

/** A US Letter page's height over its width, the box's shape until known. */
export const letterAspect = 11 / 8.5;

/**
 * The page box's size, read by the generated `sw-document-viewer-page`
 * rule: its width in CSS pixels and its height over its width.
 */
export function pageBoxStyle(
  width: number,
  aspect: number | null,
): CSSProperties {
  return {
    '--sw-document-page-width': `${Math.max(0, Math.round(width))}px`,
    '--sw-document-page-aspect': String(aspect ?? letterAspect),
  } as CSSProperties;
}
