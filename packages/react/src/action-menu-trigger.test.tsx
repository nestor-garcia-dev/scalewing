import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ActionMenu,
  type ActionMenuTriggerAppearance,
} from './components/ActionMenu.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const items = [{ id: 'out', label: 'Sign out', onSelect: vi.fn() }];

describe('ActionMenu triggerAppearance', () => {
  it('keeps the framed trigger by default', () => {
    render(<ActionMenu items={items} label="Account" />);
    expect(screen.getByRole('button', { name: 'Account' }).className).toBe(
      'sw-action-menu-trigger',
    );
  });

  it('draws a text trigger that still opens the menu', () => {
    render(
      <ActionMenu
        items={items}
        label="Account, Ada Ranger"
        trigger="Ada Ranger"
        triggerAppearance="text"
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Account, Ada Ranger' });
    expect(trigger.className).toBe(
      'sw-action-menu-trigger sw-action-menu-trigger-text',
    );
    expect(trigger.textContent).toBe('Ada Ranger');
    // The words are one flex item, so inline content keeps its spaces.
    expect(trigger.children).toHaveLength(1);
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeTruthy();
  });

  it('fails closed on an unknown appearance', () => {
    expect(() =>
      render(
        <ActionMenu
          items={items}
          label="Account"
          triggerAppearance={'ghost' as ActionMenuTriggerAppearance}
        />,
      ),
    ).toThrow(RangeError);
  });

  it('generates the words, the chevron, the open fill and the touch target', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-action-menu-trigger-text');
    expect(css).toMatch(
      /\.sw-action-menu-trigger\.sw-action-menu-trigger-text \{[^}]*background: transparent;[^}]*border-color: transparent;/,
    );
    expect(css).toContain(
      '.sw-action-menu-trigger.sw-action-menu-trigger-text::after {',
    );
    expect(css).toMatch(
      /\.sw-action-menu-trigger\.sw-action-menu-trigger-text\[aria-expanded='true'\] \{\s*background: color-mix\(in srgb, var\(--sw-color-muted\) 16%, transparent\);/,
    );
    expect(css).toMatch(
      /@media \(hover: hover\) \{\s*\.sw-action-menu-trigger\.sw-action-menu-trigger-text:hover:not\(:disabled\)/,
    );
    expect(css).toContain(
      '.sw-action-menu-trigger.sw-action-menu-trigger-text::after { border-color: CanvasText; }',
    );
    expect(css).toContain(
      ".sw-action-menu-trigger.sw-action-menu-trigger-text[aria-expanded='true'] { border-color: Highlight; }",
    );
    const target =
      '@media (pointer: coarse) {\n  .sw-action-menu-trigger.sw-action-menu-trigger-text { min-height: var(--sw-control-md-min-height); }\n}';
    expect(css).toContain(target);
    expect(css.indexOf(target)).toBeGreaterThan(
      css.indexOf('.sw-action-menu-trigger.sw-action-menu-trigger-text {'),
    );
  });
});

describe('ActionMenu triggerAppearance icon', () => {
  it('draws the glyph alone, named by the label, and opens the menu', () => {
    render(
      <ActionMenu
        items={items}
        label="More for Heron calls"
        trigger={<svg aria-hidden="true" data-testid="dots" />}
        triggerAppearance="icon"
      />,
    );
    const trigger = screen.getByRole('button', {
      name: 'More for Heron calls',
    });
    expect(trigger.className).toBe(
      'sw-action-menu-trigger sw-action-menu-trigger-icon',
    );
    expect(trigger.textContent).toBe('');
    expect(screen.getByTestId('dots').parentElement).toBe(trigger);
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeTruthy();
  });

  it('needs a glyph', () => {
    for (const trigger of [undefined, null, false, '', '  '])
      expect(() =>
        render(
          <ActionMenu
            items={items}
            label="More"
            trigger={trigger}
            triggerAppearance="icon"
          />,
        ),
      ).toThrow(new RangeError('An icon ActionMenu trigger needs its glyph'));
  });

  it('generates a round quiet button with no chevron, the open fill and the touch target', () => {
    const css = generateStylesheet();
    const icon = '.sw-action-menu-trigger.sw-action-menu-trigger-icon';
    expect(utilityClassCatalog()).toContain('sw-action-menu-trigger-icon');
    expect(css).toContain(
      `${icon} {\n  align-items: center;\n  background: transparent;\n  border-color: transparent;\n  border-radius: var(--sw-radius-pill);\n  color: var(--sw-color-muted);`,
    );
    expect(css).not.toContain(`${icon}::after`);
    expect(css).toMatch(
      /\.sw-action-menu-trigger\.sw-action-menu-trigger-icon\[aria-expanded='true'\] \{\n {2}background: color-mix/,
    );
    expect(css).toContain(
      `${icon} {\n    min-height: var(--sw-control-md-min-height);\n    min-width: var(--sw-control-md-min-height);\n  }`,
    );
  });
});
