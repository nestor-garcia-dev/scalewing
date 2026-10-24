import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Button } from './components/Button.js';
import { EmptyState, type EmptyStateProps } from './components/EmptyState.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('EmptyState', () => {
  it('is a panel with an h2 title, a muted line, a hidden glyph and its actions', () => {
    const { container } = render(
      <EmptyState
        actions={
          <>
            <Button onPress={() => {}}>Add a nest</Button>
            <Button onPress={() => {}} variant="neutral">
              Paste a list
            </Button>
          </>
        }
        description="Count the nests on the island to start."
        icon={<svg data-testid="glyph" />}
        title="No nests counted yet"
      />,
    );
    const panel = container.firstElementChild!;
    expect(panel.className).toBe('sw-empty-state');
    expect(panel.tagName).toBe('DIV');
    expect(panel.hasAttribute('role')).toBe(false);
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'No nests counted yet',
    });
    expect(heading.className).toContain('sw-empty-state-title');
    const line = screen.getByText('Count the nests on the island to start.');
    expect(line.tagName).toBe('P');
    expect(line.className).toContain('sw-empty-state-description');
    const icon = screen.getByTestId('glyph').parentElement!;
    expect(icon.className).toBe('sw-empty-state-icon');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    const actions = panel.querySelector('.sw-empty-state-actions')!;
    expect(actions.querySelectorAll('button')).toHaveLength(2);
    // Reading order: glyph (hidden), title, line, actions.
    expect([...panel.children].map((child) => child.className)).toEqual([
      'sw-empty-state-icon',
      expect.stringContaining('sw-empty-state-title'),
      expect.stringContaining('sw-empty-state-description'),
      'sw-empty-state-actions',
    ]);
  });

  it('takes an h3 title inside a card under its own heading', () => {
    render(<EmptyState title="No otters seen" titleAs="h3" />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'No otters seen' }),
    ).toBeTruthy();
  });

  it('draws only the title when nothing else is given', () => {
    const { container } = render(
      <EmptyState actions={null} icon={false} title="No otters seen" />,
    );
    expect(container.firstElementChild!.children).toHaveLength(1);
  });

  it('treats an empty fragment, array or blank words in a slot as no content', () => {
    const empties = [<></>, [], '   ', <>{null}</>, <>{[]}</>, <>{'  '}</>];
    for (const empty of empties) {
      const { container, unmount } = render(
        <EmptyState actions={empty} icon={empty} title="No otters seen" />,
      );
      expect(container.firstElementChild!.children).toHaveLength(1);
      unmount();
    }
    render(<EmptyState actions={<>{0}</>} icon="★" title="Zero otters" />);
    expect(document.querySelector('.sw-empty-state-icon')).not.toBeNull();
    expect(document.querySelector('.sw-empty-state-actions')).not.toBeNull();
  });

  it('fails closed on blank words or an unknown heading', () => {
    const cases: EmptyStateProps[] = [
      { title: '' },
      { title: '   ' },
      { title: 'No otters', description: '' },
      { title: 'No otters', description: '  ' },
      { title: 'No otters', titleAs: 'h1' as EmptyStateProps['titleAs'] },
    ];
    for (const props of cases)
      expect(() => render(<EmptyState {...props} />)).toThrow(RangeError);
  });

  it('generates the dashed panel, the glyph square, the wrapping actions and forced colours', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-empty-state',
        'sw-empty-state-icon',
        'sw-empty-state-title',
        'sw-empty-state-description',
        'sw-empty-state-actions',
      ]),
    );
    expect(css).toMatch(
      /\.sw-empty-state \{[^}]*background: var\(--sw-color-surface\);[^}]*border: 1px dashed var\(--sw-color-border\);[^}]*text-align: center;[^}]*width: 100%;/,
    );
    expect(css).toMatch(
      /\.sw-empty-state-actions \{[^}]*flex-wrap: wrap;[^}]*justify-content: center;/,
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-empty-state-actions .sw-button { min-height: var(--sw-control-md-min-height); }\n}',
    );
    expect(css).toContain('.sw-empty-state-icon { color: CanvasText; }');
    expect(css).toContain('.sw-empty-state { border-color: CanvasText; }');
    // It shrinks inside a narrow column and breaks a long word.
    expect(css).toMatch(
      /\.sw-empty-state \{[^}]*min-width: 0;[^}]*overflow-wrap: anywhere;/,
    );
    // The words keep a readable measure.
    expect(css).toContain(
      '.sw-empty-state-title,\n.sw-empty-state-description {\n  margin: 0;\n  max-width: var(--sw-reading-max);\n}',
    );
    // A direct-child glyph is drawn at spacing step 5 in a step-8 square.
    expect(css).toContain(
      '.sw-empty-state-icon > svg {\n  height: var(--sw-space-5);\n  width: var(--sw-space-5);\n}',
    );
    expect(css).toMatch(
      /\.sw-empty-state-icon \{[^}]*height: var\(--sw-space-8\);[^}]*width: var\(--sw-space-8\);/,
    );
  });
});
