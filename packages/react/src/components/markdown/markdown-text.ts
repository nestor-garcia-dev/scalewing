import { maxExcerpt } from './markdown-limits.js';
import { type MarkdownInline } from './markdown-model.js';
import { type Token } from './parse-markdown.js';
import { type ReadingContext } from './reading-context.js';

/** Left-out text as an omission quotes it: trimmed, at most `maxExcerpt`. */
export function excerpt(text: string): string {
  const trimmed = text.trim();
  return trimmed.length > maxExcerpt
    ? `${trimmed.slice(0, maxExcerpt - 1)}…`
    : trimmed;
}

/** A run's words without its marks. */
export function plainText(inlines: readonly MarkdownInline[]): string {
  return inlines
    .map((inline) => {
      if (inline.kind === 'text') return inline.value;
      if (inline.kind === 'break') return ' ';
      return plainText(inline.children);
    })
    .join('');
}

/**
 * The words of `tokens` (block tokens, or one block's inline children),
 * in order, at any depth: a flat walk, so no nesting overflows the stack.
 * Raw HTML, tables and images are never words: each is noted as left out.
 */
export function tokenText(
  context: ReadingContext,
  tokens: readonly Token[],
): string {
  const words: string[] = [];
  let table: Token | null = null;
  for (const token of tokens) {
    if (table !== null) {
      if (token.type === 'table_close' && token.level === table.level)
        table = null;
      continue;
    }
    switch (token.type) {
      case 'table_open':
        context.omitBlock('table', token);
        table = token;
        break;
      case 'html_block':
      case 'html_inline':
        context.omit('html', token.content);
        break;
      case 'image':
        context.omit(
          'image',
          `![${token.content}](${token.attrGet('src') ?? ''})`,
        );
        break;
      case 'inline':
        words.push(tokenText(context, token.children ?? []));
        break;
      case 'text':
      case 'code_inline':
      case 'code_block':
      case 'fence':
        words.push(token.content);
        break;
      case 'softbreak':
      case 'hardbreak':
        words.push(' ');
        break;
      default:
        break;
    }
  }
  return words.join(' ').replace(/\s+/g, ' ').trim();
}

/** Code shown as plain lines, a break between each. */
export function lines(value: string): MarkdownInline[] {
  return value
    .replace(/\n$/, '')
    .split('\n')
    .flatMap((line, index) => {
      const text: MarkdownInline = { kind: 'text', value: line };
      return index === 0 ? [text] : [{ kind: 'break' as const }, text];
    });
}

/** Drops the spaces an image left at a paragraph part's edges. */
export function trimEdges(inlines: MarkdownInline[]): MarkdownInline[] {
  const result = [...inlines];
  const first = result[0];
  if (first?.kind === 'text')
    result[0] = { kind: 'text', value: first.value.trimStart() };
  const last = result[result.length - 1];
  if (last?.kind === 'text')
    result[result.length - 1] = { kind: 'text', value: last.value.trimEnd() };
  return result;
}
