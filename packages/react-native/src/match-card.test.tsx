import { View } from 'react-native';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { MatchCard, type MatchCardProps } from './components/MatchCard.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

const scale = vi.hoisted(() => ({ fontScale: 1 }));

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  useColorScheme: () => 'light',
  useWindowDimensions: () => ({ fontScale: scale.fontScale }),
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

const base: MatchCardProps = {
  details: ['North pond', 'Spring meet'],
  onPress: () => {},
  sides: [
    { caption: 'Home', name: 'Heron' },
    { caption: 'Away', initials: 'OT', name: 'Otter Creek Swimmers' },
  ],
  testID: 'card',
  when: 'Tomorrow · 9:00 AM',
};

function render(props: Partial<MatchCardProps> = {}) {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <MatchCard {...base} {...props} />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function card(root: ReactTestInstance) {
  return root.find(
    (node) => node.type === 'Pressable' && node.props.testID === 'card',
  );
}

function texts(root: ReactTestInstance): string[] {
  return root
    .findAll((node) => node.type === 'Text')
    .map((node) => String(node.props.children));
}

describe('MatchCard', () => {
  it('is one button named by its visible lines', () => {
    const root = render({ leading: 'Your next race' });
    const button = card(root);
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe(
      'Your next race, Tomorrow · 9:00 AM, Heron, Home, vs, Otter Creek Swimmers, Away, North pond, Spring meet',
    );
    expect(root.findAll((node) => node.type === 'Pressable')).toHaveLength(1);
  });

  it('takes a consumer name and hint', () => {
    const button = card(
      render({
        accessibilityHint: 'Opens the race',
        accessibilityLabel: 'Race',
      }),
    );
    expect(button.props.accessibilityLabel).toBe('Race');
    expect(button.props.accessibilityHint).toBe('Opens the race');
  });

  it('calls onPress', () => {
    const onPress = vi.fn();
    const button = card(render({ onPress }));
    act(() => button.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows the lines top to bottom, with initials in the marks', () => {
    expect(texts(render({ leading: 'Your next race', versus: 'v' }))).toEqual([
      'Your next race',
      'Tomorrow · 9:00 AM',
      'HE',
      'Heron',
      'Home',
      'v',
      'OT',
      'Otter Creek Swimmers',
      'Away',
      'North pond',
      'Spring meet',
    ]);
  });

  it('leaves out the leading line, captions, and details when absent', () => {
    expect(
      texts(
        render({
          details: undefined,
          sides: [{ name: 'Heron' }, { name: 'Otter' }],
        }),
      ),
    ).toEqual(['Tomorrow · 9:00 AM', 'HE', 'Heron', 'vs', 'OT', 'Otter']);
  });

  it('draws a consumer crest instead of initials, hidden from assistive technology', () => {
    const root = render({
      sides: [
        { crest: <View testID="heron-crest" />, name: 'Heron' },
        { name: 'Otter' },
      ],
    });
    const crest = root.find((node) => node.props.testID === 'heron-crest');
    expect(texts(root)).not.toContain('HE');
    expect(crest.parent?.props.accessibilityElementsHidden).toBe(true);
    expect(crest.parent?.props.importantForAccessibility).toBe(
      'no-hide-descendants',
    );
  });

  it('lets long names wrap and lets the when line scale', () => {
    const root = render();
    const name = root.find(
      (node) =>
        node.type === 'Text' && node.props.children === 'Otter Creek Swimmers',
    );
    expect(name.props.numberOfLines).toBeUndefined();
    const when = root.find(
      (node) =>
        node.type === 'Text' && node.props.children === 'Tomorrow · 9:00 AM',
    );
    expect(when.props.allowFontScaling).toBeUndefined();
  });

  it('fills while pressed', () => {
    const style = card(render()).props.style;
    expect(style({ pressed: false }).backgroundColor).not.toBe(
      style({ pressed: true }).backgroundColor,
    );
  });

  it('stacks the sides at accessibility text sizes', () => {
    const sidesRow = (root: ReactTestInstance) =>
      root.find(
        (node) =>
          node.type === 'View' &&
          node.props.style?.gap !== undefined &&
          node.props.style?.flexDirection !== undefined &&
          node.props.style?.alignItems !== 'center',
      );
    expect(sidesRow(render()).props.style.flexDirection).toBe('row');
    scale.fontScale = 2;
    try {
      expect(sidesRow(render()).props.style.flexDirection).toBe('column');
    } finally {
      scale.fontScale = 1;
    }
  });

  it('fails closed on a third detail line', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render({ details: ['a', 'b', 'c'] })).toThrow(RangeError);
    vi.restoreAllMocks();
  });
});
