'use client';

import { type ChangeEvent, type ReactNode, useId, useRef } from 'react';

import { cx } from '../class-names.js';
import { tabStop } from '../tab-stop.js';
import { Button } from './Button.js';
import { FieldErrorRegion } from './FieldErrorRegion.js';
import { FieldLabelText } from './FieldLabelText.js';
import { assertFileField } from './file-field/file-field-checks.js';
import { useFileDrop } from './file-field/use-file-drop.js';
import { useSwapFocus } from './file-field/use-swap-focus.js';
import { Stack } from './Stack.js';

/** The chosen file as the field shows it: its name and a line about it. */
export type FileFieldValue = {
  name: string;
  /** A muted line under the name, such as "4 pages · 1.6 MB". */
  detail?: string;
};

export type FileFieldProps = {
  /** The field's label, drawn above it as Field's, and part of its button's name. */
  label: string;
  labelVisuallyHidden?: boolean;
  /** A muted hint under the field, such as "Up to 25 MB". */
  description?: string;
  /** Replaces the hint with an error, in a polite live region. */
  error?: string;
  /**
   * The file types the picker offers, as the native `accept` attribute
   * (".pdf,application/pdf"). A dropped file is not filtered by it: check
   * what `onChange` receives and say why in `error`.
   */
  accept?: string;
  /** The chosen file to show, or nothing chosen (`null` or left out). */
  value?: FileFieldValue | null;
  /** Called with the file the person chose or dropped. Nothing is uploaded. */
  onChange: (file: File) => void;
  /** The empty field's words, such as "Choose a PDF". */
  chooseLabel: string;
  /** The button beside a chosen file, such as "Choose another". */
  changeLabel: string;
  /** Muted words after `chooseLabel` for a fine pointer, such as "or drop it here". */
  dropLabel?: string;
  /** A consumer mark before the chosen file's name (Lucide), hidden from assistive technology. */
  icon?: ReactNode;
  disabled?: boolean;
  /** Prefixes the ids the field gives its parts (its button is `${id}-button`). */
  id?: string;
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

/**
 * One file chosen by a press or dropped on the field: empty, a wide zone
 * that opens the system picker; chosen, the file's name and detail with a
 * button to choose another. It hands the `File` to the consumer and shows
 * what the consumer passes back as `value`; it never reads or uploads it.
 */
export function FileField({
  label,
  labelVisuallyHidden = false,
  description,
  error,
  accept,
  value = null,
  onChange,
  chooseLabel,
  changeLabel,
  dropLabel,
  icon,
  disabled = false,
  id,
}: FileFieldProps) {
  assertFileField({ label, chooseLabel, changeLabel, dropLabel, value });
  const ownId = useId();
  const baseId = id ?? ownId;
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chosen = value !== null;
  const drop = useFileDrop({ disabled, onFile: onChange });
  const focusHandlers = useSwapFocus(buttonRef, chosen);

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    // Cleared, so choosing the same file again is a change too.
    event.currentTarget.value = '';
    if (file) onChange(file);
  }

  const ids = {
    label: `${baseId}-label`,
    button: `${baseId}-button`,
    name: `${baseId}-name`,
    detail: `${baseId}-detail`,
    hint: `${baseId}-hint`,
    error: `${baseId}-error`,
  };
  // The error is in the button's description and the polite region; the
  // button role takes no aria-invalid.
  const naming = {
    'aria-labelledby': `${ids.label} ${ids.button}`,
    'aria-describedby':
      [
        chosen && ids.name,
        chosen && value.detail && ids.detail,
        description && !error && ids.hint,
        error && ids.error,
      ]
        .filter(Boolean)
        .join(' ') || undefined,
    id: ids.button,
  };
  const open = () => inputRef.current?.click();

  return (
    <Stack
      className={cx('sw-field', 'sw-file-field', error && 'sw-field-invalid')}
      gap={labelVisuallyHidden ? 0 : 1}
    >
      <span id={ids.label}>
        <FieldLabelText label={label} visuallyHidden={labelVisuallyHidden} />
      </span>
      <div
        className={cx(
          'sw-file-field-frame',
          chosen ? 'sw-file-field-chosen' : 'sw-file-field-empty',
          drop.dragging && 'sw-file-field-dragging',
          disabled && 'sw-file-field-disabled',
        )}
        {...drop.handlers}
        {...focusHandlers}
      >
        {/* Hidden and out of the Tab order: the button opens it. */}
        <input
          accept={accept}
          aria-label={label}
          disabled={disabled}
          hidden
          onChange={onInput}
          ref={inputRef}
          tabIndex={-1}
          type="file"
        />
        {chosen ? (
          <>
            {!hasMark(icon) ? null : (
              <span aria-hidden="true" className="sw-file-field-icon">
                {icon}
              </span>
            )}
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
            <Button
              {...naming}
              disabled={disabled}
              disabledAppearance="neutral"
              onPress={open}
              ref={buttonRef}
              variant="neutral"
            >
              {changeLabel}
            </Button>
          </>
        ) : (
          <button
            {...naming}
            className="sw-file-field-zone"
            disabled={disabled}
            onClick={open}
            ref={buttonRef}
            tabIndex={tabStop}
            type="button"
          >
            <span className="sw-file-field-choose">{chooseLabel}</span>
            {/* A space between the words in the name; the gap draws it. */}
            {dropLabel ? ' ' : null}
            {dropLabel ? (
              <span className="sw-file-field-drop">{dropLabel}</span>
            ) : null}
          </button>
        )}
      </div>
      {description && !error ? (
        <span className="sw-field-description" id={ids.hint}>
          {description}
        </span>
      ) : null}
      <FieldErrorRegion
        className="sw-field-error"
        id={ids.error}
        message={error}
      />
    </Stack>
  );
}
