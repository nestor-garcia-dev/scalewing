import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Calendar } from './components/Calendar.js';
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

function renderCalendar(
  props: Partial<React.ComponentProps<typeof Calendar>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <Calendar
          label="Season starts"
          locale="en-US"
          nextMonthLabel="Next month"
          onChange={onChange}
          previousMonthLabel="Previous month"
          value="2026-10-19"
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

describe('Calendar', () => {
  it('shows the selected month open with the day selected', () => {
    const { renderer } = renderCalendar();

    expect(textContent(renderer.root)).toContain('October 2026');
    expect(
      pressable(renderer.root, 'Monday, October 19, 2026')?.props
        .accessibilityState,
    ).toEqual({ disabled: false, selected: true });
  });

  it('opens on the current month without a value', () => {
    const { renderer } = renderCalendar({ value: '' });
    const title = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    expect(textContent(renderer.root)).toContain(title);
  });

  it('reports a picked day and stays open', () => {
    const { onChange, renderer } = renderCalendar();

    act(() =>
      pressable(renderer.root, 'Monday, October 26, 2026')?.props.onPress(),
    );
    expect(onChange).toHaveBeenCalledWith('2026-10-26');
    expect(pressable(renderer.root, 'Next month')).toBeDefined();
  });

  it('pages months and disables days outside the bounds', () => {
    const { renderer } = renderCalendar({ min: '2026-10-10' });

    expect(
      pressable(renderer.root, 'Friday, October 9, 2026')?.props.disabled,
    ).toBe(true);
    act(() => pressable(renderer.root, 'Next month')?.props.onPress());
    expect(textContent(renderer.root)).toContain('November 2026');
  });

  it('rejects an invalid value or bounds', () => {
    expect(() => renderCalendar({ value: '2026-02-30' })).toThrow(RangeError);
    expect(() =>
      renderCalendar({ max: '2026-10-01', min: '2026-10-02' }),
    ).toThrow(RangeError);
  });
});
