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

describe('MultiSelect list variant', () => {
  it('stacks one checkbox row per item with a check mark on the selected row', () => {
    const { renderer } = renderMultiSelect({ variant: 'list' });

    expect(checkbox(renderer.root, 'Monday')?.props.accessibilityRole).toBe(
      'checkbox',
    );
    expect(
      checkbox(renderer.root, 'Wednesday')?.props.accessibilityState,
    ).toEqual({ checked: true, disabled: false });
    const marks = renderer.root
      .findAllByType('Text')
      .filter((node) => node.props.children === '✓');
    expect(marks).toHaveLength(1);
    expect(marks[0]?.props.importantForAccessibility).toBe('no');
  });

  it('divides every row but the first from the row above', () => {
    const { renderer } = renderMultiSelect({ variant: 'list' });
    const rows = ['Monday', 'Wednesday', 'Friday'].map(
      (label) => checkbox(renderer.root, label)?.props.style,
    );

    expect(rows.map((style) => style.borderTopWidth)).toEqual([0, 1, 1]);
  });

  it('reads a detail line with its row', () => {
    const { renderer } = renderMultiSelect({
      items: [{ id: 'mon', label: 'Monday', detail: 'Evenings only' }],
      value: [],
      variant: 'list',
    });

    expect(checkbox(renderer.root, 'Monday, Evenings only')).toBeDefined();
    expect(
      renderer.root
        .findAllByType('Text')
        .some((node) => node.props.children === 'Evenings only'),
    ).toBe(true);
  });

  it('toggles in item order and disables every row together', () => {
    const { onChange, renderer } = renderMultiSelect({ variant: 'list' });

    act(() => checkbox(renderer.root, 'Friday')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith(['wed', 'fri']);

    const disabled = renderMultiSelect({ disabled: true, variant: 'list' });
    expect(checkbox(disabled.renderer.root, 'Monday')?.props.disabled).toBe(
      true,
    );
  });
});
