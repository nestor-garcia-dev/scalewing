import { lightTheme } from '@scalewing/tokens';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { FloatingAction } from './components/FloatingAction.js';
import {
  mapFloatingActionBandStyle,
  mapFloatingActionCapsuleStyle,
} from './map-floating-action-style.js';
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

function render(props: { disabled?: boolean; onPress?: () => void } = {}) {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <FloatingAction
          disabled={props.disabled}
          onPress={props.onPress ?? (() => undefined)}
          testID="save"
        >
          Save
        </FloatingAction>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

const capsule = (root: ReactTestInstance) =>
  root.find((node) => node.type === 'Pressable');

describe('FloatingAction', () => {
  it('is one button named by its label, pressed through', () => {
    const onPress = vi.fn();
    const root = render({ onPress });
    const button = capsule(root);
    expect(button.props).toMatchObject({
      accessibilityLabel: 'Save',
      accessibilityRole: 'button',
      accessibilityState: { disabled: false },
      testID: 'save',
    });
    act(() => button.props.onPress());
    expect(onPress).toHaveBeenCalledOnce();
    // The band lets touches through to the content under the fade.
    expect(button.parent?.props.pointerEvents).toBe('box-none');
  });

  it('dims and ignores presses while disabled', () => {
    const button = capsule(render({ disabled: true }));
    expect(button.props.disabled).toBe(true);
    expect(button.props.accessibilityState).toEqual({ disabled: true });
    expect(button.props.style({ pressed: false }).opacity).toBe(
      lightTheme.disabledOpacity,
    );
  });
});

describe('floating action styles', () => {
  it('fades from clear page to the page colour behind an inset pill', () => {
    const band = mapFloatingActionBandStyle(lightTheme);
    expect(band.experimental_backgroundImage).toBe(
      'linear-gradient(to bottom, rgba(255, 255, 255, 0), #FFFFFF 40%)',
    );
    expect(band.paddingHorizontal).toBe(lightTheme.space[6]);
    const pill = mapFloatingActionCapsuleStyle(lightTheme, {
      disabled: false,
      pressed: false,
    });
    expect(pill).toMatchObject({
      backgroundColor: lightTheme.colors.accent,
      borderRadius: lightTheme.radius.pill,
      opacity: 1,
      shadowColor: lightTheme.colors.accent,
    });
    expect(
      mapFloatingActionCapsuleStyle(lightTheme, {
        disabled: false,
        pressed: true,
      }).opacity,
    ).toBeLessThan(1);
  });
});
