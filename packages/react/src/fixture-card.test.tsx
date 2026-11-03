import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  FixtureCard,
  type FixtureCardProps,
} from './components/FixtureCard.js';
import { FixtureGroup } from './components/FixtureGroup.js';
import { FixtureRow, type FixtureScore } from './components/FixtureRow.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const groupName = 'Count, Heron Marsh v Otter Pool';

function makeScore(over: Partial<FixtureScore> = {}): FixtureScore {
  return {
    label: groupName,
    home: { value: '', label: 'Heron Marsh' },
    away: { value: '', label: 'Otter Pool' },
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    ...over,
  };
}

function props(over: Partial<FixtureCardProps> = {}): FixtureCardProps {
  return {
    home: { name: 'Heron Marsh' },
    away: { name: 'Otter Pool' },
    score: makeScore(),
    ...over,
  };
}

function boxes() {
  const group = screen.getByRole('group', { name: groupName });
  return {
    group,
    home: within(group).getByRole('textbox', { name: 'Heron Marsh' }),
    away: within(group).getByRole('textbox', { name: 'Otter Pool' }),
  };
}

describe('FixtureCard', () => {
  it('is a group named by the score, with one numeric box per side', () => {
    render(<FixtureCard {...props()} />);
    const { group, home, away } = boxes();
    expect(group.className).toBe('sw-fixture-card');
    for (const box of [home, away]) {
      expect(box.className).toBe('sw-fixture-score-box');
      expect(box.getAttribute('inputmode')).toBe('numeric');
      expect(box.getAttribute('maxlength')).toBe('2');
    }
  });

  it('needs no FixtureGroup around it', () => {
    expect(() => render(<FixtureCard {...props()} />)).not.toThrow();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('draws each side as its name and note, then its box at the end', () => {
    render(
      <FixtureCard
        {...props({
          home: { name: 'Heron Marsh', note: 'Nesting' },
          away: { name: 'Otter Pool', note: <strong>Second count</strong> },
        })}
      />,
    );
    const { group, home, away } = boxes();
    const rows = [...group.querySelectorAll('.sw-fixture-card-side')];
    expect(rows).toHaveLength(2);
    expect(rows[0]!.textContent).toBe('Heron MarshNesting');
    expect(rows[0]!.lastElementChild).toBe(home);
    expect(rows[1]!.textContent).toBe('Otter PoolSecond count');
    expect(rows[1]!.lastElementChild).toBe(away);
    expect(
      rows[0]!.querySelector('.sw-fixture-card-name + .sw-fixture-card-note')
        ?.textContent,
    ).toBe('Nesting');
  });

  it('omits every slot it is not given, leaving the live region', () => {
    render(<FixtureCard {...props()} />);
    const { group } = boxes();
    expect(group.querySelector('.sw-fixture-card-top')).toBeNull();
    expect(group.querySelector('.sw-fixture-card-note')).toBeNull();
    expect(group.querySelector('.sw-fixture-card-actions')).toBeNull();
    expect(group.querySelector('.sw-fixture-card-detail')).toBeNull();
    expect([...group.children].map((part) => part.className)).toEqual([
      'sw-fixture-card-side',
      'sw-fixture-card-side',
      'sw-fixture-card-error',
    ]);
  });

  it('treats false, null and an empty string as an empty slot', () => {
    render(
      <FixtureCard
        {...props({
          home: { name: 'Heron Marsh', note: false },
          actions: null,
          detail: '',
          menu: false,
          meta: '',
        })}
      />,
    );
    expect(boxes().group.children).toHaveLength(3);
  });

  it('puts the slots in order: top line, sides, error, actions, detail', () => {
    render(
      <FixtureCard
        {...props({
          actions: <button type="button">Record</button>,
          detail: 'Saved',
          menu: <button type="button">More</button>,
          meta: 'Sunday 25 October',
        })}
      />,
    );
    const { group } = boxes();
    expect([...group.children].map((part) => part.className)).toEqual([
      'sw-fixture-card-top',
      'sw-fixture-card-side',
      'sw-fixture-card-side',
      'sw-fixture-card-error',
      'sw-fixture-card-actions',
      'sw-fixture-card-detail',
    ]);
    const top = group.querySelector('.sw-fixture-card-top')!;
    expect([...top.children].map((part) => part.className)).toEqual([
      'sw-fixture-card-meta',
      'sw-fixture-card-menu',
    ]);
    expect(group.querySelector('.sw-fixture-card-meta')?.textContent).toBe(
      'Sunday 25 October',
    );
  });

  it('draws a top line for a menu alone or a meta alone', () => {
    const { rerender } = render(
      <FixtureCard {...props({ menu: <button type="button">More</button> })} />,
    );
    expect(
      [...boxes().group.querySelector('.sw-fixture-card-top')!.children].map(
        (part) => part.className,
      ),
    ).toEqual(['sw-fixture-card-menu']);
    rerender(<FixtureCard {...props({ meta: 'Sunday' })} />);
    expect(
      [...boxes().group.querySelector('.sw-fixture-card-top')!.children].map(
        (part) => part.className,
      ),
    ).toEqual(['sw-fixture-card-meta']);
  });

  it('hands digits to onChange and drops the rest', () => {
    const onChange = vi.fn();
    render(<FixtureCard {...props({ score: makeScore({ onChange }) })} />);
    const { home, away } = boxes();
    fireEvent.change(home, { target: { value: '3x' } });
    expect(onChange).toHaveBeenLastCalledWith('home', '3');
    fireEvent.change(away, { target: { value: '1' } });
    expect(onChange).toHaveBeenLastCalledWith('away', '1');
    onChange.mockClear();
    fireEvent.change(home, { target: { value: 'x' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('submits on Enter and cancels on Escape from either box', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <FixtureCard {...props({ score: makeScore({ onCancel, onSubmit }) })} />,
    );
    const { home, away } = boxes();
    fireEvent.keyDown(home, { key: 'Enter' });
    fireEvent.keyDown(away, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(home, { key: 'Escape' });
    fireEvent.keyDown(away, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('leaves Escape alone without onCancel, and an IME key to the IME', () => {
    const onSubmit = vi.fn();
    render(<FixtureCard {...props({ score: makeScore({ onSubmit }) })} />);
    const { home } = boxes();
    // fireEvent returns false when the default was prevented.
    expect(fireEvent.keyDown(home, { key: 'Escape' })).toBe(true);
    fireEvent.keyDown(home, { isComposing: true, key: 'Enter' });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('selects the digits on focus', () => {
    render(
      <FixtureCard
        {...props({
          score: makeScore({ home: { value: '12', label: 'Heron Marsh' } }),
        })}
      />,
    );
    const home = boxes().home as HTMLInputElement;
    fireEvent.focus(home);
    expect(home.selectionStart).toBe(0);
    expect(home.selectionEnd).toBe(2);
  });

  it('keeps an empty polite live region until there is an error', () => {
    const { rerender } = render(<FixtureCard {...props()} />);
    const { group, home, away } = boxes();
    const region = group.querySelector<HTMLElement>('.sw-fixture-card-error')!;
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.textContent).toBe('');
    expect(home.getAttribute('aria-describedby')).toBeNull();
    expect(home.getAttribute('aria-invalid')).toBeNull();

    rerender(
      <FixtureCard
        {...props({ score: makeScore({ error: 'Type both counts.' }) })}
      />,
    );
    // The same element, so the new words are announced.
    expect(group.querySelector('.sw-fixture-card-error')).toBe(region);
    expect(region.textContent).toBe('Type both counts.');
    expect(region.id).not.toBe('');
    for (const box of [home, away]) {
      expect(box.getAttribute('aria-describedby')).toBe(region.id);
      expect(box.getAttribute('aria-invalid')).toBe('true');
    }
  });

  it('keeps a box unmarked with its own invalid false', () => {
    render(
      <FixtureCard
        {...props({
          score: makeScore({
            error: 'Type both counts.',
            home: { value: '3', label: 'Heron Marsh', invalid: false },
          }),
        })}
      />,
    );
    const { home, away } = boxes();
    expect(home.getAttribute('aria-invalid')).toBeNull();
    expect(away.getAttribute('aria-invalid')).toBe('true');
  });

  it('forwards each box ref and locks both boxes while disabled', () => {
    const homeRef = createRef<HTMLInputElement>();
    const awayRef = createRef<HTMLInputElement>();
    render(
      <FixtureCard
        {...props({
          score: makeScore({
            away: { value: '', label: 'Otter Pool', ref: awayRef },
            disabled: true,
            home: { value: '', label: 'Heron Marsh', ref: homeRef },
          }),
        })}
      />,
    );
    const { home, away } = boxes();
    expect(homeRef.current).toBe(home);
    expect(awayRef.current).toBe(away);
    expect((home as HTMLInputElement).disabled).toBe(true);
    expect((away as HTMLInputElement).disabled).toBe(true);
  });

  it.each([
    ['a blank home name', { home: { name: ' ' } }, /home and away/],
    ['a blank away name', { away: { name: '' } }, /home and away/],
    ['a blank group label', { score: makeScore({ label: ' ' }) }, /score/],
    [
      'a blank box label',
      { score: makeScore({ away: { value: '', label: '' } }) },
      /score/,
    ],
    [
      'no onSubmit',
      { score: makeScore({ onSubmit: undefined as never }) },
      /score/,
    ],
    ['no score', { score: undefined as never }, /score/],
  ])('throws a RangeError on %s', (_name, over, message) => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<FixtureCard {...props(over)} />)).toThrow(RangeError);
    expect(() => render(<FixtureCard {...props(over)} />)).toThrow(message);
  });
});

describe('FixtureCard CSS', () => {
  const css = generateStylesheet();

  function rule(selector: string): string {
    const start = css.indexOf(`\n${selector} {\n`);
    expect(start, selector).toBeGreaterThanOrEqual(0);
    return css.slice(start, css.indexOf('}', start));
  }

  it('has no edge, fill or radius of its own', () => {
    const root = rule('.sw-fixture-card');
    for (const property of ['border', 'background', 'padding', 'box-shadow'])
      expect(root).not.toContain(property);
  });

  it('keeps the boxes in one column and lets names wrap', () => {
    const side = rule('.sw-fixture-card-side');
    expect(side).toContain('grid-template-columns: minmax(0, 1fr) auto;');
    expect(side).toContain('align-items: center;');
    const name = rule('.sw-fixture-card-name');
    expect(name).toContain('font-weight: 500;');
    expect(name).toContain('overflow-wrap: anywhere;');
    for (const cut of ['text-overflow', 'white-space', 'line-clamp'])
      expect(name).not.toContain(cut);
  });

  it('follows compact density and catalogs its classes', () => {
    expect(css).toMatch(/:is\([^)]*\.sw-fixture-card-name[^)]*\)/);
    const catalog = utilityClassCatalog();
    for (const name of [
      'sw-fixture-card',
      'sw-fixture-card-side',
      'sw-fixture-card-name',
      'sw-fixture-card-error',
    ])
      expect(catalog).toContain(name);
  });

  it('states every catalogued class in the sheet', () => {
    for (const name of utilityClassCatalog().filter((one) =>
      one.startsWith('sw-fixture-card'),
    ))
      expect(css).toContain(`.${name}`);
  });
});

describe('FixtureRow after the extraction', () => {
  it('draws the same score markup as before', () => {
    const html = renderToStaticMarkup(
      <FixtureGroup title="Sunday">
        <FixtureRow
          away={{ name: 'Otter Pool' }}
          home={{ name: 'Heron Marsh' }}
          score={makeScore({ error: 'Type both counts.' })}
        />
      </FixtureGroup>,
    );
    expect(html).toContain(
      `<span aria-label="${groupName}" class="sw-fixture-center sw-fixture-score" role="group">`,
    );
    expect(html).toMatch(
      /<span aria-live="polite" class="sw-fixture-score-error" id="[^"]+">Type both counts\.<\/span>/,
    );
    expect(html).not.toContain('sw-fixture-card');
  });
});
