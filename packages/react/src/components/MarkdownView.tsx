import { useMemo } from 'react';

import {
  type MarkdownHeading,
  type MarkdownOmission,
  type MarkdownOmissionCounts,
} from './markdown/markdown-model.js';
import { type MarkdownOptions } from './markdown/markdown-options.js';
import { readMarkdown } from './markdown/read-markdown.js';
import { renderBlocks } from './markdown/render-markdown.js';

export type {
  MarkdownHeading,
  MarkdownImage,
  MarkdownImageResolver,
  MarkdownOmission,
  MarkdownOmissionCounts,
  MarkdownOmissionKind,
} from './markdown/markdown-model.js';
export { markdownOmissionKinds } from './markdown/markdown-model.js';
export type { MarkdownOptions } from './markdown/markdown-options.js';

export type MarkdownViewProps = MarkdownOptions & {
  /** The Markdown, as written or pasted. */
  source: string;
  /**
   * Hidden words after every link, which opens in a new tab, such as
   * "(opens in a new tab)".
   */
  newTabLabel: string;
};

/** What `inspectMarkdown` finds. */
export type MarkdownInspection = {
  /** The headings, with the ids the view gives them. */
  headings: MarkdownHeading[];
  /** The first 100 things left out, in order. */
  omissions: MarkdownOmission[];
  /** How many of each kind were left out, past the first 100 too. */
  omissionCounts: MarkdownOmissionCounts;
};

/**
 * What a source's view shows in its headings (for an "On this page" list,
 * with the ids the view gives them) and what it leaves out (for an editor
 * to say so before saving). Pure; pass the same options as the view, which
 * it refuses the same way.
 */
export function inspectMarkdown(
  source: string,
  options: MarkdownOptions = {},
): MarkdownInspection {
  const { headings, omissions, omissionCounts } = readMarkdown(
    source,
    options,
    'inspectMarkdown',
  );
  return { headings, omissions, omissionCounts };
}

/**
 * Markdown drawn in Scalewing's type as React elements, never as HTML:
 * paragraphs, headings (`#` drawn at the page's second level, an `h2`),
 * lists, bold, italic, links (http, https and mailto only, in a new tab),
 * block quotes as a highlighted box, line breaks and `photo:` images with
 * their captions. Raw HTML, tables, other images and other link schemes
 * are left out (a link's words stay); `inspectMarkdown` lists them.
 */
export function MarkdownView(props: MarkdownViewProps) {
  const { source, resolveImage, idPrefix, newTabLabel } = props;
  if (typeof newTabLabel !== 'string' || newTabLabel.trim() === '')
    throw new RangeError('MarkdownView newTabLabel must be non-empty text');
  const reading = useMemo(
    () => readMarkdown(source, { resolveImage, idPrefix }, 'MarkdownView'),
    [source, resolveImage, idPrefix],
  );
  return (
    <div className="sw-markdown">
      {renderBlocks(reading.blocks, { newTabLabel })}
    </div>
  );
}
