import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { TabBar, TabBarTrailing } from './components/TabBar.js';
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
});
