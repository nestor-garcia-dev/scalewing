import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ListGroup } from './components/ListGroup.js';
import { ListRow } from './components/ListRow.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import {
  assertListGroup,
  assertListRow,
  listRowAccessory,
} from './list-options.js';

afterEach(() => cleanup());

describe('ListGroup', () => {
  it('is a named list of rows with its role kept, a panel by default', () => {
    render(
      <ListGroup aria-label="Station">
        <ListRow title="Region" value="Pantanal" />
        <ListRow
          detail="Shared with the field teams"
          title="Observers"
          value="12"
        />
      </ListGroup>,
    );
    const list = screen.getByRole('list', { name: 'Station' });
    expect(list.className).toBe('sw-list');
    expect(list.getAttribute('role')).toBe('list');
    expect(list.parentElement?.className).toBe(
      'sw-list-group sw-list-group-panel',
    );
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]?.className).toBe('sw-list-item');
    // A read-only row is text in reading order, no control and no chevron.
    expect(items[1]?.textContent).toBe(
      'ObserversShared with the field teams12',
    );
    expect(within(list).queryByRole('button')).toBeNull();
    expect(list.querySelector('.sw-list-row-chevron')).toBeNull();
  });

  it('is plain inside a surface, with a class and id on its box and a ref', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <ListGroup
        aria-labelledby="heading"
        className="extra"
        id="smooth"
        ref={ref}
        variant="plain"
      >
        <ListRow title="No traps left open." titleAppearance="plain" />
      </ListGroup>,
    );
    expect(ref.current?.id).toBe('smooth');
    expect(ref.current?.className).toBe(
      'sw-list-group sw-list-group-plain extra',
    );
    expect(screen.getByRole('list').getAttribute('aria-labelledby')).toBe(
      'heading',
    );
    expect(screen.getByText('No traps left open.').className).toBe(
      'sw-list-row-title sw-list-row-title-plain',
    );
  });

  it('bounds its rows to a named, focusable scroll region and pins its footer', () => {
    render(
      <ListGroup
        aria-label="Night counts"
        footer={<ListRow title="8 nights" value="0" />}
        maxHeight={{ rows: 4 }}
      >
        <ListRow title="Tue, Oct 6" value="+2" />
      </ListGroup>,
    );
    const region = screen.getByRole('group', { name: 'Night counts' });
    expect(region.className).toContain('sw-list-group-scroll');
    expect(region.getAttribute('tabindex')).toBe('0');
    expect(region.style.getPropertyValue('--sw-list-max-rows')).toBe('4');
    expect(
      within(region).getByRole('list', { name: 'Night counts' }),
    ).toBeTruthy();
    // The footer's row is outside the list and its scroll, and is no list item.
    const footer = region.nextElementSibling;
    expect(footer?.className).toBe('sw-list-group-footer');
    expect(footer?.firstElementChild?.tagName).toBe('DIV');
    expect(within(footer as HTMLElement).getByText('8 nights')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('keeps a footer row out of any list, inside a row of another list too', () => {
    render(
      <ListGroup aria-label="Outer">
        <li>
          <ListGroup
            aria-label="Inner"
            footer={<ListRow title="Total" value="3" />}
          >
            <ListRow title="One" />
          </ListGroup>
        </li>
      </ListGroup>,
    );
    const footer = document.querySelector('.sw-list-group-footer');
    expect(footer?.firstElementChild?.tagName).toBe('DIV');
  });

  it('refuses a variant, a row count or an unnamed bounded list it cannot draw', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<ListGroup variant={'card' as never}>{null}</ListGroup>),
    ).toThrow('Unknown ListGroup variant: card');
    for (const rows of [0, 2.5, '3'])
      expect(() =>
        render(
          <ListGroup aria-label="Nights" maxHeight={{ rows } as never}>
            {null}
          </ListGroup>,
        ),
      ).toThrow(
        'ListGroup maxHeight must be { rows } with a whole number from 1',
      );
    expect(() =>
      render(<ListGroup maxHeight={{ rows: 3 }}>{null}</ListGroup>),
    ).toThrow('A ListGroup with maxHeight needs aria-label or aria-labelledby');
  });
});

describe('ListRow', () => {
  it('is a whole-row button named by its title and value, described by its details', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <ListGroup aria-label="Nights">
        <ListRow
          detail="Counted 135 · expected 141"
          leading={<svg data-testid="dot" />}
          onPress={onPress}
          title="Wed, Oct 7 · North marsh"
          value="−6"
          valueDetail="herons"
          valueTone="danger"
        />
      </ListGroup>,
    );
    const row = screen.getByRole('button', {
      name: 'Wed, Oct 7 · North marsh −6',
    });
    expect(row).toHaveProperty('type', 'button');
    expect(row.getAttribute('tabindex')).toBe('0');
    expect(row.className).toBe('sw-list-row sw-list-row-pressable');
    expect(row.hasAttribute('aria-pressed')).toBe(false);
    const description = (row.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent);
    expect(description).toEqual(['Counted 135 · expected 141', 'herons']);
    expect(
      screen.getByTestId('dot').parentElement?.getAttribute('aria-hidden'),
    ).toBe('true');
    expect(screen.getByText('−6').className).toBe(
      'sw-list-row-value sw-list-row-value-danger',
    );
    expect(
      row.querySelector('.sw-list-row-chevron')?.getAttribute('aria-hidden'),
    ).toBe('true');
    await user.click(screen.getByText('herons'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is a whole-row link, taking a plain press for a client router', () => {
    const onPress = vi.fn();
    render(
      <ListGroup aria-label="Worth a look">
        <ListRow
          href="/nights/2026-10-07"
          onPress={onPress}
          title="North marsh"
        />
        <ListRow href="/traps" title="Camera traps" />
      </ListGroup>,
    );
    const link = screen.getByRole('link', { name: 'North marsh' });
    expect(link.getAttribute('href')).toBe('/nights/2026-10-07');
    expect(link.getAttribute('tabindex')).toBe('0');
    expect(fireEvent.click(link)).toBe(false);
    expect(onPress).toHaveBeenCalledTimes(1);
    // A press with a modifier opens the link as the browser does.
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(onPress).toHaveBeenCalledTimes(1);
    const plain = screen.getByRole('link', { name: 'Camera traps' });
    expect(plain.onclick).toBeNull();
    expect(plain.querySelector('.sw-list-row-chevron')).toBeTruthy();
  });

  it('is a choice with a check and its state when selected', () => {
    render(
      <ListGroup aria-label="Habitat">
        <ListRow onPress={() => undefined} selected title="Wetland" />
        <ListRow onPress={() => undefined} selected={false} title="Forest" />
        <ListRow href="/savanna" selected title="Savanna" />
      </ListGroup>,
    );
    const wetland = screen.getByRole('button', { name: 'Wetland' });
    expect(wetland.getAttribute('aria-pressed')).toBe('true');
    expect(wetland.querySelector('.sw-list-row-check')).toBeTruthy();
    const forest = screen.getByRole('button', { name: 'Forest' });
    expect(forest.getAttribute('aria-pressed')).toBe('false');
    expect(
      forest.querySelector('[aria-hidden]:not(.sw-list-row-leading)'),
    ).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'Savanna' })
        .getAttribute('aria-current'),
    ).toBe('true');
  });

  it('dims and blocks a disabled row, hides the chevron with accessory none, and tones the title', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <ListGroup aria-label="Station">
        <ListRow disabled onPress={onPress} title="Export the season" />
        <ListRow disabled href="/archive" title="Archive" />
        <ListRow
          accessory="none"
          onPress={onPress}
          title="Leave the survey"
          tone="danger"
        />
        <ListRow
          aria-label="Leave, ends your session"
          onPress={onPress}
          title="Leave"
          value="now"
        />
      </ListGroup>,
    );
    const exportRow = screen.getByRole('button', { name: 'Export the season' });
    expect(exportRow).toHaveProperty('disabled', true);
    expect(exportRow.className).toContain('sw-list-row-disabled');
    await user.click(exportRow);
    expect(onPress).not.toHaveBeenCalled();
    const archive = screen.getByRole('link', { name: 'Archive' });
    expect(archive.hasAttribute('href')).toBe(false);
    // No href and no tabindex: the disabled link is no tab stop.
    expect(archive.hasAttribute('tabindex')).toBe(false);
    expect(archive.getAttribute('aria-disabled')).toBe('true');
    const leave = screen.getByRole('button', { name: 'Leave the survey' });
    expect(leave.querySelector('.sw-list-row-chevron')).toBeNull();
    expect(screen.getByText('Leave the survey').className).toContain(
      'sw-list-row-title-danger',
    );
    const named = screen.getByRole('button', {
      name: 'Leave, ends your session',
    });
    expect(named.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('refuses a row it cannot draw', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const base = {
      title: 'Row',
      tone: 'default',
      titleAppearance: 'strong',
      valueTone: undefined,
      accessory: 'chevron',
      value: undefined,
      valueDetail: undefined,
      valueBadge: undefined,
      selected: undefined,
      pressable: false,
    } as const;
    expect(() => assertListRow({ ...base, title: ' ' })).toThrow(
      'ListRow title must be non-empty text',
    );
    expect(() => assertListRow({ ...base, tone: 'warning' })).toThrow(
      'Unknown ListRow tone: warning',
    );
    expect(() => assertListRow({ ...base, titleAppearance: 'bold' })).toThrow(
      'Unknown ListRow titleAppearance: bold',
    );
    expect(() =>
      assertListRow({ ...base, value: '1', valueTone: 'amber' }),
    ).toThrow('Unknown ListRow valueTone: amber');
    expect(() => assertListRow({ ...base, accessory: 'check' })).toThrow(
      'Unknown ListRow accessory: check',
    );
    expect(() => assertListRow({ ...base, value: ' ' })).toThrow(
      'ListRow value must be non-empty text',
    );
    expect(() => assertListRow({ ...base, selected: true })).toThrow(
      'A ListRow choice (selected) needs onPress or href to say its state',
    );
    expect(() =>
      assertListRow({ ...base, selected: false, pressable: true }),
    ).not.toThrow();
    expect(() => assertListRow({ ...base, valueDetail: 'herons' })).toThrow(
      'ListRow valueDetail, valueTone and valueBadge need a value',
    );
    expect(() =>
      assertListGroup({
        label: 'x',
        labelledBy: undefined,
        variant: 'plain',
        maxHeight: { rows: 1 },
      }),
    ).not.toThrow();
    expect(() => render(<ListRow title="" />)).toThrow(
      'ListRow title must be non-empty text',
    );
  });

  it('ends a row with a check, a chevron or nothing', () => {
    expect(
      listRowAccessory({
        pressable: true,
        selected: undefined,
        accessory: 'chevron',
      }),
    ).toBe('chevron');
    expect(
      listRowAccessory({
        pressable: true,
        selected: undefined,
        accessory: 'none',
      }),
    ).toBe('none');
    expect(
      listRowAccessory({
        pressable: false,
        selected: undefined,
        accessory: 'chevron',
      }),
    ).toBe('none');
    expect(
      listRowAccessory({
        pressable: true,
        selected: true,
        accessory: 'chevron',
      }),
    ).toBe('check');
    expect(
      listRowAccessory({
        pressable: false,
        selected: false,
        accessory: 'chevron',
      }),
    ).toBe('none');
  });
});

describe('ListGroup CSS', () => {
  const css = generateStylesheet();

  it('catalogs its classes', () => {
    const catalog = utilityClassCatalog();
    for (const name of [
      'sw-list',
      'sw-list-item',
      'sw-list-group-panel',
      'sw-list-group-plain',
      'sw-list-group-scroll',
      'sw-list-group-footer',
      'sw-list-row-pressable',
      'sw-list-row-value-success',
      'sw-list-row-chevron',
      'sw-list-row-check',
    ])
      expect(catalog).toContain(name);
  });

  it('draws hairlines between rows, above a plain list and over its footer', () => {
    expect(css).toContain(
      '.sw-list > .sw-list-item + .sw-list-item,\n.sw-list-group-plain .sw-list > .sw-list-item:first-child,\n.sw-list-group-footer {\n  border-top: 1px solid var(--sw-color-border);\n}',
    );
    expect(css).toContain(
      '.sw-list-group-plain .sw-list-row { padding-inline: 0; }',
    );
  });

  it('bounds a list to its rows of a title and one detail line', () => {
    expect(css).toContain(
      'max-height: calc(var(--sw-list-max-rows) * (2 * var(--sw-space-3) + 20px + 18px + 1px));',
    );
    expect(css).toMatch(
      /\.sw-list-group-scroll\.sw-scroll-more-bottom \{\n {2}background-image: linear-gradient\(to top,/,
    );
    expect(css).toContain(
      '@media print {\n  .sw-list-group-scroll { max-height: none; }',
    );
  });

  it('keeps link rows in the text colour with an inset ring, 44 px on touch', () => {
    expect(css).toContain(
      '[data-theme] a.sw-list-row,\n[data-theme] a.sw-list-row:hover {\n  color: var(--sw-color-text);',
    );
    expect(css).toContain(
      '[data-theme] a.sw-list-row:focus-visible {\n  outline-offset: calc(-1 * var(--sw-focus-ring-width));',
    );
    expect(css).toContain(
      '.sw-list-row-pressable { min-height: var(--sw-control-md-min-height); }',
    );
    expect(css).toContain(
      '.sw-list-row-value-danger { color: var(--sw-color-danger); }',
    );
  });
});
