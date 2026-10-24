import { type ReactNode } from 'react';

import { cx } from '../../class-names.js';
import {
  type PreviewRowKind,
  previewRowKindClass,
  previewRowKinds,
} from '../../css/css-screen-preview.js';
import { isOneOf } from '../../is-one-of.js';

export { previewRowKinds, type PreviewRowKind };

export type PreviewRowProps = {
  label: ReactNode;
  value: ReactNode;
  /**
   * `plain` (default) a label and its figure; `total` the same in bold past
   * a hairline; `note` a small label over its words; `filled` on the quiet
   * fill; `alert` on the danger tint.
   */
  kind?: PreviewRowKind;
};

/** One row of a `ScreenPreview`: a label at its start and a value at its end. */
export function PreviewRow({ kind = 'plain', label, value }: PreviewRowProps) {
  if (!isOneOf(previewRowKinds, kind))
    throw new RangeError(`Unknown PreviewRow kind: ${String(kind)}`);
  return (
    <div className={cx('sw-preview-row', previewRowKindClass(kind))}>
      <span className="sw-preview-row-label">{label}</span>
      <span className="sw-preview-row-value">{value}</span>
    </div>
  );
}
