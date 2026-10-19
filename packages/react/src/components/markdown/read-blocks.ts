import { maxNesting } from './markdown-limits.js';
import { type MarkdownBlock, type MarkdownInline } from './markdown-model.js';
import { isSafeImageSrc, photoId } from './markdown-rules.js';
import { lines, plainText, tokenText, trimEdges } from './markdown-text.js';
import { type Token } from './parse-markdown.js';
import { attr, readInlines } from './read-inlines.js';
import { type ReadingContext } from './reading-context.js';

/** The index of the token that closes the one at `index` (or `index`). */
function closeOf(tokens: readonly Token[], index: number): number {
  const open = tokens[index]!;
  if (open.nesting !== 1) return index;
  for (let at = index + 1; at < tokens.length; at += 1) {
    const token = tokens[at]!;
    if (token.nesting === -1 && token.level === open.level) return at;
  }
  return tokens.length - 1;
}

/** Each part of `tokens` opened by a token of `type`, without its own open and close. */
function partsOf(tokens: readonly Token[], type: string): Token[][] {
  const parts: Token[][] = [];
  for (let at = 0; at < tokens.length; at += 1) {
    if (tokens[at]!.type !== type) continue;
    const end = closeOf(tokens, at);
    parts.push(tokens.slice(at + 1, end));
    at = end;
  }
  return parts;
}

/**
 * Block tokens as the view draws them; `depth` counts the quotes and
 * lists around. Past `maxNesting`, a quote or list is its words.
 */
export function readBlocks(
  context: ReadingContext,
  tokens: readonly Token[],
  depth = 0,
): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  for (let at = 0; at < tokens.length; at += 1) {
    const token = tokens[at]!;
    const end = closeOf(tokens, at);
    const inner = tokens.slice(at + 1, end);
    at = end;
    switch (token.type) {
      case 'paragraph_open':
        blocks.push(...readParagraph(context, inner[0]?.children ?? []));
        break;
      case 'heading_open': {
        const children = readInlines(context, inner[0]?.children ?? []);
        const text = plainText(children).trim();
        const level = Math.min(Number(token.tag.slice(1)), 3) as 1 | 2 | 3;
        const id = context.ids.take(text);
        context.headings.push({ id, level, text });
        blocks.push({ kind: 'heading', level, id, children });
        break;
      }
      case 'bullet_list_open':
      case 'ordered_list_open':
      case 'blockquote_open': {
        if (depth >= maxNesting) {
          context.omitBlock('limit', token);
          const text = tokenText(context, inner);
          if (text)
            blocks.push({
              kind: 'paragraph',
              children: [{ kind: 'text', value: text }],
            });
          break;
        }
        if (token.type === 'blockquote_open') {
          blocks.push({
            kind: 'quote',
            children: readBlocks(context, inner, depth + 1),
          });
          break;
        }
        const ordered = token.type === 'ordered_list_open';
        blocks.push({
          kind: 'list',
          ordered,
          start: ordered ? Number(attr(token, 'start') ?? 1) : null,
          // A tight list's paragraphs are hidden: only their words show.
          tight: inner.every(
            (child) =>
              child.type !== 'paragraph_open' ||
              child.level !== token.level + 2 ||
              child.hidden,
          ),
          items: partsOf(inner, 'list_item_open').map((item) =>
            readBlocks(context, item, depth + 1),
          ),
        });
        break;
      }
      case 'code_block':
      case 'fence':
        context.omitBlock('code', token);
        // An empty block draws nothing.
        if (token.content.trim() !== '')
          blocks.push({ kind: 'paragraph', children: lines(token.content) });
        break;
      case 'hr':
        blocks.push({ kind: 'rule' });
        break;
      case 'html_block':
        context.omit('html', token.content);
        break;
      case 'table_open':
        context.omitBlock('table', token);
        break;
      default:
        // Nothing else is parsed at this level.
        break;
    }
  }
  return blocks;
}

/**
 * A `photo:` the consumer resolves to a safe address, with words for it
 * (its `alt`, or the caption): anything else is left out.
 */
function readFigure(
  context: ReadingContext,
  image: Token,
): MarkdownBlock | null {
  const src = attr(image, 'src') ?? '';
  const caption = plainText(readInlines(context, image.children ?? [])).trim();
  const id = photoId(src);
  const photo =
    id === null ? null : (context.options.resolveImage?.(id) ?? null);
  // The caption names a photo without its own words, so it is never
  // announced as decorative (screen readers then also read the caption).
  const alt =
    (typeof photo?.alt === 'string' ? photo.alt.trim() : '') || caption;
  if (!photo || !isSafeImageSrc(photo.src) || alt === '') {
    context.omit('image', `![${image.content}](${src})`);
    return null;
  }
  return { kind: 'figure', src: photo.src, alt, caption };
}

/**
 * A paragraph, split around the photos in it (outside links and marks),
 * which are figures of their own; an image left out leaves the paragraph
 * whole, one space where it was.
 */
function readParagraph(
  context: ReadingContext,
  children: readonly Token[],
): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let run: Token[] = [];
  let level = 0;
  let dropped = false;
  const flush = () => {
    const inlines: MarkdownInline[] = readInlines(context, run);
    if (plainText(inlines).trim() !== '')
      blocks.push({ kind: 'paragraph', children: trimEdges(inlines) });
    run = [];
  };
  for (const child of children) {
    if (child.type === 'image' && level === 0) {
      const figure = readFigure(context, child);
      if (figure) {
        flush();
        blocks.push(figure);
        dropped = false;
      } else dropped = true;
      continue;
    }
    level += child.nesting;
    const before = run[run.length - 1];
    if (
      dropped &&
      child.type === 'text' &&
      before?.type === 'text' &&
      /\s$/.test(before.content)
    )
      run.push({ ...child, content: child.content.trimStart() } as Token);
    else run.push(child);
    dropped = false;
  }
  flush();
  return blocks;
}
