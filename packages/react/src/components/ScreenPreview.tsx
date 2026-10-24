import { type HTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import {
  type ScreenPreviewFrame,
  screenPreviewFrameClass,
  screenPreviewFrames,
} from '../css/css-screen-preview.js';
import { isOneOf } from '../is-one-of.js';

export { screenPreviewFrames, type ScreenPreviewFrame };

export type ScreenPreviewProps = Omit<
  HTMLAttributes<HTMLElement>,
  'children' | 'role' | 'style' | 'title'
> & {
  /** What the drawn screen shows, said in words: its alternative text. */
  label: string;
  /** `card` (default), or `device`, a phone's bezel from `md`. */
  frame?: ScreenPreviewFrame;
  /** A small line above the screen's title, such as where in the app it is. */
  eyebrow?: ReactNode;
  /** The screen's own title. */
  title?: ReactNode;
  /** A visible caption under the screen, such as what will replace it. */
  caption?: ReactNode;
  /** `PreviewGroup`s, `PreviewRow`s and `PreviewTiles`. */
  children: ReactNode;
};

/**
 * A drawn stand-in for an app's screen on a public page: a `figure` whose
 * screen is one image (`role="img"`) named by `label`, so its rows are
 * read as that one sentence, with an optional visible `caption`. Its
 * content is `PreviewGroup`s of `PreviewRow`s and `PreviewTiles`. A blank
 * label or an unknown frame throws a `RangeError`.
 */
export function ScreenPreview({
  caption,
  children,
  className,
  eyebrow,
  frame = 'card',
  label,
  title,
  ...rest
}: ScreenPreviewProps) {
  if (!label.trim())
    throw new RangeError('A ScreenPreview needs a label, its alternative text');
  if (!isOneOf(screenPreviewFrames, frame))
    throw new RangeError(`Unknown ScreenPreview frame: ${String(frame)}`);
  const header =
    eyebrow || title ? (
      <div className="sw-screen-preview-header">
        {eyebrow ? (
          <span className="sw-screen-preview-eyebrow">{eyebrow}</span>
        ) : null}
        {title ? (
          <span className="sw-screen-preview-title">{title}</span>
        ) : null}
      </div>
    ) : null;
  return (
    <figure
      {...rest}
      className={cx(
        'sw-screen-preview',
        screenPreviewFrameClass(frame),
        className,
      )}
    >
      <div className="sw-screen-preview-bezel">
        <div aria-label={label} className="sw-screen-preview-screen" role="img">
          {header}
          <div className="sw-screen-preview-body">{children}</div>
        </div>
      </div>
      {caption ? (
        <figcaption className="sw-screen-preview-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
