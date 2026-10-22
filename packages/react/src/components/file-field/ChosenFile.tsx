'use client';

import { type ReactNode, type Ref } from 'react';

import { tabStop } from '../../tab-stop.js';
import { Button } from '../Button.js';
import type { FileFieldValue } from '../FileField.js';

/** The ids a chosen file's parts take, from the field's. */
export type ChosenFileIds = {
  label: string;
  button: string;
  name: string;
  detail: string;
  remove: string;
};

/** The change button's naming and description, as the field wires them. */
export type ChosenFileNaming = {
  'aria-labelledby': string;
  'aria-describedby': string | undefined;
  id: string;
};

/** Remove beside a chosen file: its words and what it does. */
export type ChosenFileRemove = { label: string; onRemove: () => void };

type ChosenFileProps = {
  value: FileFieldValue;
  icon: ReactNode;
  ids: ChosenFileIds;
  naming: ChosenFileNaming;
  changeLabel: string;
  remove: ChosenFileRemove | null;
  disabled: boolean;
  onChange: () => void;
  buttonRef: Ref<HTMLButtonElement>;
};

/** Whether the consumer passed a mark to draw (not empty JSX). */
function hasMark(icon: ReactNode): boolean {
  return (
    icon !== undefined &&
    icon !== null &&
    icon !== '' &&
    typeof icon !== 'boolean'
  );
}

/** Before a chosen file's name: its photo's thumbnail, else the consumer's mark. */
function ChosenMark({ icon, preview }: { icon: ReactNode; preview?: string }) {
  if (preview !== undefined)
    return <img alt="" className="sw-file-field-preview" src={preview} />;
  if (!hasMark(icon)) return null;
  return (
    <span aria-hidden="true" className="sw-file-field-icon">
      {icon}
    </span>
  );
}

/**
 * Remove: a quiet button named by its words and the field's label
 * ("Remove Cover photo"), so two fields' Removes are told apart. Disabled,
 * the neutral one greys as the change button does; the ghost one, which
 * has no fill, fades as the compact row's pick button does.
 */
function RemoveButton({
  ids,
  remove,
  disabled,
  variant,
}: {
  ids: ChosenFileIds;
  remove: ChosenFileRemove;
  disabled: boolean;
  variant: 'neutral' | 'ghost';
}) {
  return (
    <Button
      // Named by its own words, then the label: the self-reference is
      // deliberate and needs the id below on the button itself.
      aria-labelledby={`${ids.remove} ${ids.label}`}
      className="sw-file-field-remove"
      disabled={disabled}
      disabledAppearance={variant === 'neutral' ? 'neutral' : 'faded'}
      id={ids.remove}
      onPress={remove.onRemove}
      size={variant === 'ghost' ? 'sm' : 'md'}
      variant={variant}
    >
      {remove.label}
    </Button>
  );
}

/**
 * The chosen file in the full field: its mark, its name over its detail,
 * then the change button (and Remove after it) at the row's end.
 */
export function ChosenFileRow({
  value,
  icon,
  ids,
  naming,
  changeLabel,
  remove,
  disabled,
  onChange,
  buttonRef,
}: ChosenFileProps) {
  const change = (
    <Button
      {...naming}
      disabled={disabled}
      disabledAppearance="neutral"
      onPress={onChange}
      ref={buttonRef}
      variant="neutral"
    >
      {changeLabel}
    </Button>
  );
  return (
    <>
      <ChosenMark icon={icon} preview={value.preview} />
      <span className="sw-file-field-file">
        <span className="sw-file-field-name" id={ids.name}>
          {value.name}
        </span>
        {value.detail ? (
          <span className="sw-file-field-detail" id={ids.detail}>
            {value.detail}
          </span>
        ) : null}
      </span>
      {remove === null ? (
        change
      ) : (
        <span className="sw-file-field-actions">
          {change}
          <RemoveButton
            disabled={disabled}
            ids={ids}
            remove={remove}
            variant="neutral"
          />
        </span>
      )}
    </>
  );
}

/**
 * The chosen file in a compact field: one row at a text field's height.
 * The mark and the name (cut to one line) are the change button, named by
 * the field's label and the change words, described by the name and the
 * detail (which is not drawn); Remove, quiet, ends the row.
 */
export function ChosenFileCompact({
  value,
  icon,
  ids,
  naming,
  changeLabel,
  remove,
  disabled,
  onChange,
  buttonRef,
}: ChosenFileProps) {
  return (
    <>
      <button
        {...naming}
        className="sw-file-field-pick"
        disabled={disabled}
        onClick={onChange}
        ref={buttonRef}
        tabIndex={tabStop}
        type="button"
      >
        <ChosenMark icon={icon} preview={value.preview} />
        <span className="sw-file-field-name" id={ids.name}>
          {value.name}
        </span>
        {value.detail ? (
          <span className="sw-sr-only" id={ids.detail}>
            {value.detail}
          </span>
        ) : null}
        {/* The change words, read in the name after the label. */}
        <span className="sw-sr-only" id={`${ids.button}-words`}>
          {changeLabel}
        </span>
      </button>
      {remove === null ? null : (
        <RemoveButton
          disabled={disabled}
          ids={ids}
          remove={remove}
          variant="ghost"
        />
      )}
    </>
  );
}
