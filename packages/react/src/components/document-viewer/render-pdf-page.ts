import { type PDFPageProxy, type TextLayer } from 'pdfjs-dist';

import { canvasRatio } from './pdf-options.js';

/** A page drawn: its CSS size at the width asked for. */
export type PdfPageSize = { width: number; height: number };

/**
 * Draws one page `width` CSS pixels wide into `canvas`, at the screen's
 * pixel ratio (capped), and its text into `text` (PDF.js's transparent
 * text layer, at the scale the generated rules read). `signal` cancels
 * both.
 */
export async function renderPdfPage({
  page,
  width,
  canvas,
  text,
  signal,
  createTextLayer,
}: {
  page: PDFPageProxy;
  width: number;
  canvas: HTMLCanvasElement;
  text: HTMLElement;
  signal: AbortSignal;
  createTextLayer: (
    options: ConstructorParameters<typeof TextLayer>[0],
  ) => TextLayer;
}): Promise<PdfPageSize> {
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: width / base.width });
  const ratio = canvasRatio(
    viewport.width,
    viewport.height,
    window.devicePixelRatio,
  );
  canvas.width = Math.floor(viewport.width * ratio);
  canvas.height = Math.floor(viewport.height * ratio);
  const render = page.render({
    canvas,
    viewport,
    transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
  });
  text.replaceChildren();
  text.style.setProperty('--total-scale-factor', String(viewport.scale));
  const layer = createTextLayer({
    textContentSource: page.streamTextContent(),
    container: text,
    viewport,
  });
  const cancel = () => {
    render.cancel();
    layer.cancel();
  };
  signal.addEventListener('abort', cancel, { once: true });
  try {
    await Promise.all([render.promise, layer.render()]);
  } finally {
    signal.removeEventListener('abort', cancel);
  }
  return { width: viewport.width, height: viewport.height };
}
