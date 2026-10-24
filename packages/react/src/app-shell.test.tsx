import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { habitats, renderShell } from './app-shell.test-support.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('AppShell', () => {
  it('is a named navigation of grouped links beside the page in main', () => {
    renderShell({ header: <span>Station</span>, footer: <span>Ranger</span> });
    const nav = screen.getByRole('navigation', { name: 'Field station' });
    expect(nav.className).toBe('sw-app-shell-nav');
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/today',
      '/wetlands',
      '/forests',
      '/dunes',
    ]);
    expect(links[0]?.getAttribute('aria-current')).toBe('page');
    expect(links[1]?.hasAttribute('aria-current')).toBe(false);
    for (const link of links) expect(link.getAttribute('tabindex')).toBe('0');
    // A labelled group names its list; an unlabelled one is a bare list.
    expect(
      within(nav).getByRole('list', { name: 'Reserves' }).children,
    ).toHaveLength(3);
    expect(
      within(nav).getAllByRole('list')[0]?.hasAttribute('aria-labelledby'),
    ).toBe(false);
    expect(screen.getByRole('main').textContent).toBe('Otters seen at dawn.');
    expect(screen.getByText('Station').parentElement?.className).toBe(
      'sw-app-shell-header sw-app-shell-slot',
    );
    expect(screen.getByText('Ranger').parentElement?.className).toBe(
      'sw-app-shell-footer sw-app-shell-slot',
    );
  });

  it('reads each count in the link name, a countLabel in place of the number', () => {
    renderShell();
    const nav = screen.getByRole('navigation');
    expect(
      within(nav).getByRole('link', {
        name: /^Wetlands ?3 sightings to check$/,
      }),
    ).toBeTruthy();
    expect(within(nav).getByRole('link', { name: 'Forests 2' })).toBeTruthy();
    // 0 shows no pill.
    const dunes = within(nav).getByRole('link', { name: 'Dunes' });
    expect(dunes.querySelector('.sw-app-shell-count')).toBeNull();
    const wetlands = within(nav).getByRole('link', { name: /^Wetlands/ });
    const pill = wetlands.querySelector('.sw-app-shell-count');
    expect(pill?.textContent).toBe('3');
    expect(pill?.getAttribute('aria-hidden')).toBe('true');
    const forests = within(nav).getByRole('link', { name: 'Forests 2' });
    expect(
      forests.querySelector('.sw-app-shell-count')?.hasAttribute('aria-hidden'),
    ).toBe(false);
  });

  it('draws nothing for a count of 0, even with a countLabel', () => {
    renderShell({
      groups: [
        {
          id: 'river',
          items: [
            {
              id: 'otters',
              label: 'Otters',
              href: '/otters',
              icon: <svg />,
              count: 0,
              countLabel: 'none to check',
            },
          ],
        },
      ],
    });
    const otters = screen.getByRole('link', { name: 'Otters' });
    expect(otters.querySelector('.sw-app-shell-count')).toBeNull();
    expect(otters.textContent).toBe('Otters');
  });

  it('draws a count in its tone, danger by default', () => {
    renderShell();
    const pill = (name: RegExp) =>
      screen.getByRole('link', { name }).querySelector('.sw-app-shell-count')
        ?.className;
    expect(pill(/^Wetlands/)).toBe('sw-app-shell-count');
    expect(pill(/^Forests/)).toBe(
      'sw-app-shell-count sw-app-shell-count-warning',
    );
  });

  it('maps its parts to the generated classes', () => {
    const { container } = renderShell({
      barEnd: <span>Help</span>,
      railFooter: <span>R</span>,
      railHeader: <span>H</span>,
    });
    const shell = container.firstElementChild!;
    expect(shell.className).toBe('sw-app-shell');
    expect(
      [...shell.children].map((child) => `${child.tagName} ${child.className}`),
    ).toEqual([
      'HEADER sw-padding-2 sw-app-header sw-app-header-bar sw-app-header-sticky sw-app-shell-bar',
      'DIV sw-app-shell-sidebar',
      'MAIN sw-app-shell-main',
      'DIALOG sw-app-shell-drawer',
    ]);
    expect(screen.getByText('H').parentElement?.className).toBe(
      'sw-app-shell-header sw-app-shell-rail-slot',
    );
    expect(screen.getByText('R').parentElement?.className).toBe(
      'sw-app-shell-footer sw-app-shell-rail-slot',
    );
    expect(screen.getByText('Heron Marsh').className).toBe(
      'sw-app-shell-bar-title',
    );
    expect(screen.getByText('Help').parentElement?.className).toBe(
      'sw-app-shell-bar-end',
    );
    const today = screen.getByRole('link', { name: 'Today' });
    expect(today.className).toBe('sw-app-shell-link');
    const [icon, label] = [...today.children];
    expect(icon?.className).toBe('sw-app-shell-icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(label?.className).toBe('sw-app-shell-label');
    expect(screen.getByText('Reserves').className).toBe(
      'sw-app-shell-group-label',
    );
  });

  it('draws no rail slot or bar end it was not given', () => {
    const { container } = renderShell();
    expect(container.querySelector('.sw-app-shell-rail-slot')).toBeNull();
    expect(container.querySelector('.sw-app-shell-header')).toBeNull();
    expect(container.querySelector('.sw-app-shell-bar-end')).toBeNull();
  });

  it('hands a plain press to onNavigate and leaves a modified one to the browser', () => {
    const onNavigate = vi.fn();
    renderShell({ onNavigate });
    const forests = screen.getByRole('link', { name: 'Forests 2' });
    expect(fireEvent.click(forests)).toBe(false); // prevented
    expect(onNavigate).toHaveBeenCalledWith(habitats[1]?.items[1]);
    for (const modifier of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey'])
      expect(fireEvent.click(forests, { [modifier]: true })).toBe(true);
    expect(fireEvent.click(forests, { button: 1 })).toBe(true);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('lets the sidebar links navigate without onNavigate', () => {
    renderShell();
    expect(fireEvent.click(screen.getByRole('link', { name: 'Today' }))).toBe(
      true,
    );
  });

  it('wraps the sidebar links in a tooltip shown only in the rail, naming nothing twice', () => {
    renderShell();
    // jsdom has no matchMedia: the full sidebar, tooltips off.
    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
    cleanup();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(min-width: 64rem)',
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    renderShell();
    const tips = screen.getAllByRole('tooltip', { hidden: true });
    expect(tips.map((tip) => tip.textContent)).toEqual([
      'Today',
      'Wetlands',
      'Forests',
      'Dunes',
    ]);
    const wetlands = screen.getByRole('link', {
      name: /^Wetlands ?3 sightings to check$/,
    });
    expect(wetlands.hasAttribute('aria-describedby')).toBe(false);
    expect(wetlands.parentElement?.className).toBe('sw-tooltip-anchor');
  });
});
