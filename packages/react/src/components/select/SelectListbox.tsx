import { type PointerEvent, type ReactNode } from 'react';

import { cx } from '../../class-names.js';
import { type SelectOption } from '../../select-list.js';

function SelectListOption({
  action = false,
  active,
  children,
  id,
  onCommit,
  onHighlight,
  selected,
}: {
  action?: boolean;
  active: boolean;
  children: ReactNode;
  id: string;
  onCommit: () => void;
  onHighlight: () => void;
  selected: boolean;
}) {
  return (
    <div
      aria-selected={selected}
      className={cx('sw-select-option', action && 'sw-select-action')}
      data-active={active ? 'true' : undefined}
      id={id}
      onClick={onCommit}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
      }}
      onPointerMove={onHighlight}
      role="option"
    >
      {children}
    </div>
  );
}

type SelectListboxProps = {
  /** The trailing command's label, after the options; never the value. */
  actionLabel?: string;
  highlight: number;
  id: string;
  labelId: string;
  optionIdPrefix: string;
  options: readonly SelectOption[];
  value: string;
  onCommit: (index: number) => void;
  onHighlight: (index: number) => void;
};

/**
 * The open list: one option per value, then the optional action as the last
 * item (index `options.length`). The trigger keeps DOM focus and points at
 * the highlighted item with `aria-activedescendant`.
 */
export function SelectListbox({
  actionLabel,
  highlight,
  id,
  labelId,
  optionIdPrefix,
  options,
  value,
  onCommit,
  onHighlight,
}: SelectListboxProps) {
  const actionIndex = options.length;
  return (
    <div
      aria-labelledby={labelId}
      className="sw-select-list"
      id={id}
      role="listbox"
    >
      {options.map((option, index) => (
        <SelectListOption
          active={index === highlight}
          id={`${optionIdPrefix}-${index}`}
          key={option.value}
          onCommit={() => onCommit(index)}
          onHighlight={() => onHighlight(index)}
          selected={option.value === value}
        >
          {option.label}
        </SelectListOption>
      ))}
      {actionLabel === undefined ? null : (
        <SelectListOption
          action
          active={highlight === actionIndex}
          id={`${optionIdPrefix}-${actionIndex}`}
          onCommit={() => onCommit(actionIndex)}
          onHighlight={() => onHighlight(actionIndex)}
          selected={false}
        >
          {actionLabel}
        </SelectListOption>
      )}
    </div>
  );
}
