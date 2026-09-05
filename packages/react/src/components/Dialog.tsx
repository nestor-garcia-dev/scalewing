'use client';

import {
  useEffect,
  useId,
  useRef,
  type DialogHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from 'react';

import { cx } from '../class-names.js';
import { spacingClassNames } from '../spacing-classes.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type DialogProps = Omit<
  DialogHTMLAttributes<HTMLDialogElement>,
  'onClose' | 'open' | 'title' | 'children'
> & {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Dialog({
  children,
  className,
  onClose,
  open,
  title,
  ...rest
}: DialogProps) {
  const nodeRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) {
      return;
    }
    if (open) {
      if (!node.open) {
        node.showModal();
      }
      return;
    }
    if (node.open) {
      node.close();
    }
  }, [open]);

  return (
    <dialog
      {...rest}
      ref={nodeRef}
      aria-labelledby={titleId}
      className={cx(
        'sw-dialog',
        ...spacingClassNames({ padding: 5 }),
        className,
      )}
      onClose={onClose}
      onPointerDown={(event: PointerEvent<HTMLDialogElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!inside) {
          onClose();
        }
      }}
    >
      <Stack gap={4}>
        <Text id={titleId} variant="title">
          {title}
        </Text>
        {children}
      </Stack>
    </dialog>
  );
}
