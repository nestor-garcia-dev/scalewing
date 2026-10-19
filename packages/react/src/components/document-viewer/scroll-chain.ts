const scrolling = /^(auto|scroll|overlay)$/;

function scrolls(element: Element, axis: 'x' | 'y'): boolean {
  if (element === element.ownerDocument.scrollingElement) return true;
  const style = getComputedStyle(element);
  return scrolling.test(axis === 'x' ? style.overflowX : style.overflowY);
}

/**
 * Scrolls by `amount` pixels along one axis as a finger would: the
 * element first, then each box around it that scrolls, up to the
 * document, each taking what it can until the amount is spent.
 */
export function scrollChainBy(
  start: Element,
  axis: 'x' | 'y',
  amount: number,
): void {
  let left = amount;
  for (
    let element: Element | null = start;
    element && Math.abs(left) >= 0.5;
    element = element.parentElement
  ) {
    if (!scrolls(element, axis)) continue;
    const key = axis === 'x' ? 'scrollLeft' : 'scrollTop';
    const was = element[key];
    element[key] = was + left;
    left -= element[key] - was;
  }
}
