import { Children, Fragment, isValidElement, type ReactNode } from 'react';

import { isOneOf } from '../is-one-of.js';
import { Text } from './Text.js';

export const emptyStateTitleElements = ['h2', 'h3'] as const;

/** The title's heading level: `h2` (the default) in a page, `h3` in a card under its own heading. */
export type EmptyStateTitleElement = (typeof emptyStateTitleElements)[number];

export type EmptyStateProps = {
  /** What is empty, in the consumer's words ("No teams in Spring 2027 yet"). */
  title: string;
  /** `h2` (the default) in a page column; `h3` inside a card under its own heading. */
  titleAs?: EmptyStateTitleElement;
  /** A muted line under the title: what to do next. Not blank. */
  description?: string;
  /** A decorative glyph over the title (Lucide in the consumer), hidden from assistive technology. */
  icon?: ReactNode;
  /** The ways out, such as Buttons, in a centred row that wraps. */
  actions?: ReactNode;
};

/** Fails closed on blank words or an unknown heading level. */
function assertEmptyState({ title, titleAs, description }: EmptyStateProps) {
  if (typeof title !== 'string' || !title.trim())
    throw new RangeError('EmptyState title must be nonempty');
  if (titleAs !== undefined && !isOneOf(emptyStateTitleElements, titleAs))
    throw new RangeError(`Unknown EmptyState titleAs: ${String(titleAs)}`);
  if (
    description !== undefined &&
    (typeof description !== 'string' || !description.trim())
  )
    throw new RangeError('EmptyState description must be nonempty');
}

/**
 * Whether a slot draws anything: nothing, a boolean, blank words, an empty
 * array or a Fragment holding only those is no content, so the slot's box
 * (and its gap) is left out.
 */
function hasContent(node: ReactNode): boolean {
  return Children.toArray(node).some((child) => {
    if (typeof child === 'string') return child.trim() !== '';
    if (
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === Fragment
    )
      return hasContent(child.props.children);
    return true;
  });
}

/**
 * Where a list or a page has nothing yet: a centred panel on the surface
 * with a dashed hairline edge, an optional decorative glyph, a title, a
 * muted line and the actions that fill it. It fills its column, so it fits
 * a page column or a Card.
 */
export function EmptyState({
  title,
  titleAs = 'h2',
  description,
  icon,
  actions,
}: EmptyStateProps) {
  assertEmptyState({ title, titleAs, description });
  return (
    <div className="sw-empty-state">
      {hasContent(icon) ? (
        <span aria-hidden="true" className="sw-empty-state-icon">
          {icon}
        </span>
      ) : null}
      <Text as={titleAs} className="sw-empty-state-title" variant="title">
        {title}
      </Text>
      {description !== undefined ? (
        <Text as="p" className="sw-empty-state-description" color="muted">
          {description}
        </Text>
      ) : null}
      {hasContent(actions) ? (
        <div className="sw-empty-state-actions">{actions}</div>
      ) : null}
    </div>
  );
}
