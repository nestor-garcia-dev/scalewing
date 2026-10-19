/** The viewer's words, all in the consumer's language. */
export type DocumentViewerLabels = {
  /** Names the step to the page before, such as "Previous page". */
  previous: string;
  /** Names the step to the page after, such as "Next page". */
  next: string;
  /** Where the reader is, such as `(page, count) => \`Page ${page} of ${count}\``. */
  page: (page: number, pageCount: number) => string;
  /** While the PDF opens, such as "Opening the PDF…". */
  loading: string;
  /** When it cannot be shown, such as "This PDF couldn't be shown". */
  failed: string;
  /** A line under `failed`, such as what the reader can do instead. */
  failedDetail?: string;
};

function isBlank(text: unknown): boolean {
  return typeof text !== 'string' || text.trim() === '';
}

/** Fails closed on missing words: the viewer has no words of its own. */
export function assertDocumentViewer({
  label,
  labels,
  workerSrc,
}: {
  label: string;
  labels: DocumentViewerLabels;
  workerSrc: string;
}): void {
  if (isBlank(label))
    throw new RangeError('DocumentViewer label must be non-empty text');
  if (isBlank(workerSrc))
    throw new RangeError('DocumentViewer workerSrc must be a URL');
  for (const key of ['previous', 'next', 'loading', 'failed'] as const)
    if (isBlank(labels?.[key]))
      throw new RangeError(
        `DocumentViewer labels.${key} must be non-empty text`,
      );
  if (typeof labels.page !== 'function')
    throw new RangeError('DocumentViewer labels.page must be a function');
  if (labels.failedDetail !== undefined && isBlank(labels.failedDetail))
    throw new RangeError(
      'DocumentViewer labels.failedDetail must be non-empty text',
    );
}

/** The page shown: the one asked for, kept between 1 and the last page. */
export function shownPage(page: number, pageCount: number): number {
  if (!Number.isInteger(page)) return 1;
  return Math.min(Math.max(page, 1), Math.max(pageCount, 1));
}
