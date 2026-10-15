import { type ReactNode } from 'react';

import {
  type ActionBarSummary,
  ActionBarSummaryLine,
} from '../action-bar/ActionBarSummary.js';

type DialogFooterProps = {
  summary?: ActionBarSummary;
  status?: ReactNode;
  children?: ReactNode;
};

/**
 * The dialog's pinned footer: the summary figure and the status line (in
 * one polite live region, as in ActionBar) at the start, the actions at the
 * end. Rendered only when the dialog has a footer, a summary or a status,
 * and then always with its live region, so a new figure is announced.
 */
export function DialogFooter({ children, status, summary }: DialogFooterProps) {
  return (
    <div className="sw-dialog-footer">
      <div className="sw-dialog-footer-status" role="status">
        {summary ? <ActionBarSummaryLine summary={summary} /> : null}
        {status !== undefined ? (
          <span className="sw-dialog-footer-note">{status}</span>
        ) : null}
      </div>
      {children ? (
        <div className="sw-dialog-footer-actions">{children}</div>
      ) : null}
    </div>
  );
}
