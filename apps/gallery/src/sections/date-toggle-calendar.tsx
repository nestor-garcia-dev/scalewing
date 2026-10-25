import { DateToggleCalendar, Stack, Switch, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

/** Survey days are Sundays (2027-03-28 is one). */
function isNotSunday(date: string): boolean {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!)).getUTCDay() !== 0;
}

export function DateToggleCalendarSection() {
  // 2027-03-21 is before min: drawn nowhere, and dropped by the next press.
  const [daysOff, setDaysOff] = useState(['2027-03-21', '2027-04-18']);
  const [locked, setLocked] = useState(false);

  return (
    <Section
      id="date-toggle-calendar"
      purpose="DateToggleCalendar is month grids from min's month to max's where each day that can be toggled is a toggle button (aria-pressed), named by its full date and, while on, by your toggledLabel words: days off in a season, say. isDateDisabled and the bounds leave other days as muted numbers that are not controls. The calendar is one Tab stop; the arrow keys move between days that can be toggled, skipping the rest (up and down by weeks), Home and End go to the month's first and last, PageUp and PageDown to the next or previous month, and Space or Enter toggles. onChange hands back only days that can be toggled, sorted: a value entry outside min and max or on a disabled day is dropped on the next press (the stored 2027-03-21 here, before min, goes when you toggle any day). disabled keeps the days focusable (aria-disabled) while presses change nothing: switch Lock the days off. Days on take the accent fill; months sit side by side in as many columns as fit and stack on a phone."
      title="DateToggleCalendar"
      usage={`// isNotSunday, daysOff and setDaysOff are your own function and state.
<DateToggleCalendar
  label="Survey days off"
  min="2027-03-28"
  max="2027-06-27"
  isDateDisabled={isNotSunday}
  toggledLabel="day off"
  value={daysOff}
  onChange={setDaysOff}
/>`}
    >
      <Stack gap={3}>
        <Switch
          checked={locked}
          label="Lock the days off"
          onCheckedChange={setLocked}
        />
        <DateToggleCalendar
          disabled={locked}
          isDateDisabled={isNotSunday}
          label="Survey days off"
          max="2027-06-27"
          min="2027-03-28"
          onChange={setDaysOff}
          toggledLabel="day off"
          value={daysOff}
        />
        <Text color="muted" variant="caption">
          Days off: {daysOff.length === 0 ? 'none' : daysOff.join(', ')}
        </Text>
      </Stack>
    </Section>
  );
}
