'use client';

import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useDialogCloseRequests } from './dialog-close-requests.js';
import { PaletteList } from './command-palette/PaletteList.js';
import { usePaletteShortcut } from './command-palette/shortcut.js';
import {
  type CommandPaletteItem,
  type CommandPaletteProps,
} from './command-palette/types.js';
import { assertCommandPalette } from './command-palette/validate.js';

export {
  commandPaletteShortcuts,
  type CommandPaletteGroup,
  type CommandPaletteItem,
  type CommandPaletteProps,
  type CommandPaletteShortcut,
} from './command-palette/types.js';

/** The hex of an item's id, so any id makes a valid DOM id part. */
function idPart(id: string): string {
  return Array.from(new TextEncoder().encode(id), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

/** The words the status says: loading, nothing found, or the count. */
function statusWords(
  { countText, emptyText, loading, loadingText }: CommandPaletteProps,
  count: number,
): string {
  if (loading) return loadingText ?? '';
  if (count === 0) return emptyText;
  return countText?.(count) ?? '';
}

/**
 * A search over the product, on the top layer: a modal dialog named by
 * `label` holding a field (an ARIA combobox) over an always-open listbox of
 * grouped results. ↑ and ↓ move the active row (wrapping), Enter chooses
 * it; Escape, a press outside or the shortcut again close it, and focus
 * returns to where it was. With `shortcut="mod+k"` ⌘K or Ctrl+K opens it
 * from anywhere but another text field. Invalid words or groups throw a
 * `RangeError`.
 */
export function CommandPalette(props: CommandPaletteProps) {
  assertCommandPalette(props);
  const {
    groups,
    hint,
    label,
    loading = false,
    loadingText,
    onOpenChange,
    onQueryChange,
    open,
    placeholder,
    query,
    shortcut,
  } = props;
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<Element | null>(null);
  const pointerAt = useRef<{ x: number; y: number } | null>(null);
  const [activeId, setActiveId] = useState<string>();
  // The status starts empty each time the palette opens and is filled just
  // after, so its first words are announced as a change.
  const [announcing, setAnnouncing] = useState(false);
  // Each opening and closing starts the active row over at the first item.
  const [shownOpen, setShownOpen] = useState(open);
  if (shownOpen !== open) {
    setShownOpen(open);
    setActiveId(undefined);
    setAnnouncing(false);
  }
  // A chosen item's action, run once the dialog has really closed, so it
  // can move focus to the page.
  const pendingRef = useRef<(() => void) | null>(null);
  const items = groups.flatMap((group) => group.items);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const rowId = (item: CommandPaletteItem) => `${listId}-${idPart(item.id)}`;
  const { nodeRef, handlers } = useDialogCloseRequests({
    open,
    onClose: () => onOpenChange(false),
  });

  usePaletteShortcut(
    shortcut,
    () => inputRef.current,
    () => onOpenChange(!open),
  );

  // Opening remembers where focus was (before the dialog takes it), then,
  // once the dialog is shown, selects the field's words so typing replaces
  // them. Closing hands focus back unless a chosen item moved it elsewhere.
  useLayoutEffect(() => {
    if (open) openerRef.current = document.activeElement;
  }, [open]);

  useEffect(() => {
    if (open) {
      pointerAt.current = null;
      inputRef.current?.focus();
      inputRef.current?.select();
      const timer = setTimeout(() => setAnnouncing(true), 0);
      return () => clearTimeout(timer);
    }
    const pending = pendingRef.current;
    pendingRef.current = null;
    pending?.();
    const opener = openerRef.current;
    openerRef.current = null;
    const focus = document.activeElement;
    const lost =
      !focus ||
      focus === document.body ||
      (nodeRef.current?.contains(focus) ?? false);
    if (lost && opener instanceof HTMLElement && opener.isConnected)
      opener.focus();
  }, [open, nodeRef]);

  const activeRow = active ? rowId(active) : undefined;
  const firstActive = active !== undefined && active === items[0];
  useEffect(() => {
    if (!activeRow) return;
    // The first row brings its group's caption back into view too.
    const list = document.getElementById(listId);
    if (firstActive && list) list.scrollTop = 0;
    else
      document
        .getElementById(activeRow)
        ?.scrollIntoView?.({ block: 'nearest' });
  }, [activeRow, firstActive, listId]);

  function choose(item: CommandPaletteItem) {
    pendingRef.current = item.onSelect;
    onOpenChange(false);
  }

  function move(step: 1 | -1) {
    if (items.length === 0) return;
    const index = active ? items.indexOf(active) : -1;
    const next = items[(index + step + items.length) % items.length];
    setActiveId(next?.id);
  }

  function onFieldKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (active) choose(active);
    }
  }

  function onActivate(item: CommandPaletteItem, event: PointerEvent) {
    // A list scrolled under a still pointer reports a move with no movement.
    const last = pointerAt.current;
    pointerAt.current = { x: event.clientX, y: event.clientY };
    if (last && last.x === event.clientX && last.y === event.clientY) return;
    setActiveId(item.id);
  }

  // A press anywhere but the field keeps focus in it, so the keys work on.
  function keepFocus(event: MouseEvent<HTMLDivElement>) {
    if (event.target !== inputRef.current) event.preventDefault();
  }

  const status = statusWords(props, items.length);
  const showEmpty = !loading && items.length === 0;
  return (
    <dialog
      ref={nodeRef}
      aria-label={label}
      className="sw-command-palette"
      {...handlers}
    >
      {open ? (
        <div className="sw-command-palette-body" onMouseDown={keepFocus}>
          <input
            aria-activedescendant={activeRow}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={items.length > 0}
            aria-label={label}
            autoComplete="off"
            className="sw-command-palette-field"
            onChange={(event) => {
              setActiveId(undefined);
              onQueryChange(event.target.value);
            }}
            onKeyDown={onFieldKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="text"
            value={query}
          />
          <PaletteList
            activeId={active?.id}
            groups={groups}
            label={label}
            listId={listId}
            onActivate={onActivate}
            onChoose={choose}
            rowId={rowId}
          />
          {loading || showEmpty ? (
            <p aria-hidden="true" className="sw-command-palette-message">
              {loading ? loadingText : props.emptyText}
            </p>
          ) : null}
          <div className="sw-sr-only" role="status">
            {announcing ? status : ''}
          </div>
          {hint ? <p className="sw-command-palette-hint">{hint}</p> : null}
        </div>
      ) : null}
    </dialog>
  );
}
