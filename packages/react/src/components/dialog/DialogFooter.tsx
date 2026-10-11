import { type ReactNode } from 'react';

import {
  type ActionBarSummary,
  ActionBarSummaryLine,
} from '../action-bar/ActionBarSummary.js';

type DialogFooterProps = {
  summary?: ActionBarSummary;
  children?: ReactNode;
};

/**
 * The dialog's pinned footer: the summary figure (in a polite live region,
 * as in ActionBar) at the start, the actions at the end. Rendered only when
 * the dialog has a footer or a summary, and then always with its status
 * region, so a new figure is announced.
 */
export function DialogFooter({ children, summary }: DialogFooterProps) {
  return (
    <div className="sw-dialog-footer">
      <div className="sw-dialog-footer-status" role="status">
        {summary ? <ActionBarSummaryLine summary={summary} /> : null}
      </div>
      {children ? (
        <div className="sw-dialog-footer-actions">{children}</div>
      ) : null}
    </div>
  );
}
