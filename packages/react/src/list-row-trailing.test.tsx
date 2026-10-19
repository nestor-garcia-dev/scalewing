import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActionMenu } from './components/ActionMenu.js';
import { Badge } from './components/Badge.js';
import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';
import { hasSlot } from './components/list/row-slot.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ListRow unread', () => {
  it('draws a hidden accent dot after the title and reads its words in the name', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          detail="Guide · 2 pages"
          href="#heron"
          title="Heron calls"
          unread
          unreadLabel="New"
          value="Oct 16"
        />
      </ListGroup>,
    );
    const link = screen.getByRole('link', { name: 'Heron calls New Oct 16' });
    const title = link.querySelector('.sw-list-row-title');
    expect(title?.textContent).toBe('Heron calls');
    const dot = title?.querySelector('.sw-list-row-unread');
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
    expect(link.querySelector('.sw-sr-only')?.textContent).toBe('New');
  });

  it('reads the unread words after the title of a statement row and a button row', () => {
    const onPress = vi.fn();
    render(
      <ListGroup aria-label="Field guides">
        <ListRow title="Owl pellets" unread unreadLabel="New" />
        <ListRow
          onPress={onPress}
          title="Frog chorus"
          unread
          unreadLabel="Nuevo"
        />
      </ListGroup>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]?.textContent).toBe('Owl pelletsNew');
    expect(
      screen.getByRole('button', { name: 'Frog chorus Nuevo' }),
    ).toBeTruthy();
  });

  it('lets aria-label replace the whole name, unread words included', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          aria-label="Open Heron calls"
          href="#heron"
          title="Heron calls"
          unread
          unreadLabel="New"
        />
      </ListGroup>,
    );
    const link = screen.getByRole('link', { name: 'Open Heron calls' });
    expect(link.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('reads a statement row’s unread words right after its title, before its detail', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          detail="Guide · 1 page"
          title="Owl pellets"
          unread
          unreadLabel="New"
        />
      </ListGroup>,
    );
    const label = screen
      .getByRole('listitem')
      .querySelector('.sw-list-row-label');
    expect(
      Array.from(label?.children ?? []).map((child) => child.textContent),
    ).toEqual(['Owl pellets', 'New', 'Guide · 1 page']);
  });

  it('draws nothing and reads nothing while read', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow href="#heron" title="Heron calls" unreadLabel="New" />
      </ListGroup>,
    );
    const link = screen.getByRole('link', { name: 'Heron calls' });
    expect(link.querySelector('.sw-list-row-unread')).toBeNull();
    expect(link.querySelector('.sw-sr-only')).toBeNull();
  });

  it('refuses an unread row without words, and blank words', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<ListRow title="Heron calls" unread />)).toThrow(
      'An unread ListRow needs an unreadLabel to say so',
    );
    expect(() =>
      render(<ListRow title="Heron calls" unread unreadLabel=" " />),
    ).toThrow('ListRow unreadLabel must be non-empty text');
  });

  it('draws the dot as a border, which forced colours keep', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-list-row-unread {\n  border: calc(var(--sw-space-2) / 2) solid var(--sw-color-accent);',
    );
    expect(css).toContain('.sw-list-row-unread { border-color: CanvasText; }');
  });
});

describe('ListRow tag', () => {
  it('puts a badge before the chevron and describes the row by it', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          detail="Guide · 1 page"
          href="#heron"
          tag={<Badge>Only in English</Badge>}
          title="Heron calls"
        />
      </ListGroup>,
    );
    const link = screen.getByRole('link', { name: 'Heron calls' });
    const tag = link.querySelector('.sw-list-row-tag');
    expect(tag?.textContent).toBe('Only in English');
    // The tag comes after the label and before the chevron.
    expect(tag?.previousElementSibling?.className).toBe('sw-list-row-label');
    expect(tag?.nextElementSibling?.className).toBe('sw-list-row-chevron');
    const described = (link.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent);
    expect(described).toEqual(['Guide · 1 page', 'Only in English']);
  });

  it('shows a tag on a statement row and leaves an empty one out', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          tag={<Badge tone="warning">Draft</Badge>}
          title="Owl pellets"
        />
        <ListRow tag={null} title="Frog chorus" />
      </ListGroup>,
    );
    const [first, second] = screen.getAllByRole('listitem');
    expect(within(first!).getByText('Draft')).toBeTruthy();
    expect(second?.querySelector('.sw-list-row-tag')).toBeNull();
  });
});

describe('ListRow action', () => {
  it('puts the action after the row, outside its press area', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onArchive = vi.fn();
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          accessory="none"
          action={
            <ActionMenu
              items={[{ id: 'archive', label: 'Archive', onSelect: onArchive }]}
              label="More for Heron calls"
            />
          }
          onPress={onOpen}
          title="Heron calls"
        />
      </ListGroup>,
    );
    const item = screen.getByRole('listitem');
    expect(item.className).toBe('sw-list-item sw-list-item-action');
    const row = within(item).getByRole('button', { name: 'Heron calls' });
    const more = within(item).getByRole('button', {
      name: 'More for Heron calls',
    });
    expect(row.contains(more)).toBe(false);
    expect(more.closest('.sw-list-row-action')?.parentElement).toBe(item);
    await user.click(more);
    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onArchive).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
    await user.click(row);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('keeps a row without an action as it was', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow href="#heron" title="Heron calls" />
      </ListGroup>,
    );
    const item = screen.getByRole('listitem');
    expect(item.className).toBe('sw-list-item');
    expect(item.querySelector('.sw-list-row-action')).toBeNull();
  });

  it('treats false and null slots as empty, as conditional JSX gives them', () => {
    const canArchive = false;
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          action={canArchive && <button type="button">Archive</button>}
          detail="Guide · 1 page"
          href="#heron"
          tag={canArchive && <Badge>Draft</Badge>}
          title="Heron calls"
        />
        <ListRow action={null} tag={null} title="Owl pellets" />
      </ListGroup>,
    );
    for (const item of screen.getAllByRole('listitem')) {
      expect(item.className).toBe('sw-list-item');
      expect(item.querySelector('.sw-list-row-action')).toBeNull();
      expect(item.querySelector('.sw-list-row-tag')).toBeNull();
    }
    const link = screen.getByRole('link', { name: 'Heron calls' });
    expect(
      document.getElementById(link.getAttribute('aria-describedby') ?? '')
        ?.textContent,
    ).toBe('Guide · 1 page');
  });

  it('counts only something React draws as a filled slot', () => {
    for (const empty of [undefined, null, false, true, ''])
      expect(hasSlot(empty)).toBe(false);
    for (const filled of [0, 'Draft', <span key="tag" />])
      expect(hasSlot(filled)).toBe(true);
  });

  it('draws no leading mark for a false one', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow leading={false} title="Heron calls" />
      </ListGroup>,
    );
    expect(document.querySelector('.sw-list-row-leading')).toBeNull();
  });

  it('holds an action beside a footer row too', () => {
    render(
      <ListGroup
        aria-label="Field guides"
        footer={
          <ListRow
            action={<button type="button">Add</button>}
            title="All guides"
          />
        }
      >
        <ListRow title="Heron calls" />
      </ListGroup>,
    );
    const add = screen.getByRole('button', { name: 'Add' });
    expect(add.closest('div.sw-list-item-action')).toBeTruthy();
  });

  it('fills the whole item under the pointer and catalogs the new classes', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '@supports selector(:has(*)) {\n  @media (hover: hover) {\n    .sw-list-item-action:has(> .sw-list-row-pressable:hover:not(.sw-list-row-disabled)) {\n      background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);\n    }\n\n    .sw-list-item-action > .sw-list-row-pressable:hover:not(.sw-list-row-disabled) {\n      background: transparent;\n    }',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-list-row-unread',
        'sw-list-row-tag',
        'sw-list-item-action',
        'sw-list-row-action',
      ]),
    );
  });
});
