/** How a Field's description reads: the quiet hint or a warning that is not an error. */
export const fieldDescriptionTones = ['muted', 'warning'] as const;
export type FieldDescriptionTone = (typeof fieldDescriptionTones)[number];

export function assertFieldDescriptionTone(tone: unknown): void {
  if (!(fieldDescriptionTones as readonly unknown[]).includes(tone))
    throw new RangeError(`Unknown Field descriptionTone: ${String(tone)}`);
}

/** A triangle with an exclamation mark, drawn in the description's colour. */
const alertPath = 'M12 3.5 21.5 20h-19zM12 9.75v4.5M12 17.25v.01';

/**
 * A Field's description under its control, the control's
 * `aria-describedby` target. A warning one leads with a private alert
 * glyph, hidden from assistive technology, so it reads apart from a muted
 * hint without colour (and in forced colours, where both take CanvasText).
 */
export function FieldDescription({
  children,
  id,
  tone,
}: {
  children: string;
  id: string;
  tone: FieldDescriptionTone;
}) {
  if (tone === 'muted')
    return (
      <span className="sw-field-description" id={id}>
        {children}
      </span>
    );
  return (
    <span className="sw-field-description sw-field-description-warning" id={id}>
      <svg
        aria-hidden="true"
        className="sw-field-description-glyph"
        focusable="false"
        viewBox="0 0 24 24"
      >
        <path d={alertPath} />
      </svg>
      <span>{children}</span>
    </span>
  );
}
