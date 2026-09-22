export type DenominationCellState = 'zero' | 'positive' | 'negative';

export type DenominationCellView = {
  state: DenominationCellState;
  text: string;
};

/**
 * Classifies one count for display. A null or zero count renders the zero
 * label; a signed row prefixes positive counts with "+" so movement reads as
 * a delta. Formatting stays plain digits: the consumer owns locale grouping.
 */
export function denominationCellView(
  count: number | null,
  signed: boolean,
  zeroLabel: string,
): DenominationCellView {
  if (count === null || count === 0) return { state: 'zero', text: zeroLabel };
  if (count < 0) return { state: 'negative', text: String(count) };
  return { state: 'positive', text: signed ? `+${count}` : String(count) };
}

export function isDenominationCount(count: number | null): boolean {
  return count === null || Number.isInteger(count);
}
