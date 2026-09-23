import { lightTheme } from '@scalewing/tokens';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Stepper } from './components/Stepper.js';
import {
  mapStepperButtonStyle,
  mapStepperTrackStyle,
  stepperButtonHitSlop,
  stepperButtonSize,
} from './map-stepper-style.js';
import {
  assertStepperBounds,
  canStepDown,
  canStepUp,
  stepDown,
  stepUp,
} from './stepper-value.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  StyleSheet: { hairlineWidth: 0.5 },
  Text: 'Text',
  useColorScheme: () => 'light',
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

function renderStepper(
  props: Partial<React.ComponentProps<typeof Stepper>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <Stepper
          decrementLabel="Fewer eggs"
          incrementLabel="More eggs"
          label="Eggs"
          max={10}
          min={0}
          onChange={onChange}
          testID="eggs"
          value={3}
          {...props}
        />
      </ThemeProvider>,
    );
  });
  return { onChange, renderer };
}

function byTestID(root: ReactTestInstance, testID: string) {
  return root.find(
    (node) => typeof node.type === 'string' && node.props.testID === testID,
  );
}

describe('Stepper', () => {
  it('shows the label above and the value between named buttons', () => {
    const { renderer } = renderStepper();
    const texts = renderer.root
      .findAllByType('Text')
      .map((node) => node.props.children);

    expect(texts).toEqual(['Eggs', '3']);
    expect(byTestID(renderer.root, 'eggs-decrement').props).toMatchObject({
      accessibilityLabel: 'Fewer eggs',
      accessibilityRole: 'button',
      accessibilityState: { disabled: false },
    });
    expect(byTestID(renderer.root, 'eggs-increment').props).toMatchObject({
      accessibilityLabel: 'More eggs',
      accessibilityRole: 'button',
    });
  });

  it('steps one at a time with the buttons', () => {
    const { onChange, renderer } = renderStepper({ step: 2 });

    act(() => byTestID(renderer.root, 'eggs-increment').props.onPress());
    expect(onChange).toHaveBeenLastCalledWith(5);
    act(() => byTestID(renderer.root, 'eggs-decrement').props.onPress());
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('disables the button at each bound and reports nothing there', () => {
    const atMin = renderStepper({ value: 0 });
    const minus = byTestID(atMin.renderer.root, 'eggs-decrement');
    expect(minus.props.disabled).toBe(true);
    expect(minus.props.accessibilityState).toEqual({ disabled: true });
    act(() => minus.props.onPress());
    expect(atMin.onChange).not.toHaveBeenCalled();

    const atMax = renderStepper({ value: 10 });
    const plus = byTestID(atMax.renderer.root, 'eggs-increment');
    expect(plus.props.disabled).toBe(true);
    act(() => plus.props.onPress());
    expect(atMax.onChange).not.toHaveBeenCalled();
  });

  it('exposes the value as one adjustable element with its range', () => {
    const { onChange, renderer } = renderStepper({ hint: 'Up to ten.' });
    const value = byTestID(renderer.root, 'eggs-value');

    expect(value.props).toMatchObject({
      accessibilityHint: 'Up to ten.',
      accessibilityLabel: 'Eggs',
      accessibilityRole: 'adjustable',
      accessibilityValue: { max: 10, min: 0, now: 3, text: '3' },
      accessible: true,
    });
    act(() =>
      value.props.onAccessibilityAction({
        nativeEvent: { actionName: 'increment' },
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith(4);
    act(() =>
      value.props.onAccessibilityAction({
        nativeEvent: { actionName: 'decrement' },
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('stops both buttons and the adjustable value when disabled', () => {
    const { onChange, renderer } = renderStepper({ disabled: true });

    expect(byTestID(renderer.root, 'eggs-decrement').props.disabled).toBe(true);
    expect(byTestID(renderer.root, 'eggs-increment').props.disabled).toBe(true);
    act(() =>
      byTestID(renderer.root, 'eggs-value').props.onAccessibilityAction({
        nativeEvent: { actionName: 'increment' },
      }),
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows the error under the track', () => {
    const { renderer } = renderStepper({ error: 'Too many eggs.' });
    const texts = renderer.root
      .findAllByType('Text')
      .map((node) => node.props.children);

    expect(texts).toContain('Too many eggs.');
    expect(byTestID(renderer.root, 'eggs-value').props.accessibilityHint).toBe(
      'Too many eggs.',
    );
  });

  it('refuses bounds that do not describe a range', () => {
    expect(() => renderStepper({ max: 0, min: 5 })).toThrow(
      'Stepper min 5 is greater than max 0.',
    );
  });
});

describe('stepper value', () => {
  const bounds = { max: 10, min: 0, step: 3 };

  it('steps within the bounds and clamps at either end', () => {
    expect(stepUp(4, bounds)).toBe(7);
    expect(stepUp(9, bounds)).toBe(10);
    expect(stepDown(4, bounds)).toBe(1);
    expect(stepDown(1, bounds)).toBe(0);
  });

  it('knows when a direction is exhausted', () => {
    expect(canStepDown(0, bounds)).toBe(false);
    expect(canStepDown(1, bounds)).toBe(true);
    expect(canStepUp(10, bounds)).toBe(false);
    expect(canStepUp(9, bounds)).toBe(true);
  });

  it('brings a value outside the bounds back inside', () => {
    expect(stepDown(14, bounds)).toBe(10);
    expect(stepUp(-5, bounds)).toBe(0);
  });

  it('refuses a step that is not positive or bounds that are not numbers', () => {
    expect(() => assertStepperBounds({ max: 1, min: 0, step: 0 })).toThrow(
      'Stepper step 0 must be greater than zero.',
    );
    expect(() =>
      assertStepperBounds({ max: Number.NaN, min: 0, step: 1 }),
    ).toThrow('Stepper min, max, and step must be finite numbers.');
  });
});

describe('stepper style', () => {
  it('grows each button to a full control-height hit area', () => {
    const size = stepperButtonSize(lightTheme);
    const slop = stepperButtonHitSlop(lightTheme);

    expect(size + (slop.top ?? 0) + (slop.bottom ?? 0)).toBe(
      lightTheme.control.md.minHeight,
    );
    expect(mapStepperButtonStyle(lightTheme, true)).toMatchObject({
      height: size,
      opacity: 1,
      width: size,
    });
    expect(mapStepperButtonStyle(lightTheme, false).opacity).toBe(
      lightTheme.disabledOpacity,
    );
  });

  it('draws the track on glass and marks it invalid with the danger color', () => {
    expect(
      mapStepperTrackStyle(lightTheme, { disabled: false, invalid: false }),
    ).toMatchObject({
      backgroundColor: lightTheme.glass.fill,
      borderColor: lightTheme.glass.border,
      borderRadius: lightTheme.radius.pill,
      minHeight: lightTheme.control.md.minHeight,
    });
    expect(
      mapStepperTrackStyle(lightTheme, { disabled: true, invalid: true }),
    ).toMatchObject({
      borderColor: lightTheme.colors.danger,
      opacity: lightTheme.disabledOpacity,
    });
  });
});
