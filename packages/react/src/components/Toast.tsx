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
import { spacingClassNames } from '../spacing-classes.js';
import {
  applyTravelVars,
  clearTravelVars,
  travelTranslate,
} from '../toast-travel.js';

export type ToastProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'popover'
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeoutMs?: number;
  anchor?: Element | null;
  target?: Element | null;
  children: ReactNode;
};

const DEFAULT_TIMEOUT_MS = 800;

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
  timeoutMs = DEFAULT_TIMEOUT_MS,
  ...rest
}: ToastProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
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
    }, timeoutMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [moving, open, onOpenChange, timeoutMs]);

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
        moving && 'sw-toast-travel',
        ...spacingClassNames({ padding: 3 }),
        className,
      )}
      onAnimationEnd={onAnimationEnd}
      popover="manual"
      role="status"
    >
      {children}
    </div>
  );
}
