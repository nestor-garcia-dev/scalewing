import { Button, CalendarButton, Inline, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { stationToday } from '../station-day.js';

const spanishLabels = {
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  month: 'Mes',
  year: 'Año',
  today: 'Hoy',
};

/** Noon UTC on a YYYY-MM-DD date, so no time zone moves the day. */
function noonOf(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}

function shiftDay(value: string, days: number): string {
  const date = noonOf(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** The Sunday that starts `value`'s week. */
function sundayOf(value: string): string {
  return shiftDay(value, -noonOf(value).getUTCDay());
}

function spokenDay(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeZone: 'UTC',
  }).format(noonOf(value));
}

type DayHeaderProps = {
  locale: string;
  pickLabel: string;
  previousLabel: string;
  nextLabel: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  today?: string;
  labels?: typeof spanishLabels;
  weekStartsOn?: 0 | 1;
};

/** A day heading with previous and next steps and a calendar beside it. */
function DayHeader({
  locale,
  pickLabel,
  previousLabel,
  nextLabel,
  value,
  onChange,
  min,
  max,
  today,
  labels,
  weekStartsOn,
}: DayHeaderProps) {
  return (
    <Inline gap={1} lang={locale}>
      <Button
        aria-label={previousLabel}
        disabled={min !== undefined && value <= min}
        onPress={() => onChange(shiftDay(value, -1))}
        variant="ghost"
      >
        ‹
      </Button>
      <Text as="h3" variant="title">
        {spokenDay(value, locale)}
      </Text>
      <CalendarButton
        label={pickLabel}
        labels={labels}
        locale={locale}
        max={max}
        min={min}
        onChange={onChange}
        today={today}
        value={value}
        weekStartsOn={weekStartsOn}
      />
      <Button
        aria-label={nextLabel}
        disabled={max !== undefined && value >= max}
        onPress={() => onChange(shiftDay(value, 1))}
        variant="ghost"
      >
        ›
      </Button>
    </Inline>
  );
}

export function CalendarButtonSection() {
  const [surveyDay, setSurveyDay] = useState('2026-09-22');
  const [censusDay, setCensusDay] = useState('2026-09-22');
  const [releaseDay, setReleaseDay] = useState('2026-10-05');
  const [stationDay] = useState(() => stationToday());
  const [reefDay, setReefDay] = useState(() => shiftDay(stationDay, -2));
  const [watchWeek, setWatchWeek] = useState('2026-09-27');
  const watchWeekEnd = shiftDay(watchWeek, 6);

  return (
    <Section
      id="calendar-button"
      purpose="CalendarButton is an icon-only button that opens the DateField calendar for a date the page already shows, such as a day heading with its own previous and next steps. Its name is the label plus the spoken date; picking a day calls onChange with YYYY-MM-DD and returns focus to the button. It keeps a 44 px target on touch screens at every size. today sets the day the calendar marks and picks as today, such as a business's own day in its time zone; it defaults to the device's. range tints the span a page shows around the value, such as a week or a month, so the open calendar shows the whole period; the value stays the selected day, and the page's own heading names the period."
      title="CalendarButton"
      usage={`<Inline gap={1}>
  <Button aria-label="Previous day" variant="ghost" onPress={previous}>‹</Button>
  <Text as="h3" variant="title">{spokenSurveyDay}</Text>
  <CalendarButton
    label="Choose survey day"
    value={surveyDay}
    onChange={setSurveyDay}
    min="2026-09-01"
    max="2026-09-30"
    today={stationDay}
  />
  <Button aria-label="Next day" variant="ghost" onPress={next}>›</Button>
</Inline>

<CalendarButton
  label="Choose a week"
  value={weekStart}
  range={{ start: weekStart, end: weekEnd }}
  onChange={(day) => setWeekStart(startOfWeek(day))}
/>`}
    >
      <Stack gap={4}>
        <Stack gap={1}>
          <DayHeader
            locale="en-US"
            max="2026-09-30"
            min="2026-09-01"
            nextLabel="Next day"
            onChange={setSurveyDay}
            pickLabel="Choose survey day"
            previousLabel="Previous day"
            value={surveyDay}
          />
          <Text color="muted" variant="caption">
            Survey season is September 2026. Serialized survey day: {surveyDay}.
          </Text>
        </Stack>
        <Stack gap={1}>
          <DayHeader
            labels={spanishLabels}
            locale="es"
            nextLabel="Día siguiente"
            onChange={setCensusDay}
            pickLabel="Elegir día del censo"
            previousLabel="Día anterior"
            value={censusDay}
            weekStartsOn={1}
          />
          <Text color="muted" variant="caption">
            Español, semana desde el lunes. Día del censo: {censusDay}.
          </Text>
        </Stack>
        <Stack gap={1}>
          <DayHeader
            locale="en-US"
            max={stationDay}
            nextLabel="Next reef day"
            onChange={setReefDay}
            pickLabel="Choose reef day"
            previousLabel="Previous reef day"
            today={stationDay}
            value={reefDay}
          />
          <Text color="muted" variant="caption">
            The reef station keeps Honolulu time. Its day, {stationDay}, is the
            calendar&apos;s today and its last day, not this device&apos;s.
            Serialized reef day: {reefDay}.
          </Text>
        </Stack>
        <Stack gap={1}>
          <Inline align="center" gap={1}>
            <Text as="h3" variant="title">
              Watch week {watchWeek} to {watchWeekEnd}
            </Text>
            <CalendarButton
              label="Choose watch week"
              onChange={(day) => setWatchWeek(sundayOf(day))}
              range={{ start: watchWeek, end: watchWeekEnd }}
              value={watchWeek}
            />
          </Inline>
          <Text color="muted" variant="caption">
            range: the open calendar tints the whole week; picking any day moves
            to that day&apos;s week.
          </Text>
        </Stack>
        <Inline gap={2}>
          <CalendarButton
            label="Choose release day"
            onChange={setReleaseDay}
            size="sm"
            value={releaseDay}
            variant="secondary"
          />
          <CalendarButton
            label="Choose release day"
            onChange={setReleaseDay}
            size="xs"
            value={releaseDay}
          />
          <CalendarButton
            disabled
            label="Choose archived day"
            onChange={() => undefined}
            value="2026-08-14"
          />
          <Text color="muted" variant="caption">
            Small secondary, extra small, and disabled. Serialized release day:{' '}
            {releaseDay}.
          </Text>
        </Inline>
      </Stack>
    </Section>
  );
}
