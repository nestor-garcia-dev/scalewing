import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ActionMenu } from './components/ActionMenu.js';
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
    expect(css).toContain(
      '.sw-action-menu {\n  display: inline-flex;\n  flex-shrink: 0;\n  max-width: 100%;\n  position: relative;\n}',
    );
    const trigger = css.slice(css.indexOf('.sw-action-menu-trigger {'));
    expect(trigger.slice(0, trigger.indexOf('}'))).toContain(
      'max-width: 100%;',
    );
  });

  it('keeps a text trigger’s words as the button’s own text, its name the label', () => {
    render(
      <ActionMenu
        items={[{ id: 'habitat', label: 'Habitat', onSelect: () => undefined }]}
        label="Great crested grebe colony · Wetland"
        trigger="Great crested grebe colony"
        triggerAppearance="text"
      />,
    );
    const trigger = screen.getByRole('button', {
      name: 'Great crested grebe colony · Wetland',
    });
    // One plain words box, with no class of its own to cut them.
    const words = trigger.firstElementChild!;
    expect(words.tagName).toBe('SPAN');
    expect(words.className).toBe('');
    expect(words.firstChild?.nodeType).toBe(Node.TEXT_NODE);
    expect(words.textContent).toBe('Great crested grebe colony');
  });
});
