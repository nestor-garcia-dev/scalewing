export type TravelBox = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type TravelTranslate = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

function centerOffset(
  box: TravelBox,
  toast: TravelBox,
): { x: number; y: number } {
  return {
    x: box.left + box.width / 2 - toast.width / 2,
    y: box.top + box.height / 2 - toast.height / 2,
  };
}

export function travelTranslate(
  origin: TravelBox,
  destination: TravelBox,
  toast: TravelBox,
): TravelTranslate {
  const from = centerOffset(origin, toast);
  const to = centerOffset(destination, toast);
  return {
    fromX: from.x,
    fromY: from.y,
    toX: to.x,
    toY: to.y,
  };
}

export function applyTravelVars(
  node: HTMLElement,
  travel: TravelTranslate,
): void {
  node.style.setProperty('--sw-toast-from-x', `${travel.fromX}px`);
  node.style.setProperty('--sw-toast-from-y', `${travel.fromY}px`);
  node.style.setProperty('--sw-toast-to-x', `${travel.toX}px`);
  node.style.setProperty('--sw-toast-to-y', `${travel.toY}px`);
}

export function clearTravelVars(node: HTMLElement): void {
  node.style.removeProperty('--sw-toast-from-x');
  node.style.removeProperty('--sw-toast-from-y');
  node.style.removeProperty('--sw-toast-to-x');
  node.style.removeProperty('--sw-toast-to-y');
}

export function cssDurationMs(value: string): number {
  const first = value.split(',')[0]?.trim() ?? '';
  if (!first) {
    return 0;
  }
  const amount = Number.parseFloat(first);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }
  if (first.endsWith('ms')) {
    return amount;
  }
  return amount * 1000;
}
