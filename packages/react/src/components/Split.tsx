'use client';

import { spacingScale } from '@scalewing/tokens';
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';
import {
  applySplitDrag,
  applySplitKey,
  cssLengthToPx,
  effectiveSplitMax,
  readSplitMetrics,
  splitPercent,
  type SplitMetrics,
  type SplitSnapshot,
} from '../split-size.js';

export type SplitProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: ReactNode;
  label: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

type DragSession = {
  pointerId: number;
  startX: number;
  snapshot: SplitSnapshot;
  metrics: SplitMetrics;
  moved: boolean;
};

function metricsFrom(node: HTMLElement) {
  const styles = getComputedStyle(node);
  const remPx =
    cssLengthToPx(getComputedStyle(document.documentElement).fontSize) || 16;
  return readSplitMetrics((name) => styles.getPropertyValue(name), remPx);
}

export function Split({
  children,
  className,
  collapsed: collapsedProp,
  label,
  onCollapsedChange,
  ...rest
}: SplitProps) {
  const paneId = useId();
  const splitRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [range, setRange] = useState<Pick<SplitMetrics, 'min' | 'max'> | null>(
    null,
  );
  const [collapsedUncontrolled, setCollapsedUncontrolled] = useState(false);
  const collapsed = collapsedProp ?? collapsedUncontrolled;

  const setCollapsed = useCallback(
    (next: boolean) => {
      onCollapsedChange?.(next);
      if (collapsedProp === undefined) {
        setCollapsedUncontrolled(next);
      }
    },
    [collapsedProp, onCollapsedChange],
  );

  useLayoutEffect(() => {
    const node = splitRef.current;
    if (!node) {
      return;
    }
    const measured = metricsFrom(node);
    setRange({ min: measured.min, max: measured.max });
    setWidth((current) => current ?? measured.defaultWidth);
  }, []);

  function dragMetrics(): SplitMetrics & { defaultWidth: number } {
    const split = splitRef.current;
    const handle = handleRef.current;
    if (!split) {
      return { min: 0, max: 0, step: 16, defaultWidth: 0 };
    }
    const measured = metricsFrom(split);
    const parentWidth = split.parentElement?.getBoundingClientRect().width ?? 0;
    const handleWidth = handle?.getBoundingClientRect().width ?? 0;
    return {
      ...measured,
      max: effectiveSplitMax(
        measured.max,
        parentWidth,
        handleWidth,
        measured.min,
      ),
    };
  }

  function currentSnapshot(): SplitSnapshot {
    const measured = dragMetrics();
    return {
      collapsed,
      width: width ?? measured.defaultWidth,
    };
  }

  function applySnapshot(next: SplitSnapshot) {
    setWidth(next.width);
    if (next.collapsed !== collapsed) {
      setCollapsed(next.collapsed);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !splitRef.current) {
      return;
    }
    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      snapshot: currentSnapshot(),
      metrics: dragMetrics(),
      moved: false,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) >= spacingScale[1]) {
      drag.moved = true;
    }
    applySnapshot(applySplitDrag(drag.snapshot, delta, drag.metrics));
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) {
      return;
    }
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (!drag.moved && drag.snapshot.collapsed) {
      setCollapsed(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!splitRef.current) {
      return;
    }
    const next = applySplitKey(event.key, currentSnapshot(), dragMetrics());
    if (!next) {
      return;
    }
    event.preventDefault();
    applySnapshot(next);
  }

  const valueNow = collapsed
    ? 0
    : range && width !== null
      ? splitPercent(width, range.min, range.max)
      : 0;

  return (
    <div
      {...rest}
      ref={splitRef}
      className={cx('sw-split', className)}
      data-collapsed={collapsed ? '' : undefined}
    >
      <div
        className="sw-split-pane"
        id={paneId}
        aria-hidden={collapsed || undefined}
        style={width === null ? undefined : { width: `${width}px` }}
      >
        {children}
      </div>
      <div
        ref={handleRef}
        aria-controls={paneId}
        aria-label={collapsed ? `Show ${label}` : `Resize ${label}`}
        aria-orientation="vertical"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={valueNow}
        className="sw-split-handle"
        onKeyDown={onKeyDown}
        onPointerCancel={endDrag}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        role="separator"
        tabIndex={0}
      >
        <span aria-hidden="true" className="sw-split-grip" />
      </div>
    </div>
  );
}
