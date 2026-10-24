'use client';

import { useEffect, useRef } from 'react';

import { type CommandPaletteShortcut } from './types.js';

/** Whether the system's command key is ⌘ (Apple) rather than Ctrl. */
export function usesCommandKey(platform: string): boolean {
  return /mac|iphone|ipad|ipod/i.test(platform);
}

function systemPlatform(): string {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  return nav.userAgentData?.platform || nav.platform || nav.userAgent || '';
}

/** An element a person types into: a text field, a select or editable text. */
export function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
    return true;
  if (!(target instanceof HTMLInputElement)) return false;
  return ![
    'button',
    'checkbox',
    'radio',
    'range',
    'color',
    'file',
    'image',
    'reset',
    'submit',
  ].includes(target.type);
}

type ShortcutKey = Pick<
  KeyboardEvent,
  | 'key'
  | 'code'
  | 'metaKey'
  | 'ctrlKey'
  | 'altKey'
  | 'shiftKey'
  | 'repeat'
  | 'isComposing'
>;

/**
 * ⌘K on an Apple system or Ctrl+K elsewhere, with no other modifier: the K
 * the layout types, or the key in K's place (`KeyK`) on a layout that types
 * another letter there, such as Cyrillic or Greek.
 */
export function isModK(event: ShortcutKey, commandKey: boolean): boolean {
  if (event.repeat || event.isComposing) return false;
  const isK = event.key.toLowerCase() === 'k' || event.code === 'KeyK';
  if (!isK || event.altKey || event.shiftKey) return false;
  return commandKey
    ? event.metaKey && !event.ctrlKey
    : event.ctrlKey && !event.metaKey;
}

/**
 * Listens on the document for the palette's shortcut while `shortcut` is
 * set: it calls `onToggle` (and stops the browser's own use of the keys)
 * unless focus is in another text field than `ownField`.
 */
export function usePaletteShortcut(
  shortcut: CommandPaletteShortcut | null | undefined,
  ownField: () => HTMLElement | null,
  onToggle: () => void,
): void {
  const latest = useRef({ ownField, onToggle });
  useEffect(() => {
    latest.current = { ownField, onToggle };
  });

  useEffect(() => {
    if (shortcut !== 'mod+k') return;
    const commandKey = usesCommandKey(systemPlatform());
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || !isModK(event, commandKey)) return;
      const target = event.target;
      if (isEditable(target) && target !== latest.current.ownField()) return;
      event.preventDefault();
      latest.current.onToggle();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcut]);
}
