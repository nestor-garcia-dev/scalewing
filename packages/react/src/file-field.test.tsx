import { contrastRatio } from '@scalewing/tokens';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FileField, type FileFieldValue } from './components/FileField.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const pdf = () =>
  new File(['%PDF-1.7'], 'heron-calls.pdf', { type: 'application/pdf' });

/** A consumer that shows the file it was given, as a form would. */
function Chooser({
  onFile = () => undefined,
  error,
  disabled,
}: {
  onFile?: (file: File) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<FileFieldValue | null>(null);
  return (
    <FileField
      accept=".pdf,application/pdf"
      changeLabel="Choose another"
      chooseLabel="Choose a PDF"
      description="Up to 25 MB"
      disabled={disabled}
      dropLabel="or drop it here"
      error={error}
      label="Field guide"
      onChange={(file) => {
        onFile(file);
        setValue({ name: file.name, detail: '1 page · 8 B' });
      }}
      value={value}
    />
  );
}

function fileInput(): HTMLInputElement {
  const input = document.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) throw new Error('no file input');
  return input;
}

describe('FileField', () => {
  it('names its empty zone by the label and its words, described by the hint', () => {
    render(<Chooser />);
    const zone = screen.getByRole('button', {
      name: 'Field guide Choose a PDF or drop it here',
    });
    expect(zone.className).toBe('sw-file-field-zone');
    expect(zone).toHaveProperty('type', 'button');
    expect(
      document.getElementById(zone.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Up to 25 MB');
    const input = fileInput();
    expect(input.hidden).toBe(true);
    expect(input.accept).toBe('.pdf,application/pdf');
    expect(input.tabIndex).toBe(-1);
  });

  it('opens the picker from the zone and hands over the chosen file, then shows it', async () => {
    const user = userEvent.setup();
    const onFile = vi.fn();
    render(<Chooser onFile={onFile} />);
    const click = vi.spyOn(fileInput(), 'click');
    const zone = screen.getByRole('button', { name: /Choose a PDF/ });
    await user.click(zone);
    expect(click).toHaveBeenCalledTimes(1);
    // The picker returns focus to the zone, then the input changes.
    zone.focus();
    const input = fileInput();
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [pdf()],
    });
    fireEvent.change(input);
    expect(onFile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'heron-calls.pdf' }),
    );
    const change = screen.getByRole('button', {
      name: 'Field guide Choose another',
    });
    // Focus moves to the button that replaced the zone.
    expect(document.activeElement).toBe(change);
    const described = (change.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent);
    expect(described).toEqual([
      'heron-calls.pdf',
      '1 page · 8 B',
      'Up to 25 MB',
    ]);
    // The input is cleared, so the same file again is a change too.
    expect(fileInput().value).toBe('');
  });

  it('takes the first file dropped on it, and draws the drag', () => {
    const onFile = vi.fn();
    render(<Chooser onFile={onFile} />);
    const frame = document.querySelector('.sw-file-field-frame');
    if (!frame) throw new Error('no frame');
    const files = [pdf(), new File(['x'], 'second.pdf')];
    const dataTransfer = { files, types: ['Files'], dropEffect: 'none' };
    fireEvent.dragEnter(frame, { dataTransfer });
    expect(frame.classList.contains('sw-file-field-dragging')).toBe(true);
    fireEvent.dragOver(frame, { dataTransfer });
    expect(dataTransfer.dropEffect).toBe('copy');
    fireEvent.drop(frame, { dataTransfer });
    expect(onFile).toHaveBeenCalledTimes(1);
    expect(onFile.mock.calls[0]?.[0].name).toBe('heron-calls.pdf');
    expect(
      document
        .querySelector('.sw-file-field-frame')
        ?.classList.contains('sw-file-field-dragging'),
    ).toBe(false);
  });

  it('ignores a drag of text, and a drag that leaves', () => {
    const onFile = vi.fn();
    render(<Chooser onFile={onFile} />);
    const frame = document.querySelector('.sw-file-field-frame');
    if (!frame) throw new Error('no frame');
    fireEvent.dragEnter(frame, {
      dataTransfer: { files: [], types: ['text/plain'] },
    });
    expect(frame.classList.contains('sw-file-field-dragging')).toBe(false);
    const dataTransfer = { files: [], types: ['Files'] };
    fireEvent.dragEnter(frame, { dataTransfer });
    fireEvent.dragLeave(frame, { dataTransfer });
    expect(frame.classList.contains('sw-file-field-dragging')).toBe(false);
    fireEvent.drop(frame, { dataTransfer });
    expect(onFile).not.toHaveBeenCalled();
  });

  it('shows an error in place of the hint, in a polite region, and marks the frame', () => {
    render(<Chooser error="photo.jpg isn’t a PDF. Choose a PDF." />);
    const zone = screen.getByRole('button', { name: /Choose a PDF/ });
    const error = screen.getByText('photo.jpg isn’t a PDF. Choose a PDF.');
    expect(error.getAttribute('aria-live')).toBe('polite');
    expect(zone.getAttribute('aria-describedby')).toBe(error.id);
    expect(screen.queryByText('Up to 25 MB')).toBeNull();
    expect(document.querySelector('.sw-file-field')?.className).toContain(
      'sw-field-invalid',
    );
  });

  it('blocks the picker and drops while disabled', () => {
    const onFile = vi.fn();
    render(<Chooser disabled onFile={onFile} />);
    expect(screen.getByRole('button', { name: /Choose a PDF/ })).toHaveProperty(
      'disabled',
      true,
    );
    expect(fileInput().disabled).toBe(true);
    const frame = document.querySelector('.sw-file-field-frame');
    if (!frame) throw new Error('no frame');
    const dataTransfer = { files: [pdf()], types: ['Files'] };
    fireEvent.dragEnter(frame, { dataTransfer });
    // The browser is kept from opening the file: the drop is cancelled.
    expect(fireEvent.dragOver(frame, { dataTransfer })).toBe(false);
    expect(fireEvent.drop(frame, { dataTransfer })).toBe(false);
    expect(onFile).not.toHaveBeenCalled();
    expect(frame.classList.contains('sw-file-field-dragging')).toBe(false);
  });

  it('keeps focus where the person moved it when the file is shown later', async () => {
    const field = (value: FileFieldValue | null) => (
      <>
        <FileField
          changeLabel="Choose another"
          chooseLabel="Choose a PDF"
          label="Field guide"
          onChange={() => undefined}
          value={value}
        />
        <button type="button">Elsewhere</button>
      </>
    );
    const { rerender } = render(field(null));
    screen.getByRole('button', { name: /Choose a PDF/ }).focus();
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    elsewhere.focus();
    // The blur's check runs in a microtask.
    await Promise.resolve();
    rerender(field({ name: 'heron-calls.pdf' }));
    expect(document.activeElement).toBe(elsewhere);
  });

  it('keeps focus in the field across the system picker, whose window takes focus', async () => {
    const field = (value: FileFieldValue | null) => (
      <FileField
        changeLabel="Choose another"
        chooseLabel="Choose a PDF"
        label="Field guide"
        onChange={() => undefined}
        value={value}
      />
    );
    const { rerender } = render(field(null));
    const zone = screen.getByRole('button', { name: /Choose a PDF/ });
    zone.focus();
    // The picker's window takes focus from the page: a blur, no new target.
    const away = vi.spyOn(document, 'hasFocus').mockReturnValue(false);
    zone.blur();
    await Promise.resolve();
    away.mockRestore();
    rerender(field({ name: 'heron-calls.pdf' }));
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Field guide Choose another' }),
    );
  });

  it('leaves focus nowhere when the person left the field before the answer came', async () => {
    vi.spyOn(document, 'hasFocus').mockReturnValue(true);
    const field = (value: FileFieldValue | null) => (
      <FileField
        changeLabel="Choose another"
        chooseLabel="Choose a PDF"
        label="Field guide"
        onChange={() => undefined}
        value={value}
      />
    );
    const { rerender } = render(field(null));
    const zone = screen.getByRole('button', { name: /Choose a PDF/ });
    zone.focus();
    zone.blur();
    await Promise.resolve();
    rerender(field({ name: 'heron-calls.pdf' }));
    expect(document.activeElement).toBe(document.body);
  });

  it('ends a drag that began before the field was disabled', () => {
    const field = (disabled: boolean) => (
      <FileField
        changeLabel="Choose another"
        chooseLabel="Choose a PDF"
        disabled={disabled}
        label="Field guide"
        onChange={() => undefined}
      />
    );
    const { rerender } = render(field(false));
    const frame = document.querySelector('.sw-file-field-frame');
    if (!frame) throw new Error('no frame');
    const dataTransfer = { files: [], types: ['Files'] };
    fireEvent.dragEnter(frame, { dataTransfer });
    expect(frame.classList.contains('sw-file-field-dragging')).toBe(true);
    rerender(field(true));
    expect(frame.classList.contains('sw-file-field-dragging')).toBe(false);
    fireEvent.dragLeave(frame, { dataTransfer });
    rerender(field(false));
    expect(frame.classList.contains('sw-file-field-dragging')).toBe(false);
  });

  it('keeps a disabled chosen file readable, its button disabled', () => {
    render(
      <FileField
        changeLabel="Choose another"
        chooseLabel="Choose a PDF"
        disabled
        label="Field guide"
        onChange={() => undefined}
        value={{ name: 'heron-calls.pdf', detail: '2 pages' }}
      />,
    );
    const change = screen.getByRole('button', {
      name: 'Field guide Choose another',
    });
    expect(change).toHaveProperty('disabled', true);
    // The change button greys, as the zone's words do; it never fades.
    expect(change.className).toContain('sw-button-disabled-neutral');
    expect(screen.getByText('heron-calls.pdf').className).toBe(
      'sw-file-field-name',
    );
    expect(document.querySelector('.sw-file-field-frame')?.className).toContain(
      'sw-file-field-disabled',
    );
    // No disabled rule, by class or by :disabled, restyles the name or the
    // detail: every selector naming them is free of "disabled".
    // Every prelude before a "{", the first rule inside an @media included.
    const selectors = (generateStylesheet().match(/[^{}]+(?=\{)/g) ?? [])
      .flatMap((list) => list.split(','))
      .filter((selector) => /sw-file-field-(name|detail)\b/.test(selector));
    expect(selectors.length).toBeGreaterThan(0);
    expect(
      selectors.filter((selector) => selector.includes('disabled')),
    ).toEqual([]);
  });

  it('draws no mark for an empty icon, and prefixes its ids with id', () => {
    for (const icon of [null, false, '']) {
      const { unmount } = render(
        <FileField
          changeLabel="Choose another"
          chooseLabel="Choose a PDF"
          icon={icon}
          id="guide"
          label="Field guide"
          onChange={() => undefined}
          value={{ name: 'heron-calls.pdf' }}
        />,
      );
      expect(document.querySelector('.sw-file-field-icon')).toBeNull();
      expect(
        screen.getByRole('button', { name: 'Field guide Choose another' }).id,
      ).toBe('guide-button');
      expect(document.getElementById('guide-name')?.textContent).toBe(
        'heron-calls.pdf',
      );
      unmount();
    }
  });

  it('keeps focus in the field when a drop replaces the focused zone', () => {
    render(<Chooser />);
    screen.getByRole('button', { name: /Choose a PDF/ }).focus();
    const frame = document.querySelector('.sw-file-field-frame');
    if (!frame) throw new Error('no frame');
    act(() => {
      fireEvent.drop(frame, {
        dataTransfer: { files: [pdf()], types: ['Files'] },
      });
    });
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Field guide Choose another' }),
    );
  });

  it('draws the choose words in the text colour, 4.5:1 on the subtle fill in every palette', () => {
    expect(generateStylesheet()).toContain(
      '.sw-file-field-choose {\n  color: var(--sw-color-text);',
    );
    forEveryTheme((colors, label) => {
      expect(
        contrastRatio(colors.text, colors.subtle),
        label,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(colors.muted, colors.subtle),
        label,
      ).toBeGreaterThanOrEqual(4.5);
      // A chosen file's muted detail on the chosen row's surface.
      expect(
        contrastRatio(colors.muted, colors.surface),
        label,
      ).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('draws a drag over an invalid field with the drag’s edge, also in forced colours', () => {
    const css = generateStylesheet();
    const invalid = css.indexOf(
      '.sw-field-invalid .sw-file-field-frame { border-color: var(--sw-color-danger); }',
    );
    const drag = css.indexOf('.sw-file-field-frame.sw-file-field-dragging {');
    expect(invalid).toBeGreaterThan(-1);
    expect(drag).toBeGreaterThan(invalid);
    const forcedInvalid = css.indexOf(
      '.sw-field-invalid .sw-file-field-frame { border-color: Mark; }',
    );
    const forcedDrag = css.indexOf(
      '.sw-file-field-frame.sw-file-field-dragging { border-color: Highlight;',
    );
    expect(forcedInvalid).toBeGreaterThan(-1);
    expect(forcedDrag).toBeGreaterThan(forcedInvalid);
  });

  it('keeps the words on the drag tint at 4.5:1 in every palette', () => {
    expect(generateStylesheet()).toContain(
      '.sw-file-field-dragging :is(.sw-file-field-choose, .sw-file-field-drop, .sw-file-field-detail, .sw-file-field-icon) {\n  color: var(--sw-color-text);\n}',
    );
    forEveryTheme((colors, label) => {
      expect(
        contrastRatio(colors.text, colors.accentSubtle),
        label,
      ).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('shows a chosen file with the consumer’s mark, and the label hidden when asked', () => {
    render(
      <FileField
        changeLabel="Choose another"
        chooseLabel="Choose a PDF"
        icon={<svg data-testid="mark" />}
        label="Field guide"
        labelVisuallyHidden
        onChange={() => undefined}
        value={{ name: 'owl-pellets.pdf' }}
      />,
    );
    const change = screen.getByRole('button', {
      name: 'Field guide Choose another',
    });
    expect(change.getAttribute('aria-describedby')).toMatch(/-name$/);
    expect(
      screen.getByTestId('mark').parentElement?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(screen.getByText('Field guide').className).toContain('sw-sr-only');
    expect(document.querySelector('.sw-file-field-detail')).toBeNull();
  });

  it('does not move focus when a file is dropped from elsewhere', () => {
    const onFile = vi.fn();
    render(
      <>
        <button type="button">Elsewhere</button>
        <Chooser onFile={onFile} />
      </>,
    );
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    elsewhere.focus();
    const frame = document.querySelector('.sw-file-field-frame');
    if (!frame) throw new Error('no frame');
    act(() => {
      fireEvent.drop(frame, {
        dataTransfer: { files: [pdf()], types: ['Files'] },
      });
    });
    expect(document.activeElement).toBe(elsewhere);
  });

  it('refuses empty words and a chosen file with no name', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const base = {
      changeLabel: 'Choose another',
      chooseLabel: 'Choose a PDF',
      label: 'Field guide',
      onChange: () => undefined,
    };
    expect(() => render(<FileField {...base} label=" " />)).toThrow(
      'FileField label must be non-empty text',
    );
    expect(() => render(<FileField {...base} chooseLabel="" />)).toThrow(
      'FileField chooseLabel must be non-empty text',
    );
    expect(() => render(<FileField {...base} changeLabel="" />)).toThrow(
      'FileField changeLabel must be non-empty text',
    );
    expect(() => render(<FileField {...base} dropLabel=" " />)).toThrow(
      'FileField dropLabel must be non-empty text',
    );
    expect(() => render(<FileField {...base} value={{ name: '' }} />)).toThrow(
      'FileField value name must be non-empty text',
    );
    expect(() =>
      render(<FileField {...base} value={{ name: 'a.pdf', detail: ' ' }} />),
    ).toThrow('FileField value detail must be non-empty text');
  });

  it('generates its frame, zone and drag rules from tokens and catalogs them', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-file-field-dragging {\n  background: var(--sw-color-accentSubtle);',
    );
    expect(css).toContain(
      '.sw-field-invalid .sw-file-field-frame { border-color: var(--sw-color-danger); }',
    );
    expect(css).toContain('.sw-file-field-drop { display: none; }');
    expect(css).not.toMatch(/sw-file-field[^}]*#[0-9a-f]{3,6}/i);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-file-field',
        'sw-file-field-zone',
        'sw-file-field-chosen',
        'sw-file-field-dragging',
      ]),
    );
  });
});
