import { type RefObject } from 'react';

import { type WeekStart } from '../../calendar-month.js';
import { type RangeDraft } from '../../date-range-draft.js';
import { type DateRangePreset } from '../../date-range-input.js';
import { type DateRangeButtonLabels } from '../../date-range-labels.js';

/** What both of DateRangeButton's presentations, popover and sheet, draw. */
export type RangePanelProps = {
  id: string;
  /** Names the popover or titles the sheet. */
  label: string;
  labels: DateRangeButtonLabels;
  draft: RangeDraft;
  onPress: (day: string) => void;
  presets: readonly DateRangePreset[];
  pressedPresetId: string | undefined;
  onChoosePreset: (preset: DateRangePreset) => void;
  /** Applies the draft. */
  onApply: () => void;
  /** Keeps the value; `true` returns focus to the button. */
  onCancel: (restoreFocus: boolean) => void;
  latest: string | undefined;
  min?: string;
  max?: string;
  locale: string;
  today: string;
  weekStartsOn: WeekStart;
  buttonRef: RefObject<HTMLButtonElement | null>;
  /** The draft's words: the range with weekdays, and its length. */
  line: string;
  count: string;
};
