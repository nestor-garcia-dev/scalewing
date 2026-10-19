import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import {
  DocumentViewer,
  type DocumentViewerProps,
} from './components/DocumentViewer.js';
import { type PdfDocument } from './components/document-viewer/pdf-document.js';
import { zoomSettleMs } from './components/document-viewer/use-zoom.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

const opener = vi.hoisted(() => ({ openPdf: vi.fn() }));

vi.mock('./components/document-viewer/pdf-document.js', async (actual) => ({
  ...(await actual<
    typeof import('./components/document-viewer/pdf-document.js')
  >()),
  openPdf: opener.openPdf,
}));

const labels = {
  previous: 'Previous page',
  next: 'Next page',
  page: (page: number, count: number) => `Page ${page} of ${count}`,
  loading: 'Opening the field guide…',
  failed: 'This field guide couldn’t be shown',
};

function fakeDocument(pageCount: number): PdfDocument & {
  renderPage: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
} {
  return {
    pageCount,
    renderPage: vi.fn(({ width }: { width: number }) =>
      Promise.resolve({ width, height: width * 1.25 }),
    ),
    pageAspect: vi.fn(() => Promise.resolve(1.25)),
    destroy: vi.fn(() => Promise.resolve()),
  };
}

const bytes = new Uint8Array([37, 80, 68, 70]);

function viewer(props: Partial<DocumentViewerProps> = {}) {
  return (
    <DocumentViewer
      data={bytes}
      label="Wetland field guide"
      labels={labels}
      workerSrc="/pdf.worker.js"
      {...props}
    />
  );
}

/** Settles the open and the first draw. */
async function opened() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  // jsdom lays nothing out: the stage is 600 px wide.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 600,
    height: 400,
  } as DOMRect);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  opener.openPdf.mockReset();
});

describe('DocumentViewer', () => {
  it('says it is opening while the PDF opens, once', () => {
    opener.openPdf.mockReturnValue(new Promise(() => undefined));
    render(viewer());
    expect(screen.getByRole('status').textContent).toBe(
      'Opening the field guide…',
    );
    // The visible words are the status's; assistive technology hears one.
    expect(
      screen
        .getAllByText('Opening the field guide…')
        .find((node) => node.tagName === 'P')
        ?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(screen.getByRole('region', { name: 'Wetland field guide' })).toBe(
      document.querySelector('section'),
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(opener.openPdf).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      '/pdf.worker.js',
    );
  });

  it('draws the first page fitted to its width and says where the reader is', async () => {
    const document3 = fakeDocument(3);
    opener.openPdf.mockResolvedValue(document3);
    const onLoad = vi.fn();
    render(viewer({ onLoad }));
    await opened();
    expect(onLoad).toHaveBeenCalledWith({ pageCount: 3 });
    const status = screen.getByText('Page 1 of 3');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-atomic')).toBe('true');
    expect(document3.renderPage).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, width: 600 }),
    );
    // The stage is a focusable group named by where the reader is; only
    // the viewer is a landmark.
    const stage = screen.getByRole('group', { name: 'Page 1 of 3' });
    expect(stage.className).toBe('sw-document-viewer-stage');
    expect(stage.getAttribute('tabindex')).toBe('0');
    expect(screen.getAllByRole('region')).toHaveLength(1);
    expect(document.querySelector('canvas')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    const box = document.querySelector<HTMLElement>('.sw-document-viewer-page');
    expect(box?.style.getPropertyValue('--sw-document-page-width')).toBe(
      '600px',
    );
    expect(box?.style.getPropertyValue('--sw-document-page-aspect')).toBe(
      '1.25',
    );
  });

  it('steps through the pages, its ends looking disabled but kept as stops', async () => {
    const user = userEvent.setup();
    const document3 = fakeDocument(3);
    opener.openPdf.mockResolvedValue(document3);
    const onPageChange = vi.fn();
    render(viewer({ onPageChange }));
    await opened();
    const previous = screen.getByRole('button', { name: 'Previous page' });
    const next = screen.getByRole('button', { name: 'Next page' });
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    await user.click(previous);
    expect(onPageChange).not.toHaveBeenCalled();
    await user.click(next);
    await user.click(next);
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByText('Page 3 of 3')).toBeTruthy();
    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect(next.hasAttribute('disabled')).toBe(false);
    await user.click(next);
    expect(onPageChange).toHaveBeenCalledTimes(2);
    await opened();
    expect(document3.renderPage).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 3 }),
    );
  });

  it('follows a page the consumer holds, kept within the document', async () => {
    opener.openPdf.mockResolvedValue(fakeDocument(2));
    const { rerender } = render(viewer({ page: 2 }));
    await opened();
    expect(screen.getByText('Page 2 of 2')).toBeTruthy();
    rerender(viewer({ page: 9 }));
    expect(screen.getByText('Page 2 of 2')).toBeTruthy();
    rerender(viewer({ page: 1.5 }));
    expect(screen.getByText('Page 1 of 2')).toBeTruthy();
  });

  it('shows only the page words for one page', async () => {
    opener.openPdf.mockResolvedValue(fakeDocument(1));
    render(viewer());
    await opened();
    expect(screen.getByText('Page 1 of 1')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('says it failed, with the consumer’s words and actions, when the PDF does not open', async () => {
    const error = new Error('Invalid PDF structure.');
    opener.openPdf.mockRejectedValue(error);
    const onError = vi.fn();
    render(
      viewer({
        labels: { ...labels, failedDetail: 'Ask the ranger station.' },
        failedAction: <Button onPress={() => undefined}>Try again</Button>,
        onError,
      }),
    );
    await opened();
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe(
      'This field guide couldn’t be shownAsk the ranger station.Try again',
    );
    expect(onError).toHaveBeenCalledWith(error);
    expect(
      document
        .querySelector('.sw-document-viewer-stage')
        ?.hasAttribute('tabindex'),
    ).toBe(false);
  });

  it('keeps the steps when a page cannot be drawn, so another page can be read', async () => {
    const user = userEvent.setup();
    const document3 = fakeDocument(3);
    document3.renderPage.mockImplementation(({ page, width }) =>
      page === 2
        ? Promise.reject(new Error('bad page'))
        : Promise.resolve({ width, height: width * 1.25 }),
    );
    opener.openPdf.mockResolvedValue(document3);
    render(viewer());
    await opened();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await opened();
    expect(screen.getByRole('alert').textContent).toContain(
      'couldn’t be shown',
    );
    expect(screen.getByText('Page 2 of 3')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    await opened();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('group', { name: 'Page 1 of 3' })).toBeTruthy();
    expect(
      document
        .querySelector('.sw-document-viewer-page')
        ?.hasAttribute('hidden'),
    ).toBe(false);
  });

  it('starts new bytes at the first page', async () => {
    const user = userEvent.setup();
    opener.openPdf.mockResolvedValue(fakeDocument(3));
    const { rerender } = render(viewer());
    await opened();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Page 2 of 3')).toBeTruthy();
    rerender(viewer({ data: new Uint8Array([9]) }));
    await opened();
    expect(screen.getByText('Page 1 of 3')).toBeTruthy();
  });

  it('says it failed when a page cannot be drawn, but not for a cancelled draw', async () => {
    const document2 = fakeDocument(2);
    const cancelled = new Error('cancelled');
    cancelled.name = 'RenderingCancelledException';
    document2.renderPage.mockRejectedValueOnce(cancelled);
    opener.openPdf.mockResolvedValue(document2);
    const onError = vi.fn();
    const { rerender } = render(viewer({ onError }));
    await opened();
    expect(screen.queryByRole('alert')).toBeNull();
    document2.renderPage.mockRejectedValueOnce(new Error('bad page'));
    rerender(viewer({ onError, page: 2 }));
    await opened();
    expect(screen.getByRole('alert').textContent).toContain(
      'couldn’t be shown',
    );
    expect(onError).toHaveBeenCalledWith(new Error('bad page'));
  });

  it('zooms the focused page with + - and 0, drawing it again once it rests', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const document1 = fakeDocument(1);
    opener.openPdf.mockResolvedValue(document1);
    render(viewer());
    await opened();
    const stage = document.querySelector<HTMLElement>(
      '.sw-document-viewer-stage',
    );
    if (!stage) throw new Error('no stage');
    const width = () =>
      document
        .querySelector<HTMLElement>('.sw-document-viewer-page')
        ?.style.getPropertyValue('--sw-document-page-width');
    fireEvent.keyDown(stage, { key: '+' });
    fireEvent.keyDown(stage, { key: '+' });
    expect(width()).toBe('900px');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(zoomSettleMs + 10);
    });
    expect(document1.renderPage).toHaveBeenLastCalledWith(
      expect.objectContaining({ width: 900 }),
    );
    fireEvent.keyDown(stage, { key: '-' });
    expect(width()).toBe('750px');
    fireEvent.keyDown(stage, { key: '0' });
    expect(width()).toBe('600px');
    fireEvent.keyDown(stage, { key: '+', ctrlKey: true });
    expect(width()).toBe('600px');
    vi.useRealTimers();
  });

  it('zooms with two fingers', async () => {
    opener.openPdf.mockResolvedValue(fakeDocument(1));
    render(viewer());
    await opened();
    const stage = document.querySelector<HTMLElement>(
      '.sw-document-viewer-stage',
    );
    if (!stage) throw new Error('no stage');
    const touches = (spread: number) => [
      { clientX: 100, clientY: 100 },
      { clientX: 100 + spread, clientY: 100 },
    ];
    fireEvent.touchStart(stage, { touches: touches(100) });
    const move = new TouchEvent('touchmove', { cancelable: true });
    Object.defineProperty(move, 'touches', { value: touches(200) });
    act(() => {
      stage.dispatchEvent(move);
    });
    expect(move.defaultPrevented).toBe(true);
    expect(
      document
        .querySelector<HTMLElement>('.sw-document-viewer-page')
        ?.style.getPropertyValue('--sw-document-page-width'),
    ).toBe('1200px');
    fireEvent.touchEnd(stage, { touches: [] });
    const single = new TouchEvent('touchmove', { cancelable: true });
    Object.defineProperty(single, 'touches', { value: touches(0).slice(1) });
    stage.dispatchEvent(single);
    expect(single.defaultPrevented).toBe(false);
  });

  it('opens new bytes and closes the old document', async () => {
    const first = fakeDocument(2);
    const second = fakeDocument(5);
    opener.openPdf.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
    const { rerender, unmount } = render(viewer());
    await opened();
    rerender(viewer({ data: new Uint8Array([1, 2]) }));
    expect(screen.getByRole('status').textContent).toBe(
      'Opening the field guide…',
    );
    await opened();
    expect(first.destroy).toHaveBeenCalled();
    expect(screen.getByText('Page 1 of 5')).toBeTruthy();
    unmount();
    expect(second.destroy).toHaveBeenCalled();
  });

  it('refuses missing words and a missing worker', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    opener.openPdf.mockReturnValue(new Promise(() => undefined));
    expect(() => render(viewer({ label: ' ' }))).toThrow(
      'DocumentViewer label must be non-empty text',
    );
    expect(() => render(viewer({ workerSrc: '' }))).toThrow(
      'DocumentViewer workerSrc must be a URL',
    );
    expect(() => render(viewer({ labels: { ...labels, next: '' } }))).toThrow(
      'DocumentViewer labels.next must be non-empty text',
    );
    expect(() =>
      render(viewer({ labels: { ...labels, page: 'Page' as never } })),
    ).toThrow('DocumentViewer labels.page must be a function');
    expect(() =>
      render(viewer({ labels: { ...labels, failedDetail: ' ' } })),
    ).toThrow('DocumentViewer labels.failedDetail must be non-empty text');
  });

  it('generates its stage, page, text layer and 48-point steps from tokens', () => {
    const css = generateStylesheet();
    expect(css).toContain('touch-action: pan-x pan-y;');
    expect(css).toContain(
      '.sw-button.sw-document-viewer-step {\n  border-radius: var(--sw-radius-pill);',
    );
    expect(css).toContain('min-height: var(--sw-space-8);');
    expect(css).toContain(
      '.sw-document-viewer-text :is(span, br) {\n  color: transparent;',
    );
    expect(css).not.toMatch(/sw-document-viewer[^}]*#[0-9a-f]{3,6}\b/i);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-document-viewer',
        'sw-document-viewer-stage',
        'sw-document-viewer-page',
        'sw-document-viewer-step',
      ]),
    );
  });
});
