export function barChartScaleMax(
  values: readonly number[],
  explicitMax?: number,
): number {
  if (explicitMax !== undefined) {
    return explicitMax > 0 ? explicitMax : 1;
  }

  let peak = 0;
  for (const value of values) {
    const magnitude = Math.abs(value);
    if (magnitude > peak) {
      peak = magnitude;
    }
  }

  return peak === 0 ? 1 : peak;
}

export function barChartFillRatio(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }

  const ratio = Math.abs(value) / max;
  if (ratio > 1) {
    return 1;
  }

  return ratio;
}

export function formatBarChartValue(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) {
    return '0';
  }

  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
