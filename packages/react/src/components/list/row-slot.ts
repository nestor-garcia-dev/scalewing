import { type ReactNode } from 'react';

/**
 * Whether a row's slot (`leading`, `tag`, `action`) holds something to
 * draw. As React renders nothing for them, `undefined`, `null`, a boolean
 * (the `false` of `canArchive && <ActionMenu …/>`) and an empty string are
 * an empty slot, so they add no box and no gap.
 */
export function hasSlot(node: ReactNode): boolean {
  return (
    node !== undefined &&
    node !== null &&
    node !== '' &&
    typeof node !== 'boolean'
  );
}
