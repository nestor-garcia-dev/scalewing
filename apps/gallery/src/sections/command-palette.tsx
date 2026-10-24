import {
  CommandPalette,
  type CommandPaletteGroup,
  CommandPaletteTrigger,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const search = 'M7 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10z M11 11l3.5 3.5';
const leaf = 'M3 13c0-6 4-10 10-10c0 6-4 10-10 10z M3 13l5-5';
const pin = 'M8 15s5-4.5 5-8.5a5 5 0 0 0-10 0C3 10.5 8 15 8 15z';

const species = [
  { id: 'otter', label: 'Eurasian otter', detail: 'Heron Marsh · 4 sightings' },
  { id: 'heron', label: 'Grey heron', detail: 'Heron Marsh · 12 sightings' },
  {
    id: 'harrier',
    label: 'Marsh harrier',
    detail: 'Bittern Fen · 2 sightings',
  },
  { id: 'vole', label: 'Water vole', detail: 'Pine Ridge · 1 sighting' },
];

const sites = [
  { id: 'marsh', label: 'Heron Marsh', detail: 'Wetland reserve' },
  { id: 'fen', label: 'Bittern Fen', detail: 'Reed bed' },
];

function matches(words: string, query: string): boolean {
  return words.toLowerCase().includes(query.trim().toLowerCase());
}

/** The results for the typed words, as a consumer would filter them. */
function resultsFor(
  query: string,
  choose: (words: string) => void,
): CommandPaletteGroup[] {
  return [
    {
      id: 'species',
      label: 'Species',
      items: species
        .filter((item) => matches(`${item.label} ${item.detail}`, query))
        .map((item) => ({
          ...item,
          icon: <Glyph path={leaf} />,
          onSelect: () => choose(item.label),
        })),
    },
    {
      id: 'sites',
      label: 'Sites',
      items: sites
        .filter((item) => matches(`${item.label} ${item.detail}`, query))
        .map((item) => ({
          ...item,
          icon: <Glyph path={pin} />,
          onSelect: () => choose(item.label),
        })),
    },
    {
      id: 'actions',
      label: 'Actions',
      items: matches('Report a sighting', query)
        ? [
            {
              id: 'report',
              label: 'Report a sighting',
              onSelect: () => choose('Report a sighting'),
            },
          ]
        : [],
    },
  ];
}

export function CommandPaletteSection() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [last, setLast] = useState('None yet');
  const groups = resultsFor(query, setLast);

  return (
    <Section
      id="command-palette"
      purpose="CommandPalette is a search over the product on the top layer: a modal dialog named by its label, a field (an ARIA combobox) over an always-open listbox of grouped results you filter from the words yourself. ↑ and ↓ move the active row, wrapping; the active row shows the Enter key cap and Enter or a press chooses it, which asks to close and then runs it. Escape, a press outside or the shortcut again close it and focus returns to where it was. The status says the count (countText), the empty words or the loading words; hint is a muted footer line. shortcut mod+k listens for ⌘K on Apple systems and Ctrl+K elsewhere, left alone while focus is in another text field: try it here. CommandPaletteTrigger is the search-looking button that opens it, with a key hint, or its glyph alone when compact. On a touch screen the trigger and every row are 44 px."
      title="CommandPalette"
      usage={`<CommandPaletteTrigger
  label="Search"
  placeholder="Search species and sites"
  shortcutLabel="⌘K"
  icon={<SearchIcon />}
  onPress={() => setOpen(true)}
/>
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  label="Search"
  placeholder="Search species and sites"
  query={query}
  onQueryChange={setQuery}
  groups={resultsFor(query)}
  emptyText="No species or sites match"
  countText={(n) => \`\${n} results\`}
  hint="↑↓ to move · Enter to open · Esc to close"
  shortcut="mod+k"
/>`}
    >
      <Stack gap={3}>
        <Inline gap={3} wrap>
          <CommandPaletteTrigger
            icon={<Glyph path={search} />}
            label="Search"
            onPress={() => setOpen(true)}
            placeholder="Search species and sites"
            shortcutLabel="⌘K"
          />
          <CommandPaletteTrigger
            compact
            icon={<Glyph path={search} />}
            label="Search, compact"
            onPress={() => setOpen(true)}
            placeholder="Search species and sites"
          />
        </Inline>
        <Text color="muted" role="status" variant="caption">
          Last opened: {last}
        </Text>
        <CommandPalette
          countText={(count) => `${count} results`}
          emptyText="No species or sites match"
          groups={groups}
          hint="↑↓ to move · Enter to open · Esc to close"
          label="Search"
          onOpenChange={setOpen}
          onQueryChange={setQuery}
          open={open}
          placeholder="Search species and sites"
          query={query}
          shortcut="mod+k"
        />
      </Stack>
    </Section>
  );
}
