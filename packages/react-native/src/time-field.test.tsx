import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { TimeField } from './components/TimeField.js';
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

function radios(root: ReactTestInstance) {
  return root
    .findAllByType('Pressable')
    .filter((node) => node.props.accessibilityRole === 'radio');
}

describe('TimeField', () => {
  it('shows the localized value and hides the picker until pressed', () => {
    const { renderer } = renderTimeField();
    const control = pressable(renderer.root, 'Kickoff');

    expect(control?.props.accessibilityValue).toEqual({ text: '6:30 PM' });
    expect(radios(renderer.root)).toHaveLength(0);
  });

  it('offers 24 hours and the minute steps with the current parts selected', () => {
    const { renderer } = renderTimeField({ minuteStep: 30 });
    act(() => pressable(renderer.root, 'Kickoff')?.props.onPress());

    const options = radios(renderer.root);
    expect(options).toHaveLength(26);
    expect(pressable(renderer.root, '6 PM')?.props.accessibilityState).toEqual({
      disabled: false,
      selected: true,
    });
    expect(pressable(renderer.root, ':30')?.props.accessibilityState).toEqual({
      disabled: false,
      selected: true,
    });
    expect(pressable(renderer.root, ':00')?.props.accessibilityState).toEqual({
      disabled: false,
      selected: false,
    });
  });

  it('changes one part at a time and keeps the other', () => {
    const { onChange, renderer } = renderTimeField();
    act(() => pressable(renderer.root, 'Kickoff')?.props.onPress());

    act(() => pressable(renderer.root, '9 AM')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('09:30');
    act(() => pressable(renderer.root, ':45')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('18:45');
  });

  it('starts from midnight parts when no value is set', () => {
    const { onChange, renderer } = renderTimeField({ value: '' });
    expect(
      pressable(renderer.root, 'Kickoff')?.props.accessibilityValue,
    ).toBeUndefined();
    act(() => pressable(renderer.root, 'Kickoff')?.props.onPress());

    act(() => pressable(renderer.root, '9 PM')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('21:00');
  });

  it('rejects malformed values and minute steps', () => {
    expect(() => renderTimeField({ value: '24:00' })).toThrow(RangeError);
    expect(() => renderTimeField({ minuteStep: 7 })).toThrow(RangeError);
  });
});
