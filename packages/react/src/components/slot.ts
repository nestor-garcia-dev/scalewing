import { type ReactNode } from 'react';

/**
 * Whether a component's slot (a row's `leading`, `tag` or `action`, a
 * chips row's `end`) holds something to draw. React renders nothing for
 * `undefined`, `null`, a boolean (the `false` of
 * `canArchive && <ActionMenu …/>`) or an empty string, so those are an
 * empty slot and add no box and no gap.
 */
export function hasSlot(node: ReactNode): boolean {
  return (
    node !== undefined &&
    node !== null &&
    node !== '' &&
    typeof node !== 'boolean'
  );
}
