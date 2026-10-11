import { typographyVariants } from '@scalewing/tokens';

const caption = typographyVariants.caption;

/** An enabled entry count, unless its Stepper shows an error (whose danger border wins). */
const tonedEntryInput =
  '[data-theme] .sw-denomination-cell-toned .sw-stepper:not(.sw-stepper-invalid) input.sw-stepper-input:not(:disabled)';

/*
 * Count entry and the labels around it. An entry cell holds a full-width
 * Stepper; its count keeps spacing step 8 (room for three digits), so a narrow strip scrolls
 * in its region instead of crushing the counts. A cell tone draws the
 * count's border in the tone, a hairline thicker through an inset shadow so
 * nothing moves. A caption is a muted caption-size line: under a row label,
 * or after a column label. A quiet row sits on the subtle fill, its pinned
 * label too. A disabled row fades its label, counts and total (its entry is
 * disabled by its Stepper); a pinned label fades its contents, not its
 * fill, so counts never show through it.
 */
export function cssDenominationEntryClasses(): string {
  return `.sw-denomination-strip td.sw-denomination-entry {
  padding: var(--sw-space-1);
}

.sw-denomination-entry .sw-stepper-full .sw-stepper-track {
  grid-template-columns: var(--sw-space-6) minmax(var(--sw-space-8), 1fr) var(--sw-space-6);
}

/* A strip with entry rows centres its heads and read-only counts over the steppers. */
.sw-denomination-strip-entry .sw-denomination-head:not(.sw-denomination-total-head),
.sw-denomination-strip-entry .sw-denomination-cell {
  text-align: center;
}

${tonedEntryInput} {
  border-color: var(--sw-denomination-cell-tone);
  box-shadow: inset 0 0 0 1px var(--sw-denomination-cell-tone);
}

.sw-denomination-label-words {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sw-denomination-label-caption,
.sw-denomination-head-caption {
  color: var(--sw-color-muted);
  font-size: ${caption.fontSize}px;
  font-weight: ${caption.fontWeight};
  letter-spacing: ${caption.letterSpacing}px;
  line-height: ${caption.lineHeight}px;
}

.sw-denomination-row-quiet,
.sw-denomination-strip .sw-denomination-row-quiet .sw-denomination-label {
  background: var(--sw-color-subtle);
}

.sw-denomination-strip .sw-denomination-row-disabled .sw-denomination-label-body,
.sw-denomination-strip .sw-denomination-row-disabled .sw-denomination-cell,
.sw-denomination-strip .sw-denomination-row-disabled .sw-denomination-total {
  opacity: var(--sw-disabled-opacity);
}

@media (forced-colors: active) {
  ${tonedEntryInput} { border-color: Highlight; box-shadow: inset 0 0 0 1px Highlight; }
  .sw-denomination-label-caption,
  .sw-denomination-head-caption { color: CanvasText; }
}`;
}

export function denominationEntryClassCatalog(): string[] {
  return [
    'sw-denomination-entry',
    'sw-denomination-strip-entry',
    'sw-denomination-label-words',
    'sw-denomination-label-caption',
    'sw-denomination-head-caption',
    'sw-denomination-row-quiet',
    'sw-denomination-row-disabled',
  ];
}
