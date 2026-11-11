import { type DisplayFace, displayFaceFamilies } from '@scalewing/tokens';

/**
 * The face a page's titles take: `system` (default) keeps the body face;
 * `condensed` sets `hero`, `display`, `headline` and `heading` text in the
 * tokens' condensed face, which the consumer loads.
 */
export const displayFaces = Object.keys(displayFaceFamilies) as DisplayFace[];

export type { DisplayFace };

export function assertDisplayFace(face: unknown): asserts face is DisplayFace {
  if (!(displayFaces as readonly unknown[]).includes(face))
    throw new RangeError(`Unknown display face: ${String(face)}`);
}

/** The Text variants a display face reaches: a page's titles, never its body. */
export const displayFaceVariants = [
  'hero',
  'display',
  'headline',
  'heading',
] as const;

/*
 * `data-display-face` on the themed node (or any node above the titles)
 * switches the titles' family. A condensed face is already narrow, so it
 * drops the system face's negative tracking. Two classes outrank a variant's
 * one, so the compact sizes below `md` keep their size and lose only the
 * tracking.
 */
export function cssDisplayFaceRules(): string {
  const titles = displayFaceVariants
    .map((variant) => `.sw-text-${variant}`)
    .join(', ');
  return `[data-display-face='condensed'] :is(${titles}) {
  font-family: ${displayFaceFamilies.condensed};
  letter-spacing: 0;
}`;
}
