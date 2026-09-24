import { lightTheme } from '@scalewing/tokens';
import { act, create, type ReactTestInstance } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Accordion } from './components/Accordion.js';
import { Text } from './components/Text.js';
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

function renderAccordion(
  props: Partial<React.ComponentProps<typeof Accordion>> = {},
) {
  const onOpenChange = vi.fn();
  const renderer = create(
    <ThemeProvider colorScheme="light">
      <Accordion
        accessibilityLabel="Expand match group"
        onOpenChange={onOpenChange}
        open={false}
        title="Matchday 1"
        {...props}
      >
        <Text>Match details</Text>
      </Accordion>
    </ThemeProvider>,
  );

  return { onOpenChange, renderer };
}

function pressables(root: ReactTestInstance) {
  return root.findAllByType('Pressable');
}

describe('Accordion', () => {
  it.each([
    { open: false, togglesTo: true },
    { open: true, togglesTo: false },
  ])('toggles a single header from open=$open', ({ open, togglesTo }) => {
    let result!: ReturnType<typeof renderAccordion>;
    act(() => {
      result = renderAccordion({ open });
    });

    const [header] = pressables(result.renderer.root);
    expect(header.props.accessibilityLabel).toBe('Expand match group');
    expect(header.props.accessibilityState).toEqual({ expanded: open });

    act(() => header.props.onPress());
    expect(result.onOpenChange).toHaveBeenCalledWith(togglesTo);
  });

  it('keeps title navigation independent from the disclosure control', () => {
    const onTitlePress = vi.fn();
    let result!: ReturnType<typeof renderAccordion>;
    act(() => {
      result = renderAccordion({
        onTitlePress,
        open: true,
        titleAccessibilityLabel: 'Open Matchday 1',
      });
    });

    const [title, disclosure] = pressables(result.renderer.root);
    expect(title.props.accessibilityLabel).toBe('Open Matchday 1');
    expect(title.props.accessibilityState).toBeUndefined();
    expect(disclosure.props.accessibilityLabel).toBe('Expand match group');
    expect(disclosure.props.accessibilityState).toEqual({ expanded: true });

    act(() => title.props.onPress());
    expect(onTitlePress).toHaveBeenCalledOnce();
    expect(result.onOpenChange).not.toHaveBeenCalled();

    act(() => disclosure.props.onPress());
    expect(result.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('shows a muted one-line subtitle and names the title action with it', () => {
    let result!: ReturnType<typeof renderAccordion>;
    act(() => {
      result = renderAccordion({ onTitlePress: vi.fn(), subtitle: '7v7' });
    });

    const [subtitle] = result.renderer.root.findAll(
      (node) => node.type === 'Text' && node.props.children === '7v7',
    );
    expect(subtitle?.props.numberOfLines).toBe(1);
    expect(subtitle?.props.style).toContainEqual(
      expect.objectContaining({ color: lightTheme.colors.muted }),
    );

    const [title] = pressables(result.renderer.root);
    expect(title.props.accessibilityLabel).toBe('Matchday 1, 7v7');
  });

  it.each([
    {
      name: 'wraps the title by default',
      truncateTitle: undefined,
      lines: undefined,
    },
    {
      name: 'keeps a truncated title on one line',
      truncateTitle: true,
      lines: 1,
    },
  ])('$name', ({ truncateTitle, lines }) => {
    let result!: ReturnType<typeof renderAccordion>;
    act(() => {
      result = renderAccordion({ truncateTitle });
    });

    const [title] = result.renderer.root.findAll(
      (node) => node.type === 'Text' && node.props.children === 'Matchday 1',
    );
    expect(title?.props.numberOfLines).toBe(lines);
  });

  it('unmounts children when collapsed', () => {
    let result!: ReturnType<typeof renderAccordion>;
    act(() => {
      result = renderAccordion({ open: true });
    });
    expect(
      result.renderer.root.findAll(
        (node) =>
          node.type === 'Text' && node.props.children === 'Match details',
      ),
    ).toHaveLength(1);

    act(() => {
      result.renderer.update(
        <ThemeProvider colorScheme="light">
          <Accordion
            accessibilityLabel="Expand match group"
            onOpenChange={result.onOpenChange}
            open={false}
            title="Matchday 1"
          >
            <Text>Match details</Text>
          </Accordion>
        </ThemeProvider>,
      );
    });
    expect(
      result.renderer.root.findAll(
        (node) =>
          node.type === 'Text' && node.props.children === 'Match details',
      ),
    ).toHaveLength(0);
  });

  it('hides the decorative chevron from accessibility', () => {
    let result!: ReturnType<typeof renderAccordion>;
    act(() => {
      result = renderAccordion();
    });

    expect(
      result.renderer.root.findAll(
        (node) =>
          node.type === 'View' &&
          node.props.accessibilityElementsHidden === true &&
          node.props.importantForAccessibility === 'no-hide-descendants',
      ),
    ).toHaveLength(1);
  });
});
