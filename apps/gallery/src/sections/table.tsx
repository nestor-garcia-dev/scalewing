import {
  Badge,
  Button,
  Checkbox,
  Inline,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';

import { useState } from 'react';

import { Section } from '../layout/Section.js';
import { TableLayoutExamples } from './table-layout.js';
import { TableLedgerExample } from './table-ledger.js';
import { TableFooterExample } from './table-footer.js';
import { TableRowRuleExample } from './table-row-rule.js';
import { TableTotalRowExample } from './table-total-row.js';
import {
  TableBoundedExample,
  TableBoundedListExample,
} from './table-bounded.js';
import { TableStickyPageExample } from './table-sticky-page.js';
import { PressableCensus } from './table-pressable.js';
import { SortedCensus } from './table-sorted.js';
import {
  sampleCensusRows,
  sampleCollarRows,
  sampleCollarRowsArabic,
  sampleSurveyRows,
  sampleWatchRows,
} from '../sample-copy.js';

export function TableSection() {
  const [collar, setCollar] = useState('');
  const [checkedCollars, setCheckedCollars] = useState<readonly string[]>([
    'c-221',
  ]);

  return (
    <Section
      id="table"
      purpose="Table aligns data in rows. stickyHeader keeps the header rows visible, every row of the table header and all its cells as one group: pinned to the table's own scroll region by default, or, with stickyHeader page, to the page's top while the page scrolls and the table fits its width (a table wider than its region still pins inside it). numeric cells use tabular numerals and end alignment. truncate clips overflowing cell copy. density compact densifies cells. selected marks the current row with an accent bar at its start that takes no space and no fill, so no column moves and no text loses contrast when a row is picked; the bar follows the writing direction and forced colors keep it. A table wider than its container scrolls sideways inside its own region, and each edge with content past it draws a shade until it is scrolled to that end. A header cell with sort and onSort is the column's sort control: its name becomes a button in the header's own style with a chevron (up ascending, down descending, a quiet pair on a column it is not sorted by), and the sorted header carries aria-sort; in a numeric column the chevron goes before the name, so the name lines up with the figures. layout fixed sizes the columns from the header row's widths alone (a column without one shares what is left, and gets none when the widths fill the container, so a table that scrolls on a phone sizes every column), so a filter that hides a row moves no column; width xs to xl on a header cell are 4, 6, 8, 12 and 16 rem, and width min (on every cell of an auto table's column) keeps the column as narrow as its content on one line. verticalAlign top starts every cell of a tall row on its first line. pressable makes a whole row the target of its one action, such as a search result that is picked: a body cell with onPress draws its text as a button at weight 600, and a pointer press anywhere else on the row presses that button (not with a modifier key, on another control, or when it ends a text selection); the row takes the pointer cursor and the quiet fill while hovered, pressed or while its action has keyboard focus, and keyboard and screen reader users use the button itself. maxHeight bounds the table to a number of rows, rows: 8, and the rest scroll inside the table's own region: the header pins to the region's top and a sticky total to its bottom, so a total over every row stays in view, and the edge with rows hidden past it draws a shade, cast from the pinned header or total, or from the region's own edge where nothing is pinned. On that fill a muted cell (tone muted, the habitat here) and muted words inside the cells take the text colour, keeping 4.5:1."
      title="Table"
      usage={`<Table aria-label="Field log" layout="fixed" verticalAlign="top">
  …<TableCell as="th" width="lg">When</TableCell>…
</Table>

<TableCell as="th" numeric sort="descending" onSort={() => sortBy('sightings')}>
  Sightings
</TableCell>

<Table aria-label="Site census" stickyHeader="page">…</Table>

<Table aria-label="Census" maxHeight={{ rows: 8 }}>
  …<TableFooter sticky>…</TableFooter>
</Table>

<TableRow variant="total">
  <TableCell as="th" scope="row">Expected at dusk</TableCell>
  <TableCell numeric>136</TableCell>
</TableRow>

<TableRow pressable>
  <TableCell onPress={() => pick('Red fox')}>Red fox</TableCell>
  <TableCell tone="muted">Forest</TableCell>
</TableRow>

<Table aria-label="Census" density="compact">
  <TableBody>
    <TableRow selected>
      <TableCell>Common</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
    >
      <Stack gap={5}>
        <Table aria-label="Example census">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Species</TableCell>
              <TableCell as="th">Habitat</TableCell>
              <TableCell as="th" numeric>
                Sightings
              </TableCell>
              <TableCell as="th" numeric>
                Δ
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleCensusRows.map((row) => (
              <TableRow key={row.species}>
                <TableCell>{row.species}</TableCell>
                <TableCell>{row.habitat}</TableCell>
                <TableCell numeric>{row.sightings}</TableCell>
                <TableCell numeric>{row.delta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table aria-label="Watch list" density="compact">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Slot</TableCell>
              <TableCell as="th">Animal</TableCell>
              <TableCell as="th" numeric>
                Sightings
              </TableCell>
              <TableCell as="th" numeric>
                Δ
              </TableCell>
              <TableCell as="th">Why</TableCell>
              <TableCell as="th">Log</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleWatchRows.map((row) => (
              <TableRow key={row.slot} selected={row.selected}>
                <TableCell>{row.slot}</TableCell>
                <TableCell>{row.animal}</TableCell>
                <TableCell numeric>{row.sightings}</TableCell>
                <TableCell numeric>{row.delta}</TableCell>
                <TableCell>
                  <Inline gap={1} wrap>
                    {row.chips.map((chip) => (
                      <Badge key={chip} size="sm">
                        {chip}
                      </Badge>
                    ))}
                  </Inline>
                </TableCell>
                <TableCell>
                  <Inline gap={1} wrap>
                    <Button
                      onPress={() => undefined}
                      size="xs"
                      variant="primary"
                    >
                      Log
                    </Button>
                    <Button onPress={() => undefined} size="xs" variant="ghost">
                      Skip
                    </Button>
                  </Inline>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table aria-label="Tracking collars">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Collar</TableCell>
              <TableCell as="th">Animal</TableCell>
              <TableCell as="th">Habitat</TableCell>
              <TableCell as="th" numeric>
                Battery
              </TableCell>
              <TableCell as="th">Choose</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleCollarRows.map((row) => (
              <TableRow key={row.id} selected={collar === row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.animal}</TableCell>
                <TableCell>{row.habitat}</TableCell>
                <TableCell numeric>{row.battery}</TableCell>
                <TableCell>
                  <Button
                    aria-label={`Select ${row.id}`}
                    aria-pressed={collar === row.id}
                    onPress={() => setCollar(row.id)}
                    size="xs"
                    variant="secondary"
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table aria-label="أطواق التتبع" density="compact" dir="rtl">
          <TableHeader>
            <TableRow>
              <TableCell as="th">الطوق</TableCell>
              <TableCell as="th">الحيوان</TableCell>
              <TableCell as="th">الموطن</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleCollarRowsArabic.map((row) => {
              const checked = checkedCollars.includes(row.id);
              return (
                <TableRow key={row.id} selected={checked}>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      label={row.id}
                      onCheckedChange={(next) =>
                        setCheckedCollars((current) =>
                          next
                            ? [...current, row.id]
                            : current.filter((id) => id !== row.id),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{row.animal}</TableCell>
                  <TableCell>{row.habitat}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Table aria-label="Survey log">
          <TableHeader>
            <TableRow>
              <TableCell as="th">Date</TableCell>
              <TableCell as="th">Site</TableCell>
              <TableCell as="th">Observer</TableCell>
              <TableCell as="th">Species</TableCell>
              <TableCell as="th">Habitat</TableCell>
              <TableCell as="th">Weather</TableCell>
              <TableCell as="th">Wind</TableCell>
              <TableCell as="th" numeric>
                Count
              </TableCell>
              <TableCell as="th">Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleSurveyRows.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.site}</TableCell>
                <TableCell>{row.observer}</TableCell>
                <TableCell>{row.species}</TableCell>
                <TableCell>{row.habitat}</TableCell>
                <TableCell>{row.weather}</TableCell>
                <TableCell>{row.wind}</TableCell>
                <TableCell numeric>{row.count}</TableCell>
                <TableCell>
                  <Badge
                    size="sm"
                    tone={row.status === 'Verified' ? 'success' : 'warning'}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <SortedCensus />
        <Text variant="label">Rows picked by a press</Text>
        <PressableCensus />
        <TableLayoutExamples />
        <Text variant="label">A ledger</Text>
        <TableLedgerExample />
        <Text variant="label">The same ledger, compact</Text>
        <TableLedgerExample density="compact" label="Colony ledger, compact" />
        <Text variant="label">A total mid-table</Text>
        <TableTotalRowExample />
        <Text variant="label">The same total, compact</Text>
        <TableTotalRowExample
          density="compact"
          label="Waders through the day, compact"
        />
        <Text variant="label">A cut line under a row</Text>
        <TableRowRuleExample />
        <Text variant="label">The same cut, compact</Text>
        <TableRowRuleExample
          density="compact"
          label="Nesting sites by nests, compact"
        />
        <Text variant="label">A pinned total</Text>
        <TableFooterExample />
        <Text variant="label">A table that scrolls inside itself</Text>
        <TableBoundedExample />
        <Text variant="label">A compact list that scrolls inside itself</Text>
        <TableBoundedListExample />
        <Text variant="label">A header of two rows pinned to the page</Text>
        <TableStickyPageExample />
        <Text variant="caption" color="muted">
          Pass stickyHeader false when the header should scroll away. density
          compact and selected are for ranked lists. Why chips are Badge sm, not
          a second chip control. A table wider than its column scrolls inside
          its own region, and the edge with more columns past it is shaded, so a
          phone shows that the table goes on. A ledger takes columnRules,
          TableCell tone for signed figures (never the only signal), TableRow
          variant sub under its entry (indenting its row header), variant total
          for a subtotal mid-table (weight 600 under the footer's 2 px rule, no
          fill) and struck for a voided row kept on the record, with a Badge
          saying why. TableRow rule after draws a 2 px muted rule under a row,
          such as a cut under the last place that goes through; say what it
          means in words beside the table. TableFooter holds a total at weight
          600 under a heavier rule; sticky pins it to the bottom edge, to the
          page while the table fits its width, or to the region of a table
          bounded by maxHeight, whose rows scroll inside it.
        </Text>
      </Stack>
    </Section>
  );
}
