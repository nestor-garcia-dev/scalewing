/** One row of a chart's hidden table: what it is, and each column's words. */
export type ChartTableRow = {
  key: string;
  header: string;
  cells: readonly string[];
  /** Marks the boxed current period. */
  current?: boolean;
};
