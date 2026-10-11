'use client';

import {
  useCallback,
  useLayoutEffect,
  useRef,
  type AnimationEvent,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';
import { toastTones, type ToastTone } from '../css/css-toast.js';
import { toastPlacements, type ToastPlacement } from '../css/css-toast-card.js';
import { spacingClassNames } from '../spacing-classes.js';
import {
  applyTravelVars,
  clearTravelVars,
  travelTranslate,
} from '../toast-travel.js';
import {
  assertToastContent,
  ToastContent,
  type ToastAction,
} from './toast/ToastContent.js';
import { useToastHold } from './toast/use-toast-hold.js';
import { useToastTimer } from './toast/use-toast-timer.js';

export { toastPlacements, toastTones };
export type { ToastAction, ToastPlacement, ToastTone };

export type ToastProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'popover' | 'title'
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * How long the toast stays open, in ms. Defaults to 800 for a neutral or
   * success toast and 6000 for a warning or danger one, which must be read.
   */
  timeoutMs?: number;
  anchor?: Element | null;
  target?: Element | null;
  /**
   * `success`, `warning` and `danger` tint the border and `icon`; `danger`
   * is announced as an alert, the others as a status. Default `neutral`.
   */
  tone?: ToastTone;
  /** A consumer glyph before the message, hidden from assistive technology. */
  icon?: ReactNode;
  /** A bold first line; the children become the muted detail under it. */
  title?: string;
  /**
   * One press at the end of the toast, such as "Open". It runs `onPress`,
   * then closes the toast. The toast takes the pointer while it has one.
   */
  action?: ToastAction;
  /** A thin line under the message that runs down with the time left. */
  showRemaining?: boolean;
  /**
   * `bottom` (default) centers it near the bottom edge; `top-end` puts it
   * in the top corner at the end of the line, as a card.
   */
  placement?: ToastPlacement;
  children: ReactNode;
};

const DEFAULT_TIMEOUT_MS = 800;
/** A warning or an error must be read, not glimpsed. */
const URGENT_TIMEOUT_MS = 6000;

function defaultTimeout(tone: ToastTone): number {
  return tone === 'warning' || tone === 'danger'
    ? URGENT_TIMEOUT_MS
    : DEFAULT_TIMEOUT_MS;
}

function travels(anchor?: Element | null, target?: Element | null): boolean {
  return Boolean(anchor && target);
}

function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function Toast({
  action,
  anchor = null,
  children,
  className,
  icon,
  onBlur,
  onFocus,
  onOpenChange,
  onPointerEnter,
  onPointerLeave,
  open,
  placement = 'bottom',
  showRemaining = false,
  style,
  target = null,
  timeoutMs,
  title,
  tone = 'neutral',
  ...rest
}: ToastProps) {
  assertToastContent(title, action);
  if (!(toastPlacements as readonly unknown[]).includes(placement))
    throw new RangeError(`Unknown Toast placement: ${String(placement)}`);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const dismissAfter = timeoutMs ?? defaultTimeout(tone);
  const moving = travels(anchor, target);
  const interactive = !moving && (Boolean(action) || showRemaining);
  const { handlers, paused, returnFocus } = useToastHold({
    enabled: interactive,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    open,
  });
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof node.showPopover !== 'function') {
      return;
    }
    if (!open) {
      if (node.matches(':popover-open')) {
        returnFocus(node);
        node.hidePopover();
      }
      clearTravelVars(node);
      return;
    }
    if (moving && anchor && target) {
      if (!node.matches(':popover-open')) {
        node.showPopover();
      }
      applyTravelVars(
        node,
        travelTranslate(
          anchor.getBoundingClientRect(),
          target.getBoundingClientRect(),
          node.getBoundingClientRect(),
        ),
      );
      return;
    }
    clearTravelVars(node);
    if (!node.matches(':popover-open')) {
      node.showPopover();
    }
  }, [anchor, moving, open, returnFocus, target]);

  // A travelling toast closes when its animation ends, unless motion is
  // reduced; every other toast closes on the timer, held while paused.
  useToastTimer({
    duration: dismissAfter,
    onExpire: close,
    paused,
    running: open && (!moving || reducedMotion()),
  });

  function onAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || !moving) {
      return;
    }
    onOpenChange(false);
  }

  return (
    <div
      {...rest}
      ref={nodeRef}
      className={cx(
        'sw-toast',
        tone !== 'neutral' && `sw-toast-${tone}`,
        !moving && placement !== 'bottom' && `sw-toast-${placement}`,
        interactive && 'sw-toast-interactive',
        paused && 'sw-toast-paused',
        moving && 'sw-toast-travel',
        ...spacingClassNames({ padding: 3 }),
        className,
      )}
      onAnimationEnd={onAnimationEnd}
      {...handlers}
      popover="manual"
      role={tone === 'danger' ? 'alert' : 'status'}
      style={
        showRemaining
          ? ({
              ...style,
              '--sw-toast-duration': `${dismissAfter}ms`,
            } as CSSProperties)
          : style
      }
    >
      <ToastContent
        action={action}
        icon={icon}
        onAction={() => {
          action?.onPress();
          close();
        }}
        title={title}
      >
        {children}
      </ToastContent>
      {showRemaining && open && !moving ? (
        <span aria-hidden="true" className="sw-toast-remaining" />
      ) : null}
    </div>
  );
}
