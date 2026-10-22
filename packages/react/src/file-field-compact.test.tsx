import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FileField, type FileFieldValue } from './components/FileField.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const words = {
  changeLabel: 'Choose another',
  chooseLabel: 'Choose a photo',
  label: 'Cover photo',
  onChange: () => undefined,
};

const heron: FileFieldValue = {
  name: 'heron-reeds.jpg',
  detail: '1.2 MB',
  preview: 'blob:https://gallery.test/heron',
};

/** The ids an element's aria attribute points at, read as their words. */
function wordsOf(element: Element, attribute: string): string {
  return (element.getAttribute(attribute) ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent)
    .join(' ');
}

describe('FileField compact', () => {
  it('is one row: the thumbnail and name as the change button, Remove at its end', () => {
    const onRemove = vi.fn();
    const { container } = render(
      <FileField
        {...words}
        compact
        onRemove={onRemove}
        removeLabel="Remove"
        value={heron}
      />,
    );
    const frame = container.querySelector('.sw-file-field-frame');
    expect(frame?.className).toBe(
      'sw-file-field-frame sw-file-field-chosen sw-file-field-compact',
    );
    const change = screen.getByRole('button', {
      name: 'Cover photo Choose another',
    });
    expect(change.className).toBe('sw-file-field-pick');
    expect(change.getAttribute('tabindex')).toBe('0');
    // The name and the detail describe it; the detail is read, not drawn.
    expect(wordsOf(change, 'aria-describedby')).toBe('heron-reeds.jpg 1.2 MB');
    expect(change.querySelector('img.sw-file-field-preview')).toBeTruthy();
    expect(change.querySelector('.sw-file-field-name')?.textContent).toBe(
      'heron-reeds.jpg',
    );
    expect(
      document.getElementById(
        (change.getAttribute('aria-describedby') ?? '').split(' ')[1] ?? '',
      )?.className,
    ).toBe('sw-sr-only');
    // No full-field change button beside it.
    expect(container.querySelectorAll('button')).toHaveLength(2);

    const remove = screen.getByRole('button', { name: 'Remove Cover photo' });
    expect(remove.className).toContain('sw-button-ghost');
    expect(remove.className).toContain('sw-file-field-remove');
    expect(remove.parentElement).toBe(frame);
    fireEvent.click(remove);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('opens the picker from the row, and draws its choose words at its start while empty', () => {
    const { container } = render(<FileField {...words} compact />);
    expect(
      container.querySelector('.sw-file-field-frame')?.className,
    ).toContain('sw-file-field-compact');
    const zone = screen.getByRole('button', {
      name: 'Cover photo Choose a photo',
    });
    expect(zone.className).toBe('sw-file-field-zone');
    // Nothing to remove while empty.
    cleanup();
    render(
      <FileField {...words} compact onRemove={() => {}} removeLabel="Remove" />,
    );
    expect(screen.queryByRole('button', { name: /Remove/ })).toBeNull();
    cleanup();
    render(<FileField {...words} compact value={heron} />);
    const input = document.querySelector('input[type="file"]');
    const click = vi.spyOn(input as HTMLInputElement, 'click');
    fireEvent.click(
      screen.getByRole('button', { name: 'Cover photo Choose another' }),
    );
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('is off while disabled, Remove too', () => {
    const onRemove = vi.fn();
    render(
      <FileField
        {...words}
        compact
        disabled
        onRemove={onRemove}
        removeLabel="Remove"
        value={heron}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Cover photo Choose another' }),
    ).toHaveProperty('disabled', true);
    const remove = screen.getByRole('button', { name: 'Remove Cover photo' });
    expect(remove).toHaveProperty('disabled', true);
    // The ghost Remove fades (it has no fill to grey), as the row does.
    expect(remove.className).not.toContain('sw-button-disabled-neutral');
    fireEvent.click(remove);
    expect(onRemove).not.toHaveBeenCalled();
  });
});

describe('FileField Remove', () => {
  it('sits after the change button in the full field, named with the label', () => {
    const { container } = render(
      <FileField
        {...words}
        onRemove={() => undefined}
        removeLabel="Remove"
        value={heron}
      />,
    );
    const actions = container.querySelector('.sw-file-field-actions');
    expect(
      [...(actions?.children ?? [])].map((button) => button.textContent),
    ).toEqual(['Choose another', 'Remove']);
    expect(
      screen.getByRole('button', { name: 'Remove Cover photo' }).className,
    ).toContain('sw-button-neutral');
    // Without Remove the change button stays the row's direct child.
    cleanup();
    const plain = render(<FileField {...words} value={heron} />);
    expect(plain.container.querySelector('.sw-file-field-actions')).toBeNull();
  });

  it('moves focus to the empty field once its file is removed', () => {
    function Cover() {
      const [value, setValue] = useState<FileFieldValue | null>(heron);
      return (
        <FileField
          {...words}
          compact
          onRemove={() => setValue(null)}
          removeLabel="Remove"
          value={value}
        />
      );
    }
    render(<Cover />);
    const remove = screen.getByRole('button', { name: 'Remove Cover photo' });
    act(() => remove.focus());
    act(() => {
      fireEvent.click(remove);
    });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Cover photo Choose a photo' }),
    );
  });

  it('refuses Remove without its words, words without it, and blank words', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<FileField {...words} onRemove={() => undefined} />),
    ).toThrow('FileField onRemove and removeLabel go together');
    expect(() => render(<FileField {...words} removeLabel="Remove" />)).toThrow(
      'FileField onRemove and removeLabel go together',
    );
    expect(() =>
      render(
        <FileField {...words} onRemove={() => undefined} removeLabel=" " />,
      ),
    ).toThrow('FileField removeLabel must be non-empty text');
  });

  it('generates the compact row and the actions', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-file-field-actions',
        'sw-file-field-compact',
        'sw-file-field-pick',
        'sw-file-field-remove',
      ]),
    );
    expect(css).toContain(`.sw-file-field-compact.sw-file-field-chosen {
  flex-wrap: nowrap;
  gap: var(--sw-space-1);
  min-height: var(--sw-control-md-min-height);
  padding-block: 0;
  padding-inline: 0 var(--sw-space-1);
}`);
    expect(css).toContain(`.sw-file-field-pick .sw-file-field-name {`);
    expect(css).toContain('  text-overflow: ellipsis;\n  white-space: nowrap;');
    expect(css).toContain('.sw-file-field-pick:focus-visible {');
    expect(css).toContain('.sw-file-field-actions {\n  display: flex;');
    expect(css).toContain('.sw-file-field-remove { flex: none; }');
    expect(css).toContain(
      '.sw-file-field-pick > .sw-file-field-name:first-child { margin-inline-start: var(--sw-space-3); }',
    );
    expect(css).toContain(
      '.sw-file-field-pick:disabled { opacity: var(--sw-disabled-opacity); }',
    );
  });
});
