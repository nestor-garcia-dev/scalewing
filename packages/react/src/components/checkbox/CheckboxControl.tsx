import { forwardRef, type InputHTMLAttributes } from 'react';
import { tabStop } from '../../tab-stop.js';

type CheckboxControlProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'type'
>;

/**
 * The native checkbox and its drawn mark, the one markup Checkbox's
 * generated rules style (`input + .sw-checkbox-mark`). Shared by Checkbox
 * and MultiSelect's rows so the two cannot drift apart.
 */
export const CheckboxControl = forwardRef<
  HTMLInputElement,
  CheckboxControlProps
>(function CheckboxControl({ tabIndex, ...props }, ref) {
  return (
    <span className="sw-checkbox-control">
      <input
        ref={ref}
        tabIndex={tabIndex ?? tabStop}
        {...props}
        className="sw-checkbox-input"
        type="checkbox"
      />
      <span aria-hidden="true" className="sw-checkbox-mark" />
    </span>
  );
});
