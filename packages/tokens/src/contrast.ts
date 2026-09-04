const HEX = /^#([\da-f]{3}|[\da-f]{6})$/i;

export function parseHexColor(hex: string): readonly [number, number, number] {
  const match = HEX.exec(hex.trim());

  if (!match) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const value = match[1] ?? '';

  if (value.length === 3) {
    const [r, g, b] = value.split('');
    return [
      Number.parseInt(`${r}${r}`, 16),
      Number.parseInt(`${g}${g}`, 16),
      Number.parseInt(`${b}${b}`, 16),
    ];
  }

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function channelLuminance(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [red, green, blue] = parseHexColor(hex);
  return (
    0.2126 * channelLuminance(red) +
    0.7152 * channelLuminance(green) +
    0.0722 * channelLuminance(blue)
  );
}

export function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

export function isHexColor(value: string): boolean {
  return HEX.test(value.trim());
}
