'use client';

import { type RefObject, useEffect, useState } from 'react';

import { isCancelled, type PdfDocument } from './pdf-document.js';

export type PageRenderState = 'drawing' | 'drawn' | 'failed';

type Outcome = {
  document: PdfDocument;
  page: number;
  width: number;
  state: 'drawn' | 'failed';
  aspect: number | null;
};

/**
 * Draws the shown page at `width` CSS pixels into the canvas and text
 * layer, again whenever the page or the width changes, cancelling a draw
 * that is no longer wanted. The page is visible while it draws, so it
 * appears as PDF.js paints it. `aspect` is its height over its width, for
 * the page's box, known before its first draw ends.
 */
export function usePageRender({
  document,
  page,
  width,
  canvas,
  text,
  onError,
}: {
  document: PdfDocument | null;
  page: number;
  width: number;
  canvas: RefObject<HTMLCanvasElement | null>;
  text: RefObject<HTMLDivElement | null>;
  onError: (error: unknown) => void;
}): { state: PageRenderState; aspect: number | null } {
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [shape, setShape] = useState<{
    document: PdfDocument;
    page: number;
    aspect: number;
  } | null>(null);

  useEffect(() => {
    if (!document || !canvas.current || !text.current || width <= 0) return;
    const abort = new AbortController();
    document
      .renderPage({
        page,
        width,
        canvas: canvas.current,
        text: text.current,
        signal: abort.signal,
      })
      .then(
        (size) => {
          if (abort.signal.aborted) return;
          setOutcome({
            document,
            page,
            width,
            state: 'drawn',
            aspect: size.height / size.width,
          });
        },
        (error: unknown) => {
          if (abort.signal.aborted || isCancelled(error)) return;
          setOutcome({ document, page, width, state: 'failed', aspect: null });
          onError(error);
        },
      );
    return () => abort.abort();
  }, [document, page, width, canvas, text, onError]);

  // The box takes the page's shape as soon as it is known.
  useEffect(() => {
    if (!document) return;
    let live = true;
    document.pageAspect(page).then(
      (aspect) => {
        if (live) setShape({ document, page, aspect });
      },
      () => undefined,
    );
    return () => {
      live = false;
    };
  }, [document, page]);

  const current =
    outcome &&
    outcome.document === document &&
    outcome.page === page &&
    outcome.width === width
      ? outcome
      : null;
  const known =
    shape && shape.document === document && shape.page === page
      ? shape.aspect
      : null;
  return {
    state: current?.state ?? 'drawing',
    aspect: known ?? current?.aspect ?? null,
  };
}
