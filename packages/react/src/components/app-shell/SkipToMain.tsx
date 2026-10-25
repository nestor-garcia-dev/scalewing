import { type RefObject } from 'react';

import { tabStop } from '../../tab-stop.js';

type SkipToMainProps = {
  label: string;
  mainId: string;
  mainRef: RefObject<HTMLElement | null>;
};

/**
 * The shell's first focusable element. A press (Enter included) moves
 * focus to `main` itself rather than following the fragment, so a hash
 * router's address and the history stay as they were; the `href` keeps it
 * a real link to the same place.
 */
export function SkipToMain({ label, mainId, mainRef }: SkipToMainProps) {
  return (
    <a
      className="sw-app-shell-skip-link"
      href={`#${mainId}`}
      onClick={(event) => {
        event.preventDefault();
        mainRef.current?.focus();
      }}
      tabIndex={tabStop}
    >
      {label}
    </a>
  );
}
