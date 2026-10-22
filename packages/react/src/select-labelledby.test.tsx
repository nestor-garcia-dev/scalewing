import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Select, type SelectProps } from './components/Select.js';
import { Text } from './components/Text.js';

afterEach(() => {
  cleanup();
});

const habitats = [
  { value: 'forest', label: 'Forest' },
  { value: 'savanna', label: 'Savanna' },
] as const;

/** A choice the page names with its own drawn words, as a form row does. */
function NamedByPage(props: Partial<SelectProps>) {
  return (
    <>
      <Text as="span" id="watch" variant="label">
        Watch range
      </Text>
      <Select
        aria-labelledby="watch"
        onChange={props.onChange ?? (() => undefined)}
        options={habitats}
        value="forest"
        {...props}
      />
    </>
  );
}

describe('Select aria-labelledby', () => {
  it("is named by the page's words and draws no label, so the name is read once", () => {
    const onChange = vi.fn();
    const { container } = render(<NamedByPage onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    expect(trigger.getAttribute('aria-labelledby')).toBe('watch');
    // No label of its own, hidden or drawn: the words are in the page once.
    expect(container.querySelector('label')).toBeNull();
    expect(container.querySelector('.sw-sr-only')).toBeNull();
    expect(screen.getAllByText('Watch range')).toHaveLength(1);
    // No label row: the trigger is the select's first row.
    const stack = container.querySelector('.sw-select > .sw-stack');
    expect(stack?.firstElementChild?.className).toBe('sw-select-control');
    expect(stack?.className).toContain('sw-gap-0');

    fireEvent.click(trigger);
    const list = screen.getByRole('listbox', { name: 'Watch range' });
    expect(list.getAttribute('aria-labelledby')).toBe('watch');
    fireEvent.pointerDown(screen.getByRole('option', { name: 'Savanna' }));
    fireEvent.click(screen.getByRole('option', { name: 'Savanna' }));
    expect(onChange).toHaveBeenCalledWith('savanna');
  });

  it('keeps required as aria-required and draws no mark of its own', () => {
    const { container } = render(<NamedByPage required />);
    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    expect(trigger.getAttribute('aria-required')).toBe('true');
    expect(container.querySelector('.sw-field-required')).toBeNull();
    expect(container.textContent).not.toContain('*');
  });

  it('describes its error as a labelled select does', () => {
    render(<NamedByPage error="Choose a range" />);
    const trigger = screen.getByRole('combobox', { name: 'Watch range' });
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    const described = trigger.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(described)?.textContent).toBe(
      'Choose a range',
    );
  });

  it('refuses no name, a blank id, and a label or requiredMark with aria-labelledby', () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    const base = {
      onChange: () => undefined,
      options: habitats,
      value: 'forest',
    };
    expect(() => render(<Select {...base} label=" " />)).toThrow(
      'Select needs a label or aria-labelledby',
    );
    expect(() => render(<Select {...base} label="" />)).toThrow(
      'Select needs a label or aria-labelledby',
    );
    expect(() => render(<Select {...base} aria-labelledby=" " />)).toThrow(
      'Select aria-labelledby must be a non-empty id',
    );
    const both = {
      ...base,
      label: 'Watch range',
      'aria-labelledby': 'watch',
    } as unknown as SelectProps;
    expect(() => render(<Select {...both} />)).toThrow(
      'Select takes label (and labelVisuallyHidden) or aria-labelledby, not both',
    );
    const hiddenToo = {
      ...base,
      labelVisuallyHidden: true,
      'aria-labelledby': 'watch',
    } as unknown as SelectProps;
    expect(() => render(<Select {...hiddenToo} />)).toThrow('not both');
    const blankLabelToo = {
      ...base,
      label: ' ',
      'aria-labelledby': 'watch',
    } as unknown as SelectProps;
    expect(() => render(<Select {...blankLabelToo} />)).toThrow('not both');
    const markToo = {
      ...base,
      requiredMark: 'hidden',
      'aria-labelledby': 'watch',
    } as unknown as SelectProps;
    expect(() => render(<Select {...markToo} />)).toThrow(
      'Select requiredMark needs label: with aria-labelledby the page draws the mark',
    );
    quiet.mockRestore();
  });
});
