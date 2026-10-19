import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { openPdf } from './components/document-viewer/pdf-document.js';
import {
  canvasRatio,
  copyPdfBytes,
  hardenedPdfOptions,
  maxCanvasPixels,
} from './components/document-viewer/pdf-options.js';
import { scrollChainBy } from './components/document-viewer/scroll-chain.js';
import {
  anchorShift,
  clampZoom,
  zoomForKey,
} from './components/document-viewer/zoom.js';

const pdfjs = vi.hoisted(() => ({
  getDocument: vi.fn(),
  create: vi.fn(),
  textLayers: [] as { cancel: ReturnType<typeof vi.fn> }[],
}));

vi.mock('pdfjs-dist/legacy/build/pdf.mjs', () => ({
  getDocument: pdfjs.getDocument,
  PDFWorker: { create: pdfjs.create },
  TextLayer: class {
    cancel = vi.fn();
    constructor() {
      pdfjs.textLayers.push(this);
    }
    render() {
      return Promise.resolve();
    }
  },
}));

class FakeWorker {
  static made: FakeWorker[] = [];
  terminate = vi.fn();
  constructor(
    readonly url: string,
    readonly options: WorkerOptions,
  ) {
    FakeWorker.made.push(this);
  }
}

const pdfWorker = { destroy: vi.fn() };

function fakePage() {
  const viewport = (scale: number) => ({
    width: 612 * scale,
    height: 792 * scale,
    scale,
  });
  return {
    getViewport: ({ scale }: { scale: number }) => viewport(scale),
    render: vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() })),
    streamTextContent: vi.fn(),
  };
}

beforeEach(() => {
  FakeWorker.made = [];
  pdfjs.textLayers = [];
  vi.stubGlobal('Worker', FakeWorker);
  pdfjs.create.mockReturnValue(pdfWorker);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('openPdf', () => {
  it('opens a copy of the bytes, hardened, in a module worker from workerSrc', async () => {
    const page = fakePage();
    const destroy = vi.fn(() => Promise.resolve());
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve({ numPages: 3, getPage: () => page }),
      destroy,
    });
    const bytes = new Uint8Array([37, 80, 68, 70]);
    const opened = await openPdf(bytes, '/pdf.worker.js');
    expect(opened.pageCount).toBe(3);
    expect(FakeWorker.made[0]?.url).toBe('/pdf.worker.js');
    expect(FakeWorker.made[0]?.options).toEqual({ type: 'module' });
    expect(pdfjs.create).toHaveBeenCalledWith({
      port: FakeWorker.made[0],
      verbosity: 0,
    });
    const [options] = pdfjs.getDocument.mock.calls[0] as [
      Record<string, unknown>,
    ];
    expect(options).toMatchObject({
      isEvalSupported: false,
      useWorkerFetch: false,
      useWasm: false,
      enableXfa: false,
      disableRange: true,
      disableStream: true,
      disableAutoFetch: true,
      worker: pdfWorker,
    });
    // Nothing points PDF.js at files to fetch.
    for (const key of [
      'url',
      'cMapUrl',
      'standardFontDataUrl',
      'wasmUrl',
      'iccUrl',
      'docBaseUrl',
    ])
      expect(options[key]).toBeUndefined();
    expect(options.data).toEqual(bytes);
    expect(options.data).not.toBe(bytes);

    await opened.destroy();
    expect(destroy).toHaveBeenCalled();
    expect(pdfWorker.destroy).toHaveBeenCalled();
    expect(FakeWorker.made[0]?.terminate).toHaveBeenCalled();
  });

  it('ends the worker and rejects when the bytes do not open', async () => {
    const destroy = vi.fn(() => Promise.resolve());
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.reject(new Error('Invalid PDF structure.')),
      destroy,
    });
    await expect(openPdf(new Uint8Array([1]), '/w.js')).rejects.toThrow(
      'Invalid PDF structure.',
    );
    expect(destroy).toHaveBeenCalled();
    expect(FakeWorker.made[0]?.terminate).toHaveBeenCalled();
  });

  it('reports the open error and still ends the worker when closing fails too', async () => {
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.reject(new Error('Invalid PDF structure.')),
      destroy: () => Promise.reject(new Error('Worker was destroyed')),
    });
    await expect(openPdf(new Uint8Array([1]), '/w.js')).rejects.toThrow(
      'Invalid PDF structure.',
    );
    expect(pdfWorker.destroy).toHaveBeenCalled();
    expect(FakeWorker.made[0]?.terminate).toHaveBeenCalled();
  });

  it('ends the worker when an open document fails to close', async () => {
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve({ numPages: 1, getPage: vi.fn() }),
      destroy: () => Promise.reject(new Error('closing')),
    });
    const opened = await openPdf(new Uint8Array([1]), '/w.js');
    await expect(opened.destroy()).rejects.toThrow('closing');
    expect(FakeWorker.made[0]?.terminate).toHaveBeenCalled();
  });

  it('draws a page at the width asked for, at the screen’s ratio, with its text', async () => {
    const page = fakePage();
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve({ numPages: 1, getPage: () => page }),
      destroy: () => Promise.resolve(),
    });
    vi.stubGlobal('devicePixelRatio', 2);
    const opened = await openPdf(new Uint8Array([1]), '/w.js');
    const canvas = document.createElement('canvas');
    const text = document.createElement('div');
    text.append(document.createElement('span'));
    const size = await opened.renderPage({
      page: 1,
      width: 306,
      canvas,
      text,
      signal: new AbortController().signal,
    });
    expect(size).toEqual({ width: 306, height: 396 });
    expect(canvas.width).toBe(612);
    expect(canvas.height).toBe(792);
    expect(page.render).toHaveBeenCalledWith(
      expect.objectContaining({ canvas, transform: [2, 0, 0, 2, 0, 0] }),
    );
    expect(text.childElementCount).toBe(0);
    expect(text.style.getPropertyValue('--total-scale-factor')).toBe('0.5');
    expect(await opened.pageAspect(1)).toBeCloseTo(792 / 612);
  });

  it('cancels a draw and its text when the signal aborts', async () => {
    const page = fakePage();
    const cancel = vi.fn();
    page.render.mockReturnValue({ promise: Promise.resolve(), cancel });
    pdfjs.getDocument.mockReturnValue({
      promise: Promise.resolve({ numPages: 1, getPage: () => page }),
      destroy: () => Promise.resolve(),
    });
    const opened = await openPdf(new Uint8Array([1]), '/w.js');
    const abort = new AbortController();
    const drawing = opened.renderPage({
      page: 1,
      width: 100,
      canvas: document.createElement('canvas'),
      text: document.createElement('div'),
      signal: abort.signal,
    });
    await Promise.resolve();
    await Promise.resolve();
    abort.abort();
    await drawing;
    expect(cancel).toHaveBeenCalled();
    expect(pdfjs.textLayers[0]?.cancel).toHaveBeenCalled();
  });
});

describe('the viewer’s pure rules', () => {
  it('keeps the canvas under the pixel limit', () => {
    expect(canvasRatio(600, 800, 2)).toBe(2);
    expect(canvasRatio(600, 800, 0)).toBe(1);
    const ratio = canvasRatio(4000, 5000, 3);
    expect(4000 * 5000 * ratio * ratio).toBeLessThanOrEqual(
      maxCanvasPixels + 1,
    );
  });

  it('copies bytes from an ArrayBuffer and a Uint8Array', () => {
    const buffer = new Uint8Array([1, 2, 3]).buffer;
    const fromBuffer = copyPdfBytes(buffer);
    expect(Array.from(fromBuffer)).toEqual([1, 2, 3]);
    expect(fromBuffer.buffer).not.toBe(buffer);
    const view = new Uint8Array([4, 5]);
    expect(copyPdfBytes(view)).not.toBe(view);
    expect(hardenedPdfOptions.isEvalSupported).toBe(false);
  });

  it('zooms between fit width and four times, by keys, about a point', () => {
    expect(clampZoom(0.5)).toBe(1);
    expect(clampZoom(9)).toBe(4);
    expect(clampZoom(Number.NaN)).toBe(1);
    expect(clampZoom(1.333)).toBe(1.33);
    expect(zoomForKey('+', 1)).toBe(1.25);
    expect(zoomForKey('=', 3.9)).toBe(4);
    expect(zoomForKey('-', 1.5)).toBe(1.25);
    expect(zoomForKey('_', 1)).toBe(1);
    expect(zoomForKey('0', 3)).toBe(1);
    expect(zoomForKey('a', 2)).toBeNull();
  });

  it('keeps the spot of the page under the fingers, the stage padding counted', () => {
    // A 300-wide page set 24 px into its stage at the screen's left edge,
    // pinched at x 124 (100 px into the page) and y 224 (200 px down).
    const before = { left: 24, top: 24, width: 300, height: 400 };
    const after = { left: 24, top: 24, width: 600, height: 800 };
    expect(anchorShift(before, after, { x: 124, y: 224 })).toEqual({
      x: 100,
      y: 200,
    });
    // Back to fit width from a page scrolled 100 across, the spot a third
    // into the page: it is under the point again with no sideways scroll,
    // and the window scrolls back up by half its depth.
    expect(
      anchorShift(
        { left: -76, top: 24, width: 600, height: 800 },
        { left: 24, top: 24, width: 300, height: 400 },
        { x: 124, y: 224 },
      ),
    ).toEqual({ x: 0, y: -100 });
    expect(
      anchorShift({ left: 0, top: 0, width: 0, height: 0 }, after, {
        x: 1,
        y: 1,
      }),
    ).toEqual({ x: 0, y: 0 });
  });

  it('scrolls the stage first, then the boxes around it, as far as each goes', () => {
    const outer = document.createElement('div');
    const middle = document.createElement('div');
    const stage = document.createElement('div');
    outer.style.overflowY = 'auto';
    stage.style.overflowX = 'auto';
    middle.append(stage);
    outer.append(middle);
    document.body.append(outer);
    const room = (
      element: HTMLElement,
      key: 'scrollLeft' | 'scrollTop',
      most: number,
    ) => {
      let value = 0;
      Object.defineProperty(element, key, {
        configurable: true,
        get: () => value,
        set: (next: number) => {
          value = Math.min(most, Math.max(0, next));
        },
      });
    };
    room(stage, 'scrollLeft', 40);
    room(stage, 'scrollTop', 0);
    room(middle, 'scrollTop', 500);
    room(outer, 'scrollTop', 30);
    scrollChainBy(stage, 'x', 60);
    expect(stage.scrollLeft).toBe(40);
    scrollChainBy(stage, 'y', 50);
    // The middle box does not scroll (its overflow is visible); the stage
    // has no room down, so the outer box takes what it can.
    expect(middle.scrollTop).toBe(0);
    expect(outer.scrollTop).toBe(30);
    scrollChainBy(stage, 'y', 0.2);
    expect(outer.scrollTop).toBe(30);
    outer.remove();
  });
});
