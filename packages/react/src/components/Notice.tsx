import {
  Children,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';
import { type NoticeTone, noticeTones } from '../css/css-notice.js';

export { noticeTones };
export type { NoticeTone };

/**
 * How the notice is announced: `status` (polite), `alert` (assertive), or
 * `none` (not a live region, for a notice that is part of the page from the
 * start and needs no announcement).
 */
export type NoticeRole = 'status' | 'alert' | 'none';

export type NoticeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'title'
> & {
  /** The meaning, which sets the fill, the words' color and the default role. */
  tone: NoticeTone;
  /** A bold lead before the message, such as "$30.00 short." */
  title?: string;
  /**
   * The message. Text (values interpolated in it included) shares the
   * title's row while it fits; any element (a `span`, a field, a checkbox)
   * puts the message under the title.
   */
  children?: ReactNode;
  /** One action after the text, such as a link or a small Button. */
  action?: ReactNode;
  /** A consumer glyph (Lucide) before the text, hidden from assistive technology. */
  icon?: ReactNode;
  /** Defaults to `alert` for danger and `status` for the other tones. */
  role?: NoticeRole;
};

const noticeRoles: readonly NoticeRole[] = ['status', 'alert', 'none'];

function defaultRole(tone: NoticeTone): NoticeRole {
  return tone === 'danger' ? 'alert' : 'status';
}

/**
 * The message's parts, without the empty ones (`false`, `null`,
 * `undefined`, `''`) a condition leaves; fragments flatten.
 */
function messageParts(children: ReactNode): ReactNode[] {
  return Children.toArray(children).filter((part) => part !== '');
}

/** A sentence, even one with values interpolated, may share the title's row. */
function isText(parts: ReactNode[]): boolean {
  return parts.every(
    (part) => typeof part === 'string' || typeof part === 'number',
  );
}

function assertNoticeProps(
  tone: NoticeTone,
  title: string | undefined,
  role: NoticeRole | undefined,
  hasMessage: boolean,
): void {
  if (!(noticeTones as readonly unknown[]).includes(tone))
    throw new RangeError(`Unknown Notice tone: ${String(tone)}`);
  if (title !== undefined && (typeof title !== 'string' || !title.trim()))
    throw new RangeError('Notice title must not be empty');
  if (role !== undefined && !noticeRoles.includes(role))
    throw new RangeError(`Unknown Notice role: ${String(role)}`);
  if (title === undefined && !hasMessage)
    throw new RangeError('Notice needs a title or a message');
}

/**
 * A tinted note in the page's flow: information, a good outcome, a caution
 * or a refusal, with an optional bold lead, glyph and one action. It stays
 * until the consumer removes it. Pass `tabIndex={-1}` and a ref to move
 * focus to it.
 */
export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  { action, children, className, icon, role, title, tone, ...rest },
  ref,
) {
  const parts = messageParts(children);
  const hasMessage = parts.length > 0;
  assertNoticeProps(tone, title, role, hasMessage);
  const announced = role ?? defaultRole(tone);

  return (
    <div
      {...rest}
      ref={ref}
      className={cx('sw-notice', `sw-notice-${tone}`, className)}
      role={announced === 'none' ? undefined : announced}
    >
      {icon ? (
        <span aria-hidden="true" className="sw-notice-icon">
          {icon}
        </span>
      ) : null}
      <div
        className={cx(
          'sw-notice-content',
          hasMessage && !isText(parts) && 'sw-notice-stacked',
        )}
      >
        {title ? <strong className="sw-notice-title">{title}</strong> : null}
        {hasMessage ? <div className="sw-notice-body">{children}</div> : null}
      </div>
      {action ? <div className="sw-notice-action">{action}</div> : null}
    </div>
  );
});
