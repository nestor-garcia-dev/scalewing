import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { SingleSelect } from './components/SingleSelect.js';
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
  { id: 'gw1', label: 'Gameweek 1' },
  { id: 'gw2', label: 'Gameweek 2' },
  { id: 'gw3', label: 'Gameweek 3' },
];

function renderSingleSelect(
  props: Partial<React.ComponentProps<typeof SingleSelect>> = {},
) {
  const onChange = vi.fn();
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <SingleSelect
          items={items}
          label="Gameweek"
          onChange={onChange}
          value="gw2"
          {...props}
        />
      </ThemeProvider>,
    );
  });
  return { onChange, renderer };
}

function radio(root: ReactTestInstance, label: string) {
  return root
    .findAllByType('Pressable')
    .find((node) => node.props.accessibilityLabel === label);
}

describe('SingleSelect', () => {
  it('renders one radio per item inside a labeled radiogroup', () => {
    const { renderer } = renderSingleSelect();

    const group = renderer.root
      .findAllByType('View')
      .find((node) => node.props.accessibilityRole === 'radiogroup');
    expect(group?.props.accessibilityLabel).toBe('Gameweek');
    expect(radio(renderer.root, 'Gameweek 1')?.props.accessibilityRole).toBe(
      'radio',
    );
    expect(
      radio(renderer.root, 'Gameweek 1')?.props.accessibilityState,
    ).toEqual({ disabled: false, selected: false });
    expect(
      radio(renderer.root, 'Gameweek 2')?.props.accessibilityState,
    ).toEqual({ disabled: false, selected: true });
  });

  it('reports a new id and ignores a press on the selected chip', () => {
    const { onChange, renderer } = renderSingleSelect();

    act(() => radio(renderer.root, 'Gameweek 3')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('gw3');
    act(() => radio(renderer.root, 'Gameweek 2')?.props.onPress());
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders no selection for the empty value', () => {
    const { renderer } = renderSingleSelect({ value: '' });

    const selected = renderer.root
      .findAllByType('Pressable')
      .filter((node) => node.props.accessibilityState?.selected === true);
    expect(selected).toHaveLength(0);
  });

  it('disables every chip together and shows the error caption', () => {
    const { renderer } = renderSingleSelect({
      disabled: true,
      error: 'Pick a gameweek',
    });

    expect(radio(renderer.root, 'Gameweek 1')?.props.disabled).toBe(true);
    const captions = renderer.root
      .findAllByType('Text')
      .filter((node) => node.props.accessibilityLiveRegion === 'polite');
    expect(captions).toHaveLength(1);
    expect(captions[0]?.props.children).toBe('Pick a gameweek');
  });
});

describe('SingleSelect list variant', () => {
  const terms = [
    { id: 'fall', label: 'Fall' },
    { id: 'annual', label: 'Annual', detail: 'The whole year' },
  ];

  it('stacks radio rows in a labeled radiogroup with a mark on the chosen one', () => {
    const { renderer } = renderSingleSelect({
      items: terms,
      label: 'Season',
      value: 'annual',
      variant: 'list',
    });

    const group = renderer.root
      .findAllByType('View')
      .find((node) => node.props.accessibilityRole === 'radiogroup');
    expect(group?.props.accessibilityLabel).toBe('Season');
    expect(radio(renderer.root, 'Fall')?.props).toMatchObject({
      accessibilityRole: 'radio',
      accessibilityState: { disabled: false, selected: false },
    });
    expect(
      radio(renderer.root, 'Annual, The whole year')?.props.accessibilityState,
    ).toEqual({ disabled: false, selected: true });
    const marks = renderer.root
      .findAllByType('Text')
      .filter((node) => node.props.children === '✓');
    expect(marks).toHaveLength(1);
    expect(marks[0]?.props.importantForAccessibility).toBe('no');
  });

  it('shows a detail as a muted line under its label', () => {
    const { renderer } = renderSingleSelect({
      items: terms,
      value: '',
      variant: 'list',
    });

    const detail = renderer.root
      .findAllByType('Text')
      .find((node) => node.props.children === 'The whole year');
    expect(detail).toBeDefined();
    const marks = renderer.root
      .findAllByType('Text')
      .filter((node) => node.props.children === '✓');
    expect(marks).toHaveLength(0);
  });

  it('reports a new id, ignores the chosen row, and disables every row', () => {
    const { onChange, renderer } = renderSingleSelect({
      items: terms,
      value: 'fall',
      variant: 'list',
    });

    act(() => radio(renderer.root, 'Fall')?.props.onPress());
    expect(onChange).not.toHaveBeenCalled();
    act(() => radio(renderer.root, 'Annual, The whole year')?.props.onPress());
    expect(onChange).toHaveBeenLastCalledWith('annual');

    const disabled = renderSingleSelect({
      disabled: true,
      items: terms,
      variant: 'list',
    });
    expect(radio(disabled.renderer.root, 'Fall')?.props.disabled).toBe(true);
  });
});
