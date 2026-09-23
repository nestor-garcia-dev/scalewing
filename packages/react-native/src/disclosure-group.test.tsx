import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { DateField } from './components/DateField.js';
import { TimeField } from './components/TimeField.js';
import { WheelField } from './components/WheelField.js';
import { ThemeProvider } from './theme/ThemeProvider.js';
import { closesOnPick } from './wheel-close.js';

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  ScrollView: 'ScrollView',
  StyleSheet: { hairlineWidth: 0.5 },
  Text: 'Text',
  TextInput: 'TextInput',
  useColorScheme: () => 'light',
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

const years = ['2026', '2027'].map((year) => ({ id: year, label: year }));

function renderPickers() {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <WheelField
          items={years}
          label="Year"
          onChange={vi.fn()}
          placeholder="Pick a year"
          value="2026"
        />
        <TimeField
          hoursLabel="Hour"
          label="Kickoff"
          locale="en-US"
          minutesLabel="Minutes"
          onChange={vi.fn()}
          placeholder="Pick a time"
          value="18:30"
        />
        <DateField
          label="Start"
          locale="en-US"
          nextMonthLabel="Next month"
          onChange={vi.fn()}
          placeholder="Pick a date"
          previousMonthLabel="Previous month"
          value="2026-09-22"
        />
      </ThemeProvider>,
    );
  });
  return renderer;
}

function control(root: ReactTestInstance, label: string) {
  const node = root
    .findAllByType('Pressable')
    .find(
      (item) =>
        item.props.accessibilityLabel === label &&
        item.props.accessibilityRole === 'button',
    );
  if (!node) throw new Error(`No ${label} control`);
  return node;
}

function expanded(root: ReactTestInstance) {
  return ['Year', 'Kickoff', 'Start'].filter(
    (label) => control(root, label).props.accessibilityState.expanded,
  );
}

describe('pickers under one ThemeProvider', () => {
  it('opens one picker at a time', () => {
    const renderer = renderPickers();

    act(() => control(renderer.root, 'Year').props.onPress());
    expect(expanded(renderer.root)).toEqual(['Year']);
    act(() => control(renderer.root, 'Kickoff').props.onPress());
    expect(expanded(renderer.root)).toEqual(['Kickoff']);
    act(() => control(renderer.root, 'Start').props.onPress());
    expect(expanded(renderer.root)).toEqual(['Start']);
  });

  it('closes the open picker when its own control is pressed again', () => {
    const renderer = renderPickers();

    act(() => control(renderer.root, 'Kickoff').props.onPress());
    act(() => control(renderer.root, 'Kickoff').props.onPress());
    expect(expanded(renderer.root)).toEqual([]);
  });
});

describe('closesOnPick', () => {
  it('closes on a tap except in the hours column', () => {
    expect(closesOnPick('single', 'tap')).toBe(true);
    expect(closesOnPick('minutes', 'tap')).toBe(true);
    expect(closesOnPick('period', 'tap')).toBe(true);
    expect(closesOnPick('hours', 'tap')).toBe(false);
  });

  it('never closes on a scroll that settled', () => {
    expect(closesOnPick('single', 'scroll')).toBe(false);
    expect(closesOnPick('minutes', 'scroll')).toBe(false);
    expect(closesOnPick('hours', 'scroll')).toBe(false);
  });
});
