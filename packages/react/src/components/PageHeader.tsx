'use client';

import { type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { tabStop } from '../tab-stop.js';
import { plainPress } from './link-press.js';
import { Text } from './Text.js';

/** The link back to where the page was reached from, above the title. */
export type PageHeaderBack = {
  /** Its words, such as the parent page's name. */
  label: string;
  href: string;
  /**
   * Called for a plain press (the main button, no modifier key), after the
   * browser's own navigation is prevented, so a client router moves instead.
   * Without it the link navigates.
   */
  onNavigate?: () => void;
};

export type PageHeaderProps = Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'title'
> & {
  /** The page's title, its one `h1`, in the `heading` size (28/34). */
  title: ReactNode;
  /** A short muted line under the title, in the `bodySm` size (15/22). */
  subtitle?: ReactNode;
  /** A link back above the title. */
  back?: PageHeaderBack;
  /**
   * The page's actions, at the title row's end; they move under the words
   * when they do not fit beside them. Leave it out rather than passing an
   * empty fragment, which keeps the slot.
   */
  actions?: ReactNode;
  /**
   * A row under the title, such as Tabs or FilterChips that switch the page.
   * Leave it out rather than passing an empty fragment, which keeps the slot.
   */
  below?: ReactNode;
};

function isBlank(node: ReactNode): boolean {
  return (
    node === undefined ||
    node === null ||
    node === false ||
    (typeof node === 'string' && node.trim() === '')
  );
}

/** Fails closed on a header with no title or a back link with nothing to say. */
function assertPageHeader({
  back,
  title,
}: Pick<PageHeaderProps, 'back' | 'title'>): void {
  if (isBlank(title)) throw new RangeError('A PageHeader needs a title');
  if (back !== undefined && (!back.label?.trim() || !back.href?.trim()))
    throw new RangeError('A PageHeader back link needs a label and an href');
}

/**
 * A workspace page's opening: an optional link back, the title (`h1`,
 * `heading` size) with an optional muted subtitle under it and the actions at
 * its end, and an optional row below. It wraps cleanly when narrow. Place it
 * inside `main`, where a `header` is no banner landmark. A blank title or
 * back link throws a `RangeError`.
 */
export function PageHeader({
  actions,
  back,
  below,
  className,
  subtitle,
  title,
  ...rest
}: PageHeaderProps) {
  assertPageHeader({ back, title });

  function onBack(event: MouseEvent<HTMLAnchorElement>) {
    if (!back?.onNavigate || !plainPress(event)) return;
    event.preventDefault();
    back.onNavigate();
  }

  return (
    <header {...rest} className={cx('sw-page-header', className)}>
      {back ? (
        <a
          className="sw-page-header-back"
          href={back.href}
          onClick={onBack}
          tabIndex={tabStop}
        >
          {back.label}
        </a>
      ) : null}
      <div className="sw-page-header-row">
        <div className="sw-page-header-words">
          <Text as="h1" variant="heading">
            {title}
          </Text>
          {isBlank(subtitle) ? null : (
            <Text as="p" color="muted" variant="bodySm">
              {subtitle}
            </Text>
          )}
        </div>
        {isBlank(actions) ? null : (
          <div className="sw-page-header-actions">{actions}</div>
        )}
      </div>
      {isBlank(below) ? null : (
        <div className="sw-page-header-below">{below}</div>
      )}
    </header>
  );
}
