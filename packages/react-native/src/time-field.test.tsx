import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { TimeField } from './components/TimeField.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

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

function renderTimeField(
  props: Partial<React.ComponentProps<typeof TimeField>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <TimeField
          hoursLabel="Hour"
          label="Kickoff"
          locale="en-US"
          minutesLabel="Minutes"
          onChange={onChange}
          placeholder="Pick a time"
          value="18:30"
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

function column(root: ReactTestInstance, label: string) {
  return root
    .findAllByType('View')
    .find((node) => node.props.accessibilityLabel === label);
}

function rows(root: ReactTestInstance, label: string) {
  return (
    column(root, label)
      ?.findAllByType('Pressable')
      .map((node) => ({
        label: String(node.props.accessibilityLabel),
        selected: Boolean(node.props.accessibilityState?.selected),
      })) ?? []
  );
}

function open(root: ReactTestInstance) {
  act(() => pressable(root, 'Kickoff')?.props.onPress());
}

describe('TimeField', () => {
  it('shows the localized value and hides the wheels until pressed', () => {
    const { renderer } = renderTimeField();
    const control = pressable(renderer.root, 'Kickoff');

    expect(control?.props.accessibilityValue).toEqual({ text: '6:30 PM' });
    expect(renderer.root.findAllByType('ScrollView')).toHaveLength(0);
  });

  it('shows hour, minute, and period wheels on a 12-hour clock', () => {
    const { renderer } = renderTimeField({ minuteStep: 30 });
    open(renderer.root);

    expect(rows(renderer.root, 'Hour').map((row) => row.label)).toEqual([
      '12',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
    ]);
    expect(rows(renderer.root, 'Hour').find((row) => row.selected)?.label).toBe(
      '6',
    );
    expect(rows(renderer.root, 'Minutes')).toEqual([
      { label: '00', selected: false },
      { label: '30', selected: true },
    ]);
    expect(rows(renderer.root, 'AM PM')).toEqual([
      { label: 'AM', selected: false },
      { label: 'PM', selected: true },
    ]);
  });

  it('changes one column at a time and keeps the others', () => {
    const { onChange, renderer } = renderTimeField();
    open(renderer.root);

    act(() => pressable(renderer.root, '9')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('21:30');
    act(() => pressable(renderer.root, '45')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('18:45');
    act(() => pressable(renderer.root, 'AM')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('06:30');
  });

  it('selects the row a scroll settles on and ignores a drag that still moves', () => {
    const { onChange, renderer } = renderTimeField();
    open(renderer.root);
    const minutes = column(renderer.root, 'Minutes')?.findByType('ScrollView');

    act(() =>
      minutes?.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { y: 44 * 3 } },
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith('18:45');
    onChange.mockClear();
    act(() =>
      minutes?.props.onScrollEndDrag({
        nativeEvent: { contentOffset: { y: 0 }, velocity: { y: 2 } },
      }),
    );
    expect(onChange).not.toHaveBeenCalled();
    act(() =>
      minutes?.props.onScrollEndDrag({
        nativeEvent: { contentOffset: { y: 0 }, velocity: { y: 0 } },
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith('18:00');
    // Settling on the row already selected reports nothing.
    onChange.mockClear();
    act(() =>
      minutes?.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { y: 44 * 2 } },
      }),
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('rests at noon when no value is set and reports only a change', () => {
    const { onChange, renderer } = renderTimeField({ value: '' });
    expect(
      pressable(renderer.root, 'Kickoff')?.props.accessibilityValue,
    ).toBeUndefined();
    open(renderer.root);

    expect(rows(renderer.root, 'Hour').find((row) => row.selected)?.label).toBe(
      '12',
    );
    expect(
      rows(renderer.root, 'AM PM').find((row) => row.selected)?.label,
    ).toBe('PM');
    expect(onChange).not.toHaveBeenCalled();
    act(() => pressable(renderer.root, '9')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('21:00');
  });

  it('drops the period column and pads hours on a 24-hour clock', () => {
    const { onChange, renderer } = renderTimeField({
      locale: 'en-GB',
      value: '09:15',
    });
    open(renderer.root);

    expect(renderer.root.findAllByType('ScrollView')).toHaveLength(2);
    const hours = rows(renderer.root, 'Hour');
    expect(hours).toHaveLength(24);
    expect(hours[0]?.label).toBe('00');
    expect(hours.find((row) => row.selected)?.label).toBe('09');
    act(() => pressable(renderer.root, '21')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('21:15');
  });

  it('names the period column and the test ids from the props', () => {
    const { renderer } = renderTimeField({
      periodLabel: 'Morning or afternoon',
      testID: 'kickoff',
    });
    open(renderer.root);

    expect(column(renderer.root, 'Morning or afternoon')?.props.testID).toBe(
      'kickoff-period',
    );
    expect(column(renderer.root, 'Hour')?.props.testID).toBe('kickoff-hours');
    expect(column(renderer.root, 'Minutes')?.props.testID).toBe(
      'kickoff-minutes',
    );
  });

  it('disables every row and stops the columns scrolling when disabled', () => {
    const { renderer } = renderTimeField({ disabled: true });
    // The renderer calls the disclosure handler directly; on a device a
    // disabled control never opens.
    open(renderer.root);

    expect(pressable(renderer.root, 'Kickoff')?.props.disabled).toBe(true);
    expect(pressable(renderer.root, '9')?.props.disabled).toBe(true);
    expect(pressable(renderer.root, '9')?.props.accessibilityState).toEqual({
      disabled: true,
      selected: false,
    });
    expect(
      renderer.root.findAllByType('ScrollView')[0]?.props.scrollEnabled,
    ).toBe(false);
  });

  it('rejects malformed values and minute steps', () => {
    expect(() => renderTimeField({ value: '24:00' })).toThrow(RangeError);
    expect(() => renderTimeField({ minuteStep: 7 })).toThrow(RangeError);
  });
});
