import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { DateField } from './components/DateField.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  TextInput: 'TextInput',
  useColorScheme: () => 'light',
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

function renderDateField(
  props: Partial<React.ComponentProps<typeof DateField>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <DateField
          label="Start date"
          locale="en-US"
          nextMonthLabel="Next month"
          onChange={onChange}
          placeholder="Pick a date"
          previousMonthLabel="Previous month"
          value="2026-09-21"
          {...props}
        />
      </ThemeProvider>,
    );
  });
  return { onChange, renderer };
}

function pressable(root: ReactTestInstance, label: string) {
  return root
    .findAllByType('Pressable')
    .find((node) => node.props.accessibilityLabel === label);
}

function textContent(root: ReactTestInstance): string[] {
  return root
    .findAllByType('Text')
    .map((node) => node.props.children)
    .filter((child): child is string => typeof child === 'string');
}

describe('DateField', () => {
  it('shows the formatted value and exposes it as the accessibility value', () => {
    const { renderer } = renderDateField();
    const control = pressable(renderer.root, 'Start date');

    expect(control?.props.accessibilityRole).toBe('button');
    expect(control?.props.accessibilityState).toEqual({
      disabled: false,
      expanded: false,
    });
    expect(control?.props.accessibilityValue).toEqual({ text: 'Sep 21, 2026' });
    expect(textContent(renderer.root)).toContain('Sep 21, 2026');
    expect(pressable(renderer.root, 'Next month')).toBeUndefined();
  });

  it('shows the placeholder when empty and opens on the current month', () => {
    const { renderer } = renderDateField({ value: '' });
    const control = pressable(renderer.root, 'Start date');
    expect(control?.props.accessibilityValue).toBeUndefined();
    expect(textContent(renderer.root)).toContain('Pick a date');

    act(() => control?.props.onPress());
    const now = new Date();
    const title = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(now);
    expect(textContent(renderer.root)).toContain(title);
  });

  it('opens on the value month, navigates, selects a day, and closes', () => {
    const { onChange, renderer } = renderDateField();
    act(() => pressable(renderer.root, 'Start date')?.props.onPress());

    expect(textContent(renderer.root)).toContain('September 2026');
    expect(
      pressable(renderer.root, 'Start date')?.props.accessibilityState,
    ).toEqual({ disabled: false, expanded: true });
    const selected = pressable(renderer.root, 'Monday, September 21, 2026');
    expect(selected?.props.accessibilityState).toEqual({
      disabled: false,
      selected: true,
    });

    act(() => pressable(renderer.root, 'Next month')?.props.onPress());
    expect(textContent(renderer.root)).toContain('October 2026');
    act(() => pressable(renderer.root, 'Previous month')?.props.onPress());
    act(() => pressable(renderer.root, 'Previous month')?.props.onPress());
    expect(textContent(renderer.root)).toContain('August 2026');

    act(() =>
      pressable(renderer.root, 'Monday, August 3, 2026')?.props.onPress(),
    );
    expect(onChange).toHaveBeenCalledWith('2026-08-03');
    expect(pressable(renderer.root, 'Next month')).toBeUndefined();
  });

  it('disables days outside min and max and flags an out-of-range value', () => {
    const { renderer } = renderDateField({
      max: '2026-09-25',
      min: '2026-09-20',
      value: '2026-09-28',
    });
    act(() => pressable(renderer.root, 'Start date')?.props.onPress());

    const before = pressable(renderer.root, 'Saturday, September 19, 2026');
    const inside = pressable(renderer.root, 'Tuesday, September 22, 2026');
    const after = pressable(renderer.root, 'Saturday, September 26, 2026');
    expect(before?.props.disabled).toBe(true);
    expect(inside?.props.disabled).toBe(false);
    expect(after?.props.disabled).toBe(true);
  });

  it('rejects malformed values and inverted bounds', () => {
    expect(() => renderDateField({ value: '2026-02-30' })).toThrow(RangeError);
    expect(() =>
      renderDateField({ max: '2026-01-01', min: '2026-02-01' }),
    ).toThrow(RangeError);
  });

  it('keeps a disabled field closed', () => {
    const { renderer } = renderDateField({ disabled: true });
    const control = pressable(renderer.root, 'Start date');
    expect(control?.props.disabled).toBe(true);
    expect(control?.props.accessibilityState.disabled).toBe(true);
  });
});
