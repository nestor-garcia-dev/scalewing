'use client';

import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useRef,
} from 'react';

import { cx } from '../class-names.js';
import { useScrollOverflow } from './use-scroll-overflow.js';

export type TabItem = {
  id: string;
  label: ReactNode;
};

type TabsLabel =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type TabsProps = TabsLabel & {
  /** Prefix for the tab and panel ids, so a `TabPanel` can point back at its tab. */
  id: string;
  items: readonly TabItem[];
  value: string;
  onChange: (id: string) => void;
  /**
   * Keep the strip at the top of the viewport, under the top safe area,
   * while a long panel scrolls under it. Off by default. The stuck strip is
   * a full-bleed band of the page canvas, not a glass card: the canvas
   * color, a little see-through over the glass blur, with its hairline
   * underneath; solid under Reduce Transparency and in forced colors. It
   * shares the sticky `AppHeader`'s layer, so a page uses one or the other
   * at the top edge.
   *
   * A sticky element only sticks within its parent. Make the strip a direct
   * child of the long page container that also holds the panels, not of a
   * padded `Box` round the strip alone; an ancestor whose `overflow` is not
   * `visible` becomes the box it sticks to. Put the page's side gutter on
   * the title and the panels rather than on that container: each tab
   * already has the md control's inline padding (16 px, spacing step 4), so
   * the first label lines up with a `space-4` page gutter when the strip
   * runs edge to edge.
   */
  sticky?: boolean;
};

export function tabId(tabsId: string, id: string): string {
  return `${tabsId}-tab-${id}`;
}

export function tabPanelId(tabsId: string, id: string): string {
  return `${tabsId}-panel-${id}`;
}

/**
 * A tab strip with `tablist` semantics for the sections of one page. Arrow
 * keys, Home and End move the focus and select at once; the strip scrolls
 * sideways when it overflows, and an edge with labels past it draws a shade
 * (`sw-scroll-more-start`, `sw-scroll-more-end`), as a wide `Table` does.
 * Pair each item with a `TabPanel`. `sticky`
 * keeps it at the top of the viewport over a long panel.
 */
export function Tabs({
  id,
  items,
  onChange,
  sticky = false,
  value,
  ...labelProps
}: TabsProps) {
  const tabs = useRef(new Map<string, HTMLButtonElement>());
  const strip = useRef<HTMLDivElement>(null);
  const overflow = useScrollOverflow(strip);

  function select(next: TabItem | undefined) {
    if (!next || next.id === value) {
      return;
    }
    onChange(next.id);
    tabs.current.get(next.id)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((item) => item.id === value);
    if (index < 0) {
      return;
    }
    const last = items.length - 1;
    const target =
      event.key === 'ArrowRight'
        ? items[index === last ? 0 : index + 1]
        : event.key === 'ArrowLeft'
          ? items[index === 0 ? last : index - 1]
          : event.key === 'Home'
            ? items[0]
            : event.key === 'End'
              ? items[last]
              : undefined;
    if (!target) {
      return;
    }
    event.preventDefault();
    select(target);
  }

  return (
    <div
      className={cx(
        'sw-tabs',
        sticky && 'sw-tabs-sticky',
        overflow.start && 'sw-scroll-more-start',
        overflow.end && 'sw-scroll-more-end',
      )}
      onKeyDown={onKeyDown}
      ref={strip}
      role="tablist"
      {...labelProps}
    >
      {items.map((item) => {
        const selected = item.id === value;

        return (
          <button
            aria-controls={tabPanelId(id, item.id)}
            aria-selected={selected}
            className={cx('sw-tab', selected && 'sw-tab-selected')}
            id={tabId(id, item.id)}
            key={item.id}
            onClick={() => select(item)}
            ref={(node) => {
              if (node) {
                tabs.current.set(item.id, node);
              } else {
                tabs.current.delete(item.id);
              }
            }}
            role="tab"
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export type TabPanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
  /** The `id` of the `Tabs` this panel belongs to. */
  tabsId: string;
  /** The item id this panel shows. */
  id: string;
  /** The current `Tabs` value; the panel hides itself when another tab is current. */
  value: string;
  children: ReactNode;
};

/** The content of one tab, labelled by its tab and hidden while another tab is current. */
export function TabPanel({
  children,
  className,
  id,
  tabsId,
  value,
  ...rest
}: TabPanelProps) {
  return (
    <div
      aria-labelledby={tabId(tabsId, id)}
      className={cx('sw-tab-panel', className)}
      hidden={value !== id}
      id={tabPanelId(tabsId, id)}
      role="tabpanel"
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  );
}
