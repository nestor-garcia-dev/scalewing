import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionBar } from './components/ActionBar.js';
import { Button } from './components/Button.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => cleanup());

describe('ActionBar', () => {
  it('shows a status line before its actions and sticks by default', () => {
    const onSave = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(
      <ThemeProvider colorScheme="light">
        <ActionBar
          aria-label="Survey actions"
          className="survey-bar"
          ref={ref}
          role="region"
          status="Survey saved at 5:00 PM"
        >
          <Button variant="secondary" onPress={onSave}>
            Save survey
          </Button>
          <Button onPress={() => undefined}>Submit sightings</Button>
        </ActionBar>
      </ThemeProvider>,
    );

    const bar = screen.getByRole('region', { name: 'Survey actions' });
    expect(ref.current).toBe(bar);
    expect(bar.className).toBe('sw-action-bar sw-action-bar-sticky survey-bar');
    const status = screen.getByText('Survey saved at 5:00 PM');
    expect(status.tagName).toBe('P');
    expect(status.className).toBe('sw-action-bar-status');
    expect(status.getAttribute('role')).toBeNull();
    expect(bar.firstElementChild).toBe(status);
    const actions = bar.lastElementChild;
    expect(actions?.className).toBe('sw-action-bar-actions');
    expect(actions?.children).toHaveLength(2);
    screen.getByRole('button', { name: 'Save survey' }).click();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('sticks only below a breakpoint and leaves out an empty status', () => {
    render(
      <ActionBar stickyBelow="md">
        <Button onPress={() => undefined}>Submit sightings</Button>
      </ActionBar>,
    );
    const bar = screen.getByRole('button').closest('.sw-action-bar');
    expect(bar?.className).toBe('sw-action-bar sw-action-bar-sticky-below-md');
    expect(bar?.querySelector('.sw-action-bar-status')).toBeNull();
    expect(bar?.children).toHaveLength(1);
  });

  it('generates a glass bar that clears the safe area when stuck', () => {
    const css = generateStylesheet();
    const catalog = utilityClassCatalog();
    for (const className of [
      'sw-action-bar',
      'sw-action-bar-status',
      'sw-action-bar-actions',
      'sw-action-bar-sticky',
      'sw-action-bar-sticky-below-md',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toMatch(
      /\.sw-action-bar \{[^}]*background: var\(--sw-glass-fill\);[^}]*backdrop-filter: blur\(var\(--sw-glass-blur\)\)/,
    );
    expect(css).toMatch(
      /\.sw-action-bar-sticky \{\s*bottom: calc\(var\(--sw-space-2\) \+ env\(safe-area-inset-bottom, 0px\)\);\s*position: sticky;/,
    );
    expect(css).toMatch(
      /@media not all and \(min-width: 48rem\) \{\n {2}\.sw-action-bar-sticky-below-md \{\s*bottom: calc\(var\(--sw-space-2\) \+ env\(safe-area-inset-bottom, 0px\)\);\s*position: sticky;/,
    );
    // Only inside that query: from md up the bar sits in page flow.
    expect(css.split('.sw-action-bar-sticky-below-md {')).toHaveLength(2);
    expect(css).toContain(
      'padding-left: max(var(--sw-space-4), env(safe-area-inset-left, 0px));',
    );
    expect(css).toMatch(
      /@media \(prefers-reduced-transparency: reduce\) \{[^}]*\.sw-action-bar,/,
    );
  });
});
