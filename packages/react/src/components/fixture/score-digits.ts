/** The most digits a score box holds. */
export const scoreBoxMaxDigits = 2;

/**
 * What a score box keeps of typed or pasted text: its digits only, the
 * first two ("1a2" → "12", "３" stays out as it is not an ASCII digit).
 */
export function scoreDigits(typed: string): string {
  return typed.replace(/[^0-9]/g, '').slice(0, scoreBoxMaxDigits);
}
