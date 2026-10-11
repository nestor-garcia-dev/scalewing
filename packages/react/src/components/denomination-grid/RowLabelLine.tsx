import { type DenominationGridRow } from './types.js';

/**
 * A row label's glyph and words, kept on one line: when the words wrap,
 * they wrap beside the glyph, never under it (Teisoro DRW-28). A caption is
 * a muted line under the words, beside the same glyph. Both the strip and
 * the tiles layouts draw a row label with it.
 */
export function RowLabelLine({ row }: { row: DenominationGridRow }) {
  const text = <span className="sw-denomination-label-text">{row.label}</span>;
  return (
    <span className="sw-denomination-label-line">
      {row.icon ? (
        <span aria-hidden="true" className="sw-denomination-icon">
          {row.icon}
        </span>
      ) : null}
      {row.caption === undefined ? (
        text
      ) : (
        <span className="sw-denomination-label-words">
          {text}
          <span className="sw-denomination-label-caption">{row.caption}</span>
        </span>
      )}
    </span>
  );
}
