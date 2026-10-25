import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';

const sightings = [
  {
    id: 'heron',
    time: '6:40 AM',
    title: 'Grey heron',
    detail: 'North marsh, east reed bed',
  },
  {
    id: 'otter',
    time: '7:15 AM',
    title: 'River otter',
    detail: 'Mill pond, south shore',
  },
] as const;

export function LinkSection() {
  return (
    <Section
      id="link"
      purpose='Box as="a" is a layout link with href. It is not a button. Next.js and other routers still own client navigation. link="quiet" is a title that opens something, such as a table row&apos;s: it keeps the surrounding text&apos;s colour at weight 600 and underlines on hover and focus. Its weight is the non-colour cue, so use it in text lighter than 600; in text already at 600 it has none, and an accent link there needs at least 3:1 against the text. external opens a new tab without an opener: an arrow after the words, and newTabLabel, in your language, read after the name.'
      title="Link"
      usage={`<Box as="a" href="#button" padding={2}>
  Button
</Box>

<Box as="a" href="#link" link="quiet">
  Grey heron
</Box>

<Box
  as="a"
  external
  href="https://example.org/marsh-map"
  newTabLabel="(opens in a new tab)"
>
  Check the marsh map
</Box>`}
    >
      <Stack gap={3}>
        <Box as="a" href="#button" padding={2}>
          Layout link to Button
        </Box>
        <Box as="a" href="#field">
          Layout link to Field
        </Box>
        <Text>
          North marsh hide, east reed bed.{' '}
          <Box
            as="a"
            external
            href="https://example.org/marsh-map"
            newTabLabel="(opens in a new tab)"
          >
            Check the marsh map
          </Box>
        </Text>
        <Text color="muted">
          Tab to a link to inspect the generated focus ring. Router Link
          components stay in the product; they should not nest another anchor
          inside Box as=&quot;a&quot;.
        </Text>
        <Table aria-label="Morning sightings">
          <TableHeader>
            <TableRow>
              <TableCell as="th" scope="col" width="min">
                Time
              </TableCell>
              <TableCell as="th" scope="col">
                Sighting
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sightings.map((row) => (
              <TableRow key={row.id}>
                <TableCell tone="muted" width="min">
                  {row.time}
                </TableCell>
                <TableCell>
                  <Box as="a" href="#link" link="quiet">
                    {row.title}
                  </Box>
                  <Text as="span" color="muted">
                    {` · ${row.detail}`}
                  </Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Section>
  );
}
