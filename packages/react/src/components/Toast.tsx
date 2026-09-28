'use client';

import {
  useLayoutEffect,
  useEffect,
  useRef,
  type AnimationEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';
import { toastTones, type ToastTone } from '../css/css-toast.js';
import { spacingClassNames } from '../spacing-classes.js';
import {
  applyTravelVars,
  clearTravelVars,
  travelTranslate,
} from '../toast-travel.js';

export { toastTones };
export type { ToastTone };

export type ToastProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'popover'
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

export function Toast({
  anchor = null,
  children,
  className,
  onOpenChange,
  open,
  target = null,
  timeoutMs,
  tone = 'neutral',
  icon,
  ...rest
}: ToastProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const dismissAfter = timeoutMs ?? defaultTimeout(tone);
  const moving = travels(anchor, target);

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node || typeof node.showPopover !== 'function') {
      return;
    }
    if (!open) {
      if (node.matches(':popover-open')) {
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
  }, [anchor, moving, open, target]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (moving && !reducedMotion) {
      return;
    }
    const timer = window.setTimeout(() => {
      onOpenChange(false);
    }, dismissAfter);
    return () => {
      window.clearTimeout(timer);
    };
  }, [dismissAfter, moving, open, onOpenChange]);

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
        moving && 'sw-toast-travel',
        ...spacingClassNames({ padding: 3 }),
        className,
      )}
      onAnimationEnd={onAnimationEnd}
      popover="manual"
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      {icon ? (
        <div className="sw-toast-row">
          <span aria-hidden="true" className="sw-toast-icon">
            {icon}
          </span>
          <div className="sw-toast-body">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
