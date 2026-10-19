'use client';

import { type RefObject, useEffect, useRef } from 'react';

import { clampZoom } from './zoom.js';

type Pinch = { distance: number; zoom: number };

function spread(touches: TouchList): {
  distance: number;
  x: number;
  y: number;
} {
  const [a, b] = [touches[0]!, touches[1]!];
  return {
    distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  };
}

/**
 * Two fingers on the page zoom it, between fit width and four times as
 * wide, about the point between them. The page's box allows
 * only panning (`touch-action: pan-x pan-y`), so the browser does not zoom
 * the whole screen instead; a two-finger move is taken from the browser
 * (a non-passive listener), one finger still scrolls.
 */
export function usePinchZoom(
  box: RefObject<HTMLElement | null>,
  zoom: number,
  zoomTo: (zoom: number, at: { x: number; y: number }) => void,
): void {
  const current = useRef(zoom);
  const pinch = useRef<Pinch | null>(null);
  const setter = useRef(zoomTo);
  useEffect(() => {
    current.current = zoom;
    setter.current = zoomTo;
  });

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    function start(event: TouchEvent) {
      if (event.touches.length !== 2) return;
      pinch.current = {
        distance: spread(event.touches).distance,
        zoom: current.current,
      };
    }
    function move(event: TouchEvent) {
      const begun = pinch.current;
      if (!begun || event.touches.length !== 2 || !element) return;
      event.preventDefault();
      const now = spread(event.touches);
      if (begun.distance <= 0) return;
      const next = clampZoom((begun.zoom * now.distance) / begun.distance);
      if (next === current.current) return;
      setter.current(next, { x: now.x, y: now.y });
    }
    function end(event: TouchEvent) {
      if (event.touches.length < 2) pinch.current = null;
    }
    element.addEventListener('touchstart', start, { passive: true });
    element.addEventListener('touchmove', move, { passive: false });
    element.addEventListener('touchend', end);
    element.addEventListener('touchcancel', end);
    return () => {
      element.removeEventListener('touchstart', start);
      element.removeEventListener('touchmove', move);
      element.removeEventListener('touchend', end);
      element.removeEventListener('touchcancel', end);
    };
  }, [box]);
}
