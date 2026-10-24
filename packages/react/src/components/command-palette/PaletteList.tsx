import { type PointerEvent } from 'react';

import { type CommandPaletteGroup, type CommandPaletteItem } from './types.js';

type PaletteListProps = {
  listId: string;
  label: string;
  groups: readonly CommandPaletteGroup[];
  activeId: string | undefined;
  /** The row's DOM id from the item's id. */
  rowId: (item: CommandPaletteItem) => string;
  onActivate: (item: CommandPaletteItem, event: PointerEvent) => void;
  onChoose: (item: CommandPaletteItem) => void;
};

/**
 * The always-open results: a listbox named by the palette's label, each
 * group a `group` under its caption, each item its mark (hidden), label and
 * detail, and the active row's Enter key hint (hidden: Enter is how a
 * listbox row is chosen).
 */
export function PaletteList({
  activeId,
  groups,
  label,
  listId,
  onActivate,
  onChoose,
  rowId,
}: PaletteListProps) {
  return (
    <div
      aria-label={label}
      className="sw-command-palette-list"
      hidden={!groups.some((group) => group.items.length > 0)}
      id={listId}
      role="listbox"
    >
      {groups.map((group, index) => {
        if (group.items.length === 0) return null;
        const headingId = `${listId}-group-${index}`;
        return (
          <div aria-labelledby={headingId} key={group.id} role="group">
            <div
              className="sw-command-palette-heading"
              id={headingId}
              role="presentation"
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = item.id === activeId;
              return (
                <div
                  aria-selected={active}
                  className="sw-command-palette-item"
                  id={rowId(item)}
                  key={item.id}
                  onClick={() => onChoose(item)}
                  onPointerMove={(event) => {
                    if (!active) onActivate(item, event);
                  }}
                  role="option"
                >
                  {item.icon ? (
                    <span
                      aria-hidden="true"
                      className="sw-command-palette-icon"
                    >
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="sw-command-palette-words">
                    <span className="sw-command-palette-label">
                      {item.label}
                    </span>
                    {item.detail ? (
                      <>
                        {' '}
                        <span className="sw-command-palette-detail">
                          {item.detail}
                        </span>
                      </>
                    ) : null}
                  </span>
                  {active ? (
                    <span aria-hidden="true" className="sw-command-palette-key">
                      ↵
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
