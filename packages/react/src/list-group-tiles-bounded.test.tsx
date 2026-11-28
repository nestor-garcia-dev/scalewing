import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';
import { stackingOrder } from './css/stacking.js';
import { generateStylesheet } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();
const region = '.sw-list-group-tiles > .sw-list-group-scroll';

const keepers = [
  'Ana',
  'Bruno',
  'Carmen',
  'Diego',
  'Elena',
  'Fabián',
  'Gloria',
  'Hugo',
  'Inés',
  'Jorge',
  'Karla',
  'Luis',
  'Marta',
];

describe('ListGroup tiles with maxHeight', () => {
  it('scrolls one named list of tiles inside one named region', () => {
    render(
      <>
        <h2 id="keepers">Who is on the boardwalk?</h2>
        <ListGroup
          aria-labelledby="keepers"
          maxHeight={{ rows: 4 }}
          size="lg"
          variant="tiles"
        >
          {keepers.map((name) => (
            <ListRow key={name} onPress={() => undefined} title={name} />
          ))}
        </ListGroup>
      </>,
    );
    const scroll = screen.getByRole('group', {
      name: 'Who is on the boardwalk?',
    });
    expect(scroll.className).toContain('sw-list-group-scroll');
    expect(scroll.getAttribute('tabindex')).toBe('0');
    expect(scroll.style.getPropertyValue('--sw-list-max-rows')).toBe('4');
    expect(scroll.parentElement?.className).toContain('sw-list-group-tiles');
    const list = within(scroll).getByRole('list', {
      name: 'Who is on the boardwalk?',
    });
    expect(within(list).getAllByRole('listitem')).toHaveLength(13);
    // The tiles keep the reading order: the DOM order, row by row.
    expect(
      within(list)
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual(keepers);
  });

  it('counts rows of tiles: two hairlines each and the gap between them', () => {
    expect(css).toContain(`${region} {
  max-height: calc(var(--sw-list-max-rows) * (2 * var(--sw-space-3) + 20px + 18px + 2px) + (var(--sw-list-max-rows) - 1) * var(--sw-space-3));
  scroll-padding-block: max(0px, min(var(--sw-space-5), calc((100% - (2 * var(--sw-space-3) + 20px + 18px + 2px)) / 2)));
}`);
    // The focus margin is the shade's depth, clamped so a region one row
    // tall keeps none: (64 px − 64 px) / 2 is 0, never a negative margin.
    // It outranks the bounded list's own height, which it replaces.
    expect(css).toContain(
      '.sw-list-group-scroll {\n  max-height: calc(var(--sw-list-max-rows) * (2 * var(--sw-space-3) + 20px + 18px + 1px));',
    );
  });

  it('draws the shade over the tiles, stuck to the edge with more past it', () => {
    expect(css).toContain(`${region}::before,
${region}::after {
  content: '';
  display: block;
  height: var(--sw-space-5);
  pointer-events: none;
  position: sticky;
  z-index: ${stackingOrder.stickyCell};
}`);
    expect(css).toContain(`${region}::before {
  margin-block-end: calc(-1 * var(--sw-space-5));
  top: 0;
}`);
    expect(css).toContain(`${region}::after {
  bottom: 0;
  margin-block-start: calc(-1 * var(--sw-space-5));
}`);
    expect(css).toMatch(
      /\.sw-list-group-tiles > \.sw-list-group-scroll\.sw-scroll-more-top::before \{ background-image: linear-gradient\(to bottom,/,
    );
    expect(css).toMatch(
      /\.sw-list-group-tiles > \.sw-list-group-scroll\.sw-scroll-more-bottom::after \{ background-image: linear-gradient\(to top,/,
    );
    // No shade under the opaque tiles, where it would not show.
    expect(css).not.toMatch(
      /(^|\n)\.sw-list-group-scroll\.sw-scroll-more-(top|bottom)/,
    );
  });

  it('draws no shade in forced colours and every tile in print', () => {
    expect(css).toContain(`@media (forced-colors: active) {
  ${region}::before,
  ${region}::after { display: none; }
}`);
    expect(css).toContain(`@media print {
  ${region} { max-height: none; }
}`);
  });
});
