import {
  Children,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';
import {
  type NoticeTone,
  type NoticeVariant,
  noticeTones,
  noticeVariants,
} from '../css/css-notice.js';

export { noticeTones, noticeVariants };
export type { NoticeTone, NoticeVariant };

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
  /**
   * Defaults to `alert` for danger and `status` for the other tones; a band
   * is page chrome and defaults to `none`.
   */
  role?: NoticeRole;
  /**
   * `band` is a full-width square strip in caption type, its words
   * centered, such as an environment strip above the app header.
   */
  variant?: NoticeVariant;
};

const noticeRoles: readonly NoticeRole[] = ['status', 'alert', 'none'];

function defaultRole(tone: NoticeTone, variant: NoticeVariant): NoticeRole {
  if (variant === 'band') return 'none';
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
  variant: NoticeVariant,
  hasMessage: boolean,
): void {
  if (!(noticeVariants as readonly unknown[]).includes(variant))
    throw new RangeError(`Unknown Notice variant: ${String(variant)}`);
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
 * until the consumer removes it. `variant="band"` is the same note as a
 * full-width strip of page chrome. Pass `tabIndex={-1}` and a ref to move
 * focus to it.
 */
export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  {
    action,
    children,
    className,
    icon,
    role,
    title,
    tone,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const parts = messageParts(children);
  const hasMessage = parts.length > 0;
  assertNoticeProps(tone, title, role, variant, hasMessage);
  const announced = role ?? defaultRole(tone, variant);

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        'sw-notice',
        `sw-notice-${tone}`,
        variant === 'band' && 'sw-notice-band',
        className,
      )}
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
