import { typographyVariants } from '@scalewing/tokens';

const label = typographyVariants.label;
const caption = typographyVariants.caption;

/* A row's padding, shared by the row rules and a bounded list's height. */
export const listRowPadBlock = 'var(--sw-space-3)';

/*
 * The row a bounded list counts (`maxHeight: { rows }`): a title and one
 * detail line inside the row's padding, 62 px. A taller row shows fewer
 * at a time and a shorter one more. It is taller than an `lg` row's
 * 56 px floor, so the count is the same at either size. A sum, for a
 * caller to add its hairlines to inside its own parentheses.
 */
export const listCountedRowHeight = `2 * ${listRowPadBlock} + ${label.lineHeight}px + ${caption.lineHeight}px`;

/*
 * An `lg` row's floor, 56 px (space-8 and space-2) on every pointer: a
 * larger press target than the 44 px coarse-pointer one.
 */
export const listRowLargeMinHeight =
  'calc(var(--sw-space-8) + var(--sw-space-2))';
