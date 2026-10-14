import {
  Button,
  ButtonGroup,
  DateRangeButton,
  type DateRangeButtonValue,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';
import {
  shiftDays,
  stepRange,
  surveyPresets,
  surveyToday,
} from './date-range-button-data.js';

const spanishLabels = {
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  presets: 'Periodos rápidos',
  apply: 'Mostrar',
  cancel: 'Cancelar',
  close: 'Cerrar',
  hint: 'Elige un primer y un último día',
  dayCount: (days: number) => (days === 1 ? '1 día' : `${days} días`),
};

const presets = surveyPresets(surveyToday);
const lastWeek = presets[0]?.range ?? { start: surveyToday, end: surveyToday };

function serialized({ start, end }: DateRangeButtonValue): string {
  return `${start} to ${end}`;
}

/** A period with steps to the one before and after, as a report's toolbar. */
function SurveyPeriod() {
  const [period, setPeriod] = useState(lastWeek);
  // The period after would end past the station's today.
  const atEnd = stepRange(period, 1).end > surveyToday;
  return (
    <Stack gap={1}>
      <ButtonGroup aria-label="Survey period" attached>
        <Button
          aria-label="The period before"
          onPress={() => setPeriod(stepRange(period, -1))}
          variant="neutral"
        >
          <Glyph path="M10 3 5 8l5 5" />
        </Button>
        <DateRangeButton
          label="Choose survey period"
          max={surveyToday}
          maxDays={366}
          onChange={setPeriod}
          presets={presets}
          today={surveyToday}
          value={period}
        />
        <Button
          aria-disabled={atEnd || undefined}
          aria-label="The period after"
          disabledAppearance="neutral"
          onPress={() => {
            if (!atEnd) setPeriod(stepRange(period, 1));
          }}
          variant="neutral"
        >
          <Glyph path="M6 3l5 5-5 5" />
        </Button>
      </ButtonGroup>
      <Text color="muted" variant="caption">
        Up to 366 days, none after the station&apos;s today ({surveyToday}).
        Serialized survey period: {serialized(period)}.
      </Text>
    </Stack>
  );
}

export function DateRangeButtonSection() {
  const [census, setCensus] = useState({
    start: '2026-09-01',
    end: '2026-09-14',
  });
  const [nesting, setNesting] = useState({
    start: '2026-05-04',
    end: '2026-05-04',
  });

  return (
    <Section
      id="date-range-button"
      purpose="DateRangeButton shows a range of days and opens a calendar to pick a first and a last day: the first press sets the start, the second the end (a press before the start starts over from it). From the md breakpoint up the calendar is a popover with the presets beside two months (above them below lg); on a phone it is a bottom sheet with the presets in a row and one month. Apply gives the range to onChange; Cancel, Escape, a press outside and the sheet's close keep the value. A preset applies its range at once. Days after max are disabled, and so, once a first day is pressed, are the days past maxDays from it. The range being picked is a polite status. The button's name is the label plus the range it shows."
      title="DateRangeButton"
      usage={`<ButtonGroup aria-label="Survey period" attached>
  <Button aria-label="The period before" variant="neutral" onPress={previous}>‹</Button>
  <DateRangeButton
    label="Choose survey period"
    value={period}
    onChange={setPeriod}
    presets={[
      { id: 'week', label: 'Last 7 days', range: lastSevenDays },
      { id: 'month', label: 'This month', range: thisMonth },
    ]}
    max={stationDay}
    maxDays={366}
    today={stationDay}
  />
  <Button aria-label="The period after" variant="neutral" onPress={next}>›</Button>
</ButtonGroup>`}
    >
      <Stack gap={5}>
        <SurveyPeriod />
        <Stack gap={1} lang="es">
          <Inline gap={2}>
            <DateRangeButton
              label="Elegir periodo del censo"
              labels={spanishLabels}
              locale="es"
              max={shiftDays(surveyToday, 30)}
              min="2026-08-01"
              onChange={setCensus}
              today={surveyToday}
              value={census}
              weekStartsOn={1}
            />
          </Inline>
          <Text color="muted" variant="caption">
            Español, semana desde el lunes, sin periodos rápidos, de agosto a
            noviembre. Periodo del censo: {serialized(census)}.
          </Text>
        </Stack>
        <Inline align="center" gap={2} wrap>
          <DateRangeButton
            label="Choose nesting days"
            onChange={setNesting}
            size="sm"
            today={surveyToday}
            value={nesting}
            variant="secondary"
          />
          <DateRangeButton
            label="Choose nesting days"
            onChange={setNesting}
            size="xs"
            today={surveyToday}
            value={nesting}
            variant="ghost"
          />
          <DateRangeButton
            disabled
            label="Choose archived period"
            onChange={() => undefined}
            value={{ start: '2025-06-01', end: '2025-06-30' }}
          />
          <Text color="muted" variant="caption">
            Small secondary, extra small ghost, and disabled; one day shows as
            one date. Serialized nesting days: {serialized(nesting)}.
          </Text>
        </Inline>
      </Stack>
    </Section>
  );
}
