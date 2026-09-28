import { cx } from '../../class-names.js';

export type DateFieldGlyphName = 'calendar' | 'previous' | 'next';

const PATHS: Record<DateFieldGlyphName, string> = {
  calendar:
    'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5zM4 10h16M8.5 2.5v3M15.5 2.5v3',
  previous: 'M14.5 6l-6 6 6 6',
  next: 'M9.5 6l6 6-6 6',
};

/**
 * Private control chrome for DateField. Stroke, size, and color come from
 * the generated `sw-date-field-glyph` rule; the chevrons mirror in
 * right-to-left text.
 */
export function DateFieldGlyph({ name }: { name: DateFieldGlyphName }) {
  return (
    <svg
      aria-hidden="true"
      className={cx(
        'sw-date-field-glyph',
        name !== 'calendar' && 'sw-date-field-glyph-directional',
      )}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
