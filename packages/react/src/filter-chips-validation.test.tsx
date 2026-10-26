import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FilterChips } from './components/FilterChips.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const options = [
  { value: 'deposit', label: 'Bank deposit' },
  { value: 'correction', label: 'Till correction' },
  { value: 'other', label: 'Other' },
];

describe('FilterChips required and error', () => {
  it('starts with nothing chosen, marks the label and requires each radio', () => {
    render(
      <FilterChips
        label="Why"
        onChange={vi.fn()}
        options={options}
        required
        value=""
      />,
    );
    const group = screen.getByRole('group', { name: 'Why' });
    expect(
      group.querySelector('.sw-field-required')?.getAttribute('aria-hidden'),
    ).toBe('true');
    for (const radio of screen.getAllByRole('radio')) {
      expect((radio as HTMLInputElement).required).toBe(true);
      expect((radio as HTMLInputElement).checked).toBe(false);
    }
    expect(group.getAttribute('aria-invalid')).toBeNull();
    expect(group.getAttribute('aria-describedby')).toBeNull();
  });

  it('describes the group by its error and the consumer ids, and marks it invalid', () => {
    render(
      <>
        <span id="hint">The reason goes on the record.</span>
        <FilterChips
          aria-describedby="hint"
          error="Pick a reason."
          label="Why"
          onChange={vi.fn()}
          options={options}
          required
          value=""
        />
      </>,
    );
    const group = screen.getByRole('group', { name: 'Why' });
    expect(group.getAttribute('aria-invalid')).toBe('true');
    const ids = group.getAttribute('aria-describedby')!.split(' ');
    expect(ids[0]).toBe('hint');
    const error = document.getElementById(ids[1]!)!;
    expect(error.textContent).toBe('Pick a reason.');
    expect(error.getAttribute('aria-live')).toBe('polite');
    expect(error.className).toBe('sw-filter-chips-error');
  });

  it('keeps an empty error region in the page and out of the description', () => {
    const { container } = render(
      <FilterChips
        label="Why"
        onChange={vi.fn()}
        options={options}
        value="other"
      />,
    );
    expect(container.querySelector('.sw-filter-chips-error')?.textContent).toBe(
      '',
    );
    expect(
      screen
        .getByRole('group', { name: 'Why' })
        .getAttribute('aria-describedby'),
    ).toBeNull();
    expect(screen.getByRole('radio', { name: 'Other' })).toHaveProperty(
      'required',
      false,
    );
  });

  it('shows an error without required, ignores a blank describedby, and chooses from nothing', () => {
    const onChange = vi.fn();
    render(
      <FilterChips
        aria-describedby="  "
        error="Pick one."
        label="Why"
        onChange={onChange}
        options={options}
        value=""
      />,
    );
    const group = screen.getByRole('group', { name: 'Why' });
    expect(group.querySelector('.sw-field-required')).toBeNull();
    expect(group.getAttribute('aria-describedby')!.split(' ')).toHaveLength(1);
    fireEvent.click(screen.getByRole('radio', { name: 'Other' }));
    expect(onChange).toHaveBeenCalledWith('other');
  });

  it('still fails closed on a value that is neither empty nor an option', () => {
    expect(() =>
      render(
        <FilterChips
          label="Why"
          onChange={vi.fn()}
          options={options}
          value="lost"
        />,
      ),
    ).toThrow(RangeError);
  });
});

describe('FilterChips validation CSS', () => {
  const css = generateStylesheet();

  it('lists the error class and draws the danger edge and message', () => {
    expect(utilityClassCatalog()).toContain('sw-filter-chips-error');
    expect(css).toContain(
      ".sw-filter-chips[aria-invalid='true'] .sw-filter-chip-face {\n  border-color: var(--sw-color-danger);\n}",
    );
    expect(css).toMatch(
      /\.sw-filter-chips-error \{\n {2}color: var\(--sw-color-danger\);/,
    );
    expect(css).toContain(
      '.sw-filter-chips-error:empty { position: absolute; }',
    );
    expect(css).toMatch(
      /forced-colors: active\) \{[^@]*\.sw-filter-chips-error \{ color: Mark; \}/,
    );
  });

  it("keeps the chosen chip's words off the forced-colours backplate", () => {
    // FutMas F-010-S22: Chromium paints a Canvas backplate behind text in
    // forced colours, so HighlightText words on the chosen chip vanished.
    expect(css).toContain(
      '.sw-filter-chip-input:checked + .sw-filter-chip-face { background: Highlight; border-color: Highlight; color: HighlightText; forced-color-adjust: none; }',
    );
  });

  it('edges the chosen chip too, after its checked rule, in both modes', () => {
    const invalid =
      ".sw-filter-chips[aria-invalid='true'] .sw-filter-chip-face {";
    const checked = '.sw-filter-chip-input:checked + .sw-filter-chip-face {';
    expect(css.indexOf(invalid)).toBeGreaterThan(css.indexOf(checked));
    const forced = css.slice(
      css.indexOf('@media (forced-colors: active) {\n  .sw-filter-chip-face'),
    );
    const block = forced.slice(0, forced.indexOf('\n}'));
    expect(
      block.indexOf(
        "[aria-invalid='true'] .sw-filter-chip-face { border-color: Mark; }",
      ),
    ).toBeGreaterThan(
      block.indexOf('.sw-filter-chip-input:checked + .sw-filter-chip-face {'),
    );
  });
});
