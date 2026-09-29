/**
 * A decorative stroked glyph in the current text color, standing in for the
 * consumer's Lucide icons that Scalewing's icon slots take. `grid` is the
 * path's coordinate grid, `size` the drawn size in pixels.
 */
export function Glyph({
  grid = 16,
  path,
  size = 16,
}: {
  grid?: number;
  path: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox={`0 0 ${grid} ${grid}`}
      width={size}
    >
      <path d={path} />
    </svg>
  );
}
