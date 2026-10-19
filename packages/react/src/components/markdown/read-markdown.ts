import { maxParseNesting } from './markdown-limits.js';
import { type MarkdownReading } from './markdown-model.js';
import {
  assertMarkdownInput,
  type MarkdownOptions,
} from './markdown-options.js';
import { parseMarkdown } from './parse-markdown.js';
import { readBlocks } from './read-blocks.js';
import { ReadingContext } from './reading-context.js';

/**
 * Reads Markdown into what `MarkdownView` draws: its blocks, its headings
 * (with the ids the view gives them) and what it leaves out. Pure: the
 * same source and options always give the same reading. Refuses a source
 * that is not text and options the view refuses.
 */
export function readMarkdown(
  source: string,
  options: MarkdownOptions = {},
  owner = 'readMarkdown',
): MarkdownReading {
  assertMarkdownInput(owner, source, options);
  const tokens = parseMarkdown(source);
  const context = new ReadingContext(source, options);
  // The parser stops reading a block nested deeper than it reads.
  const cut = tokens.find((token) => token.level >= maxParseNesting - 1);
  if (cut) context.omitBlock('limit', cut);
  const blocks = readBlocks(context, tokens);
  return {
    blocks,
    headings: context.headings,
    omissions: context.omissions,
    omissionCounts: context.omissionCounts,
  };
}
