import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SectionNav, sectionNavAppearances } from './index.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => cleanup());

const items = [
  { id: 'today', label: 'Today', href: '/vault', current: 'page' as const },
  { id: 'tasks', label: 'Tasks', href: '/vault/tasks', count: 3 },
  { id: 'orders', label: 'Orders', href: '/vault/orders', count: 0 },
];

describe('SectionNav count and filled appearance', () => {
  it('puts a count pill after the label, read as part of the name', () => {
    render(<SectionNav aria-label="Vault" items={items} />);
    const tasks = screen.getByRole('link', { name: 'Tasks 3' });
    const pill = tasks.querySelector('.sw-section-nav-count');
    expect(pill?.textContent).toBe('3');
    expect(tasks.textContent).toBe('Tasks 3');
    // 0 shows no pill.
    expect(
      screen
        .getByRole('link', { name: 'Orders' })
        .querySelector('.sw-section-nav-count'),
    ).toBeNull();
  });

  it('marks a filled navigation and leaves the default as it was', () => {
    const { rerender } = render(
      <SectionNav aria-label="Vault" appearance="filled" items={items} />,
    );
    expect(screen.getByRole('navigation').className).toBe(
      'sw-section-nav sw-section-nav-filled',
    );
    rerender(<SectionNav aria-label="Vault" items={items} />);
    expect(screen.getByRole('navigation').className).toBe('sw-section-nav');
    expect(sectionNavAppearances).toEqual(['underline', 'filled']);
  });

  it('fails closed on an unknown appearance or a count that is not a whole number', () => {
    expect(() =>
      render(
        <SectionNav
          appearance={'pill' as 'filled'}
          aria-label="Vault"
          items={items}
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <SectionNav
          aria-label="Vault"
          items={[{ id: 'a', label: 'A', href: '/a', countLabel: 'two' }]}
        />,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <SectionNav
          aria-label="Vault"
          items={[
            { id: 'a', label: 'A', href: '/a', count: 2, countLabel: ' ' },
          ]}
        />,
      ),
    ).toThrow(RangeError);
    for (const count of [-1, 1.5, Number.NaN])
      expect(() =>
        render(
          <SectionNav
            aria-label="Vault"
            items={[{ id: 'a', label: 'A', href: '/a', count }]}
          />,
        ),
      ).toThrow(RangeError);
  });

  it('keeps the count figures at 4.5:1 on the danger fill in every palette', () => {
    forEveryTheme((colors, label) => {
      expect(
        contrastRatio(colors.onDanger, colors.danger),
        label,
      ).toBeGreaterThanOrEqual(4.5);
    });
  });
});

describe('SectionNav filled CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-section-nav-filled', 'sw-section-nav-count']),
    );
  });

  it('drops the hairline and underline and fills the current link', () => {
    expect(css).toContain(
      '.sw-section-nav.sw-section-nav-filled .sw-section-nav-list {\n  border-bottom: 0;\n}',
    );
    expect(css).toMatch(
      /\[data-theme\] \.sw-section-nav\.sw-section-nav-filled \.sw-section-nav-link \{\n {2}border: 2px solid transparent;\n {2}border-radius: var\(--sw-radius-sm\);\n {2}font-weight: 500;\n {2}margin-bottom: 0;\n {2}min-height: var\(--sw-control-sm-min-height\);/,
    );
    expect(css).toMatch(
      /\[data-theme\] \.sw-section-nav\.sw-section-nav-filled \.sw-section-nav-link\[aria-current\] \{\n {2}background: color-mix\(in srgb, var\(--sw-color-muted\) 18%, transparent\);\n {2}border-color: transparent;\n {2}color: var\(--sw-color-text\);\n {2}font-weight: 600;/,
    );
  });

  it('keeps the 44 px target on a coarse pointer', () => {
    expect(css).toContain(
      '@media (pointer: coarse) {\n  [data-theme] .sw-section-nav.sw-section-nav-filled .sw-section-nav-link { min-height: var(--sw-control-md-min-height); }\n}',
    );
  });

  it('outranks the side list by two classes, not by source order', () => {
    const vertical =
      /\.sw-section-nav-vertical-from-md \.sw-section-nav-link:dir\(rtl\)/;
    expect(css).toMatch(vertical);
    // The side list's link rules are one class and an element or :dir;
    // every filled link rule starts with two classes and [data-theme].
    expect(css).not.toMatch(/\n\[data-theme\] \.sw-section-nav-filled /);
  });

  it('reads a count label in place of the bare number', () => {
    render(
      <SectionNav
        aria-label="Vault"
        items={[
          {
            id: 'tasks',
            label: 'Tasks',
            href: '/t',
            count: 3,
            countLabel: '3 tasks to do',
          },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: /^Tasks ?3 tasks to do$/ });
    expect(
      link.querySelector('.sw-section-nav-count')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('draws the count as a danger pill and keeps both in forced colours', () => {
    expect(css).toMatch(
      /\[data-theme\] \.sw-section-nav-count \{[^}]*background: var\(--sw-color-danger\);[^}]*color: var\(--sw-color-onDanger\);[^}]*font-weight: 700;/,
    );
    expect(css).toMatch(
      /forced-colors: active\) \{\n {2}\[data-theme\] \.sw-section-nav\.sw-section-nav-filled \.sw-section-nav-link\[aria-current\] \{ border-color: Highlight; \}\n {2}\[data-theme\] \.sw-section-nav-count \{ border: 1px solid CanvasText; \}/,
    );
  });
});
