import { useState } from 'react';

import {
  assertClockTime,
  assertMinuteStep,
  formatClockTime,
  formatClockTimeLabel,
  formatHourLabel,
  formatMinuteLabel,
  hourOptions,
  minuteOptions,
  parseClockTime,
} from '../clock-time.js';
import { Chip } from './Chip.js';
import { DisclosureControl } from './DisclosureControl.js';
import { Inline } from './Inline.js';
import { LabeledControl } from './LabeledControl.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type TimeFieldProps = {
  disabled?: boolean;
  error?: string;
  hint?: string;
  hoursLabel: string;
  label: string;
  /** BCP 47 tag for hour and value labels; device default when omitted. */
  locale?: string;
  /** Minutes between selectable minute options; must divide 60. */
  minuteStep?: number;
  minutesLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Wall-clock time `HH:MM`, or empty for no selection. */
  value: string;
};

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
  placeholder,
  value,
}: TimeFieldProps) {
  assertClockTime('value', value, true);
  assertMinuteStep(minuteStep);

  const [open, setOpen] = useState(false);
  const time = parseClockTime(value);

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
        <Stack gap={2}>
          <Text color="muted" variant="caption">
            {hoursLabel}
          </Text>
          <Inline accessibilityLabel={hoursLabel} gap={2} wrap>
            {hourOptions().map((hour) => (
              <Chip
                accessibilityRole="radio"
                disabled={disabled}
                key={hour}
                label={formatHourLabel(hour, locale)}
                onPress={() =>
                  onChange(formatClockTime({ hour, minute: time?.minute ?? 0 }))
                }
                selected={time?.hour === hour}
              />
            ))}
          </Inline>
          <Text color="muted" variant="caption">
            {minutesLabel}
          </Text>
          <Inline accessibilityLabel={minutesLabel} gap={2} wrap>
            {minuteOptions(minuteStep).map((minute) => (
              <Chip
                accessibilityRole="radio"
                disabled={disabled}
                key={minute}
                label={formatMinuteLabel(minute)}
                onPress={() =>
                  onChange(formatClockTime({ hour: time?.hour ?? 0, minute }))
                }
                selected={time?.minute === minute}
              />
            ))}
          </Inline>
        </Stack>
      ) : null}
    </LabeledControl>
  );
}
