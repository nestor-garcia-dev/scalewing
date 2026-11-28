import { createElement, useState } from 'react';

import { PinField, type PinFieldProps } from './components/PinField.js';

/**
 * A PinField whose digits a parent holds, as a consumer does. Its ids come
 * from `id`, so two renders of it are comparable byte for byte.
 * Test-only: excluded from the build.
 */
export function HeldPinField({
  initial = '',
  onChange,
  ...props
}: Partial<PinFieldProps> & { initial?: string }) {
  const [value, setValue] = useState(initial);
  return createElement(PinField, {
    id: 'code',
    label: 'Gate code',
    ...props,
    onChange: (next: string) => {
      setValue(next);
      onChange?.(next);
    },
    value,
  });
}

/**
 * Everything a reader of the page could get from it: the serialized DOM
 * (every element, attribute and text node) and each input's live `value`
 * property, which is not in the markup.
 */
export function pageState(root: Element): string {
  const values = [...root.querySelectorAll('input')].map(
    (input) => input.value,
  );
  return `${root.innerHTML}\n${JSON.stringify(values)}`;
}

/**
 * The page's state without what the pad's keys themselves draw (their
 * digit or glyph): the one place a digit is named by design. The keys'
 * own attributes stay in.
 */
export function pageStateOutsideKeyFaces(root: Element): string {
  const copy = root.cloneNode(true) as Element;
  for (const key of copy.querySelectorAll('.sw-pin-field-key'))
    key.textContent = '';
  const values = [...root.querySelectorAll('input')].map(
    (input) => input.value,
  );
  return `${copy.innerHTML}\n${JSON.stringify(values)}`;
}
