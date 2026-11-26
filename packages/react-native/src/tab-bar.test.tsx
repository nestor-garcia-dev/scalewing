import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  TabBar,
  TabBarTrailing,
  type TabBarItem,
} from './components/TabBar.js';
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

function pressables(root: ReactTestInstance) {
  return root.findAllByType('Pressable');
}

function renderTabs(items: TabBarItem[]) {
  let renderer!: ReturnType<typeof create>;

  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <TabBar items={items} />
      </ThemeProvider>,
    );
  });

  return renderer.root;
}

function tab(label: string, extra: Partial<TabBarItem> = {}): TabBarItem {
  return {
    icon: `${label}-icon`,
    key: label,
    label,
    onPress: vi.fn(),
    selected: false,
    ...extra,
  };
}

function badgeTexts(root: ReactTestInstance) {
  return root
    .findAll(
      (node) =>
        node.type === 'View' && node.props.accessibilityElementsHidden === true,
    )
    .map((badge) => badge.findByType('Text').props.children as string);
}

describe('TabBar', () => {
  it('keeps large labels bounded while preserving full accessible names', () => {
    const labels = [
      'Match schedule',
      'League directory',
      'Following',
      'Settings',
    ];
    let renderer!: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider colorScheme="light">
          <TabBar
            items={labels.map((label, index) => ({
              icon: `icon-${index}`,
              key: label,
              label,
              onPress: vi.fn(),
              selected: index === 0,
            }))}
            trailing={
              <TabBarTrailing accessibilityLabel="Search" onPress={vi.fn()}>
                search-icon
              </TabBarTrailing>
            }
          />
        </ThemeProvider>,
      );
    });

    const controls = pressables(renderer.root);
    expect(controls.map((control) => control.props.accessibilityLabel)).toEqual(
      [...labels, 'Search'],
    );
    expect(controls[0]?.props.accessibilityState).toEqual({ selected: true });
    expect(controls[1]?.props.accessibilityState).toEqual({ selected: false });

    const renderedLabels = renderer.root.findAll(
      (node) =>
        node.type === 'Text' && labels.includes(String(node.props.children)),
    );
    expect(renderedLabels).toHaveLength(labels.length);
    expect(
      renderedLabels.every((label) => label.props.numberOfLines === 1),
    ).toBe(true);
  });

  it('lets labels shrink to fit before they ellipsize', () => {
    const root = renderTabs([tab('Configuración')]);
    const label = root.find(
      (node) => node.type === 'Text' && node.props.children === 'Configuración',
    );

    expect(label.props.adjustsFontSizeToFit).toBe(true);
    expect(label.props.minimumFontScale).toBe(0.7);
    expect(label.props.numberOfLines).toBe(1);
  });

  it('draws a hidden-from-AT badge and reads the count after the label', () => {
    const root = renderTabs([
      tab('Agenda', { badge: 3 }),
      tab('Matches'),
      tab('Inbox', { badge: 120 }),
    ]);
    const controls = pressables(root);

    expect(badgeTexts(root)).toEqual(['3', '99+']);
    expect(controls[0]?.props.accessibilityLabel).toBe('Agenda');
    expect(controls[0]?.props.accessibilityValue).toEqual({ text: '3 items' });
    expect(controls[1]?.props.accessibilityValue).toBeUndefined();
    expect(controls[2]?.props.accessibilityValue).toEqual({
      text: '120 items',
    });
    const badges = root.findAll(
      (node) =>
        node.type === 'View' && node.props.accessibilityElementsHidden === true,
    );
    expect(
      badges.map((badge) => badge.props.importantForAccessibility),
    ).toEqual(['no-hide-descendants', 'no-hide-descendants']);
  });

  it("reads the consumer's badge words", () => {
    const root = renderTabs([
      tab('Agenda', { badge: 2, badgeAccessibilityLabel: '2 pendientes' }),
    ]);

    expect(pressables(root)[0]?.props.accessibilityValue).toEqual({
      text: '2 pendientes',
    });
  });

  it('draws no badge and no value at zero', () => {
    const root = renderTabs([
      tab('Agenda', { badge: 0, badgeAccessibilityLabel: '0 pendientes' }),
    ]);

    expect(badgeTexts(root)).toEqual([]);
    expect(pressables(root)[0]?.props.accessibilityValue).toBeUndefined();
  });
});
