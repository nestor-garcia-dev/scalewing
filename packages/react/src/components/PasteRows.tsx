'use client';

import { Field } from './Field.js';
import { Inline } from './Inline.js';
import {
  parsePastedRows,
  type PastedRowsDelimiter,
} from './paste-rows/parse-pasted-rows.js';
import { Select } from './Select.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type PasteRowsColumn = {
  /** What `mapping` holds for a found column given this meaning. */
  id: string;
  /** The choice's words in each column's Select, such as "Team" or "Don’t use". */
  label: string;
};

export type PasteRowsProps = {
  /** The text area's label, such as "Paste here". */
  label: string;
  /** A muted line under the label, read as the text area's description. */
  description?: string;
  /** The pasted text, as typed. */
  value: string;
  onValueChange: (value: string) => void;
  /** The meanings each found column can be given, in menu order. */
  columns: readonly PasteRowsColumn[];
  /**
   * One `columns` id per found column, in order. Derive it from the same
   * `value` and `delimiter` with `parsePastedRows` (its `columnCount`), so a new column
   * gets its default in the same render. A missing entry, or an id not
   * in `columns`, counts as the first choice: it is drawn so and filled in
   * on the next change.
   */
  mapping: readonly string[];
  /** Called with the whole new mapping when one column's Select changes. */
  onMappingChange: (mapping: string[]) => void;
  /** The line before the Selects, such as `(n) => \`Found ${n} columns\``. */
  countLabel: (count: number) => string;
  /**
   * The name of the Select for the column at a 1-based position, not
   * drawn: "Column 1" (the default, English).
   */
  columnLabel?: (position: number) => string;
  /** How cells are split (`parsePastedRows`); default `auto`. */
  delimiter?: PastedRowsDelimiter;
  /** The text area's visible rows; default 6. */
  rows?: number;
  placeholder?: string;
  error?: string;
  /**
   * Disables the text area and leaves the column Selects out (the count
   * line stays), so nothing changes while the consumer saves.
   */
  disabled?: boolean;
  required?: boolean;
};

const defaultColumnLabel = (position: number) => `Column ${position}`;

function assertPasteRowsProps({
  columns,
  label,
  rows,
}: Pick<PasteRowsProps, 'columns' | 'label' | 'rows'>) {
  if (typeof label !== 'string' || !label.trim())
    throw new RangeError('PasteRows label must not be empty');
  if (columns.length === 0)
    throw new RangeError('PasteRows needs at least one column');
  const ids = new Set<string>();
  const labels = new Set<string>();
  for (const column of columns) {
    if (!column.id.trim() || !column.label.trim())
      throw new RangeError('PasteRows column id and label must not be empty');
    if (ids.has(column.id))
      throw new RangeError(`Repeated PasteRows column id: ${column.id}`);
    if (labels.has(column.label))
      throw new RangeError(`Repeated PasteRows column label: ${column.label}`);
    ids.add(column.id);
    labels.add(column.label);
  }
  if (rows !== undefined && (!Number.isInteger(rows) || rows < 1))
    throw new RangeError('PasteRows rows must be a whole number from 1');
}

/**
 * A text area for rows pasted from a spreadsheet (cells split on tabs or
 * commas) and, once something is pasted, a polite count line and one
 * small Select per found column choosing what that column means. It parses
 * only rows and cells (`parsePastedRows`); the consumer gives the
 * meanings, keeps the mapping, checks the values and draws the preview.
 */
export function PasteRows({
  columnLabel = defaultColumnLabel,
  columns,
  countLabel,
  delimiter = 'auto',
  description,
  disabled = false,
  error,
  label,
  mapping,
  onMappingChange,
  onValueChange,
  placeholder,
  required = false,
  rows = 6,
  value,
}: PasteRowsProps) {
  assertPasteRowsProps({ columns, label, rows });
  const { columnCount } = parsePastedRows(value, delimiter);
  const options = columns.map((column) => ({
    value: column.id,
    label: column.label,
  }));
  // A missing entry, or an id not in `columns`, counts as the first choice.
  const chosenId = (position: number) => {
    const id = mapping[position];
    return columns.some((column) => column.id === id) ? id! : columns[0]!.id;
  };
  const choose = (index: number, id: string) => {
    const next = Array.from({ length: columnCount }, (_, position) =>
      chosenId(position),
    );
    next[index] = id;
    onMappingChange(next);
  };

  return (
    <Stack gap={2}>
      <Field
        description={description}
        error={error}
        label={label}
        required={required}
      >
        <textarea
          disabled={disabled}
          onChange={(event) => onValueChange(event.currentTarget.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          spellCheck={false}
          value={value}
        />
      </Field>
      <Inline align="center" gap={2} wrap>
        <Text color="muted" role="status" variant="caption">
          {columnCount > 0 ? countLabel(columnCount) : ''}
        </Text>
        {(disabled ? [] : Array.from({ length: columnCount })).map(
          (_, index) => (
            <Select
              key={index}
              label={columnLabel(index + 1)}
              labelVisuallyHidden
              onChange={(id) => choose(index, id)}
              options={options}
              size="xs"
              value={chosenId(index)}
            />
          ),
        )}
      </Inline>
    </Stack>
  );
}
