import { describe, expect, it } from 'vitest';

import { parsePastedRows } from './components/paste-rows/parse-pasted-rows.js';

describe('parsePastedRows', () => {
  it('splits a spreadsheet copy on tabs and line breaks, trimming cells', () => {
    expect(
      parsePastedRows('Bird\tHabitat\r\n Mallard \tPond\nHeron\tMarsh\rTeal'),
    ).toEqual({
      rows: [
        ['Bird', 'Habitat'],
        ['Mallard', 'Pond'],
        ['Heron', 'Marsh'],
        ['Teal', ''],
      ],
      columnCount: 2,
      delimiter: 'tab',
    });
  });

  it('splits on commas when there is no tab, and on tabs only when asked', () => {
    expect(parsePastedRows('Mallard, Pond\nHeron,Marsh').rows).toEqual([
      ['Mallard', 'Pond'],
      ['Heron', 'Marsh'],
    ]);
    expect(parsePastedRows('Smith, Jones Reserve', 'tab')).toEqual({
      rows: [['Smith, Jones Reserve']],
      columnCount: 1,
      delimiter: 'tab',
    });
    expect(parsePastedRows('a\tb, c', 'comma').rows).toEqual([['a\tb', 'c']]);
  });

  it('reads quoted cells holding the delimiter, a line break or a quote', () => {
    expect(
      parsePastedRows('"Heron, grey",Marsh\n "Owl ""barn""" ,"Barn\nloft"')
        .rows,
    ).toEqual([
      ['Heron, grey', 'Marsh'],
      ['Owl "barn"', 'Barn\nloft'],
    ]);
  });

  it('keeps a quote with no closing one, or inside a cell, as a character', () => {
    expect(parsePastedRows('O"Neil Marsh\n"Owls').rows).toEqual([
      ['O"Neil Marsh'],
      ['"Owls'],
    ]);
  });

  it('keeps an opening quote whose only later quotes are escaped pairs as a character', () => {
    expect(parsePastedRows('"abc\tx\n""y').rows).toEqual([
      ['"abc', 'x'],
      ['y', ''],
    ]);
    // A later cell does not depend on a stray quote before it: here the
    // first quote opens an empty quoted cell that the second closes.
    expect(parsePastedRows('""y').rows).toEqual([['y']]);
    expect(parsePastedRows('"abc""').rows).toEqual([['"abc""']]);
  });

  it('quotes a leading quote when a later quote closes it, across rows', () => {
    // CSV's rule: a cell opened by a quote runs to its closing quote.
    expect(parsePastedRows('"Owls\tNest\nRed "fox\tWood').rows).toEqual([
      ['Owls\tNest\nRed fox', 'Wood'],
    ]);
  });

  it('drops blank rows and pads short ones', () => {
    expect(parsePastedRows('\n  \nMallard\t\tPond\n\t\n\nHeron\n')).toEqual({
      rows: [
        ['Mallard', '', 'Pond'],
        ['Heron', '', ''],
      ],
      columnCount: 3,
      delimiter: 'tab',
    });
    expect(parsePastedRows('')).toEqual({
      rows: [],
      columnCount: 0,
      delimiter: 'comma',
    });
  });

  it('throws on an unknown delimiter', () => {
    expect(() => parsePastedRows('a', 'pipe' as 'tab')).toThrow(RangeError);
  });

  it('stays linear on a long paste', () => {
    const text = 'Mallard\tPond\n'.repeat(20000) + '"' + 'x'.repeat(20000);
    const start = performance.now();
    const { rows } = parsePastedRows(text);
    expect(rows).toHaveLength(20001);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});
