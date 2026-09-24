import { darkTheme, lightTheme } from '@scalewing/tokens';
import { act, create } from 'react-test-renderer';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Progress } from './components/Progress.js';
import {
  mapProgressFillStyle,
  mapProgressTrackStyle,
} from './map-progress-style.js';
import {
  assertProgressRange,
  progressCount,
  progressFraction,
} from './progress-range.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

vi.mock('react-native', () => ({
  StyleSheet: { hairlineWidth: 0.5 },
  Text: 'Text',
  useColorScheme: () => 'light',
  View: 'View',
}));

beforeAll(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

function hostView(renderer: ReturnType<typeof create>, testID: string) {
  return renderer.root.find(
    (node) => node.type === ('View' as never) && node.props.testID === testID,
  );
}

function renderProgress(props: React.ComponentProps<typeof Progress>) {
  let renderer!: ReturnType<typeof create>;
  act(() => {
    renderer = create(
      <ThemeProvider colorScheme="light">
        <Progress {...props} />
      </ThemeProvider>,
    );
  });
  return renderer;
}

describe('progress range', () => {
  it('reports the filled share and the visible count', () => {
    expect(progressFraction({ max: 8, value: 0 })).toBe(0);
    expect(progressFraction({ max: 8, value: 4 })).toBe(0.5);
    expect(progressFraction({ max: 8, value: 8 })).toBe(1);
    expect(progressCount({ max: 8, value: 4 })).toBe('4 / 8');
  });

  it('rejects an empty label and invalid ranges like the web component', () => {
    expect(() =>
      assertProgressRange('Done', { max: 4, value: 4 }),
    ).not.toThrow();
    expect(() => assertProgressRange(' ', { max: 4, value: 0 })).toThrow(
      RangeError,
    );
    for (const range of [
      { max: 0, value: 0 },
      { max: Infinity, value: 1 },
      { max: 4, value: -1 },
      { max: 4, value: 5 },
      { max: 4, value: Number.NaN },
    ]) {
      expect(() => assertProgressRange('Done', range)).toThrow(RangeError);
    }
  });
});

describe('progress style', () => {
  it('draws the track in the border color and the fill in the tone', () => {
    expect(mapProgressTrackStyle(lightTheme)).toMatchObject({
      backgroundColor: lightTheme.colors.border,
      borderRadius: lightTheme.radius.pill,
      height: lightTheme.space[2],
    });
    expect(mapProgressFillStyle(lightTheme, 'accent', 0.5)).toMatchObject({
      backgroundColor: lightTheme.colors.accent,
      width: '50%',
    });
    expect(mapProgressFillStyle(darkTheme, 'success', 1)).toMatchObject({
      backgroundColor: darkTheme.colors.success,
      width: '100%',
    });
    expect(mapProgressFillStyle(lightTheme, 'danger', 0).width).toBe('0%');
  });
});

describe('Progress', () => {
  it('is one progress bar named by its label with its value range', () => {
    const renderer = renderProgress({
      label: 'Next: add teams',
      max: 8,
      testID: 'season',
      value: 4,
    });
    const bar = hostView(renderer, 'season');
    expect(bar.props).toMatchObject({
      accessibilityLabel: 'Next: add teams',
      accessibilityRole: 'progressbar',
      accessibilityValue: { max: 8, min: 0, now: 4 },
      accessible: true,
    });
    const texts = renderer.root
      .findAllByType('Text' as never)
      .map((node) => node.props.children);
    expect(texts).toEqual(['Next: add teams', '4 / 8']);
    const fill = hostView(renderer, 'season-fill');
    expect(fill.props.style).toMatchObject({
      backgroundColor: lightTheme.colors.accent,
      width: '50%',
    });
  });

  it('follows the tone and a changed value', () => {
    const renderer = renderProgress({
      label: 'Nests checked',
      max: 4,
      testID: 'nests',
      tone: 'success',
      value: 1,
    });
    act(() => {
      renderer.update(
        <ThemeProvider colorScheme="light">
          <Progress
            label="Nests checked"
            max={4}
            testID="nests"
            tone="success"
            value={4}
          />
        </ThemeProvider>,
      );
    });
    expect(hostView(renderer, 'nests').props.accessibilityValue).toEqual({
      max: 4,
      min: 0,
      now: 4,
    });
    expect(hostView(renderer, 'nests-fill').props.style).toMatchObject({
      backgroundColor: lightTheme.colors.success,
      width: '100%',
    });
  });

  it('throws for an invalid range', () => {
    expect(() => renderProgress({ label: 'Done', max: 4, value: 5 })).toThrow(
      RangeError,
    );
  });
});
