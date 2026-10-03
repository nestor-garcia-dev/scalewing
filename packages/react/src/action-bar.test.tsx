import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionBar } from './components/ActionBar.js';
import { Badge } from './components/Badge.js';
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
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Survey saved at 5:00 PM');
    expect(status.tagName).toBe('DIV');
    expect(status.className).toBe('sw-action-bar-status');
    expect(bar.firstElementChild).toBe(status);
    const actions = bar.lastElementChild;
    expect(actions?.className).toBe('sw-action-bar-actions');
    expect(actions?.children).toHaveLength(2);
    screen.getByRole('button', { name: 'Save survey' }).click();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('sticks only below a breakpoint and keeps an empty live status for the first update', () => {
    const { rerender } = render(
      <ActionBar stickyBelow="md">
        <Button onPress={() => undefined}>Submit sightings</Button>
      </ActionBar>,
    );
    const bar = screen.getByRole('button').closest('.sw-action-bar');
    expect(bar?.className).toBe('sw-action-bar sw-action-bar-sticky-below-md');
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('');
    expect(bar?.firstElementChild).toBe(status);

    // The same live region takes each new status, so each one is announced.
    rerender(
      <ActionBar status="Draft saved at 5:00 PM" stickyBelow="md">
        <Button onPress={() => undefined}>Submit sightings</Button>
      </ActionBar>,
    );
    expect(screen.getByRole('status')).toBe(status);
    expect(status.textContent).toBe('Draft saved at 5:00 PM');
    rerender(
      <ActionBar status="Draft saved at 5:05 PM" stickyBelow="md">
        <Button onPress={() => undefined}>Submit sightings</Button>
      </ActionBar>,
    );
    expect(screen.getByRole('status')).toBe(status);
    expect(status.textContent).toBe('Draft saved at 5:05 PM');
  });

  it('takes a Badge and a short line as its status in the same live region', () => {
    const { rerender } = render(
      <ActionBar status="Not submitted yet">
        <Button onPress={() => undefined}>Submit sightings</Button>
      </ActionBar>,
    );
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Not submitted yet');

    rerender(
      <ActionBar
        status={
          <>
            <Badge tone="success">Ready to submit</Badge>
            <span>
              14 sightings · <strong>3</strong> habitats
            </span>
          </>
        }
      >
        <Button onPress={() => undefined}>Submit sightings</Button>
      </ActionBar>,
    );
    // The same node takes the new status, so it is announced; a div holds
    // the badge and the line validly, where the old paragraph could not
    // hold a block.
    expect(screen.getByRole('status')).toBe(status);
    expect(status.tagName).toBe('DIV');
    expect(status.className).toBe('sw-action-bar-status');
    expect(status.children).toHaveLength(2);
    expect(status.firstElementChild?.className).toContain('sw-badge-success');
    expect(status.textContent).toBe('Ready to submit14 sightings · 3 habitats');

    for (const nothing of [undefined, null, false]) {
      rerender(
        <ActionBar status={nothing}>
          <Button onPress={() => undefined}>Submit sightings</Button>
        </ActionBar>,
      );
      expect(screen.getByRole('status')).toBe(status);
      expect(status.childNodes).toHaveLength(0);
    }
  });

  it('lays a status badge and its line on one wrapping row a small gap apart', () => {
    const css = generateStylesheet();
    const start = css.indexOf('.sw-action-bar-status {');
    const rule = css.slice(start, css.indexOf('}', start));
    expect(rule).toContain('display: flex;');
    expect(rule).toContain('flex-wrap: wrap;');
    expect(rule).toContain('align-items: center;');
    expect(rule).toContain('column-gap: var(--sw-space-2);');
    expect(rule).toContain('row-gap: var(--sw-space-1);');
    expect(rule).toContain('min-width: 0;');
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
    // An empty status leaves the layout but stays in the accessibility tree.
    expect(css).toMatch(
      /\.sw-action-bar-status:empty \{\s*clip-path: inset\(50%\);\s*height: 1px;\s*overflow: hidden;\s*position: absolute;\s*width: 1px;\s*\}/,
    );
    expect(css).not.toMatch(
      /\.sw-action-bar-status:empty \{[^}]*display: none/,
    );
    expect(css).toMatch(
      /@media \(prefers-reduced-transparency: reduce\) \{[^}]*\.sw-action-bar,/,
    );
  });
});
