import {
  ActionMenu,
  Card,
  ListGroup,
  ListRow,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';
import { colonyNights } from './list-group-data.js';
import { ListGroupTilesExample } from './list-group-tiles.js';
import { ListRowTrailingExample } from './list-row-trailing.js';
import { ListRowTruncateExample } from './list-row-truncate.js';

/** A status dot in a semantic colour, as a consumer's Lucide Circle. */
function Dot({ color }: { color: 'warning' | 'muted' }) {
  return (
    <Text as="span" color={color}>
      <svg aria-hidden="true" height="8" viewBox="0 0 8 8" width="8">
        <circle cx="4" cy="4" fill="currentColor" r="4" />
      </svg>
    </Text>
  );
}

const tick = 'M3 8.5 6.5 12 13 4.5';

export function ListGroupSection() {
  const [opened, setOpened] = useState('nothing yet');
  const [habitat, setHabitat] = useState('wetland');

  return (
    <Section
      id="list-group"
      purpose="ListGroup is rows in one list with hairlines between them: a bordered panel of its own, or plain rows inside a Card (variant plain, with a hairline above the first row too). A ListRow has a title, an optional muted detail line, an optional value at its end (valueTone colours it, warning included for a figure that needs a look, valueBadge draws it as a Badge such as a status, valueDetail adds a muted line under it) and an optional leading mark, hidden from assistive technology. With onPress or href the whole row is the button or link, named by its title and value and described by its detail lines, with a chevron; selected makes it a choice with a check; without either it only states something. titleAppearance plain sets the title at the body weight. maxHeight bounds the list to a count of rows that scroll inside its own named region, shading an edge with more past it, and footer stays pinned under them, such as a total. unread marks a row new with an accent dot after its title, read as unreadLabel; tag puts a short status such as a Badge before the row's end, describing it; action holds a control such as an ActionMenu after the row, outside its press area. truncate keeps the title and the detail to one line each, ending in an ellipsis, the whole words still in the row's name, description and tooltip. titleLang marks a title in another language than the page's, such as a Spanish guide's on an English page, on the title's box (its words and the wordless unread dot), never its detail, tag or unread words. variant tiles lays the same list's rows out as tiles, each its own panel, tileColumns (2, 3 or 4, default 3) across from md up and one a row below it."
      title="ListGroup"
      usage={`<Card>
  <Text as="h3" variant="label" id="look">Worth a look</Text>
  <ListGroup aria-labelledby="look" variant="plain">
    <ListRow
      leading={<Circle />}
      title="Thu, Oct 8 · North marsh counted 6 fewer herons"
      detail="Recounted Sat, Oct 10 by Field team A"
      href="/nights/2026-10-08"
    />
  </ListGroup>
</Card>

<ListGroup aria-labelledby="arrivals" variant="tiles">
  {arrivals.map((arrival) => (
    <ListRow key={arrival.id} title={arrival.title} detail={arrival.detail}
      href={arrival.href} truncate accessory="none" />
  ))}
</ListGroup>

<ListGroup
  aria-label="Nights"
  maxHeight={{ rows: 5 }}
  footer={<ListRow title="8 nights" value="0" />}
>
  {nights.map((night) => (
    <ListRow key={night.id} title={night.name} detail={night.detail}
      value={night.change} valueTone={night.tone} onPress={() => open(night)} />
  ))}
</ListGroup>

<ListRow
  title="Coro de ranas"
  titleLang="es"
  tag={<Badge>Only in Spanish</Badge>}
  href="/guides/frog"
/>

<ListRow
  title="Owl pellets"
  detail="Guide · 1 page · Oct 16"
  href="/guides/owl"
  unread
  unreadLabel="New"
  truncate
  tag={<Badge>Only in English</Badge>}
  accessory="none"
  action={
    <ActionMenu
      label="More for Owl pellets"
      trigger={<Ellipsis />}
      items={[{ id: 'archive', label: 'Archive…', onSelect: archive }]}
    />
  }
/>`}
    >
      <Stack gap={5}>
        <ListGroupTilesExample onOpen={setOpened} />
        <ListRowTrailingExample onOpen={setOpened} />
        <ListRowTruncateExample onOpen={setOpened} />
        <Card padding={4}>
          <Stack gap={2}>
            <Text as="h3" id="list-group-look" variant="label">
              Worth a look
            </Text>
            <ListGroup aria-labelledby="list-group-look" variant="plain">
              <ListRow
                detail="Recounted Sat, Oct 10 by Field team A: 135 → 141."
                leading={<Dot color="warning" />}
                onPress={() => setOpened('North marsh')}
                title="Wed, Oct 7 · North marsh counted 6 fewer herons than expected"
              />
              <ListRow
                detail="Last checked Mon, Sep 28 by Field team C. This reserve checks weekly."
                href="#list-group"
                leading={<Dot color="warning" />}
                onPress={() => setOpened('Camera traps')}
                title="15 days since the camera traps were checked"
              />
              <ListRow
                detail="Closed by Field team B · reason: not recorded."
                leading={<Dot color="muted" />}
                onPress={() => setOpened('South reeds')}
                title="Fri, Oct 9 · South reeds +2"
              />
            </ListGroup>
            <Text color="muted" variant="caption">
              Opened: {opened}.
            </Text>
          </Stack>
        </Card>
        <Card padding={4}>
          <Stack gap={2}>
            <Text as="h3" id="list-group-smooth" variant="label">
              Went smoothly
            </Text>
            <ListGroup aria-labelledby="list-group-smooth" variant="plain">
              {[
                '14 of 14 night counts finished; 14 tally sheets filed.',
                '7 of 7 nest checks done; every nest accounted for.',
                'No traps left open.',
              ].map((line) => (
                <ListRow
                  key={line}
                  leading={
                    <Text as="span" color="success">
                      <Glyph path={tick} />
                    </Text>
                  }
                  title={line}
                  titleAppearance="plain"
                />
              ))}
            </ListGroup>
          </Stack>
        </Card>
        <Stack gap={2}>
          <Text as="h3" id="list-group-nights" variant="label">
            Night counts
          </Text>
          <ListGroup
            aria-labelledby="list-group-nights"
            footer={<ListRow title="8 nights" value="0" valueTone="muted" />}
            maxHeight={{ rows: 4 }}
          >
            {colonyNights.map((night) => (
              <ListRow
                detail={night.detail}
                key={night.night}
                onPress={() => setOpened(night.night)}
                title={night.night}
                value={night.change}
                valueDetail="herons"
                valueTone={night.tone}
              />
            ))}
          </ListGroup>
          <Text color="muted" variant="caption">
            Eight nights · the list scrolls · the total is all eight.
          </Text>
        </Stack>
        <Stack gap={2}>
          <Text as="h3" id="list-group-habitat" variant="label">
            Survey habitat
          </Text>
          <ListGroup aria-labelledby="list-group-habitat">
            {[
              ['wetland', 'Wetland'],
              ['forest', 'Forest'],
              ['savanna', 'Savanna'],
            ].map(([value, label]) => (
              <ListRow
                key={value}
                onPress={() => setHabitat(value ?? '')}
                selected={habitat === value}
                title={label ?? ''}
              />
            ))}
          </ListGroup>
        </Stack>
        <ListGroup aria-label="Station">
          <ListRow title="Region" value="Pantanal" />
          <ListRow
            detail="Last checked 3 days ago"
            title="Camera traps"
            value="2 offline"
            valueTone="warning"
          />
          <ListRow
            detail="Jaguar, two cubs"
            onPress={() => setOpened('Riverbank den')}
            title="Riverbank den"
            value="Watched"
            valueBadge="warning"
          />
          <ListRow
            detail="Ocelot"
            onPress={() => setOpened('Hollow log den')}
            title="Hollow log den"
            value="Clear"
            valueBadge="success"
          />
          <ListRow
            action={
              <ActionMenu
                align="end"
                items={[
                  {
                    id: 'invite',
                    label: 'Invite an observer',
                    onSelect: () => setOpened('Invite an observer'),
                  },
                ]}
                label="More for Observers"
                trigger={<Glyph path="M3 8h.01M8 8h.01M13 8h.01" />}
              />
            }
            detail="Shared with the field teams"
            title="Observers"
            value="12"
          />
          <ListRow
            disabled
            onPress={() => undefined}
            title="Export the season"
            detail="Opens when the season closes"
          />
          <ListRow
            onPress={() => setOpened('Leave the survey')}
            title="Leave the survey"
            tone="danger"
            accessory="none"
          />
        </ListGroup>
      </Stack>
    </Section>
  );
}
