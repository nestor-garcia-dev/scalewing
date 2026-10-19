import { maxExcerpt, maxNesting } from './markdown-limits.js';
import { type MarkdownInline } from './markdown-model.js';
import { safeLinkHref } from './markdown-rules.js';
import { plainText } from './markdown-text.js';
import { type Token } from './parse-markdown.js';
import { type ReadingContext } from './reading-context.js';

/** A token's attribute, read without its methods (tokens may be copies). */
export function attr(token: Token, name: string): string | null {
  return token.attrs?.find(([key]) => key === name)?.[1] ?? null;
}

type Frame = {
  kind: 'root' | 'strong' | 'emphasis' | 'link';
  href: string | null;
  children: MarkdownInline[];
};

function close(context: ReadingContext, frame: Frame, parent: Frame): void {
  if (frame.kind === 'root') return;
  if (frame.kind !== 'link') {
    parent.children.push({ kind: frame.kind, children: frame.children });
    return;
  }
  const href = safeLinkHref(frame.href ?? '');
  if (href !== null) {
    parent.children.push({ kind: 'link', href, children: frame.children });
    return;
  }
  context.omit('link', `[${plainText(frame.children)}](${frame.href ?? ''})`);
  // Links never hold links, so each word moves up once.
  for (const child of frame.children) parent.children.push(child);
}

/**
 * One block's inline tokens as the view's inlines: text, breaks, bold,
 * italic and links. A link's address must pass `safeLinkHref`, or its
 * words stay as text; raw HTML and images here are left out; code is its
 * words; marks nested past `maxNesting` are their words.
 */
export function readInlines(
  context: ReadingContext,
  tokens: readonly Token[],
): MarkdownInline[] {
  const root: Frame = { kind: 'root', href: null, children: [] };
  const stack: Frame[] = [root];
  // Marks past `maxNesting` open no frame: their words go straight into
  // the deepest drawn one, so each word is placed once at any depth.
  let flat = 0;
  let flatWords = '';
  // Links never hold links: the open one's address, quoted when it shuts.
  const flatLinks: (string | null)[] = [];
  const quote = (text: string) => {
    if (flatWords.length < maxExcerpt) flatWords += text;
  };
  const open = (kind: Frame['kind'], href: string | null) => {
    if (flat > 0 || stack.length > maxNesting) {
      flat += 1;
      // A link this deep is drawn as its words; the run's one omission
      // quotes it as `[words](address)`.
      flatLinks.push(kind === 'link' ? (href ?? '') : null);
      if (kind === 'link') quote('[');
      return;
    }
    stack.push({ kind, href, children: [] });
  };
  const shut = () => {
    if (flat > 0) {
      flat -= 1;
      const link = flatLinks.pop();
      if (link !== null && link !== undefined) quote(`](${link})`);
      if (flat === 0) {
        context.omit('limit', flatWords);
        flatWords = '';
      }
      return;
    }
    if (stack.length > 1)
      close(context, stack.pop()!, stack[stack.length - 1]!);
  };
  const words = (value: string) => {
    stack[stack.length - 1]!.children.push({ kind: 'text', value });
    if (flat > 0) quote(value);
  };
  for (const token of tokens) {
    const top = stack[stack.length - 1]!;
    switch (token.type) {
      case 'text':
      case 'text_special':
        words(token.content);
        break;
      case 'softbreak':
        words('\n');
        break;
      case 'hardbreak':
        top.children.push({ kind: 'break' });
        break;
      case 'code_inline':
        context.omit('code', `\`${token.content}\``);
        words(token.content);
        break;
      case 'html_inline':
        context.omit('html', token.content);
        break;
      case 'image':
        // An image in a link, a mark or a heading: never drawn there.
        context.omit(
          'image',
          `![${token.content}](${attr(token, 'src') ?? ''})`,
        );
        break;
      case 'strong_open':
        open('strong', null);
        break;
      case 'em_open':
        open('emphasis', null);
        break;
      case 'link_open':
        open('link', attr(token, 'href'));
        break;
      case 'strong_close':
      case 'em_close':
      case 'link_close':
        shut();
        break;
      default:
        // Nothing else is parsed (no strikethrough, no footnotes); any
        // other token's words, if it has them, stay as text.
        if (token.content) words(token.content);
    }
  }
  while (flat > 0) shut();
  while (stack.length > 1)
    close(context, stack.pop()!, stack[stack.length - 1]!);
  return root.children;
}
