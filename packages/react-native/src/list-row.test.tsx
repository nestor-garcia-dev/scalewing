import { lightTheme } from '@scalewing/tokens';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ListGroup } from './components/ListGroup.js';
import { ListRow, type ListRowProps } from './components/ListRow.js';
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

function render(
  rows: ListRowProps[],
  variant?: React.ComponentProps<typeof ListGroup>['variant'],
) {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <ListGroup accessibilityLabel="Habitats" variant={variant}>
          {rows.map((row) => (
            <ListRow key={row.title} {...row} />
          ))}
        </ListGroup>
      </ThemeProvider>,
    );
  });
  return renderer.root;
}

/** The host row element, not the `ListRow` instance above it. */
function row(root: ReactTestInstance, name: string) {
  return root.find(
    (node) =>
      typeof node.type === 'string' && node.props.accessibilityLabel === name,
  );
}

/** The drawn chevron: a hidden bordered square turned to the end side. */
function chevrons(node: ReactTestInstance) {
  return node.findAll(
    (child) =>
      child.type === 'View' &&
      child.props.style?.transform?.[0]?.rotate === '-45deg',
  );
}

function checks(node: ReactTestInstance) {
  return node.findAll(
    (child) => child.type === 'Text' && child.props.children === '✓',
  );
}

describe('ListGroup', () => {
  it('names the group and draws a hairline between rows only', () => {
    const root = render([
      { title: 'Wetland' },
      { title: 'Forest' },
      { title: 'Desert' },
    ]);
    const group = root.find(
      (node) =>
        node.type === 'View' && node.props.accessibilityLabel === 'Habitats',
    );
    const separators = group.children.filter(
      (child) =>
        typeof child !== 'string' &&
        child.type === 'View' &&
        child.props.style?.height === 1,
    );
    expect(separators).toHaveLength(2);
    expect(group.props.style.borderWidth).toBe(1);
  });

  it('draws plain rows with a hairline above each, and no panel', () => {
    const root = render(
      [{ title: 'Wetland' }, { title: 'Forest' }, { title: 'Desert' }],
      'plain',
    );
    const group = root.find(
      (node) =>
        node.type === 'View' && node.props.accessibilityLabel === 'Habitats',
    );
    const separators = group.children.filter(
      (child) =>
        typeof child !== 'string' &&
        child.type === 'View' &&
        child.props.style?.height === 1,
    );
    expect(separators).toHaveLength(3);
    expect(group.props.style).toEqual({});
  });
});

describe('ListRow', () => {
  it('opens with a chevron and a button role, named by its lines', () => {
    const onPress = vi.fn();
    const root = render([
      { detail: '12 animals', onPress, title: 'Wetland', value: 'Open' },
    ]);
    const pressable = row(root, 'Wetland, 12 animals, Open');
    expect(pressable.type).toBe('Pressable');
    expect(pressable.props.accessibilityRole).toBe('button');
    expect(pressable.props.accessibilityState).toEqual({ disabled: false });
    expect(chevrons(pressable)).toHaveLength(1);
    act(() => pressable.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('fills while pressed', () => {
    const root = render([{ onPress: () => undefined, title: 'Wetland' }]);
    const style = row(root, 'Wetland').props.style as (state: {
      pressed: boolean;
    }) => { backgroundColor: string };
    expect(style({ pressed: false }).backgroundColor).toBe('transparent');
    expect(style({ pressed: true }).backgroundColor).not.toBe('transparent');
  });

  it('hides the chevron of a row that acts in place', () => {
    const root = render([
      { accessory: 'none', onPress: () => undefined, title: 'Refresh' },
    ]);
    expect(chevrons(row(root, 'Refresh'))).toHaveLength(0);
  });

  it('draws a danger row title in the danger colour', () => {
    const root = render([
      {
        accessory: 'none',
        onPress: () => undefined,
        title: 'End shift',
        tone: 'danger',
      },
      { onPress: () => undefined, title: 'Wetland' },
    ]);
    // The drawn title's colour, from its flattened style array.
    const titleColor = (name: string): unknown =>
      [
        row(root, name).find(
          (child) => child.type === 'Text' && child.props.children === name,
        ).props.style,
      ]
        .flat(Infinity)
        .reduce<Record<string, unknown>>(
          (merged, part) => ({ ...merged, ...(part || {}) }),
          {},
        ).color;
    expect(titleColor('End shift')).toBe(lightTheme.colors.danger);
    expect(titleColor('Wetland')).toBe(lightTheme.colors.text);
  });

  it('is one read-only text element without onPress', () => {
    const root = render([
      { accessory: 'chevron', title: 'Climate', value: 'Humid' },
    ]);
    const readOnly = row(root, 'Climate, Humid');
    expect(readOnly.type).toBe('View');
    expect(readOnly.props.accessible).toBe(true);
    expect(readOnly.props.accessibilityRole).toBeUndefined();
    expect(chevrons(readOnly)).toHaveLength(0);
    expect(typeof readOnly.props.style).toBe('object');
  });

  it('marks the selected choice with a check and announces both states', () => {
    const root = render([
      { onPress: () => undefined, selected: true, title: 'Dawn' },
      { onPress: () => undefined, selected: false, title: 'Dusk' },
    ]);
    const dawn = row(root, 'Dawn');
    const dusk = row(root, 'Dusk');
    expect(dawn.props.accessibilityState).toEqual({
      disabled: false,
      selected: true,
    });
    expect(dusk.props.accessibilityState).toEqual({
      disabled: false,
      selected: false,
    });
    expect(checks(dawn)).toHaveLength(1);
    expect(checks(dusk)).toHaveLength(0);
    expect(chevrons(dawn)).toHaveLength(0);
    expect(chevrons(dusk)).toHaveLength(0);
  });

  it('blocks presses and dims while disabled', () => {
    const root = render([
      { disabled: true, onPress: () => undefined, title: 'Wetland' },
    ]);
    const disabled = row(root, 'Wetland');
    expect(disabled.props.disabled).toBe(true);
    expect(disabled.props.accessibilityState).toEqual({ disabled: true });
    expect(disabled.props.style({ pressed: false }).opacity).toBeLessThan(1);
  });

  it('renders a leading mark and takes an explicit name', () => {
    const root = render([
      {
        accessibilityLabel: 'Wetland habitat',
        leading: <mark-view testID="mark" />,
        onPress: () => undefined,
        title: 'Wetland',
      },
    ]);
    const labelled = row(root, 'Wetland habitat');
    expect(labelled.findByProps({ testID: 'mark' })).toBeTruthy();
  });
});
