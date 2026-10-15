import { type Ref } from 'react';

import { tabStop } from '../../tab-stop.js';
import { type CalendarPopup } from './use-calendar-popup.js';
import { type DateEntry } from './use-date-entry.js';
import { DateFieldGlyph } from './DateFieldGlyph.js';

export type TypedEntryProps = {
  id: string;
  /** The field's label element, which describes the calendar button. */
  labelId: string;
  describedBy: string | undefined;
  entry: DateEntry;
  placeholder: string;
  /** The calendar button's name, `labels.chooseDate`. */
  toggleName: string;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  controlRef: Ref<HTMLDivElement>;
  inputRef: Ref<HTMLInputElement>;
  buttonRef: Ref<HTMLButtonElement>;
  trigger: CalendarPopup['trigger'];
  onToggle: () => void;
};

/**
 * DateField's typed entry: the text input in the locale's order, checked
 * on blur and Enter, and the calendar button inside its end.
 */
export function TypedEntry({
  id,
  labelId,
  describedBy,
  entry,
  placeholder,
  toggleName,
  disabled,
  required,
  invalid,
  controlRef,
  inputRef,
  buttonRef,
  trigger,
  onToggle,
}: TypedEntryProps) {
  return (
    <div className="sw-date-field-control" ref={controlRef}>
      <input
        aria-describedby={describedBy}
        aria-invalid={invalid}
        autoComplete="off"
        className="sw-date-field-input"
        disabled={disabled}
        id={id}
        onBlur={entry.check}
        onChange={(event) => entry.change(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') entry.check();
        }}
        placeholder={placeholder}
        ref={inputRef}
        required={required}
        spellCheck={false}
        type="text"
        value={entry.text}
      />
      <button
        {...trigger}
        aria-describedby={labelId}
        className="sw-date-field-button"
        disabled={disabled}
        onClick={onToggle}
        ref={buttonRef}
        tabIndex={tabStop}
        type="button"
      >
        <span className="sw-sr-only">{toggleName}</span>
        <DateFieldGlyph name="calendar" />
      </button>
    </div>
  );
}
