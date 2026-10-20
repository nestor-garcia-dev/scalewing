import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Badge } from './components/Badge.js';
import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(cleanup);

function described(element: HTMLElement): string {
  return (element.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent)
    .join(' | ');
}

describe('ListRow truncate', () => {
  it('cuts the title and detail to a line each and keeps the whole words in the name, description and tooltips', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow
          detail="Guide · Wetlands › Herons and egrets · 12 pages"
          href="#heron"
          tag={<Badge>Only in English</Badge>}
          title="Heron calls heard at the marsh before dawn"
          truncate
          unread
          unreadLabel="New"
          value="Oct 16"
        />
      </ListGroup>,
    );
    const link = screen.getByRole('link', {
      name: 'Heron calls heard at the marsh before dawn New Oct 16',
    });
    expect(link.classList.contains('sw-list-row-truncate')).toBe(true);
    expect(described(link)).toBe(
      'Guide · Wetlands › Herons and egrets · 12 pages | Only in English',
    );
    const words = link.querySelector('.sw-list-row-title-text');
    expect(words?.textContent).toBe(
      'Heron calls heard at the marsh before dawn',
    );
    expect(words?.getAttribute('title')).toBe(
      'Heron calls heard at the marsh before dawn',
    );
    // The dot follows the words' box, so the cut never hides it.
    expect(words?.nextElementSibling?.className).toBe('sw-list-row-unread');
    expect(
      link.querySelector('.sw-list-row-detail')?.getAttribute('title'),
    ).toBe('Guide · Wetlands › Herons and egrets · 12 pages');
  });

  it('truncates a button row and a statement row the same way', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow onPress={() => {}} title="Frog chorus" truncate />
        <ListRow detail="Guide · 1 page" title="Owl pellets" truncate />
      </ListGroup>,
    );
    const button = screen.getByRole('button', { name: 'Frog chorus' });
    expect(button.classList.contains('sw-list-row-truncate')).toBe(true);
    const items = screen.getAllByRole('listitem');
    expect(items[1]?.textContent).toBe('Owl pelletsGuide · 1 page');
    expect(
      items[1]?.querySelector('.sw-list-row-title-text')?.getAttribute('title'),
    ).toBe('Owl pellets');
  });

  it('leaves a row without truncate as it was: no words box, no tooltip', () => {
    render(
      <ListGroup aria-label="Field guides">
        <ListRow detail="Guide · 2 pages" href="#heron" title="Heron calls" />
      </ListGroup>,
    );
    const link = screen.getByRole('link', { name: 'Heron calls' });
    expect(link.classList.contains('sw-list-row-truncate')).toBe(false);
    expect(link.querySelector('.sw-list-row-title-text')).toBeNull();
    expect(link.querySelector('[title]')).toBeNull();
    expect(link.querySelector('.sw-list-row-title')?.textContent).toBe(
      'Heron calls',
    );
  });

  it('generates one-line rules for the words and the detail and catalogs the classes', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-list-row-truncate .sw-list-row-title {\n  align-items: center;\n  display: flex;\n  min-width: 0;\n}',
    );
    expect(css).toContain(
      '.sw-list-row-truncate .sw-list-row-unread { flex: none; }',
    );
    expect(css).toContain(
      '.sw-list-row-truncate .sw-list-row-title-text,\n.sw-list-row-truncate .sw-list-row-detail {\n  min-width: 0;\n  overflow: hidden;\n  overflow-wrap: normal;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}',
    );
    // Every selector that names the words box is scoped to truncated rows.
    const selectors = css
      .split('}')
      .map((block) => block.slice(0, block.lastIndexOf('{')))
      .flatMap((list) => list.split(','))
      .map((selector) => selector.slice(selector.lastIndexOf('{') + 1).trim())
      .filter((selector) => selector.includes('sw-list-row-title-text'));
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors)
      expect(selector.startsWith('.sw-list-row-truncate ')).toBe(true);
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-list-row-truncate',
        'sw-list-row-title-text',
      ]),
    );
  });
});
