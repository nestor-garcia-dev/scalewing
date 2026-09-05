import { spacingScale, splitScale } from '@scalewing/tokens';

export type SplitMetrics = {
  min: number;
  max: number;
  step: number;
};

export type SplitSnapshot = {
  collapsed: boolean;
  width: number;
};

export function cssLengthToPx(value: string, remPx = 16): number {
  const trimmed = value.trim();
  if (trimmed.endsWith('rem')) {
    const count = Number.parseFloat(trimmed);
    return Number.isFinite(count) ? count * remPx : 0;
  }
  if (trimmed.endsWith('px')) {
    const count = Number.parseFloat(trimmed);
    return Number.isFinite(count) ? count : 0;
  }
  const count = Number.parseFloat(trimmed);
  return Number.isFinite(count) ? count : 0;
}

export function readSplitMetrics(
  read: (name: string) => string,
  remPx = 16,
): SplitMetrics & { defaultWidth: number } {
  return {
    min: cssLengthToPx(read('--sw-split-min') || `${splitScale.min}rem`, remPx),
    max: cssLengthToPx(read('--sw-split-max') || `${splitScale.max}rem`, remPx),
    step: cssLengthToPx(read('--sw-space-4') || `${spacingScale[4]}px`, remPx),
    defaultWidth: cssLengthToPx(
      read('--sw-split-size') || `${splitScale.size}rem`,
      remPx,
    ),
  };
}

export function clampSplitSize(size: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, size));
}

export function splitPercent(width: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }
  return Math.round(
    ((clampSplitSize(width, min, max) - min) / (max - min)) * 100,
  );
}

export function effectiveSplitMax(
  tokenMax: number,
  parentWidth: number,
  handleWidth: number,
  min: number,
): number {
  if (parentWidth <= 0) {
    return tokenMax;
  }
  const room = parentWidth - handleWidth - min;
  if (room < min) {
    return min;
  }
  return Math.min(tokenMax, room);
}

export function applySplitDrag(
  start: SplitSnapshot,
  deltaX: number,
  metrics: SplitMetrics,
): SplitSnapshot {
  if (start.collapsed) {
    if (deltaX <= 0) {
      return start;
    }
    return {
      collapsed: false,
      width: clampSplitSize(metrics.min + deltaX, metrics.min, metrics.max),
    };
  }
  const proposed = start.width + deltaX;
  if (proposed < metrics.min) {
    return { collapsed: true, width: start.width };
  }
  return {
    collapsed: false,
    width: clampSplitSize(proposed, metrics.min, metrics.max),
  };
}

export function applySplitKey(
  key: string,
  start: SplitSnapshot,
  metrics: SplitMetrics,
): SplitSnapshot | null {
  if (key === 'Enter' || key === ' ') {
    return { collapsed: !start.collapsed, width: start.width };
  }
  if (start.collapsed) {
    if (key === 'ArrowRight') {
      return { collapsed: false, width: start.width };
    }
    if (key === 'End') {
      return { collapsed: false, width: metrics.max };
    }
    return null;
  }
  if (key === 'Home') {
    return { collapsed: false, width: metrics.min };
  }
  if (key === 'End') {
    return { collapsed: false, width: metrics.max };
  }
  if (key === 'ArrowRight') {
    return {
      collapsed: false,
      width: clampSplitSize(
        start.width + metrics.step,
        metrics.min,
        metrics.max,
      ),
    };
  }
  if (key === 'ArrowLeft') {
    const next = start.width - metrics.step;
    if (next < metrics.min) {
      return { collapsed: true, width: start.width };
    }
    return { collapsed: false, width: next };
  }
  return null;
}
