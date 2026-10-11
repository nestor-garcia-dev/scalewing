import { trackInset, typographyVariants } from '@scalewing/tokens';

import { quietFill } from './quiet-fill.js';

const label = typographyVariants.label;

export const segmentedRaisedClass = 'sw-segmented-raised';

const raised = `.sw-segmented.${segmentedRaisedClass}`;

/*
 * The raised track: the quiet grey fill (no border) with corners one track
 * inset rounder than the segments' small radius, so the two curves stay
 * concentric, sized to its segments even in a Stack (unlike compact).
 * Every segment is the md control height in label type with its words in
 * the text color at medium weight; with marks, a segment pads a step less
 * before its mark. The selected one is the surface raised by the small
 * elevation, its words at label weight. In the dark scheme a shadow does
 * not show and the surface is about the track's grey, so the selected
 * segment draws a hairline ring in the muted color instead (3:1 or more
 * against the track in every dark palette, on the canvas or a card). Two classes,
 * so these win over the compact track's rules and the reduced-transparency
 * surface; the track's transparent border would also win over the error
 * outline (`.sw-segmented[aria-invalid='true']`, the same specificity,
 * earlier), so the danger border, and Mark in forced colors, is restated
 * last. Forced colors outline the track and the selected segment.
 */
export function cssSegmentedRaisedClasses(): string {
  return `${raised} {
  background: ${quietFill};
  border-color: transparent;
  border-radius: calc(var(--sw-radius-sm) + ${trackInset}px);
}

/* Sized to its segments even where the field is stretched (a Stack). */
.sw-segmented-field > ${raised} {
  align-self: flex-start;
}

${raised} .sw-segmented-item {
  border-radius: var(--sw-radius-sm);
  color: var(--sw-color-text);
  font-size: ${label.fontSize}px;
  font-weight: 500;
  letter-spacing: ${label.letterSpacing}px;
  line-height: ${label.lineHeight}px;
  min-height: var(--sw-control-md-min-height);
  padding-inline: var(--sw-space-4);
}

${raised}.sw-segmented-with-icons .sw-segmented-item {
  padding-inline: var(--sw-space-2) var(--sw-space-3);
}

${raised} .sw-segmented-item-selected {
  background: var(--sw-color-surface);
  box-shadow: var(--sw-elevation-sm);
  font-weight: ${label.fontWeight};
}

[data-theme='dark'] ${raised} .sw-segmented-item-selected {
  box-shadow: inset 0 0 0 1px var(--sw-color-muted);
}

${raised}[aria-invalid='true'] {
  border-color: var(--sw-color-danger);
}

@media (forced-colors: active) {
  ${raised} { border-color: CanvasText; }
  ${raised} .sw-segmented-item-selected { outline: 2px solid Highlight; }
  ${raised}[aria-invalid='true'] { border-color: Mark; }
}`;
}

export function segmentedRaisedClassCatalog(): string[] {
  return [segmentedRaisedClass];
}
