/** The file and its natural size in pixels, so the page keeps its place while it loads. */
export type PreviewImageProps = {
  src: string;
  width: number;
  height: number;
};

/**
 * A real screenshot inside a `ScreenPreview`, drawn at the width of the
 * screen with its height following. It is decorative (`alt=""`): the
 * preview's `label` already says what it shows. A blank `src` or a size
 * that is not a positive whole number throws a `RangeError`.
 */
export function PreviewImage({ height, src, width }: PreviewImageProps) {
  if (!src.trim()) throw new RangeError('A PreviewImage needs a src');
  for (const [name, side] of [
    ['width', width],
    ['height', height],
  ] as const)
    if (!Number.isInteger(side) || side <= 0)
      throw new RangeError(
        `A PreviewImage's ${name} must be a positive whole number, not ${side}`,
      );
  return (
    <img
      alt=""
      className="sw-preview-image"
      height={height}
      loading="lazy"
      src={src}
      width={width}
    />
  );
}
