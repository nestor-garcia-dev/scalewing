import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RadioGroup } from './components/RadioGroup.js';
import { cssRadioGroupClasses } from './css/css-radio-group.js';
import { utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const options = [
  { value: 'forest', label: 'Forest' },
  { value: 'desert', label: 'Desert', disabled: true },
  { value: 'wetland', label: 'Wetland' },
] as const;

describe('RadioGroup', () => {
  it('groups native required choices and associates description and error', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        description="Choose one habitat"
        error="A habitat is required"
        legend="Habitat"
        onChange={onChange}
        options={options}
        required
        value=""
      />,
    );
    const group = screen.getByRole('group', { name: 'Habitat' });
    expect(group.getAttribute('aria-invalid')).toBe('true');
    const ids = (group.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0] ?? '')?.textContent).toBe(
      'Choose one habitat',
    );
    expect(document.getElementById(ids[1] ?? '')?.textContent).toBe(
      'A habitat is required',
    );
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios.every((radio) => !radio.hasAttribute('checked'))).toBe(true);
    expect(radios.every((radio) => radio.hasAttribute('required'))).toBe(true);
    expect(radios[1]).toHaveProperty('disabled', true);
    expect(radios[0]?.getAttribute('name')).toBe(
      radios[2]?.getAttribute('name'),
    );
  });

  it('selects once by pointer and Space, skipping a disabled option', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    function ControlledGroup() {
      const [value, setValue] = useState('');
      return (
        <RadioGroup
          legend="Habitat"
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
          options={options}
          value={value}
        />
      );
    }
    render(<ControlledGroup />);
    const forest = screen.getByRole('radio', { name: 'Forest' });
    const desert = screen.getByRole('radio', { name: 'Desert' });
    const wetland = screen.getByRole('radio', { name: 'Wetland' });
    await user.click(forest);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('forest');
    expect(forest).toHaveProperty('checked', true);
    await user.click(desert);
    expect(onChange).toHaveBeenCalledTimes(1);
    wetland.focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith('wetland');
    expect(wetland).toHaveProperty('checked', true);
    expect(forest).toHaveProperty('checked', false);
  });

  it('rejects missing, duplicate, and unknown values', () => {
    const onChange = vi.fn();
    expect(() =>
      render(
        <RadioGroup
          legend="Habitat"
          onChange={onChange}
          options={[]}
          value=""
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <RadioGroup
          legend="Habitat"
          onChange={onChange}
          options={[
            { value: 'forest', label: 'A' },
            { value: 'forest', label: 'B' },
          ]}
          value="forest"
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <RadioGroup
          legend="Habitat"
          onChange={onChange}
          options={options}
          value="unknown"
        />,
      ),
    ).toThrow(RangeError);
  });
});

describe('RadioGroup option icons', () => {
  const glyph = (title: string) => (
    <svg data-testid={title} viewBox="0 0 16 16">
      <title>{title}</title>
      <circle cx="8" cy="8" r="4" />
    </svg>
  );

  it('draws a hidden glyph between the radio and its label, keeping the name the label', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        legend="Check type"
        onChange={onChange}
        options={[
          { value: 'personal', label: 'Personal check', icon: glyph('Person') },
          { value: 'company', label: 'Company check', icon: glyph('Building') },
          { value: 'other', label: 'Other' },
        ]}
        value=""
      />,
    );
    // Teisoro CHK-13: the name is the text alone, not the glyph's title.
    const company = screen.getByRole('radio', { name: 'Company check' });
    expect(screen.getByRole('radio', { name: 'Personal check' })).toBeTruthy();
    const option = company.closest('label')!;
    const icon = option.querySelector('.sw-radio-group-icon')!;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.contains(screen.getByTestId('Building'))).toBe(true);
    // Order: the radio's control, the glyph, then the words.
    expect(Array.from(option.children).map((child) => child.className)).toEqual(
      ['sw-radio-group-control', 'sw-radio-group-icon', 'sw-radio-group-text'],
    );
    // An option without an icon renders no slot.
    const other = screen
      .getByRole('radio', { name: 'Other' })
      .closest('label')!;
    expect(other.querySelector('.sw-radio-group-icon')).toBeNull();

    await userEvent.click(screen.getByTestId('Building'));
    expect(onChange).toHaveBeenCalledWith('company');
  });

  it('generates the icon slot in the text color', () => {
    expect(cssRadioGroupClasses()).toContain(
      '.sw-radio-group-icon {\n  align-items: center;\n  color: var(--sw-color-text);',
    );
    expect(utilityClassCatalog()).toContain('sw-radio-group-icon');
  });
});
