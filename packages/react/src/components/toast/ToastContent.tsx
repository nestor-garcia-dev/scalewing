import { type ReactNode } from 'react';

import { Button } from '../Button.js';

/** One press in the toast, such as "Open" for what was just saved. */
export type ToastAction = {
  label: string;
  onPress: () => void;
};

type ToastContentProps = {
  title?: string;
  icon?: ReactNode;
  action?: ToastAction;
  /** Runs the action, then closes the toast. */
  onAction: () => void;
  children: ReactNode;
};

/**
 * What the toast says. Children alone render as they always have; with a
 * title, an icon or an action they go in a row: the icon, the bold title
 * over the children as a muted detail, and the action at the end.
 */
export function ToastContent({
  action,
  children,
  icon,
  onAction,
  title,
}: ToastContentProps) {
  if (!icon && !title && !action) return <>{children}</>;

  return (
    <div className="sw-toast-row">
      {icon ? (
        <span aria-hidden="true" className="sw-toast-icon">
          {icon}
        </span>
      ) : null}
      <div className="sw-toast-body">
        {title ? <strong className="sw-toast-title">{title}</strong> : null}
        {title ? <div className="sw-toast-detail">{children}</div> : children}
      </div>
      {action ? (
        <Button
          className="sw-toast-action"
          onPress={onAction}
          size="sm"
          variant="ghost"
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export function assertToastContent(
  title: string | undefined,
  action: ToastAction | undefined,
): void {
  if (title !== undefined && (typeof title !== 'string' || !title.trim()))
    throw new RangeError('Toast title must not be empty');
  if (
    action !== undefined &&
    (typeof action.label !== 'string' ||
      !action.label.trim() ||
      typeof action.onPress !== 'function')
  )
    throw new RangeError('Toast action needs a label and an onPress');
}
