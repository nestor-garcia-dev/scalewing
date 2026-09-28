import { lightTheme } from '@scalewing/tokens';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  ActionRow,
  type ActionRowAction,
  type ActionRowProps,
} from './components/ActionRow.js';
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

function action(label: string, extra: Partial<ActionRowAction> = {}) {
  return {
    icon: 'glyph',
    key: label.toLowerCase(),
    label,
    onPress: vi.fn(),
    testID: `action-${label.toLowerCase()}`,
    ...extra,
  } satisfies ActionRowAction;
}

function render(props: ActionRowProps) {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <ActionRow {...props} />
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

function tiles(root: ReactTestInstance) {
  return root.findAll((node) => node.type === 'Pressable');
}

function row(root: ReactTestInstance) {
  return root.find(
    (node) =>
      node.type === 'View' && node.props.accessibilityRole === 'toolbar',
  );
}

/** Host children of the row: tiles and the empty slots after them. */
function slots(root: ReactTestInstance) {
  return row(root).children.filter(
    (child): child is ReactTestInstance => typeof child !== 'string',
  );
}

describe('ActionRow', () => {
  it('keeps one tile in the first of four equal slots', () => {
    const root = render({ actions: [action('Team')] });
    const [first, ...rest] = slots(root);

    expect(slots(root)).toHaveLength(4);
    expect(
      first?.findByType('Pressable' as never).props.accessibilityLabel,
    ).toBe('Team');
    for (const empty of rest) {
      expect(empty.type).toBe('View');
      expect(empty.props.importantForAccessibility).toBe('no-hide-descendants');
      expect(empty.props.style).toEqual({
        flexBasis: 0,
        flexGrow: 1,
        minWidth: 0,
      });
    }
  });

  it('names each tile a button by its label unless given a longer name', () => {
    const root = render({
      accessibilityLabel: 'Season actions',
      actions: [
        action('Team'),
        action('Competition', { accessibilityLabel: 'New competition' }),
      ],
      testID: 'season-actions',
    });
    const [team, competition] = tiles(root);

    expect(row(root).props.accessibilityLabel).toBe('Season actions');
    expect(row(root).props.testID).toBe('season-actions');
    expect(team?.props).toMatchObject({
      accessibilityLabel: 'Team',
      accessibilityRole: 'button',
      accessibilityState: { disabled: false },
      testID: 'action-team',
    });
    expect(competition?.props.accessibilityLabel).toBe('New competition');
    const label = competition?.find((node) => node.type === 'Text');
    expect(label?.props.children).toBe('Competition');
    expect(label?.props.numberOfLines).toBe(1);
  });

  it('shows four actions with no More tile', () => {
    const root = render({
      actions: ['A', 'B', 'C', 'D'].map((label) => action(label)),
    });
    expect(tiles(root).map((tile) => tile.props.accessibilityLabel)).toEqual([
      'A',
      'B',
      'C',
      'D',
    ]);
  });

  it('turns the fourth slot into More, which hands over the rest', () => {
    const onMore = vi.fn();
    const actions = ['A', 'B', 'C', 'D', 'E'].map((label) => action(label));
    const root = render({
      actions,
      more: {
        accessibilityLabel: 'More actions',
        icon: 'dots',
        label: 'More',
        onPress: onMore,
        testID: 'action-more',
      },
    });
    const shown = tiles(root);

    expect(shown.map((tile) => tile.props.accessibilityLabel)).toEqual([
      'A',
      'B',
      'C',
      'More actions',
    ]);
    expect(shown[3]?.props.testID).toBe('action-more');
    act(() => shown[3]?.props.onPress());
    expect(onMore).toHaveBeenCalledWith(actions.slice(3));
  });

  it('refuses more than four actions without a More tile', () => {
    expect(() =>
      render({
        actions: ['A', 'B', 'C', 'D', 'E'].map((label) => action(label)),
      }),
    ).toThrow(/needs `more`/);
  });

  it('keeps a disabled tile in its slot, dimmed and not pressable', () => {
    const blocked = action('Venue', { disabled: true });
    const root = render({ actions: [action('Team'), blocked] });
    const tile = tiles(root)[1];

    expect(tile?.props.disabled).toBe(true);
    expect(tile?.props.accessibilityState).toEqual({ disabled: true });
    expect(tile?.props.style({ pressed: false }).opacity).toBe(
      lightTheme.disabledOpacity,
    );
  });

  it('calls an action when its tile is pressed and hides the glyph', () => {
    const team = action('Team');
    const root = render({ actions: [team] });
    const tile = tiles(root)[0];

    act(() => tile?.props.onPress());
    expect(team.onPress).toHaveBeenCalledTimes(1);
    const glyph = tile?.find(
      (node) => node.type === 'View' && node.props.accessibilityElementsHidden,
    );
    expect(glyph?.props.children).toBe('glyph');
  });

  it('renders nothing without actions', () => {
    const root = render({ actions: [] });
    expect(
      root.findAll((node) => node.props.accessibilityRole === 'toolbar'),
    ).toHaveLength(0);
    expect(tiles(root)).toHaveLength(0);
  });
});
