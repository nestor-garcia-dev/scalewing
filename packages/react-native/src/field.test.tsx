import { lightTheme } from '@scalewing/tokens';
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
});
