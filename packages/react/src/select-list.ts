export type SelectOption = {
  value: string;
  label: string;
};

export function selectedSelectIndex(
  options: readonly SelectOption[],
  value: string,
): number {
  const index = options.findIndex((option) => option.value === value);
  return index < 0 ? 0 : index;
}

export function nextSelectIndex(
  current: number,
  delta: number,
  length: number,
): number {
  if (length <= 0) {
    return 0;
  }

  return Math.min(length - 1, Math.max(0, current + delta));
}

export function selectIndexForKey(
  key: string,
  current: number,
  length: number,
): number | null {
  switch (key) {
    case 'ArrowDown':
      return nextSelectIndex(current, 1, length);
    case 'ArrowUp':
      return nextSelectIndex(current, -1, length);
    case 'Home':
      return 0;
    case 'End':
      return Math.max(0, length - 1);
    default:
      return null;
  }
}
