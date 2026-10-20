import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Badge } from './components/Badge.js';
import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Every element in the row that carries a `lang`, as `class: lang`. */
function langs(row: HTMLElement): string[] {
  return [...row.querySelectorAll('[lang]')].map(
    (node) => `${node.className}: ${node.getAttribute('lang') ?? ''}`,
  );
}

describe('ListRow titleLang', () => {
  it("marks a link row's title words only, its name and description unchanged", () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          detail="Course · 16 pages · Sep 24"
          href="#frog"
          tag={<Badge>Only in Spanish</Badge>}
          title="Coro de ranas"
          titleLang="es"
          unread
          unreadLabel="New"
          value="Sep 24"
          valueDetail="16 pages"
        />
      </ListGroup>,
    );
    const link = screen.getByRole('link', {
      name: 'Coro de ranas New Sep 24',
    });
    expect(
      (link.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .map((id) => document.getElementById(id)?.textContent)
        .join(' | '),
    ).toBe('Course · 16 pages · Sep 24 | 16 pages | Only in Spanish');
    expect(link.getAttribute('lang')).toBeNull();
    expect(langs(link)).toEqual(['sw-list-row-title: es']);
    const title = link.querySelector('.sw-list-row-title');
    expect(title?.textContent).toBe('Coro de ranas');
    // The wordless dot sits in the marked box; it has no words to speak.
    expect(
      link.querySelector('.sw-list-row-unread')?.closest('[lang]')?.className,
    ).toBe('sw-list-row-title');
    // The detail, value, tag and unread words stay in the page's language.
    for (const part of [
      '.sw-list-row-detail',
      '.sw-list-row-value',
      '.sw-list-row-value-detail',
      '.sw-list-row-tag',
      '.sw-sr-only',
    ])
      expect(link.querySelector(part)?.closest('[lang]')).toBeNull();
  });

  it('marks a button row, a truncated row and a statement row the same way', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow onPress={() => {}} title="Búhos" titleLang="es" />
        <ListRow
          detail="Guide · 12 pages"
          href="#heron"
          title="Garzas al amanecer en la marisma del norte"
          titleLang="es"
          truncate
        />
        <ListRow detail="Guide · 1 page" title="Egrets" titleLang="en" />
      </ListGroup>,
    );
    const button = screen.getByRole('button', { name: 'Búhos' });
    expect(langs(button)).toEqual(['sw-list-row-title: es']);
    const cut = screen.getByRole('link', {
      name: 'Garzas al amanecer en la marisma del norte',
    });
    expect(langs(cut)).toEqual(['sw-list-row-title: es']);
    expect(
      cut.querySelector('.sw-list-row-title-text')?.closest('[lang]')
        ?.className,
    ).toBe('sw-list-row-title');
    const items = screen.getAllByRole('listitem');
    expect(langs(items[2]!)).toEqual(['sw-list-row-title: en']);
  });

  it('adds no lang without titleLang', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow href="#heron" title="Heron calls" />
      </ListGroup>,
    );
    expect(langs(screen.getByRole('link', { name: 'Heron calls' }))).toEqual(
      [],
    );
  });

  it('throws on a blank titleLang', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const titleLang of ['', '  '])
      expect(() =>
        render(<ListRow title="Heron calls" titleLang={titleLang} />),
      ).toThrow(
        new RangeError('ListRow titleLang must be a non-empty language tag'),
      );
  });
});
