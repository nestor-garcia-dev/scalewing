import { render } from '@testing-library/react';

import {
  AppShell,
  type AppShellNavGroup,
  type AppShellProps,
} from './components/AppShell.js';

/** A field station's destinations: one bare group and one labelled. */
export const habitats: AppShellNavGroup[] = [
  {
    id: 'field',
    items: [
      {
        id: 'today',
        label: 'Today',
        href: '/today',
        icon: <svg data-glyph="today" />,
        current: 'page',
      },
    ],
  },
  {
    id: 'reserves',
    label: 'Reserves',
    items: [
      {
        id: 'wetlands',
        label: 'Wetlands',
        href: '/wetlands',
        icon: <svg />,
        count: 3,
        countLabel: '3 sightings to check',
      },
      {
        id: 'forests',
        label: 'Forests',
        href: '/forests',
        icon: <svg />,
        count: 2,
        countTone: 'warning',
      },
      { id: 'dunes', label: 'Dunes', href: '/dunes', icon: <svg />, count: 0 },
    ],
  },
];

/** The shell with its required words, a page, and any prop overridden. */
export function renderShell(props: Partial<AppShellProps> = {}) {
  return render(
    <AppShell
      barTitle="Heron Marsh"
      groups={habitats}
      labels={{ openMenu: 'Open menu', closeMenu: 'Close menu' }}
      menuIcon={<svg data-glyph="menu" />}
      navLabel="Field station"
      {...props}
    >
      <p>Otters seen at dawn.</p>
    </AppShell>,
  );
}
