import { type DenominationGridRow } from './types.js';

/**
 * A row label's glyph and words, kept on one line: when the words wrap,
 * they wrap beside the glyph, never under it (Teisoro DRW-28). Both the
 * strip and the tiles layouts draw a row label with it.
 */
export function RowLabelLine({ row }: { row: DenominationGridRow }) {
  return (
    <span className="sw-denomination-label-line">
      {row.icon ? (
        <span aria-hidden="true" className="sw-denomination-icon">
          {row.icon}
        </span>
      ) : null}
      <span className="sw-denomination-label-text">{row.label}</span>
    </span>
  );
}
