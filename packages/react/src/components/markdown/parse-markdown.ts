import MarkdownIt, { type Options, type Token } from 'markdown-it';

import { maxParseNesting } from './markdown-limits.js';

export type { Token };

/*
 * CommonMark with GFM tables (recognised only so they are left out whole)
 * and raw HTML read as HTML tokens (so they are left out, never shown as
 * text), as a token stream. Its renderer is never called: nothing here
 * makes HTML. Every link is read as a link (the view decides on its
 * address); links are never found in bare text.
 */
// `maxNesting` is read by markdown-it's parsers; its types leave it out.
const options: Options & { maxNesting: number } = {
  html: true,
  linkify: false,
  maxNesting: maxParseNesting,
};
const parser = new MarkdownIt('commonmark', options).enable('table');
parser.validateLink = () => true;

/** The block tokens of `source`; inline tokens are each block's `children`. */
export function parseMarkdown(source: string): Token[] {
  return parser.parse(source, {});
}
