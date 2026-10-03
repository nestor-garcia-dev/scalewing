import { lightTheme } from '@scalewing/tokens';
import { View } from 'react-native';
import { act, create } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Field } from './components/Field.js';
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

describe('Field', () => {
  it('labels the input, tracks focus, and prefers the error caption', () => {
    const onChangeText = vi.fn();
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        <ThemeProvider colorScheme="light">
          <Field
            error="Required"
            hint="Shown on schedules"
            label="Team name"
            onChangeText={onChangeText}
            value=""
          />
        </ThemeProvider>,
      );
    });

    const input = renderer.root.findByType('TextInput');
    expect(input.props.accessibilityLabel).toBe('Team name');
    expect(input.props.accessibilityHint).toBe('Required');
    expect(input.props.editable).toBe(true);
    expect(input.props.style.lineHeight).toBeUndefined();

    expect(input.props.style.borderColor).toBe(lightTheme.colors.danger);
    act(() => input.props.onFocus({}));
    expect(renderer.root.findByType('TextInput').props.style.borderColor).toBe(
      lightTheme.colors.danger,
    );
    act(() => input.props.onChangeText('Harbor'));
    expect(onChangeText).toHaveBeenCalledWith('Harbor');

    const captions = renderer.root
      .findAllByType('Text')
      .filter((node) => typeof node.props.children === 'string')
      .map((node) => node.props.children);
    expect(captions).toEqual(['Team name', 'Required']);
    expect(input.props.multiline).toBe(false);
  });

  it('becomes a multi-line field that starts several lines tall', () => {
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        <ThemeProvider colorScheme="light">
          <Field
            label="Team names"
            onChangeText={vi.fn()}
            rows={4}
            value={'Chivas\nTropis'}
          />
        </ThemeProvider>,
      );
    });

    const input = renderer.root.findByType('TextInput');
    expect(input.props.multiline).toBe(true);
    expect(input.props.style.textAlignVertical).toBe('top');
    expect(input.props.style.minHeight).toBe(
      lightTheme.typography.body.lineHeight * 4 + lightTheme.space[2] * 2,
    );
    expect(input.props.value).toBe('Chivas\nTropis');
  });

  function renderSearch(
    props: Partial<React.ComponentProps<typeof Field>> = {},
  ) {
    const onChangeText = vi.fn();
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        <ThemeProvider colorScheme="light">
          <Field
            clearLabel="Clear search"
            label="Search animals"
            leading={<View testID="glass" />}
            onChangeText={onChangeText}
            placeholder="Search"
            testID="animals"
            value="Her"
            variant="search"
            {...(props as object)}
          />
        </ThemeProvider>,
      );
    });
    return { onChangeText, renderer };
  }

  function clearButton(renderer: ReturnType<typeof create>) {
    return renderer.root.findAll(
      (node) =>
        node.type === 'Pressable' && node.props.testID === 'animals-clear',
    );
  }

  it('draws a search field with no label above and names it by the label', () => {
    const { renderer } = renderSearch();
    const input = renderer.root.findByType('TextInput');

    expect(input.props).toMatchObject({
      accessibilityLabel: 'Search animals',
      accessibilityRole: 'search',
      multiline: false,
      placeholder: 'Search',
      returnKeyType: 'search',
      testID: 'animals',
    });
    expect(input.props.style.lineHeight).toBeUndefined();
    expect(
      renderer.root.findAllByType('Text').map((node) => node.props.children),
    ).toEqual([]);
  });

  it('keeps the consumer glyph out of the accessibility tree', () => {
    const { renderer } = renderSearch();
    const glyph = renderer.root.find(
      (node) => node.type === 'View' && node.props.testID === 'glass',
    );

    expect(glyph.parent?.props).toMatchObject({
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants',
    });
  });

  it('clears the text with a named button shown only while there is text', () => {
    const { onChangeText, renderer } = renderSearch();
    const [clear] = clearButton(renderer);

    expect(clear?.props).toMatchObject({
      accessibilityLabel: 'Clear search',
      accessibilityRole: 'button',
    });
    act(() => clear?.props.onPress());
    expect(onChangeText).toHaveBeenCalledWith('');

    expect(clearButton(renderSearch({ value: '' }).renderer)).toHaveLength(0);
    expect(clearButton(renderSearch({ disabled: true }).renderer)).toHaveLength(
      0,
    );
  });

  it('lets the consumer choose another return key', () => {
    const { renderer } = renderSearch({ returnKeyType: 'done' });

    expect(renderer.root.findByType('TextInput').props.returnKeyType).toBe(
      'done',
    );
  });

  it('shows a search field’s error under it and borders it in danger', () => {
    const { renderer } = renderSearch({ error: 'No connection.' });
    const frame = renderer.root.find(
      (node) =>
        node.type === 'View' &&
        node.props.style?.backgroundColor === lightTheme.colors.subtle,
    );

    expect(frame.props.style.borderColor).toBe(lightTheme.colors.danger);
    expect(
      renderer.root.findAllByType('Text').map((node) => node.props.children),
    ).toEqual(['No connection.']);
    expect(renderer.root.findByType('TextInput').props.accessibilityHint).toBe(
      'No connection.',
    );
  });

  it('refuses a search field without a clear label', () => {
    expect(() => renderSearch({ clearLabel: '' })).toThrow(
      'A search Field needs a clearLabel for its clear button.',
    );
  });

  it('keeps an outlined field free of the search semantics', () => {
    let renderer!: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        <ThemeProvider colorScheme="light">
          <Field label="Team name" onChangeText={vi.fn()} value="Harbor" />
        </ThemeProvider>,
      );
    });
    const input = renderer.root.findByType('TextInput');

    expect(input.props.accessibilityRole).toBeUndefined();
    expect(input.props.returnKeyType).toBeUndefined();
    expect(renderer.root.findAllByType('Pressable')).toHaveLength(0);
  });
});
