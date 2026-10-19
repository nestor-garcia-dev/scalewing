/** A run of text and its marks, as the view draws it. */
export type MarkdownInline =
  | { kind: 'text'; value: string }
  | { kind: 'strong' | 'emphasis'; children: MarkdownInline[] }
  | { kind: 'link'; href: string; children: MarkdownInline[] }
  | { kind: 'break' };

/** A block of the page, as the view draws it. */
export type MarkdownBlock =
  | { kind: 'paragraph'; children: MarkdownInline[] }
  | {
      kind: 'heading';
      level: 1 | 2 | 3;
      id: string;
      children: MarkdownInline[];
    }
  | {
      kind: 'list';
      ordered: boolean;
      start: number | null;
      tight: boolean;
      items: MarkdownBlock[][];
    }
  | { kind: 'quote'; children: MarkdownBlock[] }
  | { kind: 'figure'; src: string; alt: string; caption: string }
  | { kind: 'rule' };

/** A heading of the page, for an "On this page" list. */
export type MarkdownHeading = {
  /** The heading's element id, for a link to it (`#${id}`). */
  id: string;
  /** 1 for `#`, 2 for `##`, 3 for `###` (and deeper). */
  level: 1 | 2 | 3;
  text: string;
};

/** What the view leaves out of the Markdown it is given. */
export type MarkdownOmissionKind =
  /** Raw HTML, scripts included: dropped (the words between tags stay). */
  | 'html'
  /** A table: dropped. */
  | 'table'
  /** An image that is not a `photo:` the consumer resolves: dropped. */
  | 'image'
  /** A link whose scheme is not http, https or mailto: shown as its words. */
  | 'link'
  /** Code: shown as plain text, without its code formatting. */
  | 'code'
  /**
   * Past the view's limits: quotes, lists and marks nested more than 16
   * deep are shown as their words (a link there too, quoted in the run's
   * one omission); a block reaching the parser's 128th level, past which
   * it stops reading, is reported as it may be lost.
   */
  | 'limit';

export const markdownOmissionKinds = [
  'html',
  'table',
  'image',
  'link',
  'code',
  'limit',
] as const satisfies readonly MarkdownOmissionKind[];

/** How many of each kind the view left out, the ones past the list too. */
export type MarkdownOmissionCounts = Record<MarkdownOmissionKind, number>;

export type MarkdownOmission = {
  kind: MarkdownOmissionKind;
  /** The Markdown it came from, cut to 80 characters. */
  source: string;
};

/** A `photo:` image as the consumer resolves it. */
export type MarkdownImage = {
  /**
   * The photo's address: relative, `https:`, `http:`, `blob:` or a
   * `data:image/` of PNG, JPEG, GIF, WebP, AVIF or SVG; any other is left out.
   */
  src: string;
  /** What the photo shows; the caption is used when this is left out. */
  alt?: string;
};

export type MarkdownImageResolver = (id: string) => MarkdownImage | null;

/** The page read from Markdown: its blocks, its headings, what was left out. */
export type MarkdownReading = {
  blocks: MarkdownBlock[];
  headings: MarkdownHeading[];
  /** The first 100 things left out, in the order they appear. */
  omissions: MarkdownOmission[];
  omissionCounts: MarkdownOmissionCounts;
};
