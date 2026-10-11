import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Bracket, type BracketRound } from './components/Bracket.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

const scale = vi.hoisted(() => ({ fontScale: 1 }));

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  ScrollView: 'ScrollView',
  Text: 'Text',
  useColorScheme: () => 'light',
  useWindowDimensions: () => ({ fontScale: scale.fontScale }),
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

const match = (id: string, home: string, away: string) => ({
  accessibilityLabel: `${home} versus ${away}`,
  away: { label: away },
  home: { label: home },
  id,
  testID: id,
});

const rounds: BracketRound[] = [
  {
    id: 'semis',
    label: 'Semi-finals',
    matches: [
      {
        ...match('sf1', 'Heron', 'Otter'),
        home: { label: 'Heron', outcome: 'winner', score: '2', seed: '1' },
        away: { label: 'Otter', outcome: 'loser', score: '0', seed: '4' },
        status: 'FT',
      },
      match('sf2', 'Lynx', 'Badger'),
    ],
  },
  {
    id: 'final',
    label: 'Final',
    matches: [
      {
        ...match('final', 'Heron', 'Winner of semi-final 2'),
        away: { label: 'Winner of semi-final 2', outcome: 'pending' },
      },
    ],
  },
];

function render(value: string) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <Bracket
          accessibilityLabel="Rounds"
          onChange={onChange}
          rounds={rounds}
          value={value}
        />
      </ThemeProvider>,
    );
  });
  return { onChange, renderer };
}

const hosts = (root: ReactTestInstance, type: string) =>
  root.findAll((node) => node.type === type);

function layOut(root: ReactTestInstance, width: number) {
  const area = root.find(
    (node) => node.type === 'View' && typeof node.props.onLayout === 'function',
  );
  act(() => area.props.onLayout({ nativeEvent: { layout: { width } } }));
}

describe('Bracket', () => {
  it('chooses rounds from radio chips', () => {
    const { onChange, renderer } = render('semis');
    const chips = hosts(renderer.root, 'Pressable').filter(
      (node) => node.props.accessibilityRole === 'radio',
    );
    expect(chips.map((chip) => chip.props.accessibilityState)).toEqual([
      { disabled: false, selected: true },
      { disabled: false, selected: false },
    ]);
    act(() => chips[0]?.props.onPress());
    expect(onChange).not.toHaveBeenCalled();
    act(() => chips[1]?.props.onPress());
    expect(onChange).toHaveBeenCalledWith('final');
  });

  it('peeks at the next round once it knows its width, and opens it', () => {
    const { onChange, renderer } = render('semis');
    const named = () =>
      hosts(renderer.root, 'View')
        .filter((node) => node.props.accessible)
        .map((node) => node.props.accessibilityLabel);
    expect(named()).toEqual(['Heron versus Otter', 'Lynx versus Badger']);
    layOut(renderer.root, 358);
    expect(named()).toEqual([
      'Heron versus Otter',
      'Lynx versus Badger',
      'Heron versus Winner of semi-final 2',
    ]);
    const peek = hosts(renderer.root, 'Pressable').find(
      (node) => node.props.accessible === false,
    );
    expect(peek?.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(peek?.props.style.width).toBe(358 - 64);
    act(() => peek?.props.onPress());
    expect(onChange).toHaveBeenCalledWith('final');
  });

  it('marks the winner and shows seeds and scores', () => {
    const { renderer } = render('semis');
    const card = renderer.root.find(
      (node) => node.type === 'View' && node.props.testID === 'sf1',
    );
    expect(
      card.findAllByType('Text').map((node) => node.props.children),
    ).toEqual(['FT', '', '1', 'Heron', '2', '◀', '4', 'Otter', '0', '']);
  });

  it('lists the round alone at accessibility text sizes', () => {
    scale.fontScale = 2;
    const { renderer } = render('semis');
    layOut(renderer.root, 358);
    expect(
      hosts(renderer.root, 'Pressable').some(
        (node) => node.props.accessible === false,
      ),
    ).toBe(false);
    scale.fontScale = 1;
  });
});
