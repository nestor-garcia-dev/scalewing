import {
  Field,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@scalewing/react';
import { useState } from 'react';

const birds = [
  { id: 'kestrel', name: 'Kestrel', band: '7' },
  { id: 'merlin', name: 'Merlin', band: '12' },
  { id: 'hobby', name: 'Hobby', band: '7' },
] as const;

/** The first other bird already wearing this band number, if any. */
function sharedWith(
  bands: Record<string, string>,
  id: string,
): string | undefined {
  const band = bands[id]?.trim();
  if (!band) return undefined;
  return birds.find((bird) => bird.id !== id && bands[bird.id]?.trim() === band)
    ?.name;
}

/**
 * Band numbers typed in a compact table: a number another bird already
 * wears gets a warning description (amber, after an alert glyph) that is
 * not an error, so the field is never marked invalid and the row can still
 * be saved.
 */
export function BandNumbers() {
  const [bands, setBands] = useState<Record<string, string>>(() =>
    Object.fromEntries(birds.map((bird) => [bird.id, bird.band])),
  );
  return (
    <Table aria-label="Band numbers" density="compact">
      <TableHeader>
        <TableRow>
          <TableCell as="th">Bird</TableCell>
          <TableCell as="th">Band</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {birds.map((bird) => {
          const other = sharedWith(bands, bird.id);
          return (
            <TableRow key={bird.id}>
              <TableCell as="th" scope="row">
                {bird.name}
              </TableCell>
              <TableCell>
                <Field
                  description={
                    other ? `${other} also wears ${bands[bird.id]}` : undefined
                  }
                  descriptionTone="warning"
                  label={`Band number for ${bird.name}`}
                  labelVisuallyHidden
                  size="xs"
                  width="xs"
                >
                  <input
                    inputMode="numeric"
                    name={`band-${bird.id}`}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setBands((last) => ({ ...last, [bird.id]: value }));
                    }}
                    value={bands[bird.id]}
                  />
                </Field>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
