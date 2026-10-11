import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Field, fieldVariants } from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function Search({ disabled = false }: { disabled?: boolean }) {
  const [query, setQuery] = useState('heron');
  return (
    <Field
      clearLabel="Clear search"
      description="Names as on the ring."
      label="Search birds"
      leading={<svg data-testid="glass" />}
      onClear={() => setQuery('')}
      variant="search"
    >
      <input
        disabled={disabled}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder="Search"
        value={query}
      />
    </Field>
  );
}

describe('Field variant="search"', () => {
  it('names a search box by its hidden label, with the glyph hidden', () => {
    render(<Search />);
    const box = screen.getByRole('searchbox', { name: 'Search birds' });
    expect(box.getAttribute('type')).toBe('search');
    expect(screen.getByText('Search birds').closest('label')?.className).toBe(
      'sw-sr-only',
    );
    expect(box.getAttribute('enterkeyhint')).toBe('search');
    const glyph = screen.getByTestId('glass').parentElement!;
    expect(glyph.className).toBe('sw-field-search-leading');
    expect(glyph.getAttribute('aria-hidden')).toBe('true');
    expect(box.closest('.sw-field')?.className).toContain(
      'sw-field-search-field',
    );
    expect(box.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('clears the text and puts focus back in the input', () => {
    render(<Search />);
    const clear = screen.getByRole('button', { name: 'Clear search' });
    fireEvent.click(clear);
    const box = screen.getByRole('searchbox') as HTMLInputElement;
    expect(box.value).toBe('');
    expect(document.activeElement).toBe(box);
    // No text, no clear button.
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    fireEvent.change(box, { target: { value: 'egret' } });
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy();
  });

  it('shows no clear button while disabled or read-only', () => {
    render(<Search disabled />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    cleanup();
    const readOnlyClear = vi.fn();
    render(
      <Field
        clearLabel="Clear search"
        label="Search birds"
        onClear={readOnlyClear}
        variant="search"
      >
        <input readOnly value="heron" />
      </Field>,
    );
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    // Escape leaves a read-only box alone too.
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    expect(readOnlyClear).not.toHaveBeenCalled();
  });

  it('clears on Escape through onClear, and leaves an empty box alone', () => {
    const onClear = vi.fn();
    const { rerender } = render(
      <Field
        clearLabel="Clear"
        label="Search"
        onClear={onClear}
        variant="search"
      >
        <input onChange={vi.fn()} value="heron" />
      </Field>,
    );
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    expect(onClear).toHaveBeenCalledTimes(1);
    rerender(
      <Field
        clearLabel="Clear"
        label="Search"
        onClear={onClear}
        variant="search"
      >
        <input onChange={vi.fn()} value="" />
      </Field>,
    );
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Escape' });
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('focuses the input from the glyph, keeps it on the clear button, and leaves a press on the input alone', () => {
    render(<Search />);
    const box = screen.getByRole('searchbox');
    const glyph = screen.getByTestId('glass').parentElement!;
    expect(fireEvent.mouseDown(glyph)).toBe(false);
    expect(document.activeElement).toBe(box);
    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(fireEvent.mouseDown(clear)).toBe(false);
    expect(fireEvent.mouseDown(box)).toBe(true);
  });

  it('overrides a text type, and shows an error under the frame', () => {
    render(
      <Field
        clearLabel="Clear"
        error="Type at least two letters."
        label="Search"
        onClear={vi.fn()}
        variant="search"
      >
        <input onChange={vi.fn()} type="text" value="h" />
      </Field>,
    );
    const box = screen.getByRole('searchbox');
    expect(box.getAttribute('type')).toBe('search');
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(box.closest('.sw-field')?.className).toContain('sw-field-invalid');
    expect(screen.getByText('Type at least two letters.').id).toBe(
      box.getAttribute('aria-describedby'),
    );
  });

  it('fails closed without a clear label or onClear, with prefix, or on a non-input child', () => {
    const base = { label: 'Search', variant: 'search' as const };
    const input = <input onChange={vi.fn()} value="" />;
    expect(() =>
      render(
        <Field {...base} onClear={vi.fn()}>
          {input}
        </Field>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Field {...base} clearLabel=" " onClear={vi.fn()}>
          {input}
        </Field>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <Field {...base} clearLabel="Clear">
          {input}
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field {...base} clearLabel="Clear" onClear={vi.fn()} prefix="$">
          {input}
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field {...base} clearLabel="Clear" onClear={vi.fn()}>
          <textarea />
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field {...base} clearLabel="Clear" onClear={vi.fn()}>
          <input defaultValue="heron" />
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field label="Name" leading={<svg />}>
          {input}
        </Field>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <Field label="Name" variant={'pill' as 'search'}>
          {input}
        </Field>,
      ),
    ).toThrow(RangeError);
    expect(fieldVariants).toEqual(['outlined', 'search']);
  });
});

describe('Field search CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-field-search',
        'sw-field-search-leading',
        'sw-field-search-clear',
        'sw-field-search-cross',
      ]),
    );
  });

  it('hides the browser search chrome and draws the clear disc, kept in forced colours', () => {
    expect(css).toContain("input[type='search']::-webkit-search-cancel-button");
    expect(css).toMatch(
      /\.sw-field-search-cross \{[^}]*background: var\(--sw-color-muted\);/,
    );
    expect(css).toMatch(
      /forced-colors: active\) \{[^@]*\.sw-field-search-cross \{ background: ButtonText; forced-color-adjust: none; \}/,
    );
    expect(css).toMatch(
      /pointer: coarse\) \{\n {2}\.sw-field-search-clear \{ min-width: var\(--sw-control-md-min-height\); \}/,
    );
  });
});
