'use client';

import { useEffect, useRef, useState } from 'react';

import { openPdf, type PdfDocument } from './pdf-document.js';

export type PdfDocumentState =
  | { status: 'loading' }
  | { status: 'ready'; document: PdfDocument }
  | { status: 'failed'; error: unknown };

/** Closes a document no one shows any more; a failure to close is moot. */
function closeQuietly(document: PdfDocument) {
  document.destroy().catch(() => undefined);
}

type Settled = {
  data: ArrayBuffer | Uint8Array;
  workerSrc: string;
  state: PdfDocumentState;
};

/**
 * Opens the PDF in `data` and closes it (and its worker) when the bytes
 * change or the viewer goes away. New bytes start a new open and show as
 * loading until it settles, so a consumer's Try again is new bytes (or a
 * new `key`).
 */
export function usePdfDocument(
  data: ArrayBuffer | Uint8Array,
  workerSrc: string,
  callbacks: {
    onLoad?: (info: { pageCount: number }) => void;
    onError?: (error: unknown) => void;
  },
): PdfDocumentState {
  const [settled, setSettled] = useState<Settled | null>(null);
  // The callbacks are read when the open settles, never reasons to reopen.
  const latest = useRef(callbacks);
  useEffect(() => {
    latest.current = callbacks;
  });

  useEffect(() => {
    let live = true;
    let opened: PdfDocument | null = null;
    openPdf(data, workerSrc).then(
      (document) => {
        if (!live) {
          closeQuietly(document);
          return;
        }
        opened = document;
        setSettled({ data, workerSrc, state: { status: 'ready', document } });
        latest.current.onLoad?.({ pageCount: document.pageCount });
      },
      (error: unknown) => {
        if (!live) return;
        setSettled({ data, workerSrc, state: { status: 'failed', error } });
        latest.current.onError?.(error);
      },
    );
    return () => {
      live = false;
      if (opened) closeQuietly(opened);
    };
  }, [data, workerSrc]);

  return settled && settled.data === data && settled.workerSrc === workerSrc
    ? settled.state
    : { status: 'loading' };
}
