import type { MouseEvent, ReactNode } from 'react';
import { tabStop } from '../../tab-stop.js';

type SearchFrameProps = {
  children: ReactNode;
  leading?: ReactNode;
  clearLabel: string;
  /** Shown while the input holds text and is enabled. */
  showClear: boolean;
  onClear: () => void;
};

/*
 * A press on the frame's chrome (the glyph or the padding) focuses the
 * input, as on an adorned field; a press on the input keeps the browser's
 * own caret placement, and the clear button runs its own action.
 */
function focusSearchInput(event: MouseEvent<HTMLSpanElement>) {
  const input = event.currentTarget.querySelector('input');
  const target = event.target as Element;
  if (!input || input.disabled || target === input) return;
  event.preventDefault();
  // The clear button keeps focus in the input: no blur, and its click
  // still runs.
  if (target.closest('.sw-field-search-clear')) return;
  input.focus();
}

/**
 * The search field's frame: the consumer's glyph at the start (hidden from
 * assistive technology), the input, and a clear button at the end while
 * there is text. Clearing calls `onClear` and puts focus back in the input.
 */
export function SearchFrame({
  children,
  clearLabel,
  leading,
  onClear,
  showClear,
}: SearchFrameProps) {
  return (
    <span
      className="sw-field-adorned sw-field-search"
      onMouseDown={focusSearchInput}
    >
      {leading != null && leading !== false ? (
        <span aria-hidden="true" className="sw-field-search-leading">
          {leading}
        </span>
      ) : null}
      {children}
      {showClear ? (
        <button
          aria-label={clearLabel}
          className="sw-field-search-clear"
          onClick={(event) => {
            // Focus first, so a consumer that moves focus in onClear wins.
            event.currentTarget.parentElement
              ?.querySelector<HTMLInputElement>('input')
              ?.focus();
            onClear();
          }}
          tabIndex={tabStop}
          type="button"
        >
          <span aria-hidden="true" className="sw-field-search-cross" />
        </button>
      ) : null}
    </span>
  );
}
