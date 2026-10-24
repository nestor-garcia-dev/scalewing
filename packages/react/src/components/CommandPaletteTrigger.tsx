'use client';

import { cx } from '../class-names.js';
import { tabStop } from '../tab-stop.js';
import { type CommandPaletteTriggerProps } from './command-palette/types.js';
import { assertCommandPaletteTrigger } from './command-palette/validate.js';

export type { CommandPaletteTriggerProps } from './command-palette/types.js';

/**
 * The button that opens a CommandPalette: a search-looking pill holding the
 * glyph, the placeholder words and a key hint, or with `compact` the glyph
 * alone in a round quiet button. Named by `label`; the hint is hidden from
 * assistive technology. Blank words or a missing glyph throw a `RangeError`.
 */
export function CommandPaletteTrigger(props: CommandPaletteTriggerProps) {
  assertCommandPaletteTrigger(props);
  const {
    compact = false,
    icon,
    label,
    onPress,
    placeholder,
    shortcutLabel,
  } = props;
  return (
    <button
      aria-haspopup="dialog"
      aria-label={label}
      className={cx(
        'sw-command-palette-trigger',
        compact && 'sw-command-palette-trigger-compact',
      )}
      onClick={onPress}
      tabIndex={tabStop}
      type="button"
    >
      <span aria-hidden="true" className="sw-command-palette-trigger-icon">
        {icon}
      </span>
      {compact ? null : (
        <>
          <span className="sw-command-palette-trigger-text">{placeholder}</span>
          {shortcutLabel ? (
            <span aria-hidden="true" className="sw-command-palette-key">
              {shortcutLabel}
            </span>
          ) : null}
        </>
      )}
    </button>
  );
}
