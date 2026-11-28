import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Badge } from './components/Badge.js';
import { Button } from './components/Button.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('Button natural width', () => {
  it('keeps its natural width in a flex row, never wider than its container', () => {
    expect(css).toContain(`.sw-button {
  flex-shrink: 0;
  max-width: 100%;
}`);
    // A full button still shares an Inline row: its own rule outranks.
    expect(css).toContain('.sw-inline > .sw-button-full {\n  flex: 1 1 0;');
  });

  it('never cuts its words or holds them on one line: they wrap where the container is narrower', () => {
    const button = css.slice(css.indexOf('.sw-button {'));
    const rule = button.slice(0, button.indexOf('}'));
    expect(rule).not.toContain('white-space');
    expect(css).not.toMatch(/\.sw-button[^{]*\{[^}]*text-overflow/);
    expect(utilityClassCatalog()).not.toContain('sw-button-label');
  });

  it('leaves its children and its name as they were', () => {
    render(
      <Button aria-pressed onPress={() => undefined}>
        Forest <Badge tone="warning">2 nests</Badge>
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Forest 2 nests' });
    // The words are still the button's own text node, no wrapper.
    expect(button.firstChild?.nodeType).toBe(Node.TEXT_NODE);
  });
});

describe('ActionMenu natural width', () => {
  it('keeps the menu at its natural width, no wider than its container', () => {
    expect(css).toContain('.sw-action-menu { flex-shrink: 0; }');
    expect(css).toContain(
      '.sw-action-menu,\n.sw-action-menu-trigger { max-width: 100%; }',
    );
    expect(css).not.toContain('sw-action-menu-trigger-words');
    expect(css).not.toMatch(
      /\.sw-action-menu-trigger \{ white-space: nowrap; \}/,
    );
  });
});
