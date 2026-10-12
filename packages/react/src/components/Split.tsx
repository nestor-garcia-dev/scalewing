'use client';

import { spacingScale } from '@scalewing/tokens';
import {
  useCallback,
  useId,
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
  clampSplitSize,
  splitPercent,
  type SplitMetrics,
  type SplitSnapshot,
} from '../split-size.js';
import { useSplitRange } from './use-split-range.js';

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

  const { range, measure } = useSplitRange(splitRef, handleRef);

  /**
   * `width` is the reader's chosen width; what shows is it held to the range
   * the container leaves, so an expansion never shows a pane under its
   * minimum or past the room, and a gesture starts from what shows.
   */
  function currentSnapshot(
    metrics: Pick<SplitMetrics, 'min' | 'max'> & {
      defaultWidth: number;
    },
  ) {
    return {
      collapsed,
      width: clampSplitSize(
        width ?? metrics.defaultWidth,
        metrics.min,
        metrics.max,
      ),
    };
  }

  function applySnapshot(next: SplitSnapshot, start: SplitSnapshot) {
    // Only a gesture that moves the pane chooses a width: a collapse, or a
    // move held at the end of a narrow container's range, keeps the chosen
    // one, so it shows again when the container widens.
    if (!next.collapsed && next.width !== start.width) {
      setWidth(next.width);
    }
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
    const metrics = measure();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      snapshot: currentSnapshot(metrics),
      metrics,
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
    applySnapshot(
      applySplitDrag(drag.snapshot, delta, drag.metrics),
      drag.snapshot,
    );
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
    const metrics = measure();
    const start = currentSnapshot(metrics);
    const next = applySplitKey(event.key, start, metrics);
    if (!next) {
      return;
    }
    event.preventDefault();
    applySnapshot(next, start);
  }

  // What shows: the chosen width held to the container's range.
  const shownWidth = range
    ? clampSplitSize(width ?? range.defaultWidth, range.min, range.max)
    : null;
  const valueNow =
    collapsed || !range || shownWidth === null
      ? 0
      : splitPercent(shownWidth, range.min, range.max);

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
        style={shownWidth === null ? undefined : { width: `${shownWidth}px` }}
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
