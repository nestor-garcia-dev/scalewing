import { type WheelItem } from './components/Wheel.js';

/** A consumer bug, not a runtime state: the value must name one of the items. */
export function assertWheelFieldValue(
  items: readonly WheelItem[],
  value: string,
): void {
  if (value !== '' && !items.some((item) => item.id === value)) {
    throw new Error(
      `WheelField value "${value}" is not the id of one of its items.`,
    );
  }
}

/** The item the wheel rests on: the selection, else the first item. */
export function restingWheelItem(
  items: readonly WheelItem[],
  value: string,
): WheelItem | undefined {
  return items.find((item) => item.id === value) ?? items[0];
}
