import { type CardVariant, cardVariants } from '@scalewing/tokens';
import { forwardRef, type HTMLAttributes, type ReactNode, useId } from 'react';

import { cx } from '../class-names.js';
import { Separator } from './Separator.js';
import { Text } from './Text.js';

/** The photo across the top of an article. */
export type ArticleCover = {
  src: string;
  /** What the photo shows; `''` when it only decorates. */
  alt: string;
};

export const articleTitleElements = ['h1', 'h2', 'h3'] as const;
export type ArticleTitleElement = (typeof articleTitleElements)[number];

export type ArticleProps = Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'title'
> & {
  /** The article's title, in heading type. */
  title: string;
  /**
   * `h1` (the default) on the article's own page; `h2` or `h3` where it
   * sits under another page's headings.
   */
  titleAs?: ArticleTitleElement;
  /** A short line over the title, such as "Store procedure · Services". */
  eyebrow?: ReactNode;
  /** A muted line under the title, such as "Manager 1 · Oct 16 · 4 min read". */
  meta?: ReactNode;
  /** A photo across the top, edge to edge; `null` is none. */
  cover?: ArticleCover | null;
  /** Controls at the end of the eyebrow's row, such as a language switch. */
  actions?: ReactNode;
  /** The card look, as `Card`'s. */
  variant?: CardVariant;
  /** The article's body, under a hairline. */
  children?: ReactNode;
};

function hasContent(node: ReactNode): boolean {
  return (
    node !== undefined &&
    node !== null &&
    typeof node !== 'boolean' &&
    node !== ''
  );
}

function assertArticle({ title, titleAs, cover, variant }: ArticleProps) {
  if (typeof title !== 'string' || title.trim() === '')
    throw new RangeError('Article title must be non-empty text');
  if (titleAs !== undefined && !articleTitleElements.includes(titleAs))
    throw new RangeError(`Unknown Article titleAs: ${String(titleAs)}`);
  if (variant !== undefined && !cardVariants.includes(variant))
    throw new RangeError(`Unknown Article variant: ${String(variant)}`);
  if (cover !== undefined && cover !== null) {
    if (typeof cover.src !== 'string' || cover.src.trim() === '')
      throw new RangeError('Article cover src must be non-empty text');
    if (typeof cover.alt !== 'string')
      throw new RangeError(
        "Article cover alt must be text ('' for a photo that only decorates)",
      );
  }
}

/**
 * A page that reads like a post, on a card at a reading width: an optional
 * cover photo edge to edge across the top, then the eyebrow (with the
 * consumer's actions at its row's end), the title in heading type, the
 * muted meta line, a hairline, and the body. The article is named by its
 * title (an `aria-labelledby` you pass replaces that). The ref is the
 * `article` element.
 */
export const Article = forwardRef<HTMLElement, ArticleProps>(
  function Article(props, ref) {
    assertArticle(props);
    const {
      title,
      titleAs = 'h1',
      eyebrow,
      meta,
      cover,
      actions,
      variant = 'glass',
      children,
      className,
      ...rest
    } = props;
    const titleId = useId();
    const top = hasContent(eyebrow) || hasContent(actions);
    return (
      <article
        aria-labelledby={titleId}
        className={cx('sw-card', `sw-card-${variant}`, 'sw-article', className)}
        ref={ref}
        {...rest}
      >
        {cover ? (
          <img alt={cover.alt} className="sw-article-cover" src={cover.src} />
        ) : null}
        <div className="sw-article-body">
          <header className="sw-article-header">
            {top ? (
              <div className="sw-article-top">
                {hasContent(eyebrow) ? (
                  <div className="sw-article-eyebrow">{eyebrow}</div>
                ) : null}
                {hasContent(actions) ? (
                  <div className="sw-article-actions">{actions}</div>
                ) : null}
              </div>
            ) : null}
            <Text
              as={titleAs}
              className="sw-article-title"
              id={titleId}
              variant="heading"
            >
              {title}
            </Text>
            {hasContent(meta) ? (
              <div className="sw-article-meta">{meta}</div>
            ) : null}
          </header>
          <Separator decorative />
          {hasContent(children) ? (
            <div className="sw-article-content">{children}</div>
          ) : null}
        </div>
      </article>
    );
  },
);
