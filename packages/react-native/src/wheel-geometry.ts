/** Rows visible in a wheel column; the selected row sits in the middle. */
export const wheelVisibleRows = 5;

/** Rows above and below the selection band so every item can centre. */
export function wheelEdgeRows(): number {
  return (wheelVisibleRows - 1) / 2;
}

/** The scroll offset that centres the item at `index`. */
export function wheelOffsetForIndex(index: number, rowHeight: number): number {
  return index * rowHeight;
}

/** The item a settled scroll offset lands on, clamped to the list. */
export function wheelIndexForOffset(
  offset: number,
  rowHeight: number,
  count: number,
): number {
  if (count === 0 || rowHeight <= 0) return 0;
  const index = Math.round(offset / rowHeight);
  return Math.min(Math.max(index, 0), count - 1);
}

/** A drag that ends with no momentum settles where it stopped. */
export function wheelDragSettles(velocity: number | undefined): boolean {
  return velocity === undefined || Math.abs(velocity) < 0.1;
}
