import { copyPdfBytes, hardenedPdfOptions } from './pdf-options.js';
import { type PdfPageSize, renderPdfPage } from './render-pdf-page.js';

export type { PdfPageSize };

/** An open PDF, as DocumentViewer uses it. */
export type PdfDocument = {
  pageCount: number;
  /**
   * Draws page `page` (from 1) `width` CSS pixels wide into `canvas`, and
   * its text into `text` (transparent, for reading and selecting), and
   * resolves with its size. `signal` cancels it.
   */
  renderPage: (options: {
    page: number;
    width: number;
    canvas: HTMLCanvasElement;
    text: HTMLElement;
    signal: AbortSignal;
  }) => Promise<PdfPageSize>;
  /** The aspect (height over width) of page `page`, without drawing it. */
  pageAspect: (page: number) => Promise<number>;
  destroy: () => Promise<void>;
};

/** Whether an error is PDF.js reporting a cancelled render or text layer. */
export function isCancelled(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'RenderingCancelledException' ||
      error.name === 'AbortException')
  );
}

/**
 * Opens a PDF from its bytes with PDF.js's legacy build (the modern one
 * needs browsers newer than the ones stores run, such as for
 * `Map.prototype.getOrInsertComputed`), loaded on first use (so a page
 * without a viewer never downloads it), in a module worker started from
 * `workerSrc` and ended with the document. Rejects when the bytes are not
 * a PDF PDF.js can open.
 */
export async function openPdf(
  data: ArrayBuffer | Uint8Array,
  workerSrc: string,
): Promise<PdfDocument> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const port = new Worker(workerSrc, { type: 'module' });
  const worker = pdfjs.PDFWorker.create({
    port,
    verbosity: hardenedPdfOptions.verbosity,
  });
  const task = pdfjs.getDocument({
    ...hardenedPdfOptions,
    data: copyPdfBytes(data),
    worker,
  });
  // The worker always ends, even when PDF.js fails to close the document.
  async function destroy() {
    try {
      await task.destroy();
    } finally {
      worker.destroy();
      port.terminate();
    }
  }
  let document;
  try {
    document = await task.promise;
  } catch (error) {
    // The open error is the one reported, never a failure to close.
    await destroy().catch(() => undefined);
    throw error;
  }
  const loaded = document;

  return {
    pageCount: loaded.numPages,
    destroy,
    async pageAspect(page) {
      const { width, height } = (await loaded.getPage(page)).getViewport({
        scale: 1,
      });
      return height / width;
    },
    async renderPage({ page, ...target }) {
      return renderPdfPage({
        page: await loaded.getPage(page),
        ...target,
        createTextLayer: (options) => new pdfjs.TextLayer(options),
      });
    },
  };
}
