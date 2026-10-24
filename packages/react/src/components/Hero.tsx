import { type HTMLAttributes, type ReactNode, useId } from 'react';

import { cx } from '../class-names.js';
import { Text } from './Text.js';

export type HeroProps = Omit<
  HTMLAttributes<HTMLElement>,
  'aria-labelledby' | 'children' | 'style' | 'title'
> & {
  /** The page's title, its one `h1`, in the `hero` size. */
  title: ReactNode;
  /** A short line above the title saying who or what the page is for. */
  eyebrow?: ReactNode;
  /** The sentence under the title, in the `lead` size. */
  lead?: ReactNode;
  /**
   * Links or buttons in a row, stacked to the full width below `md`. Leave
   * it out rather than passing an empty fragment, which keeps the row.
   */
  actions?: ReactNode;
  /**
   * A picture beside the words from `md`, under them below it. Leave it out
   * rather than passing an empty fragment, which keeps its column.
   */
  media?: ReactNode;
};

function isBlank(node: ReactNode): boolean {
  return (
    node === undefined ||
    node === null ||
    node === false ||
    (typeof node === 'string' && node.trim() === '')
  );
}

/**
 * A public page's opening, as a `section` named by its title: an optional
 * eyebrow, the title (`h1`, `hero` size), an optional lead (`lead` size)
 * and actions, with an optional picture beside them from `md`. The title
 * always names the section. A blank title throws a `RangeError`.
 */
export function Hero({
  actions,
  className,
  eyebrow,
  lead,
  media,
  title,
  ...rest
}: HeroProps) {
  const titleId = useId();
  if (isBlank(title)) throw new RangeError('A Hero needs a title');
  const withMedia = !isBlank(media);
  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      className={cx('sw-hero', withMedia && 'sw-hero-with-media', className)}
    >
      <div className="sw-hero-text">
        {isBlank(eyebrow) ? null : (
          <Text color="muted" as="p" variant="label">
            {eyebrow}
          </Text>
        )}
        <Text id={titleId} variant="hero">
          {title}
        </Text>
        {isBlank(lead) ? null : <Text variant="lead">{lead}</Text>}
        {isBlank(actions) ? null : (
          <div className="sw-hero-actions">{actions}</div>
        )}
      </div>
      {withMedia ? <div className="sw-hero-media">{media}</div> : null}
    </section>
  );
}
