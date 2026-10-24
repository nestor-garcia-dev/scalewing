import {
  Card,
  ContextSwitcher,
  type ContextSwitcherGroup,
  GlyphTile,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const station = 'M2 8l6-5 6 5 M4 7v7h8V7';
const plus = 'M8 3v10 M3 8h10';

function crest(hue: 'teal' | 'orange' | 'purple') {
  return (
    <GlyphTile hue={hue} size="sm">
      <Glyph path={station} />
    </GlyphTile>
  );
}

const stations: ContextSwitcherGroup[] = [
  {
    id: 'home',
    options: [
      {
        id: 'all',
        label: 'All stations',
        icon: <Glyph path={station} />,
        count: 7,
        countLabel: '7 need you',
        countTone: 'warning',
      },
    ],
  },
  {
    id: 'mine',
    label: 'Stations you run',
    options: [
      {
        id: 'heron',
        label: 'Heron Marsh',
        detail: 'Warden',
        icon: crest('teal'),
      },
      {
        id: 'pine',
        label: 'Pine Ridge',
        detail: 'Ranger',
        icon: crest('orange'),
      },
      {
        id: 'bittern',
        label: 'Bittern Fen',
        detail: 'Volunteer',
        icon: crest('purple'),
      },
    ],
  },
];

const surveys: ContextSwitcherGroup[] = [
  {
    id: 'surveys',
    options: [
      { id: 'waders', label: 'Wader count' },
      { id: 'otters', label: 'Otter spraints' },
    ],
  },
];

const seasons: ContextSwitcherGroup[] = [
  {
    id: 'seasons',
    options: [
      {
        id: 'spring-27',
        label: 'Spring 2027',
        badge: { label: 'Draft', tone: 'neutral' },
      },
      {
        id: 'autumn-26',
        label: 'Autumn 2026',
        detail: 'Current',
        badge: { label: 'Live', tone: 'success' },
      },
      {
        id: 'spring-26',
        label: 'Spring 2026',
        badge: { label: 'Finished', tone: 'accent' },
      },
    ],
  },
];

function labelOf(groups: readonly ContextSwitcherGroup[], id: string): string {
  return (
    groups.flatMap((group) => group.options).find((option) => option.id === id)
      ?.label ?? ''
  );
}

export function ContextSwitcherSection() {
  const [stationId, setStationId] = useState('heron');
  const [surveyId, setSurveyId] = useState('waders');
  const [seasonId, setSeasonId] = useState('autumn-26');
  const [last, setLast] = useState('None yet');
  const stationLabel = labelOf(stations, stationId);
  const actions = [
    {
      id: 'new',
      label: 'New station',
      icon: <Glyph path={plus} />,
      onSelect: () => setLast('New station'),
    },
    {
      id: 'code',
      label: 'Enter a code',
      onSelect: () => setLast('Enter a code'),
    },
  ];

  return (
    <Section
      id="context-switcher"
      purpose="ContextSwitcher is a button showing the context in use (a station, a survey, a season) that opens a popup to switch it: an optional filter field, the options in groups as a listbox, and commands in a footer. The trigger's name is the label and what it shows (Station Heron Marsh). The current option is checked and aria-selected; an option has a mark, a muted detail, a status badge and the shared count pill, all read in its name. Focus moves into the popup, to the filter field (a combobox that narrows the options by label or detail, ignoring case and accents, with the empty words shown and announced) or else to the listbox; the arrow keys move the active row, Enter chooses it, Home and End and typeahead work in the listbox, Escape closes it with focus back on the trigger, and a press outside or Tab away closes it where focus went. A footer command closes the popup, focus back on the trigger, then runs. triggerAppearance framed, text, pill or icon (a glyph alone for a rail, named by the label and the current option); width full fills a sidebar's top. On a touch screen the trigger and every row are 44 px."
      title="ContextSwitcher"
      usage={`<ContextSwitcher
  label="Station"
  trigger={<StationCrestAndName />}
  triggerAppearance="text"
  width="full"
  groups={[{ id: 'mine', label: 'Stations you run', options: [{ id: 'heron', label: 'Heron Marsh', detail: 'Warden' }] }]}
  currentId={stationId}
  onSelect={(option) => setStationId(option.id)}
  filter={{ label: 'Find a station', placeholder: 'Station name', emptyText: 'No station matches' }}
  actions={[{ id: 'new', label: 'New station', onSelect: openNewStation }]}
/>`}
    >
      <Stack gap={4}>
        <Inline align="start" gap={4} wrap>
          <Card padding={3}>
            <Stack gap={2}>
              <Text color="muted" variant="caption">
                A sidebar's top
              </Text>
              <div className="gallery-switcher-column">
                <ContextSwitcher
                  actions={actions}
                  currentId={stationId}
                  filter={{
                    label: 'Find a station',
                    placeholder: 'Station name',
                    emptyText: 'No station matches',
                  }}
                  groups={stations}
                  label="Station"
                  onSelect={(option) => {
                    setStationId(option.id);
                    setLast(option.label);
                  }}
                  trigger={
                    <>
                      {crest('teal')}
                      <Stack gap={0}>
                        <Text variant="label">{stationLabel}</Text>
                        <Text variant="caption">Warden</Text>
                      </Stack>
                    </>
                  }
                  triggerAppearance="text"
                  width="full"
                />
              </div>
            </Stack>
          </Card>
          <Card padding={3}>
            <Stack gap={2}>
              <Text color="muted" variant="caption">
                A rail's top
              </Text>
              <ContextSwitcher
                actions={actions}
                currentId={stationId}
                groups={stations}
                label="Station"
                onSelect={(option) => {
                  setStationId(option.id);
                  setLast(option.label);
                }}
                trigger={crest('teal')}
                triggerAppearance="icon"
              />
            </Stack>
          </Card>
        </Inline>
        <Inline gap={2} wrap>
          <ContextSwitcher
            currentId={surveyId}
            groups={surveys}
            label="Survey"
            onSelect={(option) => {
              setSurveyId(option.id);
              setLast(option.label);
            }}
            trigger={labelOf(surveys, surveyId)}
            triggerAppearance="pill"
          />
          <ContextSwitcher
            actions={[
              {
                id: 'new-season',
                label: 'Start a new season',
                onSelect: () => setLast('Start a new season'),
              },
            ]}
            currentId={seasonId}
            groups={seasons}
            label="Season"
            onSelect={(option) => {
              setSeasonId(option.id);
              setLast(option.label);
            }}
            trigger={labelOf(seasons, seasonId)}
            triggerAppearance="pill"
          />
          <ContextSwitcher
            align="end"
            currentId={seasonId}
            groups={seasons}
            label="Season, framed"
            onSelect={(option) => setSeasonId(option.id)}
            trigger={labelOf(seasons, seasonId)}
          />
        </Inline>
        <Text color="muted" role="status" variant="caption">
          Last choice: {last}
        </Text>
      </Stack>
    </Section>
  );
}
