import { contrastRatio } from '@scalewing/tokens';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { renderShell } from './app-shell.test-support.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('AppShell contentMaxWidth', () => {
  it('leaves the page a direct child of main by default', () => {
    renderShell();
    expect(
      screen.getByText('Otters seen at dawn.').parentElement?.tagName,
    ).toBe('MAIN');
  });

  it('wraps the page in the centred container, and not the page bar', () => {
    renderShell({
      contentMaxWidth: 'container',
      pageBar: <span>Census</span>,
    });
    const wrap = screen.getByText('Otters seen at dawn.').parentElement!;
    expect(wrap.className).toBe('sw-container');
    expect(wrap.parentElement?.tagName).toBe('MAIN');
    expect(
      screen.getByText('Census').parentElement?.parentElement?.tagName,
    ).toBe('MAIN');
  });

  it('fails closed on an unknown width', () => {
    expect(() =>
      // @ts-expect-error an unknown width
      renderShell({ contentMaxWidth: 'wide' }),
    ).toThrow(RangeError);
  });
});

describe('AppShell sidebarTone', () => {
  it('adds no class by default', () => {
    const { container } = renderShell();
    expect(container.querySelector('.sw-app-shell')?.className).toBe(
      'sw-app-shell',
    );
    expect(css).toContain(
      'background: var(--sw-color-surface);\n    border-inline-end',
    );
  });

  it('puts the sidebar and the drawer on the subtle fill', () => {
    const { container } = renderShell({ sidebarTone: 'subtle' });
    expect(container.querySelector('.sw-app-shell')?.className).toBe(
      'sw-app-shell sw-app-shell-sidebar-subtle',
    );
    expect(css).toContain(
      '.sw-app-shell-sidebar-subtle :is(.sw-app-shell-sidebar, .sw-app-shell-drawer) {\n  background: var(--sw-color-subtle);\n}',
    );
    expect(utilityClassCatalog()).toContain('sw-app-shell-sidebar-subtle');
  });

  it('fails closed on an unknown tone', () => {
    expect(() =>
      // @ts-expect-error an unknown tone
      renderShell({ sidebarTone: 'loud' }),
    ).toThrow(RangeError);
  });

  it('keeps 4.5:1 for the words on it in every palette and scheme', () => {
    forEveryTheme((colors, label) => {
      const current = tintOver(colors.muted, 0.18, colors.subtle);
      const hover = tintOver(colors.muted, 0.12, colors.subtle);
      expect(
        contrastRatio(colors.text, colors.subtle),
        label,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(colors.muted, colors.subtle),
        label,
      ).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(colors.text, current), label).toBeGreaterThanOrEqual(
        4.5,
      );
      expect(contrastRatio(colors.text, hover), label).toBeGreaterThanOrEqual(
        4.5,
      );
    });
  });
});
