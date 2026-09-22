import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { MultiSelect, toggleSelection } from './components/MultiSelect.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

vi.mock('react-native', () => ({
  Pressable: 'Pressable',
  Text: 'Text',
  TextInput: 'TextInput',
  useColorScheme: () => 'light',
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

const items = [
  { id: 'mon', label: 'Monday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'fri', label: 'Friday' },
];

function renderMultiSelect(
  props: Partial<React.ComponentProps<typeof MultiSelect>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <MultiSelect
          items={items}
          label="Weekdays"
          onChange={onChange}
          value={['wed']}
          {...props}
        />
      </ThemeProvider>,
    );
  });
  return { onChange, renderer };
}

function checkbox(root: ReactTestInstance, label: string) {
  return root
    .findAllByType('Pressable')
    .find((node) => node.props.accessibilityLabel === label);
}

describe('MultiSelect', () => {
  it('renders one checkbox per item with the checked state', () => {
    const { renderer } = renderMultiSelect();

    expect(checkbox(renderer.root, 'Monday')?.props.accessibilityRole).toBe(
      'checkbox',
    );
    expect(checkbox(renderer.root, 'Monday')?.props.accessibilityState).toEqual(
      {
        checked: false,
        disabled: false,
      },
    );
    expect(
      checkbox(renderer.root, 'Wednesday')?.props.accessibilityState,
    ).toEqual({ checked: true, disabled: false });
  });

  it('adds and removes ids in item order', () => {
    const { onChange, renderer } = renderMultiSelect();

    act(() => checkbox(renderer.root, 'Monday')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith(['mon', 'wed']);
    act(() => checkbox(renderer.root, 'Wednesday')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(toggleSelection(items, ['fri', 'mon'], 'wed')).toEqual([
      'mon',
      'wed',
      'fri',
    ]);
  });

  it('disables every chip together and shows the error caption', () => {
    const { renderer } = renderMultiSelect({
      disabled: true,
      error: 'Pick at least one day',
    });

    expect(checkbox(renderer.root, 'Friday')?.props.disabled).toBe(true);
    const captions = renderer.root
      .findAllByType('Text')
      .filter((node) => node.props.accessibilityLiveRegion === 'polite');
    expect(captions).toHaveLength(1);
    expect(captions[0]?.props.children).toBe('Pick at least one day');
  });
});
