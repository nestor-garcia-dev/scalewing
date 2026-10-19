import { type ReactNode } from 'react';

import { hasSlot } from './row-slot.js';

function ids(...parts: (string | false)[]): string | undefined {
  const joined = parts.filter(Boolean).join(' ');
  return joined === '' ? undefined : joined;
}

/**
 * A pressable row's name (its title, the unread words and its value) and
 * description (its detail lines and its tag), by the ids its parts carry.
 */
export function rowNaming(
  id: string,
  row: {
    'aria-label'?: string;
    value?: string;
    detail?: string;
    valueDetail?: string;
    unread: boolean;
    tag?: ReactNode;
  },
) {
  const hasTag = hasSlot(row.tag);
  return {
    'aria-label': row['aria-label'],
    'aria-labelledby': row['aria-label']
      ? undefined
      : ids(
          `${id}-title`,
          row.unread && `${id}-unread`,
          row.value !== undefined && `${id}-value`,
        ),
    'aria-describedby': ids(
      Boolean(row.detail) && `${id}-detail`,
      Boolean(row.valueDetail) && `${id}-value-detail`,
      hasTag && `${id}-tag`,
    ),
  };
}
