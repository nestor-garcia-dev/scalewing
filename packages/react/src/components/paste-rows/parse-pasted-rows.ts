/**
 * How pasted cells are split: `tab` (what a spreadsheet copies), `comma`
 * (a CSV line), or `auto`, tab when the text holds a tab and comma
 * otherwise. A list whose one column may hold commas ("Smith, Jones") is
 * parsed with `tab`, so a comma never splits it.
 */
export type PastedRowsDelimiter = 'auto' | 'tab' | 'comma';

export const pastedRowsDelimiters: readonly PastedRowsDelimiter[] = [
  'auto',
  'tab',
  'comma',
];

export type PastedRows = {
  /** The rows in order, each padded with `''` to `columnCount` cells. */
  rows: string[][];
  /** The most cells any row has; 0 when nothing but blank lines was pasted. */
  columnCount: number;
  /** The delimiter used, `auto` resolved. */
  delimiter: 'tab' | 'comma';
};

function resolveDelimiter(
  text: string,
  delimiter: PastedRowsDelimiter,
): 'tab' | 'comma' {
  if (!pastedRowsDelimiters.includes(delimiter))
    throw new RangeError(`Unknown PasteRows delimiter: ${String(delimiter)}`);
  if (delimiter !== 'auto') return delimiter;
  return text.includes('\t') ? 'tab' : 'comma';
}

/**
 * Reads one quoted cell starting at the opening quote `start`: `""` is
 * one quote, and delimiters and line breaks inside it are its words.
 * Returns the words and the index after the closing quote, or `null` when
 * no lone closing quote follows (the opening quote is then a character).
 */
function readQuoted(text: string, start: number): [string, number] | null {
  let words = '';
  let index = start + 1;
  while (index < text.length) {
    const char = text[index];
    if (char === '"') {
      if (text[index + 1] === '"') {
        words += '"';
        index += 2;
        continue;
      }
      return [words, index + 1];
    }
    words += char;
    index += 1;
  }
  return null;
}

/**
 * For each index, where a quoted cell's scan starting there would find its
 * lone closing quote (`""` being one escaped quote), or -1 when none
 * follows; one extra entry for the end. Built backwards in one pass, so
 * each opening quote is checked in constant time and the parse stays
 * linear: a run of quotes from i of odd length closes on its last quote,
 * an even run is all escapes and the scan carries on after it.
 */
function closingQuoteTable(text: string): Int32Array {
  const closesFrom = new Int32Array(text.length + 1).fill(-1);
  const runFrom = new Int32Array(text.length + 1);
  for (let index = text.length - 1; index >= 0; index -= 1) {
    if (text[index] !== '"') {
      closesFrom[index] = closesFrom[index + 1]!;
      continue;
    }
    const run = 1 + runFrom[index + 1]!;
    runFrom[index] = run;
    closesFrom[index] =
      run % 2 === 1 ? index + run - 1 : closesFrom[index + run]!;
  }
  return closesFrom;
}

/**
 * Splits pasted text into rows of trimmed cells: rows on line breaks
 * (CR, LF or CRLF), cells on the delimiter. A cell that starts with a
 * double quote and has a closing one later is quoted, as spreadsheets and
 * CSV write a cell holding the delimiter, a line break or a quote; any
 * other quote is a plain character. Rows whose cells are all blank are
 * left out. It knows nothing of what the columns mean: the consumer maps
 * and checks them. Linear in the text's length.
 */
export function parsePastedRows(
  text: string,
  delimiter: PastedRowsDelimiter = 'auto',
): PastedRows {
  const used = resolveDelimiter(text, delimiter);
  const separator = used === 'tab' ? '\t' : ',';
  const closesFrom = closingQuoteTable(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let cellStart = true;
  const endCell = () => {
    row.push(cell.trim());
    cell = '';
    cellStart = true;
  };
  const endRow = () => {
    endCell();
    if (row.some((value) => value !== '')) rows.push(row);
    row = [];
  };
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    const quoted =
      cellStart && char === '"' && closesFrom[index + 1]! >= 0
        ? readQuoted(text, index)
        : null;
    if (quoted) {
      cell += quoted[0];
      index = quoted[1];
      cellStart = false;
    } else if (char === separator) {
      endCell();
      index += 1;
    } else if (char === '\r' || char === '\n') {
      endRow();
      index += char === '\r' && text[index + 1] === '\n' ? 2 : 1;
    } else {
      // Spaces before a quoted cell's opening quote do not unquote it.
      if (!(cellStart && char === ' ')) {
        cell += char;
        cellStart = false;
      }
      index += 1;
    }
  }
  if (cell !== '' || row.length > 0) endRow();
  const columnCount = rows.reduce(
    (most, cells) => Math.max(most, cells.length),
    0,
  );
  for (const cells of rows) while (cells.length < columnCount) cells.push('');
  return { rows, columnCount, delimiter: used };
}
