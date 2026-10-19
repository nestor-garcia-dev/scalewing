'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react';

import { Button } from './Button.js';
import { Spinner } from './Spinner.js';
import { Text } from './Text.js';
import {
  assertDocumentViewer,
  type DocumentViewerLabels,
  shownPage,
} from './document-viewer/document-viewer-labels.js';
import { pageBoxStyle } from './document-viewer/page-box.js';
import { useErrorReport } from './document-viewer/use-error-report.js';
import { usePageRender } from './document-viewer/use-page-render.js';
import { usePdfDocument } from './document-viewer/use-pdf-document.js';
import { usePinchZoom } from './document-viewer/use-pinch-zoom.js';
import { useZoom } from './document-viewer/use-zoom.js';
import { zoomForKey } from './document-viewer/zoom.js';
import { useElementWidth } from './use-element-width.js';

export type { DocumentViewerLabels };

export type DocumentViewerProps = {
  /**
   * The PDF's bytes, never a URL. The viewer draws from a copy. Other
   * bytes (another object) open again at the first page, so keep this the
   * same object between renders (state or a memo).
   */
  data: ArrayBuffer | Uint8Array;
  /**
   * The URL of the bundled worker entry `@scalewing/react/document-viewer-worker`
   * (Scalewing's PDF.js worker, always the viewer's version), such as Vite's
   * `import workerSrc from '@scalewing/react/document-viewer-worker?worker&url'`.
   */
  workerSrc: string;
  /** Names the viewer, such as the document's title. */
  label: string;
  labels: DocumentViewerLabels;
  /** The page shown, from 1; left out, the viewer keeps its own. */
  page?: number;
  /** Called with the page a step goes to. */
  onPageChange?: (page: number) => void;
  /** The failed state's actions, such as Try again and Download PDF. */
  failedAction?: ReactNode;
  /** Called once the PDF opens, with its page count. */
  onLoad?: (info: { pageCount: number }) => void;
  /** Called when the PDF cannot be opened or a page cannot be drawn. */
  onError?: (error: unknown) => void;
};

/**
 * A PDF drawn one page at a time from its bytes with PDF.js, fitted to the
 * width it is given, with previous and next steps and "Page n of m" in a
 * polite live region. Two fingers, or `+`, `-` and `0` on the focused
 * page, zoom it. The page's text sits over the drawing, transparent, so it
 * can be read by assistive technology and selected. It opens nothing from
 * the network beyond the worker, and has no download or print of its own.
 */
export function DocumentViewer({
  data,
  workerSrc,
  label,
  labels,
  page: pageProp,
  onPageChange,
  failedAction,
  onLoad,
  onError,
}: DocumentViewerProps) {
  assertDocumentViewer({ label, labels, workerSrc });
  const statusId = useId();
  // The viewer's own page belongs to its bytes: new bytes start at page 1.
  const [own, setOwn] = useState({ data, page: 1 });
  const ownPage = own.data === data ? own.page : 1;
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const opened = usePdfDocument(data, workerSrc, { onLoad, onError });
  const reportError = useErrorReport(onError);
  const document = opened.status === 'ready' ? opened.document : null;
  const pageCount = document?.pageCount ?? 0;
  const page = shownPage(pageProp ?? ownPage, pageCount);
  const {
    box: stage,
    page: sheet,
    zoom,
    drawnZoom,
    zoomTo,
  } = useZoom(`${page}`);
  const fitWidth = useElementWidth(stage, 0, { content: true });
  usePinchZoom(stage, zoom, zoomTo);
  const drawn = usePageRender({
    document,
    page,
    width: Math.round(fitWidth * drawnZoom),
    canvas,
    text,
    onError: reportError,
  });
  // A page that cannot be drawn keeps the steps, so another can be read.
  const failed = opened.status === 'failed' || drawn.state === 'failed';
  const open = document !== null;

  function go(target: number) {
    if (target < 1 || target > pageCount || target === page) return;
    setOwn({ data, page: target });
    onPageChange?.(target);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const next = zoomForKey(event.key, zoom);
    if (next === null) return;
    event.preventDefault();
    zoomTo(next);
  }

  const step = (direction: 'previous' | 'next') => {
    const target = direction === 'previous' ? page - 1 : page + 1;
    const off = target < 1 || target > pageCount;
    return (
      <Button
        aria-disabled={off || undefined}
        aria-label={labels[direction]}
        className="sw-document-viewer-step"
        disabledAppearance="neutral"
        onPress={() => go(target)}
        variant="neutral"
      >
        <span
          aria-hidden="true"
          className={`sw-pagination-glyph sw-pagination-glyph-${direction}`}
        />
      </Button>
    );
  };

  return (
    <section aria-label={label} className="sw-document-viewer">
      <div
        aria-labelledby={open && !failed ? statusId : undefined}
        className="sw-document-viewer-stage"
        onKeyDown={open && !failed ? onKeyDown : undefined}
        ref={stage}
        role={open && !failed ? 'group' : undefined}
        tabIndex={open && !failed ? 0 : undefined}
      >
        {failed ? (
          <div className="sw-document-viewer-message" role="alert">
            <Text as="p" variant="title">
              {labels.failed}
            </Text>
            {labels.failedDetail ? (
              <Text as="p">{labels.failedDetail}</Text>
            ) : null}
            {failedAction ? (
              <div className="sw-document-viewer-actions">{failedAction}</div>
            ) : null}
          </div>
        ) : null}
        {opened.status === 'loading' ? (
          <div className="sw-document-viewer-message">
            <Spinner label={labels.loading} />
            <Text aria-hidden as="p">
              {labels.loading}
            </Text>
          </div>
        ) : null}
        {open ? (
          <div
            className="sw-document-viewer-page"
            data-zoomed={zoom > 1 || undefined}
            hidden={failed}
            ref={sheet}
            style={pageBoxStyle(fitWidth * zoom, drawn.aspect)}
          >
            <canvas aria-hidden="true" ref={canvas} />
            <div className="sw-document-viewer-text" ref={text} />
          </div>
        ) : null}
      </div>
      {open ? (
        <div className="sw-document-viewer-bar">
          {pageCount > 1 ? step('previous') : null}
          <span
            aria-atomic="true"
            aria-live="polite"
            className="sw-document-viewer-status"
            id={statusId}
          >
            {labels.page(page, pageCount)}
          </span>
          {pageCount > 1 ? step('next') : null}
        </div>
      ) : null}
    </section>
  );
}
