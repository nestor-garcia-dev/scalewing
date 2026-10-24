import { type ReactNode } from 'react';

/** One tile: `id` keys it and is never shown; `label` sits over `value`. */
export type PreviewTile = { id: string; label: ReactNode; value: ReactNode };

export type PreviewTilesProps = { items: readonly PreviewTile[] };

/**
 * A row of small tiles in a `ScreenPreview`, each a label over its value,
 * such as counts by kind: three to a row on a phone, six from `md`. No
 * items, or a blank or repeated id, throws a `RangeError`.
 */
export function PreviewTiles({ items }: PreviewTilesProps) {
  if (items.length === 0) throw new RangeError('PreviewTiles needs an item');
  if (items.some((item) => !item.id.trim()))
    throw new RangeError('PreviewTiles items need nonempty ids');
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new RangeError('PreviewTiles items need unique ids');
  return (
    <div className="sw-preview-tiles">
      {items.map((item) => (
        <div className="sw-preview-tile" key={item.id}>
          <span className="sw-preview-tile-label">{item.label}</span>
          <span className="sw-preview-tile-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
