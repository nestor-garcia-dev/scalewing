import { type ButtonSize } from '@scalewing/tokens';
import {
  type ButtonDisabledAppearance,
  buttonClassNames,
  buttonDisabledAppearances,
  type WebButtonVariant,
} from '../css/css-button.js';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { tabStop } from '../tab-stop.js';

/** The web variants: the shared tiers plus `neutral`. */
export type ButtonVariant = WebButtonVariant;

export type { ButtonDisabledAppearance, ButtonSize };

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'type'
> & {
  children: ReactNode;
  onPress: () => void;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  /**
   * `primary` (default), `secondary`, `tertiary`, `ghost`, `danger`, or
   * `neutral`: a quiet grey fill in the text color, for an action beside the
   * primary that should not draw the eye.
   */
  variant?: ButtonVariant;
  /**
   * How the button looks while `disabled`: `faded` (default) fades its
   * variant; `neutral` draws it on the quiet grey fill with muted words,
   * whatever its variant (a ghost button still fades).
   */
  disabledAppearance?: ButtonDisabledAppearance;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      disabled = false,
      disabledAppearance = 'faded',
      onPress,
      size = 'md',
      tabIndex,
      type = 'button',
      variant = 'primary',
      ...rest
    },
    ref,
  ) {
    if (
      !(buttonDisabledAppearances as readonly unknown[]).includes(
        disabledAppearance,
      )
    )
      throw new RangeError(
        `Unknown Button disabledAppearance: ${String(disabledAppearance)}`,
      );
    return (
      <button
        ref={ref}
        className={cx(
          ...buttonClassNames({ size, variant, disabledAppearance }),
          className,
        )}
        disabled={disabled}
        tabIndex={tabIndex ?? tabStop}
        type={type}
        {...rest}
        onClick={onPress}
      >
        {children}
      </button>
    );
  },
);
