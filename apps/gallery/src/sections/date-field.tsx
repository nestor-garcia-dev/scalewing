import { DateField, Field, Grid, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

const spanishLabels = {
  chooseDate: 'Elegir fecha',
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  month: 'Mes',
  year: 'Año',
  today: 'Hoy',
  clear: 'Borrar',
  invalidEntry: 'Escribe una fecha válida.',
  outOfRange: 'Elige una fecha dentro del rango permitido.',
  yearPlaceholder: 'AAAA',
};

export function DateFieldSection() {
  const [sightingDate, setSightingDate] = useState('2024-03-10');
  const [taggingDate, setTaggingDate] = useState('');
  const [hatchDate, setHatchDate] = useState('1961-05-14');
  const [reviewDate, setReviewDate] = useState('2024-02-29');
  const [spanishDate, setSpanishDate] = useState('2024-11-03');
  const [surveyStart, setSurveyStart] = useState('2024-04-02');

  return (
    <Section
      id="date-field"
      purpose="DateField keeps a date-only value. Type the date in the locale's order, or open the calendar: arrows move by day and week, PageUp and PageDown by month, Shift with them by year, and the month and year selectors jump decades. Callbacks receive YYYY-MM-DD or an empty value. Month and weekday names come from Intl; the control's own words come from labels. Its label row matches Field's, so a date beside a text field lines up."
      title="DateField"
      usage={`<DateField
  label="Sighting date"
  value={sightingDate}
  onChange={setSightingDate}
  min="2024-01-01"
  max="2024-12-31"
/>`}
    >
      <Stack gap={4}>
        <Grid columns={2} gap={3}>
          <DateField
            label="Survey start"
            onChange={setSurveyStart}
            required
            value={surveyStart}
          />
          <Field label="Observers" required>
            <input defaultValue="3" inputMode="numeric" name="observers" />
          </Field>
        </Grid>
        <Grid columns={2} columnsBelow={{ md: 1 }} gap={4}>
          <DateField
            description="Days outside 2024 are unavailable"
            label="Sighting date"
            max="2024-12-31"
            min="2024-01-01"
            onChange={setSightingDate}
            value={sightingDate}
          />
          <DateField
            description="Optional; clear it from the calendar"
            label="Tagging date"
            onChange={setTaggingDate}
            value={taggingDate}
          />
          <DateField
            description="Decades back: type it or pick the year"
            label="Hatch date"
            max="2024-12-31"
            onChange={setHatchDate}
            required
            value={hatchDate}
          />
          <DateField
            error="Choose a date on or after March 1"
            label="Review date"
            min="2024-03-01"
            onChange={setReviewDate}
            value={reviewDate}
          />
          <DateField
            disabled
            label="Archived date"
            onChange={() => undefined}
            value="2024-11-03"
          />
          <DateField
            description="Español, semana desde el lunes"
            label="Fecha del avistamiento"
            labels={spanishLabels}
            locale="es"
            onChange={setSpanishDate}
            value={spanishDate}
            weekStartsOn={1}
          />
        </Grid>
        <Stack gap={1}>
          <Text color="muted" variant="caption">
            Serialized sighting date: {sightingDate || 'empty'}.
          </Text>
          <Text color="muted" variant="caption">
            Serialized tagging date: {taggingDate || 'empty'}.
          </Text>
          <Text color="muted" variant="caption">
            Serialized hatch date: {hatchDate || 'empty'}.
          </Text>
          <Text color="muted" variant="caption">
            Serialized review date: {reviewDate || 'empty'}.
          </Text>
          <Text color="muted" variant="caption">
            Serialized Spanish date: {spanishDate || 'empty'}.
          </Text>
        </Stack>
      </Stack>
    </Section>
  );
}
