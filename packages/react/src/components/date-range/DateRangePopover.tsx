import { useRef } from 'react';

import { Button } from '../Button.js';
import { CalendarPopover } from '../calendar/CalendarPopover.js';
import { type RangePanelProps } from './range-panel-props.js';
import { RangeMonths } from './RangeMonths.js';
import { RangePresets } from './RangePresets.js';
import { RangeSummary } from './RangeSummary.js';

/**
 * DateRangeButton from `md` up: a popover beside the button with the
 * presets, two months, the range being picked, Cancel and Apply. Escape
 * and a press outside cancel.
 */
export function DateRangePopover(props: RangePanelProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { labels, presets } = props;
  return (
    <CalendarPopover
      anchorRef={props.buttonRef}
      aria-label={props.label}
      buttonRef={props.buttonRef}
      className="sw-date-range-popover"
      id={props.id}
      onClose={props.onCancel}
      popoverRef={popoverRef}
    >
      <div className="sw-date-range-body">
        {presets.length > 0 ? (
          <RangePresets
            label={labels.presets}
            layout="list"
            onChoose={props.onChoosePreset}
            presets={presets}
            pressedId={props.pressedPresetId}
          />
        ) : null}
        <RangeMonths
          count={2}
          draft={props.draft}
          focusOnMount
          labels={labels}
          latest={props.latest}
          locale={props.locale}
          max={props.max}
          min={props.min}
          onPress={props.onPress}
          today={props.today}
          weekStartsOn={props.weekStartsOn}
        />
      </div>
      <div className="sw-date-range-footer">
        <RangeSummary
          count={props.count}
          hint={labels.hint}
          line={props.line}
        />
        <div className="sw-date-range-actions">
          <Button
            onPress={() => props.onCancel(true)}
            size="sm"
            variant="neutral"
          >
            {labels.cancel}
          </Button>
          <Button onPress={props.onApply} size="sm">
            {labels.apply}
          </Button>
        </div>
      </div>
    </CalendarPopover>
  );
}
