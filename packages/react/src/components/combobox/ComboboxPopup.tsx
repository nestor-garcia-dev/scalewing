'use client';

import {
  Fragment,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type RefObject,
} from 'react';

import { cx } from '../../class-names.js';
import { Badge } from '../Badge.js';
import { useAnchoredPopover } from '../use-anchored-popover.js';
import { type ComboboxEntry } from './entries.js';
import { type ComboboxBadge, type ComboboxGroup } from './types.js';

type ComboboxPopupProps = {
  listId: string;
  listLabel: string;
  groups: readonly ComboboxGroup[];
  entries: readonly ComboboxEntry[];
  activeId: string | undefined;
  emptyText: string;
  note?: string;
  noteId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onActivate: (entry: ComboboxEntry) => void;
  onChoose: (entry: ComboboxEntry) => void;
  onDismiss: () => void;
};

function keepInputFocus(event: MouseEvent) {
  // A press in the list never takes focus from the input.
  event.preventDefault();
}

function EntryBadge({ badge }: { badge?: ComboboxBadge }) {
  if (!badge) return null;
  return (
    <Badge size="sm" tone={badge.tone ?? 'neutral'}>
      {badge.label}
    </Badge>
  );
}

/**
 * The open list beside the input, on the popover layer and at least as
 * wide as the input: a heading per group, each option's label, badge and
 * description, then the action; the empty text when nothing matches, and
 * the note under it all.
 */
export function ComboboxPopup({
  activeId,
  emptyText,
  entries,
  groups,
  inputRef,
  listId,
  listLabel,
  note,
  noteId,
  onActivate,
  onChoose,
  onDismiss,
}: ComboboxPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  useAnchoredPopover(popupRef, inputRef, inputRef, onDismiss, {
    align: 'start',
    flipInline: true,
  });

  // At least as wide as the input, and kept so when the input resizes.
  useLayoutEffect(() => {
    const popup = popupRef.current;
    const input = inputRef.current;
    if (!popup || !input) return;
    const fit = () => {
      popup.style.minWidth = `${input.offsetWidth}px`;
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(input);
    return () => observer.disconnect();
  }, [inputRef]);

  useLayoutEffect(() => {
    if (activeId)
      document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeId]);

  const options = entries.filter((entry) => entry.kind === 'option');
  const action = entries.find((entry) => entry.kind === 'action');

  function renderEntry(entry: ComboboxEntry) {
    const disabled = entry.kind === 'option' && entry.option.disabled;
    return (
      <div
        aria-disabled={disabled || undefined}
        aria-selected={entry.id === activeId}
        className={cx(
          'sw-combobox-option',
          entry.kind === 'action' && 'sw-combobox-action',
        )}
        id={entry.id}
        key={entry.id}
        onClick={() => onChoose(entry)}
        onMouseDown={keepInputFocus}
        // The pointer moves the active option, as the arrow keys do.
        onMouseMove={() => {
          if (entry.id !== activeId) onActivate(entry);
        }}
        role="option"
      >
        {entry.kind === 'option' ? (
          <>
            <span className="sw-combobox-label">{entry.option.label}</span>
            <EntryBadge badge={entry.option.badge} />
            {entry.option.description ? (
              <span className="sw-combobox-description">
                {entry.option.description}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <span className="sw-combobox-label">{entry.action.label}</span>
            <EntryBadge badge={entry.action.badge} />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="sw-combobox-popup"
      onMouseDown={keepInputFocus}
      ref={popupRef}
    >
      {entries.length > 0 ? (
        <div
          aria-label={listLabel}
          className="sw-combobox-list"
          id={listId}
          role="listbox"
        >
          {groups.map((group, groupIndex) => {
            const groupEntries = options.filter(
              (entry) =>
                entry.kind === 'option' && entry.groupIndex === groupIndex,
            );
            if (groupEntries.length === 0) return null;
            if (!group.label)
              return (
                <Fragment key={`${listId}-group-${groupIndex}`}>
                  {groupEntries.map(renderEntry)}
                </Fragment>
              );
            const headingId = `${listId}-group-${groupIndex}`;
            return (
              <div aria-labelledby={headingId} key={headingId} role="group">
                <div
                  className="sw-combobox-heading"
                  id={headingId}
                  role="presentation"
                >
                  {group.label}
                </div>
                {groupEntries.map(renderEntry)}
              </div>
            );
          })}
          {action ? renderEntry(action) : null}
        </div>
      ) : null}
      {/* The Combobox's own live region announces it, so it is read once. */}
      {options.length === 0 ? (
        <div aria-hidden="true" className="sw-combobox-empty">
          {emptyText}
        </div>
      ) : null}
      {note ? (
        <div className="sw-combobox-note" id={noteId}>
          {note}
        </div>
      ) : null}
    </div>
  );
}
