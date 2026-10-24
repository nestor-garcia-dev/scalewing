import { useId, type MouseEvent } from 'react';

import { plainPress } from '../link-press.js';
import { AppShellLink } from './AppShellLink.js';
import { type AppShellNavGroup, type AppShellNavItem } from './types.js';

export type AppShellNavProps = {
  navLabel: string;
  groups: readonly AppShellNavGroup[];
  onNavigate?: (item: AppShellNavItem) => void;
  /** The drawer's: a plain press on a destination also closes it. */
  onChoose?: () => void;
  /** The sidebar's: whether the rail's tooltips show (see AppShellLink). */
  tooltip?: boolean;
};

/**
 * The shell's navigation landmark: each group a list named by its label,
 * the same in the sidebar and the drawer.
 */
export function AppShellNav({
  groups,
  navLabel,
  onChoose,
  onNavigate,
  tooltip,
}: AppShellNavProps) {
  const idPrefix = useId();

  // Only a given onNavigate or onChoose attaches a handler.
  function pressHandler(item: AppShellNavItem) {
    if (!onNavigate && !onChoose) return undefined;
    return (event: MouseEvent<HTMLAnchorElement>) => {
      if (!plainPress(event)) return;
      if (onNavigate) {
        event.preventDefault();
        onNavigate(item);
      }
      onChoose?.();
    };
  }

  return (
    <nav aria-label={navLabel} className="sw-app-shell-nav">
      {groups.map((group, index) => {
        const labelId = `${idPrefix}-group-${index}`;
        return (
          <div className="sw-app-shell-group" key={group.id}>
            {group.label ? (
              <p className="sw-app-shell-group-label" id={labelId}>
                {group.label}
              </p>
            ) : null}
            <ul
              aria-labelledby={group.label ? labelId : undefined}
              className="sw-app-shell-list"
            >
              {group.items.map((item) => (
                <AppShellLink
                  item={item}
                  key={item.id}
                  onClick={pressHandler(item)}
                  tooltip={tooltip}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
