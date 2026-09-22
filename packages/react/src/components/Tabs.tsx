import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useRef,
} from 'react';

import { cx } from '../class-names.js';

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
 * sideways when it overflows. Pair each item with a `TabPanel`.
 */
export function Tabs({ id, items, onChange, value, ...labelProps }: TabsProps) {
  const tabs = useRef(new Map<string, HTMLButtonElement>());

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
      className="sw-tabs"
      onKeyDown={onKeyDown}
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
