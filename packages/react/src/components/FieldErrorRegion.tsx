/**
 * A field control's error message as a polite live region. It is always
 * rendered, empty while there is no error, so a screen reader announces a
 * new error once when its text is swapped in, while the person types or
 * after a submit, without the assertive pile of one alert per field. The
 * control lists it in `aria-describedby` while it has text. Generated CSS
 * takes an empty region out of the layout (`position: absolute`), never out
 * of the accessibility tree, which would stop the announcement.
 */
export function FieldErrorRegion({
  className,
  id,
  message,
}: {
  className: string;
  id: string;
  message?: string;
}) {
  return (
    <span aria-live="polite" className={className} id={id}>
      {message || ''}
    </span>
  );
}
