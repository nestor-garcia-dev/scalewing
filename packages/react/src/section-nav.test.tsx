import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SectionNav, type SectionNavItem } from './components/SectionNav.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const sections: SectionNavItem[] = [
  { id: 'review', label: 'Review', href: '/admin/review', current: 'location' },
  { id: 'employees', label: 'Employees', href: '/admin/employees' },
];

describe('SectionNav', () => {
  it('is a labelled navigation of links, the current one marked', () => {
    render(<SectionNav aria-label="Admin sections" items={sections} />);
    const nav = screen.getByRole('navigation', { name: 'Admin sections' });
    expect(nav.className).toBe('sw-section-nav');
    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'Review',
      'Employees',
    ]);
    expect(links[0]?.getAttribute('href')).toBe('/admin/review');
    expect(links[0]?.getAttribute('aria-current')).toBe('location');
    expect(links[1]?.hasAttribute('aria-current')).toBe(false);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('maps page, true and false to aria-current', () => {
    render(
      <SectionNav
        aria-label="Sections"
        items={[
          { id: 'a', label: 'A', href: '/a', current: 'page' },
          { id: 'b', label: 'B', href: '/b', current: true },
          { id: 'c', label: 'C', href: '/c', current: false },
        ]}
      />,
    );
    const [a, b, c] = screen.getAllByRole('link');
    expect(a?.getAttribute('aria-current')).toBe('page');
    expect(b?.getAttribute('aria-current')).toBe('true');
    expect(c?.hasAttribute('aria-current')).toBe(false);
  });

  it('hands a plain press to onNavigate and leaves a modified one to the browser', () => {
    const onNavigate = vi.fn();
    render(
      <SectionNav
        aria-label="Admin sections"
        items={sections}
        onNavigate={onNavigate}
      />,
    );
    const employees = screen.getByRole('link', { name: 'Employees' });
    const plain = fireEvent.click(employees);
    expect(plain).toBe(false); // prevented
    expect(onNavigate).toHaveBeenCalledWith(sections[1]);
    for (const modifier of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey'])
      expect(fireEvent.click(employees, { [modifier]: true })).toBe(true);
    expect(fireEvent.click(employees, { button: 1 })).toBe(true);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('lets the links navigate without onNavigate', () => {
    render(<SectionNav aria-label="Admin sections" items={sections} />);
    expect(fireEvent.click(screen.getByRole('link', { name: 'Review' }))).toBe(
      true,
    );
  });

  it('attaches no handler without onNavigate, so a server component can render it', () => {
    // A server component cannot pass an event handler to the client, so the
    // links carry onClick only when the consumer gives onNavigate.
    const handlers = (node: ReactNode): unknown[] =>
      Children.toArray(node).flatMap((child) => {
        if (!isValidElement(child)) return [];
        const { children, onClick } = (
          child as ReactElement<{ children?: ReactNode; onClick?: unknown }>
        ).props;
        return [...(onClick ? [onClick] : []), ...handlers(children)];
      });
    expect(
      handlers(SectionNav({ 'aria-label': 'Admin sections', items: sections })),
    ).toEqual([]);
    expect(
      handlers(
        SectionNav({
          'aria-label': 'Admin sections',
          items: sections,
          onNavigate: () => undefined,
        }),
      ),
    ).toHaveLength(2);
  });

  it('renders a decorative icon and the vertical class', () => {
    render(
      <SectionNav
        aria-labelledby="portal"
        items={[{ id: 'a', label: 'A', href: '/a', icon: <svg /> }]}
        verticalFrom="md"
      />,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.className).toBe(
      'sw-section-nav sw-section-nav-vertical-from-md',
    );
    expect(nav.getAttribute('aria-labelledby')).toBe('portal');
    const icon = screen.getByRole('link').firstElementChild;
    expect(icon?.className).toBe('sw-section-nav-icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('refuses empty or duplicate ids, empty labels and an unknown breakpoint', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      for (const items of [
        [{ id: ' ', label: 'A', href: '/a' }],
        [{ id: 'a', label: '', href: '/a' }],
        [
          { id: 'a', label: 'A', href: '/a' },
          { id: 'a', label: 'B', href: '/b' },
        ],
      ])
        expect(() =>
          render(<SectionNav aria-label="Sections" items={items} />),
        ).toThrow(RangeError);
      expect(() =>
        render(
          <SectionNav
            aria-label="Sections"
            items={sections}
            // @ts-expect-error an unknown breakpoint from untyped code
            verticalFrom="xl"
          />,
        ),
      ).toThrow('SectionNav verticalFrom must be one of md');
    } finally {
      consoleError.mockRestore();
    }
  });

  it('generates a quiet row, an underline on the current item, and a side list from md', () => {
    const css = generateStylesheet();
    expect(css).toMatch(
      /\[data-theme\] \.sw-section-nav-link \{[^}]*color: var\(--sw-color-muted\);[^}]*text-decoration: none;/,
    );
    expect(css).toContain(
      '.sw-section-nav-link[aria-current] {\n  border-bottom-color: var(--sw-color-accent);\n  color: var(--sw-color-text);\n}',
    );
    expect(css).toMatch(
      /@media \(min-width: 48rem\) \{\n {2}\.sw-section-nav-vertical-from-md \.sw-section-nav-list \{[^}]*flex-direction: column;/,
    );
    expect(css).toContain(
      '  .sw-section-nav-vertical-from-md .sw-section-nav-link[aria-current] {\n    border-inline-start-color: var(--sw-color-accent);',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  [data-theme] .sw-section-nav-link { min-height: var(--sw-control-md-min-height); }',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-section-nav',
        'sw-section-nav-list',
        'sw-section-nav-link',
        'sw-section-nav-icon',
        'sw-section-nav-vertical-from-md',
      ]),
    );
  });
});
