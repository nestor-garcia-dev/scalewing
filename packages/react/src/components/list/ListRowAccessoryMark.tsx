import { type ListRowAccessory } from '../../list-options.js';

/** A row's chevron or check: control chrome drawn by the generated CSS. */
export function ListRowAccessoryMark({ kind }: { kind: ListRowAccessory }) {
  if (kind === 'none') return null;
  return (
    <span
      aria-hidden="true"
      className={kind === 'check' ? 'sw-list-row-check' : 'sw-list-row-chevron'}
    />
  );
}
