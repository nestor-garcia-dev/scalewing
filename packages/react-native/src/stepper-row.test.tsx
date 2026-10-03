import { darkTheme, lightTheme } from '@scalewing/tokens';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ListGroup } from './components/ListGroup.js';
import { StepperRow } from './components/StepperRow.js';
import { mapListRowStyle } from './map-list-style.js';
import {
  mapStepperRowButtonStyle,
  mapStepperRowControlsStyle,
  mapStepperRowValueStyle,
  stepperRowButtonHitSlop,
  stepperRowButtonSize,
  stepperRowValueTextStyle,
} from './map-stepper-row-style.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  useColorScheme: () => 'light',
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

function renderRow(
  props: Partial<React.ComponentProps<typeof StepperRow>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <ListGroup accessibilityLabel="Hatchlings">
          <StepperRow
            decrementLabel="One fewer"
            detail="Nest 9"
            incrementLabel="One more"
            max={5}
            min={0}
            onChange={onChange}
            testID="heron"
            title="Heron"
            value={2}
            {...props}
          />
        </ListGroup>
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

describe('StepperRow', () => {
  it('sits in a ListGroup with a ListRow’s spacing and text', () => {
    const { renderer } = renderRow();
    const row = byTestID(renderer.root, 'heron');
    const texts = renderer.root
      .findAllByType('Text')
      .map((node) => [node.props.children, node.props.style[0].fontSize]);

    expect(row.props.style).toEqual(
      mapListRowStyle(lightTheme, { disabled: false, pressed: false }),
    );
    expect(texts).toEqual([
      ['Heron', lightTheme.typography.label.fontSize],
      ['Nest 9', lightTheme.typography.caption.fontSize],
      ['2', lightTheme.typography.body.fontSize],
    ]);
  });

  it('makes the title and detail one adjustable element with the count', () => {
    const { onChange, renderer } = renderRow();
    const value = byTestID(renderer.root, 'heron-value');

    expect(value.props).toMatchObject({
      accessibilityLabel: 'Heron, Nest 9',
      accessibilityRole: 'adjustable',
      accessibilityState: { disabled: false },
      accessibilityValue: { max: 5, min: 0, now: 2, text: '2' },
      accessible: true,
    });
    act(() =>
      value.props.onAccessibilityAction({
        nativeEvent: { actionName: 'increment' },
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith(3);
    act(() =>
      value.props.onAccessibilityAction({
        nativeEvent: { actionName: 'decrement' },
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('names a row without a detail by its title alone', () => {
    const { renderer } = renderRow({ detail: undefined });

    expect(
      byTestID(renderer.root, 'heron-value').props.accessibilityLabel,
    ).toBe('Heron');
  });

  it('hides the drawn count, which the adjustable element reports', () => {
    const { renderer } = renderRow();
    const count = renderer.root.find(
      (node) =>
        node.type === 'View' && node.props.accessibilityElementsHidden === true,
    );

    expect(count.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(count.findByType('Text').props.children).toBe('2');
  });

  it('steps with named buttons that answer at 44 points', () => {
    const { onChange, renderer } = renderRow({ step: 2 });
    const minus = byTestID(renderer.root, 'heron-decrement');
    const plus = byTestID(renderer.root, 'heron-increment');

    expect(minus.props).toMatchObject({
      accessibilityLabel: 'One fewer',
      accessibilityRole: 'button',
      accessibilityState: { disabled: false },
      hitSlop: stepperRowButtonHitSlop(lightTheme),
    });
    expect(plus.props.accessibilityLabel).toBe('One more');
    act(() => plus.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith(4);
    act(() => minus.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('disables and fades the button at each bound', () => {
    const atMin = renderRow({ value: 0 });
    const minus = byTestID(atMin.renderer.root, 'heron-decrement');
    expect(minus.props.disabled).toBe(true);
    expect(minus.props.accessibilityState).toEqual({ disabled: true });
    expect(minus.props.style.opacity).toBe(lightTheme.disabledOpacity);
    act(() => minus.props.onPress());
    expect(atMin.onChange).not.toHaveBeenCalled();

    const atMax = renderRow({ value: 5 });
    const plus = byTestID(atMax.renderer.root, 'heron-increment');
    expect(plus.props.disabled).toBe(true);
    act(() =>
      byTestID(atMax.renderer.root, 'heron-value').props.onAccessibilityAction({
        nativeEvent: { actionName: 'increment' },
      }),
    );
    expect(atMax.onChange).not.toHaveBeenCalled();
  });

  it('dims the whole row once when disabled and stops every input', () => {
    const { onChange, renderer } = renderRow({ disabled: true });
    const minus = byTestID(renderer.root, 'heron-decrement');

    expect(byTestID(renderer.root, 'heron').props.style.opacity).toBe(
      lightTheme.disabledOpacity,
    );
    expect(minus.props.disabled).toBe(true);
    expect(minus.props.style.opacity).toBe(1);
    expect(byTestID(renderer.root, 'heron-increment').props.disabled).toBe(
      true,
    );
    expect(
      byTestID(renderer.root, 'heron-value').props.accessibilityState,
    ).toEqual({ disabled: true });
    act(() =>
      byTestID(renderer.root, 'heron-value').props.onAccessibilityAction({
        nativeEvent: { actionName: 'decrement' },
      }),
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it('puts a leading mark inside the adjustable element', () => {
    const { renderer } = renderRow({ leading: <View testID="mark" /> });

    expect(() =>
      byTestID(renderer.root, 'heron-value').find(
        (node) => node.props.testID === 'mark',
      ),
    ).not.toThrow();
  });

  it('leaves the parts unnamed without a testID', () => {
    const { renderer } = renderRow({ testID: undefined });

    expect(
      renderer.root.findAll(
        (node) =>
          typeof node.type === 'string' && node.props.testID !== undefined,
      ),
    ).toEqual([]);
  });

  it('refuses bounds that do not describe a range', () => {
    expect(() => renderRow({ max: 0, min: 5 })).toThrow(
      'Stepper min 5 is greater than max 0.',
    );
  });
});

describe('stepper row style', () => {
  it('keeps a ListRow’s height with buttons of the smallest control size', () => {
    const size = stepperRowButtonSize(lightTheme);
    const slop = stepperRowButtonHitSlop(lightTheme);
    const row = mapListRowStyle(lightTheme, {
      disabled: false,
      pressed: false,
    });

    expect(size).toBe(lightTheme.control.xs.minHeight);
    expect(size + 2 * Number(row.paddingVertical)).toBeLessThanOrEqual(
      Number(row.minHeight),
    );
    expect(size + (slop.top ?? 0) + (slop.bottom ?? 0)).toBe(
      lightTheme.control.md.minHeight,
    );
    expect(size + (slop.left ?? 0) + (slop.right ?? 0)).toBe(
      lightTheme.control.md.minHeight,
    );
  });

  it('keeps the two buttons’ touch areas apart', () => {
    const slop = stepperRowButtonHitSlop(lightTheme);
    const gap = Number(mapStepperRowControlsStyle(lightTheme).gap);
    const valueWidth = Number(mapStepperRowValueStyle(lightTheme).minWidth);

    expect(gap).toBeGreaterThanOrEqual(slop.right ?? 0);
    expect(valueWidth + 2 * gap).toBeGreaterThanOrEqual(
      (slop.right ?? 0) + (slop.left ?? 0),
    );
  });

  it('fills round buttons with the subtle colour and fades one at a bound', () => {
    expect(mapStepperRowButtonStyle(darkTheme, true)).toMatchObject({
      backgroundColor: darkTheme.colors.subtle,
      borderRadius: darkTheme.radius.pill,
      height: darkTheme.control.xs.minHeight,
      opacity: 1,
      width: darkTheme.control.xs.minHeight,
    });
    expect(mapStepperRowButtonStyle(lightTheme, false).opacity).toBe(
      lightTheme.disabledOpacity,
    );
  });

  it('draws the count with digits of equal width', () => {
    expect(stepperRowValueTextStyle.fontVariant).toEqual(['tabular-nums']);
  });
});
