import { useState } from 'react';

import {
  assertClockTime,
  assertMinuteStep,
  clockPeriods,
  composeClockTime,
  formatClockTime,
  formatClockTimeLabel,
  formatWheelHourLabel,
  formatWheelMinuteLabel,
  hourColumnOptions,
  minuteOptions,
  parseClockTime,
  periodLabels,
  splitClockTime,
  usesTwelveHourClock,
  type ClockParts,
  type ClockPeriod,
} from '../clock-time.js';
import { DisclosureControl } from './DisclosureControl.js';
import { Inline } from './Inline.js';
import { LabeledControl } from './LabeledControl.js';
import { Wheel } from './Wheel.js';

export type TimeFieldProps = {
  disabled?: boolean;
  error?: string;
  hint?: string;
  hoursLabel: string;
  label: string;
  /** BCP 47 tag for the hour cycle and value labels; device default when omitted. */
  locale?: string;
  /** Minutes between selectable minute options; must divide 60. */
  minuteStep?: number;
  minutesLabel: string;
  onChange: (value: string) => void;
  /** Names the AM/PM column on a 12-hour clock; the period words when omitted. */
  periodLabel?: string;
  placeholder: string;
  /** Names the columns `<testID>-hours`, `-minutes`, and `-period`. */
  testID?: string;
  /** Wall-clock time `HH:MM`, or empty for no selection. */
  value: string;
};

/** Where the wheels rest before a choice: noon on either clock. */
const restingTime = { hour: 12, minute: 0 };

function isPeriod(value: string): value is ClockPeriod {
  return (clockPeriods as readonly string[]).includes(value);
}

export function TimeField({
  disabled = false,
  error,
  hint,
  hoursLabel,
  label,
  locale,
  minuteStep = 15,
  minutesLabel,
  onChange,
  periodLabel,
  placeholder,
  testID,
  value,
}: TimeFieldProps) {
  assertClockTime('value', value, true);
  assertMinuteStep(minuteStep);

  const [open, setOpen] = useState(false);
  const twelveHour = usesTwelveHourClock(locale);
  const parts = splitClockTime(
    parseClockTime(value) ?? restingTime,
    twelveHour,
  );
  const periods = periodLabels(locale);

  function change(next: Partial<ClockParts>) {
    onChange(formatClockTime(composeClockTime({ ...parts, ...next })));
  }

  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <DisclosureControl
        accessibilityHint={error ?? hint}
        disabled={disabled}
        expanded={open}
        invalid={Boolean(error)}
        label={label}
        onPress={() => setOpen((current) => !current)}
        placeholder={placeholder}
        valueText={formatClockTimeLabel(value, locale)}
      />
      {open ? (
        <Inline gap={2}>
          <Wheel
            accessibilityLabel={hoursLabel}
            disabled={disabled}
            items={hourColumnOptions(twelveHour).map((hour) => ({
              id: String(hour),
              label: formatWheelHourLabel(hour, twelveHour, locale),
            }))}
            onSelect={(id) => change({ hour: Number(id) })}
            selectedId={String(parts.hour)}
            testID={testID ? `${testID}-hours` : undefined}
          />
          <Wheel
            accessibilityLabel={minutesLabel}
            disabled={disabled}
            items={minuteOptions(minuteStep).map((minute) => ({
              id: String(minute),
              label: formatWheelMinuteLabel(minute),
            }))}
            onSelect={(id) => change({ minute: Number(id) })}
            selectedId={String(parts.minute)}
            testID={testID ? `${testID}-minutes` : undefined}
          />
          {twelveHour ? (
            <Wheel
              accessibilityLabel={periodLabel ?? `${periods.am} ${periods.pm}`}
              disabled={disabled}
              items={clockPeriods.map((period) => ({
                id: period,
                label: periods[period],
              }))}
              onSelect={(id) => {
                if (isPeriod(id)) change({ period: id });
              }}
              selectedId={parts.period ?? 'am'}
              testID={testID ? `${testID}-period` : undefined}
            />
          ) : null}
        </Inline>
      ) : null}
    </LabeledControl>
  );
}
