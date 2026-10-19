import { maxOmissionsListed } from './markdown-limits.js';
import {
  type MarkdownHeading,
  type MarkdownOmission,
  type MarkdownOmissionCounts,
  type MarkdownOmissionKind,
} from './markdown-model.js';
import { type MarkdownOptions } from './markdown-options.js';
import { HeadingIds } from './markdown-rules.js';
import { excerpt } from './markdown-text.js';
import { type Token } from './parse-markdown.js';

/** One document's reading so far: its headings and what it left out. */
export class ReadingContext {
  readonly headings: MarkdownHeading[] = [];
  readonly omissions: MarkdownOmission[] = [];
  readonly omissionCounts: MarkdownOmissionCounts = {
    html: 0,
    table: 0,
    image: 0,
    link: 0,
    code: 0,
    limit: 0,
  };
  readonly ids: HeadingIds;
  private readonly lines: string[];

  constructor(
    source: string,
    readonly options: MarkdownOptions,
  ) {
    this.ids = new HeadingIds(options.idPrefix ?? '');
    this.lines = source.split(/\r\n?|\n/);
  }

  /** Notes something left out, by its words. */
  omit(kind: MarkdownOmissionKind, text: string): void {
    this.omissionCounts[kind] += 1;
    if (this.omissions.length < maxOmissionsListed)
      this.omissions.push({ kind, source: excerpt(text) });
  }

  /** Notes a block left out, by the source lines it came from. */
  omitBlock(kind: MarkdownOmissionKind, token: Token): void {
    const [start, end] = token.map ?? [0, 0];
    this.omit(kind, this.lines.slice(start, end).join('\n'));
  }
}
