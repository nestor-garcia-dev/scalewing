import { type ButtonSize, type ButtonVariant } from '@scalewing/tokens';
import { buttonClassNames } from '../css/css-button.js';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';

export type { ButtonSize, ButtonVariant };

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'type'
> & {
  children: ReactNode;
  onPress: () => void;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      disabled = false,
      onPress,
      size = 'md',
      type = 'button',
      variant = 'primary',
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cx(...buttonClassNames({ size, variant }), className)}
        disabled={disabled}
        type={type}
        {...rest}
        onClick={onPress}
      >
        {children}
      </button>
    );
  },
);
