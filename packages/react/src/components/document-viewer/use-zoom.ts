'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { scrollChainBy } from './scroll-chain.js';
import { anchorShift, clampZoom, minZoom, type ScreenBox } from './zoom.js';

type Anchor = { point: { x: number; y: number }; before: ScreenBox };
type Keyed = { key: string; zoom: number };

/** The middle of the part of `element` inside the window, in client pixels. */
function visibleMiddle(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  const view = element.ownerDocument.documentElement;
  const top = Math.max(rect.top, 0);
  const bottom = Math.min(rect.bottom, view.clientHeight || rect.bottom);
  return {
    x: rect.left + rect.width / 2,
    y: bottom > top ? (top + bottom) / 2 : rect.top + rect.height / 2,
  };
}

/** How long a zoom rests before the page is drawn again at its size. */
export const zoomSettleMs = 150;

/**
 * The page's zoom (1 is fit width) and the scrolling box it is shown in.
 * `zoomTo` changes it about a point on the screen (`at`, in client
 * pixels; the middle of the box's visible part when left out) so the spot
 * of the page under it stays put: once the bigger or smaller page is laid
 * out, the box scrolls across and the boxes around it (the window at
 * last) scroll down by what keeps that spot in place. `drawnZoom`
 * follows `zoom` once it rests, so a pinch stretches the drawn page and
 * only its end draws it again. Another `resetKey` (another page) is fit
 * width again.
 */
export function useZoom(resetKey: string) {
  const box = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [keyed, setKeyed] = useState<Keyed>({ key: resetKey, zoom: minZoom });
  const [drawn, setDrawn] = useState<Keyed>({ key: resetKey, zoom: minZoom });
  const zoom = keyed.key === resetKey ? keyed.zoom : minZoom;
  const drawnZoom = drawn.key === resetKey ? drawn.zoom : minZoom;
  const anchor = useRef<Anchor | null>(null);
  const shown = useRef(zoom);

  useLayoutEffect(() => {
    const from = shown.current;
    shown.current = zoom;
    const element = box.current;
    const sheet = page.current;
    const spot = anchor.current;
    anchor.current = null;
    if (!element || !sheet || !spot || from === zoom) return;
    const shift = anchorShift(
      spot.before,
      sheet.getBoundingClientRect(),
      spot.point,
    );
    scrollChainBy(element, 'x', shift.x);
    scrollChainBy(element, 'y', shift.y);
  }, [zoom]);

  useEffect(() => {
    const timer = setTimeout(
      () => setDrawn({ key: resetKey, zoom }),
      zoomSettleMs,
    );
    return () => clearTimeout(timer);
  }, [resetKey, zoom]);

  function zoomTo(next: number, at?: { x: number; y: number }) {
    const element = box.current;
    const sheet = page.current;
    const target = clampZoom(next);
    if (target === shown.current) return;
    if (element && sheet) {
      anchor.current = {
        point: at ?? visibleMiddle(element),
        before: sheet.getBoundingClientRect(),
      };
    }
    setKeyed({ key: resetKey, zoom: target });
  }

  return { box, page, zoom, drawnZoom, zoomTo };
}
