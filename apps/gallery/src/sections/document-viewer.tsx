import { Button, DocumentViewer, Stack, Text } from '@scalewing/react';
import workerSrc from '@scalewing/react/document-viewer-worker?worker&url';
import { useEffect, useState } from 'react';

import guideUrl from '../assets/field-guide.pdf?url';
import { Section } from '../layout/Section.js';

const labels = {
  previous: 'Previous page',
  next: 'Next page',
  page: (page: number, count: number) => `Page ${page} of ${count}`,
  loading: 'Opening the field guide…',
  failed: 'This field guide couldn’t be shown',
  failedDetail: 'The file may be damaged. Ask the ranger station for a copy.',
};

/** Bytes that are not a PDF, for the state a damaged file shows. */
const broken = new TextEncoder().encode('Not a field guide');

/**
 * The sample guide's bytes, as a consumer fetches them from its own API.
 * The guide (`assets/field-guide.pdf`) is three pages of Helvetica text
 * written for this gallery by a short script, with no outside content.
 */
function useGuideBytes(): ArrayBuffer | null {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  useEffect(() => {
    let live = true;
    fetch(guideUrl)
      .then((response) => response.arrayBuffer())
      .then(
        (buffer) => {
          if (live) setBytes(buffer);
        },
        () => undefined,
      );
    return () => {
      live = false;
    };
  }, []);
  return bytes;
}

export function DocumentViewerSection() {
  const guide = useGuideBytes();
  const [page, setPage] = useState(1);
  const [tries, setTries] = useState(0);
  const [asked, setAsked] = useState(false);
  return (
    <Section
      id="document-viewer"
      purpose="DocumentViewer draws a PDF from its bytes with PDF.js, one page at a time, fitted to its width: previous and next steps (48 points, round) around the page words, which are a polite live region; two fingers, or + - and 0 on the focused page, zoom it. The page's text lies over the drawing, transparent, for reading aloud and selecting. It shows the consumer's loading words while the PDF opens and its failed words and actions when it cannot. It takes bytes, never a URL, fetches nothing else, and has no download or print of its own. The worker is Scalewing's own entry, bundled by the consumer and passed as workerSrc."
      title="DocumentViewer"
      usage={`import workerSrc from '@scalewing/react/document-viewer-worker?worker&url';

<DocumentViewer
  data={bytes}
  workerSrc={workerSrc}
  label="Wetland field guide"
  labels={{
    previous: 'Previous page',
    next: 'Next page',
    page: (page, count) => \`Page \${page} of \${count}\`,
    loading: 'Opening the field guide…',
    failed: 'This field guide couldn’t be shown',
  }}
  page={page}
  onPageChange={setPage}
  failedAction={
    <Button onPress={() => setTries(tries + 1)}>Try again</Button>
  }
  key={tries}
/>`}
    >
      <Stack gap={5}>
        {guide ? (
          <DocumentViewer
            data={guide}
            label="Wetland field guide"
            labels={labels}
            onPageChange={setPage}
            page={page}
            workerSrc={workerSrc}
          />
        ) : (
          <Text color="muted">Fetching the field guide…</Text>
        )}
        <Text color="muted" variant="caption">
          Showing page {page}. The sample is three pages of text drawn in
          Helvetica, which the viewer shows in a system font: it loads no font
          files.
        </Text>
        <DocumentViewer
          data={broken}
          failedAction={
            <>
              <Button onPress={() => setTries(tries + 1)} variant="neutral">
                Try again
              </Button>
              <Button onPress={() => setAsked(true)} variant="neutral">
                Ask for a copy
              </Button>
            </>
          }
          key={tries}
          label="Damaged field guide"
          labels={labels}
          workerSrc={workerSrc}
        />
        {asked ? (
          <Text color="muted" role="status">
            The ranger station will send a copy.
          </Text>
        ) : null}
      </Stack>
    </Section>
  );
}
