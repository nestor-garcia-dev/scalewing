import { Button, CalendarButton, Inline, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

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

  return (
    <Section
      id="calendar-button"
      purpose="CalendarButton is an icon-only button that opens the DateField calendar for a date the page already shows, such as a day heading with its own previous and next steps. Its name is the label plus the spoken date; picking a day calls onChange with YYYY-MM-DD and returns focus to the button. It keeps a 44 px target on touch screens at every size."
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
  />
  <Button aria-label="Next day" variant="ghost" onPress={next}>›</Button>
</Inline>`}
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
