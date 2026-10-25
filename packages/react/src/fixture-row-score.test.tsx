import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FixtureGroup } from './components/FixtureGroup.js';
import {
  FixtureRow,
  type FixtureRowProps,
  type FixtureScore,
} from './components/FixtureRow.js';
import { scoreDigits } from './components/fixture/score-digits.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const herons = { name: 'Heron Marsh' };
const otters = { name: 'Otter Pool' };

function makeScore(over: Partial<FixtureScore> = {}): FixtureScore {
  return {
    label: 'Count, Heron Marsh v Otter Pool',
    home: { value: '', label: 'Heron Marsh' },
    away: { value: '', label: 'Otter Pool' },
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    ...over,
  };
}

function renderRow(props: Partial<FixtureRowProps> = {}) {
  return render(
    <FixtureGroup title="Sunday 25 October · North meadow">
      <FixtureRow away={otters} home={herons} {...props} />
    </FixtureGroup>,
  );
}

function boxes() {
  const group = screen.getByRole('group', {
    name: 'Count, Heron Marsh v Otter Pool',
  });
  return {
    group,
    home: within(group).getByRole('textbox', { name: 'Heron Marsh' }),
    away: within(group).getByRole('textbox', { name: 'Otter Pool' }),
  };
}

describe('scoreDigits', () => {
  it.each([
    ['', ''],
    ['3', '3'],
    ['12', '12'],
    ['123', '12'],
    ['1a', '1'],
    [' 4 ', '4'],
    ['-2', '2'],
    ['３', ''],
  ])('keeps the digits of %j as %j', (typed, kept) => {
    expect(scoreDigits(typed)).toBe(kept);
  });
});

describe('FixtureRow score', () => {
  it('draws two named numeric boxes in a named group between the sides', () => {
    renderRow({
      score: makeScore({
        home: { value: '2', label: 'Heron Marsh' },
        away: { value: '1', label: 'Otter Pool' },
      }),
    });
    const { group, home, away } = boxes();
    expect(group.className).toBe('sw-fixture-center sw-fixture-score');
    for (const box of [home, away]) {
      expect(box.getAttribute('type')).toBe('text');
      expect(box.getAttribute('inputmode')).toBe('numeric');
      expect(box.getAttribute('pattern')).toBe('[0-9]*');
      expect(box.getAttribute('maxlength')).toBe('2');
      expect(box.getAttribute('autocomplete')).toBe('off');
      expect(box.className).toBe('sw-fixture-score-box');
      expect(box.getAttribute('aria-invalid')).toBeNull();
      expect(box.getAttribute('aria-describedby')).toBeNull();
    }
    expect((home as HTMLInputElement).value).toBe('2');
    expect((away as HTMLInputElement).value).toBe('1');
    // Home side, home box, dash (hidden), away box, away side, in order.
    const row = group.parentElement!;
    const order = [...row.children].map((child) => child.className);
    expect(order).toEqual([
      'sw-fixture-team sw-fixture-team-home',
      'sw-fixture-center sw-fixture-score',
      'sw-fixture-team sw-fixture-team-away',
    ]);
    expect(
      group
        .querySelector('.sw-fixture-score-dash')!
        .getAttribute('aria-hidden'),
    ).toBe('true');
    expect(row.tagName).toBe('DIV');
    expect(screen.queryByText('8:00')).toBeNull();
  });

  it('hands digits only to onChange, by side, and skips a change that keeps none', () => {
    const score = makeScore({ home: { value: '1', label: 'Heron Marsh' } });
    renderRow({ score });
    const { home, away } = boxes();
    fireEvent.change(away, { target: { value: '3' } });
    expect(score.onChange).toHaveBeenLastCalledWith('away', '3');
    fireEvent.change(home, { target: { value: '1x' } });
    // "1x" keeps "1", the value already there: nothing changed.
    expect(score.onChange).toHaveBeenCalledTimes(1);
    fireEvent.change(home, { target: { value: '12' } });
    expect(score.onChange).toHaveBeenLastCalledWith('home', '12');
    fireEvent.change(home, { target: { value: '' } });
    expect(score.onChange).toHaveBeenLastCalledWith('home', '');
  });

  it('records on Enter and puts back on Escape in either box', () => {
    const onCancel = vi.fn();
    const score = makeScore({ onCancel });
    renderRow({ score });
    const { home, away } = boxes();
    const enter = fireEvent.keyDown(home, { key: 'Enter' });
    expect(enter).toBe(false);
    expect(score.onSubmit).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(away, { key: 'Enter' });
    expect(score.onSubmit).toHaveBeenCalledTimes(2);
    expect(fireEvent.keyDown(away, { key: 'Escape' })).toBe(false);
    expect(onCancel).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(home, { key: 'Tab' });
    expect(score.onSubmit).toHaveBeenCalledTimes(2);
  });

  it('leaves Escape alone without onCancel, and Enter that ends a composition', () => {
    const score = makeScore();
    renderRow({ score });
    const { home } = boxes();
    expect(fireEvent.keyDown(home, { key: 'Escape' })).toBe(true);
    fireEvent.keyDown(home, { key: 'Enter', isComposing: true });
    expect(score.onSubmit).not.toHaveBeenCalled();
  });

  it('selects a box’s digits on focus, so a typed score replaces them', () => {
    renderRow({
      score: makeScore({ home: { value: '12', label: 'Heron Marsh' } }),
    });
    const home = boxes().home as HTMLInputElement;
    fireEvent.focus(home);
    expect(home.selectionStart).toBe(0);
    expect(home.selectionEnd).toBe(2);
  });

  it('passes each box its ref', () => {
    const homeRef = createRef<HTMLInputElement>();
    const awayRef = createRef<HTMLInputElement>();
    renderRow({
      score: makeScore({
        home: { value: '', label: 'Heron Marsh', ref: homeRef },
        away: { value: '', label: 'Otter Pool', ref: awayRef },
      }),
    });
    expect(homeRef.current).toBe(boxes().home);
    expect(awayRef.current).toBe(boxes().away);
  });

  it('locks both boxes while disabled', () => {
    renderRow({ score: makeScore({ disabled: true }) });
    const { home, away } = boxes();
    expect((home as HTMLInputElement).disabled).toBe(true);
    expect((away as HTMLInputElement).disabled).toBe(true);
  });

  it('says an error politely under the row, marking and describing the boxes', () => {
    const { rerender } = renderRow({ score: makeScore() });
    const item = screen.getByRole('listitem');
    const region = item.querySelector('.sw-fixture-score-error')!;
    // The live region is there, empty, before any error.
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');
    expect(item.className).toBe('sw-fixture-item sw-fixture-item-below');

    rerender(
      <FixtureGroup title="Sunday 25 October · North meadow">
        <FixtureRow
          away={otters}
          home={herons}
          score={makeScore({
            error: 'Type both counts.',
            home: { value: '3', label: 'Heron Marsh', invalid: false },
          })}
        />
      </FixtureGroup>,
    );
    expect(region.textContent).toBe('Type both counts.');
    const { home, away } = boxes();
    expect(home.getAttribute('aria-invalid')).toBeNull();
    expect(away.getAttribute('aria-invalid')).toBe('true');
    for (const box of [home, away])
      expect(box.getAttribute('aria-describedby')).toBe(region.id);
    // The region follows the row, outside it.
    expect(region.previousElementSibling!.className).toContain(
      'sw-fixture-row',
    );
  });

  it('marks a box invalid without an error, and treats an empty error as none', () => {
    renderRow({
      score: makeScore({
        error: '',
        home: { value: '', label: 'Heron Marsh', invalid: true },
      }),
    });
    const { home, away } = boxes();
    expect(home.getAttribute('aria-invalid')).toBe('true');
    expect(away.getAttribute('aria-invalid')).toBeNull();
    expect(home.getAttribute('aria-describedby')).toBeNull();
  });

  it('works with a flag, a select and an action, in order on one item', () => {
    const onCheckedChange = vi.fn();
    renderRow({
      action: <button type="button">Record</button>,
      flag: { label: 'Counts differ' },
      score: makeScore(),
      select: {
        checked: false,
        label: 'Select Heron Marsh vs Otter Pool',
        onCheckedChange,
      },
    });
    const item = screen.getByRole('listitem');
    // Tab order: the select, the home box, the away box, the action.
    const controls = [...item.querySelectorAll('input, button')];
    expect(controls).toEqual([
      screen.getByRole('checkbox', {
        name: 'Select Heron Marsh vs Otter Pool',
      }),
      boxes().home,
      boxes().away,
      screen.getByRole('button', { name: 'Record' }),
    ]);
    expect(item.querySelector('.sw-fixture-flag')).not.toBeNull();
    expect(item.className).toBe(
      'sw-fixture-item sw-fixture-item-select sw-fixture-item-action sw-fixture-item-below',
    );
  });

  it.each<[string, Partial<FixtureRowProps>, string]>([
    ['neither centre nor score', {}, 'FixtureRow center must be nonempty'],
    [
      'both a centre and a score',
      { center: '8:00', score: makeScore() },
      'FixtureRow takes a center or a score, not both',
    ],
    [
      'a centre kind with a score',
      { centerKind: 'score', score: makeScore() },
      'FixtureRow centerKind styles center: leave it out with score',
    ],
    [
      'a score on a link row',
      { href: '/counts/1', score: makeScore() },
      'FixtureRow score boxes are their own controls: leave out href and onPress',
    ],
    [
      'a score on a button row',
      { onPress: () => undefined, score: makeScore() },
      'FixtureRow score boxes are their own controls: leave out href and onPress',
    ],
  ])('refuses %s', (_, props, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderRow(props)).toThrow(new RangeError(message));
  });

  const scoreMessage =
    'FixtureRow score needs a label, home and away boxes (value and label), onChange and onSubmit';
  it.each<[string, Partial<FixtureScore>]>([
    ['a blank group label', { label: ' ' }],
    ['a box without a label', { home: { value: '', label: '' } }],
    [
      'a box without a string value',
      { away: { value: 2 as unknown as string, label: 'Otter Pool' } },
    ],
    [
      'a non-boolean invalid',
      {
        away: {
          value: '',
          label: 'Otter Pool',
          invalid: 'yes' as unknown as boolean,
        },
      },
    ],
    ['no onChange', { onChange: undefined as unknown as () => void }],
    ['no onSubmit', { onSubmit: undefined as unknown as () => void }],
    [
      'an onCancel that is no function',
      { onCancel: 'x' as unknown as () => void },
    ],
    ['an error that is no string', { error: 1 as unknown as string }],
  ])('refuses a score with %s', (_, over) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderRow({ score: makeScore(over) })).toThrow(
      new RangeError(scoreMessage),
    );
  });
});

describe('FixtureRow detail', () => {
  it('draws a part under the row, in its item, outside its button', () => {
    const onPress = vi.fn();
    renderRow({
      center: '8:00',
      detail: <input aria-label="Reason" />,
      onPress,
    });
    const item = screen.getByRole('listitem');
    const reason = screen.getByRole('textbox', { name: 'Reason' });
    const detail = reason.parentElement!;
    expect(detail.className).toBe('sw-fixture-detail');
    expect(detail.parentElement).toBe(item);
    const row = screen.getByRole('button');
    expect(row.contains(reason)).toBe(false);
    expect(row.nextElementSibling).toBe(detail);
    fireEvent.click(reason);
    expect(onPress).not.toHaveBeenCalled();
    expect(item.className).toBe('sw-fixture-item sw-fixture-item-below');
  });

  it('follows a score’s message, comes before the action, and draws nothing for an empty slot', () => {
    const { rerender } = renderRow({
      action: <button type="button">Record</button>,
      detail: <span>Why the count changed</span>,
      score: makeScore({ error: 'Type both counts.' }),
    });
    const item = screen.getByRole('listitem');
    expect([...item.children].map((child) => child.className)).toEqual([
      'sw-fixture-row',
      'sw-fixture-score-error',
      'sw-fixture-detail',
      // Last in the Tab order, after a reason field in the detail.
      'sw-fixture-action',
    ]);
    rerender(
      <FixtureGroup title="Sunday 25 October · North meadow">
        <FixtureRow away={otters} center="8:00" detail={null} home={herons} />
      </FixtureGroup>,
    );
    expect(item.querySelector('.sw-fixture-detail')).toBeNull();
    expect(item.className).toBe('sw-fixture-item');
  });
});
