import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FixtureGroup } from './components/FixtureGroup.js';
import { FixtureRow, type FixtureRowProps } from './components/FixtureRow.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const herons = { name: 'Heron Marsh', mark: <svg data-mark="heron" /> };
const otters = { name: 'Otter Pool', mark: <svg data-mark="otter" /> };

function renderRow(props: Partial<FixtureRowProps> = {}) {
  return render(
    <FixtureGroup title="Sunday 25 October · North meadow">
      <FixtureRow away={otters} center="8:00" home={herons} {...props} />
    </FixtureGroup>,
  );
}

describe('FixtureGroup', () => {
  it('is a list named by its caption, holding its rows', () => {
    render(
      <FixtureGroup title="Sunday 25 October · North meadow">
        <FixtureRow away={otters} center="8:00" home={herons} />
        <FixtureRow away={herons} center="9:15" home={otters} />
      </FixtureGroup>,
    );
    const list = screen.getByRole('list', {
      name: 'Sunday 25 October · North meadow',
    });
    expect(list.className).toBe('sw-fixture-list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('refuses a blank title, and a row outside a group', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<FixtureGroup title=" ">{null}</FixtureGroup>)).toThrow(
      new RangeError('FixtureGroup title must be nonempty'),
    );
    expect(() =>
      render(<FixtureRow away={otters} center="8:00" home={herons} />),
    ).toThrow(new RangeError('A FixtureRow lives in a FixtureGroup'));
  });
});

describe('FixtureRow', () => {
  it('lays out home, centre and away, the marks on the centre side and hidden', () => {
    renderRow({
      meta: 'Field 1',
      status: { label: 'To confirm', tone: 'warning' },
    });
    const row = screen.getByRole('listitem').firstElementChild as HTMLElement;
    expect(row.tagName).toBe('DIV');
    expect(row.className).toBe('sw-fixture-row');
    const [home, center, away, end] = Array.from(row.children) as HTMLElement[];
    expect(home?.className).toBe('sw-fixture-team sw-fixture-team-home');
    expect(home?.lastElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(home?.firstElementChild?.textContent).toBe('Heron Marsh');
    expect(center?.className).toBe('sw-fixture-center sw-fixture-center-time');
    expect(center?.textContent).toBe('8:00');
    expect(away?.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(away?.lastElementChild?.textContent).toBe('Otter Pool');
    expect(end?.className).toBe('sw-fixture-end');
    expect(end?.textContent).toBe('Field 1 To confirm');
    expect(row.querySelector('.sw-fixture-chevron')).toBeNull();
    expect(row.textContent).toBe(
      'Heron Marsh 8:00 Otter Pool Field 1 To confirm',
    );
  });

  it('draws a score and hides the meta below a breakpoint', () => {
    renderRow({
      center: '2–1',
      centerKind: 'score',
      meta: 'Field 2',
      metaHideBelow: 'md',
    });
    expect(screen.getByText('2–1').className).toBe(
      'sw-fixture-center sw-fixture-center-score',
    );
    expect(screen.getByText('Field 2').className).toBe(
      'sw-fixture-meta sw-hide-below-md',
    );
  });

  it('is a link with a chevron, named by aria-label when given', () => {
    renderRow({
      href: '/games/1',
      'aria-label': 'Heron Marsh against Otter Pool, 8:00',
    });
    const link = screen.getByRole('link', {
      name: 'Heron Marsh against Otter Pool, 8:00',
    });
    expect(link.getAttribute('href')).toBe('/games/1');
    expect(link.getAttribute('tabindex')).toBe('0');
    expect(link.className).toBe('sw-fixture-row sw-fixture-row-pressable');
    expect(
      link.querySelector('.sw-fixture-chevron')?.getAttribute('aria-hidden'),
    ).toBe('true');
  });

  it('hands a plain press on a link to onPress, and leaves a modifier press alone', () => {
    const onPress = vi.fn();
    renderRow({ href: '/games/1', onPress });
    const link = screen.getByRole('link');
    expect(fireEvent.click(link)).toBe(false);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is a plain link without onPress, the browser navigating', () => {
    renderRow({ href: '/games/1' });
    const link = screen.getByRole('link');
    expect(fireEvent.click(link)).toBe(true);
  });

  it('leaves modifier and middle presses on a link to the browser', () => {
    const onPress = vi.fn();
    renderRow({ href: '/games/1', onPress });
    const link = screen.getByRole('link');
    for (const init of [
      { ctrlKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
    ])
      expect(fireEvent.click(link, init)).toBe(true);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reads the meta and the status in a link row’s name', () => {
    renderRow({
      href: '/games/1',
      meta: 'Hide 1',
      status: { label: 'Final', tone: 'neutral' },
    });
    expect(
      screen.getByRole('link', {
        name: /^Heron Marsh ?8:00 ?Otter Pool ?Hide 1 ?Final$/,
      }),
    ).toBeTruthy();
  });

  it('draws no end without meta or status', () => {
    renderRow({ meta: null });
    expect(document.querySelector('.sw-fixture-end')).toBeNull();
  });

  it('is a button with onPress alone, named by what it shows', () => {
    const onPress = vi.fn();
    renderRow({ onPress });
    const button = screen.getByRole('button', {
      name: /^Heron Marsh ?8:00 ?Otter Pool$/,
    });
    expect(button.getAttribute('type')).toBe('button');
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reads a flag first, draws its mark with a tooltip, amber by default', () => {
    const { container } = renderRow({
      flag: { label: "Can't-play clash" },
      meta: 'Field 1',
    });
    const item = screen.getByRole('listitem');
    expect(item.textContent).toBe(
      "Can't-play clash Heron Marsh 8:00 Otter Pool Field 1",
    );
    const flag = container.querySelector('.sw-fixture-flag')!;
    expect(flag.className).toBe('sw-fixture-flag sw-fixture-flag-warning');
    // The flag is the row's first item, before the home side.
    expect(flag.parentElement!.className).toBe(
      'sw-fixture-row sw-fixture-row-flagged',
    );
    expect(flag.parentElement!.firstElementChild).toBe(flag);
    expect(flag.nextElementSibling!.className).toContain(
      'sw-fixture-team-home',
    );
    const mark = flag.querySelector('.sw-fixture-flag-mark')!;
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    expect(mark.getAttribute('title')).toBe("Can't-play clash");
    expect(flag.querySelector('.sw-sr-only')!.textContent).toBe(
      "Can't-play clash",
    );
  });

  it('puts a flag before the name of a pressable row, and before its aria-label', () => {
    renderRow({ flag: { label: 'Clash', tone: 'danger' }, onPress: vi.fn() });
    expect(
      screen.getByRole('button', {
        name: /^Clash ?Heron Marsh ?8:00 ?Otter Pool$/,
      }),
    ).toBeTruthy();
    cleanup();
    renderRow({
      flag: { label: 'Clash' },
      href: '/g/1',
      'aria-label': 'Heron Marsh vs Otter Pool, 8:00',
    });
    expect(
      screen.getByRole('link', {
        name: 'Clash, Heron Marsh vs Otter Pool, 8:00',
      }),
    ).toBeTruthy();
  });

  it('draws an action after the row, outside its button, as its own control', () => {
    const onPress = vi.fn();
    const onMove = vi.fn();
    renderRow({
      action: (
        <button onClick={onMove} type="button">
          Move Heron Marsh vs Otter Pool
        </button>
      ),
      meta: 'Field 1',
      onPress,
    });
    const item = screen.getByRole('listitem');
    expect(item.className).toBe('sw-fixture-item sw-fixture-item-action');
    const row = screen.getByRole('button', { name: /^Heron Marsh/ });
    const move = screen.getByRole('button', {
      name: 'Move Heron Marsh vs Otter Pool',
    });
    expect(row.contains(move)).toBe(false);
    expect(move.parentElement!.className).toBe('sw-fixture-action');
    expect(move.parentElement!.parentElement).toBe(item);
    fireEvent.click(move);
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('draws an action beside a statement row, and nothing for an empty one', () => {
    const { container } = renderRow({
      action: <button type="button">Move</button>,
    });
    expect(
      container.querySelector('div.sw-fixture-row + .sw-fixture-action'),
    ).not.toBeNull();
    cleanup();
    const again = renderRow({ action: null });
    expect(again.container.querySelector('.sw-fixture-action')).toBeNull();
    expect(screen.getByRole('listitem').className).toBe('sw-fixture-item');
  });

  it('draws a named checkbox before the row, outside its link, toggling', () => {
    const onPress = vi.fn();
    const onCheckedChange = vi.fn();
    renderRow({
      href: '/games/1',
      onPress,
      select: {
        checked: false,
        label: 'Select Heron Marsh vs Otter Pool',
        onCheckedChange,
      },
    });
    const item = screen.getByRole('listitem');
    expect(item.className).toBe('sw-fixture-item sw-fixture-item-select');
    const box = screen.getByRole('checkbox', {
      name: 'Select Heron Marsh vs Otter Pool',
    });
    const link = screen.getByRole('link');
    expect(link.contains(box)).toBe(false);
    const select = item.firstElementChild as HTMLElement;
    expect(select.className).toBe('sw-fixture-select');
    expect(select.contains(box)).toBe(true);
    expect(select.nextElementSibling).toBe(link);
    expect(box.closest('label')!.className).toBe(
      'sw-checkbox-label sw-checkbox-label-hidden',
    );
    fireEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows the checked state and refuses a press while disabled', () => {
    const onCheckedChange = vi.fn();
    renderRow({
      select: {
        checked: true,
        disabled: true,
        label: 'Select Heron Marsh vs Otter Pool',
        onCheckedChange,
      },
    });
    const box = screen.getByRole<HTMLInputElement>('checkbox');
    expect(box.checked).toBe(true);
    expect(box.disabled).toBe(true);
    fireEvent.click(box);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('puts the select, the flagged row and the action in order on one item', () => {
    const onMove = vi.fn();
    renderRow({
      action: (
        <button onClick={onMove} type="button">
          Pick a time
        </button>
      ),
      flag: { label: 'Postponed' },
      onPress: vi.fn(),
      select: {
        checked: true,
        label: 'Select Heron Marsh vs Otter Pool',
        onCheckedChange: vi.fn(),
      },
    });
    const item = screen.getByRole('listitem');
    expect(item.className).toBe(
      'sw-fixture-item sw-fixture-item-select sw-fixture-item-action',
    );
    expect(
      Array.from(item.children).map((child) => child.className.split(' ')[0]),
    ).toEqual(['sw-fixture-select', 'sw-fixture-row', 'sw-fixture-action']);
    expect(
      screen.getByRole('button', { name: /^Postponed ?Heron Marsh/ }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Pick a time' }));
    expect(onMove).toHaveBeenCalledTimes(1);
  });

  it.each<[string, Partial<FixtureRowProps>, boolean]>([
    ['no meta or status', {}, true],
    ['meta hidden below md', { meta: 'Field 1', metaHideBelow: 'md' }, true],
    ['meta hidden below lg', { meta: 'Field 1', metaHideBelow: 'lg' }, true],
    ['meta shown', { meta: 'Field 1' }, false],
    [
      'a status',
      {
        meta: 'Field 1',
        metaHideBelow: 'md',
        status: { label: 'Moved', tone: 'warning' },
      },
      false,
    ],
  ])('keeps the flag inline below md with %s: %s', (_, props, inline) => {
    renderRow({ flag: { label: 'Clash' }, ...props });
    const row = screen.getByRole('listitem').firstElementChild!;
    expect(row.classList.contains('sw-fixture-row-flag-inline')).toBe(inline);
  });

  it('marks no inline flag on a row without a flag', () => {
    renderRow();
    expect(document.querySelector('.sw-fixture-row-flag-inline')).toBeNull();
  });

  it.each<[string, Partial<FixtureRowProps>, string]>([
    [
      'a home side without a name',
      { home: { name: ' ' } },
      'FixtureRow home and away need nonempty names',
    ],
    ['a blank centre', { center: '' }, 'FixtureRow center must be nonempty'],
    [
      'no home side',
      { home: undefined as never },
      'FixtureRow home and away need nonempty names',
    ],
    [
      'no away side',
      { away: undefined as never },
      'FixtureRow home and away need nonempty names',
    ],
    [
      'an unknown status tone',
      { status: { label: 'Final', tone: 'info' as never } },
      'FixtureRow status needs a label and one of neutral, accent, success, danger, warning',
    ],
    [
      'an unknown centre kind',
      { centerKind: 'clock' as never },
      'FixtureRow centerKind must be one of time, score',
    ],
    [
      'an unknown breakpoint',
      { metaHideBelow: 'xl' as never },
      'FixtureRow metaHideBelow must be one of md, lg',
    ],
    [
      'a status without words',
      { status: { label: '', tone: 'success' } },
      'FixtureRow status needs a label and one of neutral, accent, success, danger, warning',
    ],
    [
      'a flag without words',
      { flag: { label: ' ' } },
      'FixtureRow flag needs a label and one of warning, danger',
    ],
    [
      'an unknown flag tone',
      { flag: { label: 'Clash', tone: 'info' as never } },
      'FixtureRow flag needs a label and one of warning, danger',
    ],
    [
      'a select without a label',
      {
        select: { label: ' ', checked: false, onCheckedChange: () => {} },
      },
      'FixtureRow select needs a label, checked and onCheckedChange',
    ],
    [
      'a select without checked',
      {
        select: {
          label: 'Select',
          checked: undefined as never,
          onCheckedChange: () => {},
        },
      },
      'FixtureRow select needs a label, checked and onCheckedChange',
    ],
    [
      'a select without onCheckedChange',
      {
        select: {
          label: 'Select',
          checked: false,
          onCheckedChange: undefined as never,
        },
      },
      'FixtureRow select needs a label, checked and onCheckedChange',
    ],
    [
      'a blank address',
      { href: ' ' },
      'FixtureRow href must be nonempty when given',
    ],
    [
      'a blank aria-label',
      { href: '/g', 'aria-label': ' ' },
      'FixtureRow aria-label must be nonempty when given',
    ],
    [
      'an aria-label on a statement',
      { 'aria-label': 'Game' },
      'FixtureRow aria-label names a link or a button: give it href or onPress',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderRow(props)).toThrow(new RangeError(message));
  });
});
