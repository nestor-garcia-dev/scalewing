import { tabStop } from '../../tab-stop.js';

const digitKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Private control chrome: the Delete key's backspace mark. */
function DeleteGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="sw-pin-field-glyph"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zM17 9l-5 6M12 9l5 6" />
    </svg>
  );
}

/**
 * A PinField's on-screen keys: twelve positions in three columns, 1 to 9,
 * an empty one, 0 and Delete. Each key is a native button and its own Tab
 * stop; a press reports the key and moves no focus. Delete with nothing to
 * delete is `aria-disabled`, never `disabled`, so the focus it holds after
 * the last digit goes is not dropped.
 */
export function PinPad({
  canDelete,
  deleteLabel,
  disabled,
  label,
  onDelete,
  onDigit,
}: {
  canDelete: boolean;
  deleteLabel: string;
  disabled: boolean;
  label: string;
  onDelete: () => void;
  onDigit: (digit: string) => void;
}) {
  function digitKey(digit: string) {
    return (
      <button
        className="sw-pin-field-key"
        disabled={disabled}
        key={digit}
        onClick={() => onDigit(digit)}
        tabIndex={tabStop}
        type="button"
      >
        {digit}
      </button>
    );
  }

  return (
    <div aria-label={label} className="sw-pin-field-pad" role="group">
      {digitKeys.map(digitKey)}
      <span aria-hidden="true" />
      {digitKey('0')}
      <button
        aria-disabled={!disabled && !canDelete ? true : undefined}
        aria-label={deleteLabel}
        className="sw-pin-field-key sw-pin-field-key-delete"
        disabled={disabled}
        onClick={onDelete}
        tabIndex={tabStop}
        type="button"
      >
        <DeleteGlyph />
      </button>
    </div>
  );
}
