import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { WheelField } from './components/WheelField.js';
import { ThemeProvider } from './theme/ThemeProvider.js';
import {
  assertWheelFieldValue,
  restingWheelItem,
} from './wheel-field-items.js';

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

const years = ['2026', '2027', '2028', '2029'].map((year) => ({
  id: year,
  label: year,
}));

function renderWheelField(
  props: Partial<React.ComponentProps<typeof WheelField>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <WheelField
          items={years}
          label="Year"
          onChange={onChange}
          placeholder="Pick a year"
          testID="season-year"
          value="2027"
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
  act(() => pressable(root, 'Year')?.props.onPress());
}

describe('WheelField', () => {
  it('shows the selected label and hides the wheel until pressed', () => {
    const { renderer } = renderWheelField();
    const control = pressable(renderer.root, 'Year');

    expect(control?.props.accessibilityValue).toEqual({ text: '2027' });
    expect(control?.props.accessibilityState).toEqual({
      disabled: false,
      expanded: false,
    });
    expect(renderer.root.findAllByType('ScrollView')).toHaveLength(0);
  });

  it('discloses one wheel named after the field with the selection in place', () => {
    const { renderer } = renderWheelField();
    open(renderer.root);

    expect(column(renderer.root, 'Year')?.props.testID).toBe(
      'season-year-wheel',
    );
    expect(rows(renderer.root, 'Year')).toEqual([
      { label: '2026', selected: false },
      { label: '2027', selected: true },
      { label: '2028', selected: false },
      { label: '2029', selected: false },
    ]);
    expect(
      pressable(renderer.root, 'Year')?.props.accessibilityState.expanded,
    ).toBe(true);
  });

  it('names the column separately when asked', () => {
    const { renderer } = renderWheelField({ wheelLabel: 'Season year' });
    open(renderer.root);

    expect(column(renderer.root, 'Season year')).toBeDefined();
    expect(column(renderer.root, 'Year')).toBeUndefined();
  });

  it('reports a tapped row and a settled scroll, never the current row', () => {
    const { onChange, renderer } = renderWheelField();
    open(renderer.root);

    act(() => pressable(renderer.root, '2029')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('2029');
    onChange.mockClear();

    const wheel = column(renderer.root, 'Year')?.findByType('ScrollView');
    act(() =>
      wheel?.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { y: 0 } },
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith('2026');
    onChange.mockClear();
    act(() =>
      wheel?.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { y: 44 } },
      }),
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('rests on the first item when nothing is selected and reports a tap or a settled scroll', () => {
    const { onChange, renderer } = renderWheelField({ value: '' });
    const control = pressable(renderer.root, 'Year');

    expect(control?.props.accessibilityValue).toBeUndefined();
    expect(control?.findByType('Text').props.children).toBe('Pick a year');
    open(renderer.root);
    expect(rows(renderer.root, 'Year').find((row) => row.selected)?.label).toBe(
      '2026',
    );
    expect(onChange).not.toHaveBeenCalled();
    act(() => pressable(renderer.root, '2026')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('2026');
    act(() => pressable(renderer.root, '2028')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('2028');
  });

  it('shows the error, marks the control invalid, and disables the wheel', () => {
    const { renderer } = renderWheelField({
      disabled: true,
      error: 'Pick a later year.',
    });
    const control = pressable(renderer.root, 'Year');

    expect(control?.props.accessibilityHint).toBe('Pick a later year.');
    expect(control?.props.accessibilityState.disabled).toBe(true);
    expect(
      renderer.root
        .findAllByType('Text')
        .some((node) => node.props.children === 'Pick a later year.'),
    ).toBe(true);
  });

  it('refuses a value that is not one of the items', () => {
    expect(() => renderWheelField({ value: '1999' })).toThrow(
      'WheelField value "1999" is not the id of one of its items.',
    );
  });
});

describe('wheel field items', () => {
  it('accepts the empty value and any item id', () => {
    expect(() => assertWheelFieldValue(years, '')).not.toThrow();
    expect(() => assertWheelFieldValue(years, '2028')).not.toThrow();
    expect(() => assertWheelFieldValue([], '')).not.toThrow();
  });

  it('rests on the selection, else the first item, else nothing', () => {
    expect(restingWheelItem(years, '2028')?.id).toBe('2028');
    expect(restingWheelItem(years, '')?.id).toBe('2026');
    expect(restingWheelItem([], '')).toBeUndefined();
  });
});
