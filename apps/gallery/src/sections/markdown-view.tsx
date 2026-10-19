import {
  Box,
  Card,
  Grid,
  inspectMarkdown,
  type MarkdownImage,
  type MarkdownImageResolver,
  MarkdownView,
  Nav,
  Notice,
  Stack,
  Text,
} from '@scalewing/react';

import heronMarsh from '../assets/heron-marsh.svg';
import { Section } from '../layout/Section.js';

const fieldNotes = `# Before you set out

Herons feed at **first light**, so reach the hide *before dawn*.
Read the [survey guide](https://example.org/heron-survey) and
[write to the warden](mailto:warden@example.org) if a path is closed.

![The north colony at dawn](photo:north-colony)

## At the hide

1. Count the nests from left to right.
2. Note each adult once.
   - Grey heron
   - Night heron
3. Wait ten minutes, then count again.

> If the two counts **don't match**, count a third time before you leave.
>
> ![The same nests from the south path](photo:south-path)

---

## Left out of the view

| Species | Nests |
| --- | --- |
| Grey heron | 14 |

<b>Raw HTML</b>, a [script link](javascript:alert(1)) and an
![outside photo](https://example.org/egret.png) stay out.`;

const photos: Record<string, MarkdownImage> = {
  'north-colony': {
    src: heronMarsh,
    alt: 'A grey heron standing in shallow water in front of reeds',
  },
  // No alt of its own: its caption names it.
  'south-path': { src: heronMarsh },
};

const resolveImage: MarkdownImageResolver = (id) => photos[id] ?? null;

const options = { resolveImage, idPrefix: 'field-notes-' } as const;

export function MarkdownViewSection() {
  const { headings, omissions, omissionCounts } = inspectMarkdown(
    fieldNotes,
    options,
  );
  return (
    <Section
      id="markdown-view"
      purpose="MarkdownView draws a safe subset of Markdown in Scalewing's type, as React elements and never as HTML: paragraphs, headings (# drawn as an h2 under the page's own title), lists, bold, italic, links (http, https and mailto only, each in a new tab without an opener), block quotes as a highlighted box, line breaks and photo: images the consumer resolves, with their captions. Raw HTML, tables, outside images, other link schemes and code highlighting are left out (a link keeps its words, code shows as plain text). A photo needs words (the resolver's alt, else its caption) and a safe address (relative, https, http, blob or a data PNG, JPEG, GIF, WebP, AVIF or SVG). Quotes, lists and marks nested past 16 levels are shown as their words, and the parser's work stays linear, so a 50,000-character page reads in milliseconds and even a crafted one in about a tenth of a second. newTabLabel is required; give every view on a page its own idPrefix. inspectMarkdown lists the headings with their ids, for an On this page Nav, and the first 100 things the view left out with a count of each kind, for an editor to say so."
      title="MarkdownView"
      usage={`// One stable resolver for both: a new function reads the source again.
const resolveImage = useCallback((id) => photos[id] ?? null, [photos]);

<MarkdownView
  source={page.body}
  resolveImage={resolveImage}
  idPrefix="page-"
  newTabLabel="(opens in a new tab)"
/>

const { headings, omissions } = inspectMarkdown(page.body, {
  resolveImage,
  idPrefix: 'page-',
});`}
    >
      <Grid columns={2} columnsBelow={{ md: 1 }} gap={4}>
        <Card padding={5}>
          <MarkdownView
            newTabLabel="(opens in a new tab)"
            source={fieldNotes}
            {...options}
          />
        </Card>
        <Stack gap={4}>
          <Card padding={4}>
            <Stack gap={2}>
              <Text as="h3" variant="label">
                On this page
              </Text>
              <Nav appearance="words" aria-label="On this page">
                {headings.map((heading) => (
                  <Box
                    as="a"
                    href={`#${heading.id}`}
                    key={heading.id}
                    tabIndex={0}
                  >
                    {heading.text}
                  </Box>
                ))}
              </Nav>
            </Stack>
          </Card>
          <Notice
            role="none"
            title={`Left out (${Object.values(omissionCounts).reduce((sum, count) => sum + count, 0)})`}
            tone="info"
          >
            <Stack gap={1}>
              {omissions.map((omission, index) => (
                <Text as="p" key={index} variant="caption">
                  {`${omission.kind}: ${omission.source}`}
                </Text>
              ))}
            </Stack>
          </Notice>
        </Stack>
      </Grid>
    </Section>
  );
}
