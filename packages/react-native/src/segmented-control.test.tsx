import { act, create } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './components/SegmentedControl.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  ScrollView: 'ScrollView',
  Text: 'Text',
  useColorScheme: () => 'light',
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

function render(scrollable?: boolean) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <SegmentedControl
          accessibilityLabel="Habitat sections"
          items={[
            { id: 'nests', label: 'Nests' },
            { id: 'tracks', label: 'Tracks' },
          ]}
          onChange={onChange}
          scrollable={scrollable}
          value="nests"
        />
      </ThemeProvider>,
    );
  });
  return { onChange, renderer };
}

describe('SegmentedControl', () => {
  it('shares a fixed track by default', () => {
    const { renderer } = render();
    expect(renderer.root.findAll((node) => node.type === 'ScrollView')).toEqual(
      [],
    );
  });

  it('scrolls sideways as one radio group when scrollable', () => {
    const { onChange, renderer } = render(true);
    const track = renderer.root.find((node) => node.type === 'ScrollView');
    expect(track.props).toMatchObject({
      accessibilityLabel: 'Habitat sections',
      accessibilityRole: 'radiogroup',
      horizontal: true,
    });
    const radios = track.findAll(
      (node) =>
        node.type === 'Pressable' && node.props.accessibilityRole === 'radio',
    );
    act(() => radios[1]?.props.onPress());
    expect(onChange).toHaveBeenCalledWith('tracks');
  });
});
