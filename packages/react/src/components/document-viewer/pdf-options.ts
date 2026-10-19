/**
 * The options every document opens with: nothing is fetched beyond the
 * bytes given, no font, character map, colour profile or WebAssembly file
 * (PDF.js falls back to system fonts and skips what it cannot decode), no
 * XFA forms, no streaming or range requests, and no code evaluation.
 *
 * `isEvalSupported` is absent from PDF.js 6.4.299, whose bundles hold no
 * `eval` or `new Function`; it stays here, set to `false`, so the
 * hardening reads the same as the Teisoro API's and survives a downgrade.
 */
export const hardenedPdfOptions = {
  isEvalSupported: false,
  useWorkerFetch: false,
  useWasm: false,
  useSystemFonts: true,
  disableFontFace: false,
  enableXfa: false,
  disableRange: true,
  disableStream: true,
  disableAutoFetch: true,
  stopAtErrors: false,
  verbosity: 0,
} as const;

/** The largest canvas drawn, in device pixels: within every browser's limit. */
export const maxCanvasPixels = 16_000_000;

/**
 * The device-pixel ratio a page of `width` by `height` CSS pixels is drawn
 * at: the screen's, lowered so the canvas stays under `maxCanvasPixels`.
 */
export function canvasRatio(
  width: number,
  height: number,
  deviceRatio: number,
): number {
  const ratio = deviceRatio > 0 ? deviceRatio : 1;
  const area = width * height * ratio * ratio;
  if (area <= maxCanvasPixels) return ratio;
  return Math.sqrt(maxCanvasPixels / (width * height));
}

/**
 * A private copy of the bytes: PDF.js hands its data to the worker, which
 * detaches the buffer, so the consumer's own bytes (kept for a download)
 * are never touched.
 */
export function copyPdfBytes(data: ArrayBuffer | Uint8Array): Uint8Array {
  return data instanceof Uint8Array
    ? data.slice()
    : new Uint8Array(data.slice(0));
}
