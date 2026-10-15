import { type Ref, useId } from 'react';

import { formatDateMedium } from '../../calendar-labels.js';
import { cx } from '../../class-names.js';
import { Button } from '../Button.js';
import { type CalendarPopup } from './use-calendar-popup.js';
import { DateFieldGlyph } from './DateFieldGlyph.js';

export type CalendarEntryButtonProps = {
  id: string;
  /** The field's label element, which names the button with its words. */
  labelId: string;
  describedBy: string | undefined;
  value: string;
  locale: string;
  /** What an empty field shows, such as "Choose a day". */
  emptyText: string;
  disabled: boolean;
  invalid: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  trigger: CalendarPopup['trigger'];
  onPress: () => void;
};

/**
 * DateField's calendar entry: a neutral Button showing the calendar glyph
 * and the chosen day, or the words that ask for one, that opens the
 * calendar. It is named by the field's label and its own words ("Hire date
 * Choose a day", "Hire date Oct 6, 2026") and described as the field is.
 */
export function CalendarEntryButton({
  id,
  labelId,
  describedBy,
  value,
  locale,
  emptyText,
  disabled,
  invalid,
  buttonRef,
  trigger,
  onPress,
}: CalendarEntryButtonProps) {
  const textId = useId();
  return (
    <Button
      {...trigger}
      aria-describedby={describedBy}
      aria-labelledby={`${labelId} ${textId}`}
      className={cx(
        'sw-date-field-calendar-entry',
        invalid && 'sw-date-field-calendar-entry-invalid',
      )}
      disabled={disabled}
      id={id}
      onPress={onPress}
      ref={buttonRef}
      variant="neutral"
    >
      <DateFieldGlyph name="calendar" />
      <span className="sw-date-field-calendar-entry-text" id={textId}>
        {value ? formatDateMedium(value, locale) : emptyText}
      </span>
    </Button>
  );
}
