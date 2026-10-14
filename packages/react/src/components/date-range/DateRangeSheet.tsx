import { Button } from '../Button.js';
import { Dialog } from '../Dialog.js';
import { type RangePanelProps } from './range-panel-props.js';
import { RangeMonths } from './RangeMonths.js';
import { RangePresets } from './RangePresets.js';
import { RangeSummary } from './RangeSummary.js';

/**
 * DateRangeButton below `md`: a bottom sheet titled by its label, the
 * range being picked under the title, the presets in a row, one month,
 * and the hint over Cancel and Apply. Closing it any other way cancels.
 */
export function DateRangeSheet(props: RangePanelProps) {
  const { labels, presets } = props;
  return (
    <Dialog
      className="sw-date-range-sheet"
      closeLabel={labels.close}
      description={`${props.line} · ${props.count}`}
      footer={
        <div className="sw-date-range-sheet-footer">
          <span className="sw-date-range-hint">{labels.hint}</span>
          <div className="sw-date-range-actions">
            <Button onPress={() => props.onCancel(true)} variant="neutral">
              {labels.cancel}
            </Button>
            <Button onPress={props.onApply}>{labels.apply}</Button>
          </div>
        </div>
      }
      id={props.id}
      onClose={() => props.onCancel(true)}
      open
      sheetBelow="md"
      title={props.label}
    >
      <RangeSummary count={props.count} line={props.line} visuallyHidden />
      {presets.length > 0 ? (
        <RangePresets
          label={labels.presets}
          layout="row"
          onChoose={props.onChoosePreset}
          presets={presets}
          pressedId={props.pressedPresetId}
        />
      ) : null}
      <RangeMonths
        count={1}
        draft={props.draft}
        focusOnMount={false}
        labels={labels}
        latest={props.latest}
        locale={props.locale}
        max={props.max}
        min={props.min}
        onPress={props.onPress}
        today={props.today}
        weekStartsOn={props.weekStartsOn}
      />
    </Dialog>
  );
}
