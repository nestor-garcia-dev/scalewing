import { type ButtonSize } from '@scalewing/tokens';
import {
  type ButtonDisabledAppearance,
  buttonClassNames,
  buttonDisabledAppearances,
  type WebButtonVariant,
} from '../css/css-button.js';
import {
  type ButtonWidth,
  buttonWidthClass,
  buttonWidths,
} from '../css/css-button-width.js';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { tabStop } from '../tab-stop.js';

/** The web variants: the shared tiers plus `neutral`. */
export type ButtonVariant = WebButtonVariant;

export type { ButtonDisabledAppearance, ButtonSize, ButtonWidth };

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
  /**
   * `content` (default) is as wide as the words; `full` fills the
   * container, and in an Inline row the space its siblings leave, such as
   * an Edit beside a ••• menu.
   */
  width?: ButtonWidth;
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
      width = 'content',
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
    if (!(buttonWidths as readonly unknown[]).includes(width))
      throw new RangeError(`Unknown Button width: ${String(width)}`);
    return (
      <button
        ref={ref}
        className={cx(
          ...buttonClassNames({ size, variant, disabledAppearance }),
          buttonWidthClass(width),
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
