import { parseHexColor } from './contrast.js';

/** One colour channel moved `amount` (0 to 1) of the way toward another. */
export function mixChannel(from: number, to: number, amount: number): number {
  return Math.round(from + (to - from) * amount);
}

function hexChannel(value: number): string {
  return value.toString(16).padStart(2, '0').toUpperCase();
}

/**
 * A solid colour `amount` (0 to 1) of the way from `from` to `to`, as
 * six-digit hex, so it stays a valid semantic colour and a contrast input.
 */
export function mixHexColors(from: string, to: string, amount: number): string {
  const start = parseHexColor(from);
  const end = parseHexColor(to);
  return `#${start
    .map((channel, index) =>
      hexChannel(mixChannel(channel, end[index] ?? channel, amount)),
    )
    .join('')}`;
}
