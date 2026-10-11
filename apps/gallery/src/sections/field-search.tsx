import { Field, Text } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';

const birds = [
  'Grey heron',
  'Little egret',
  'Great crested grebe',
  'Kingfisher',
  'Reed warbler',
];

/**
 * A search box over a short list (a magnifier, no label above, a clear
 * button), then a disabled one with a description and a compact one with
 * an error.
 */
export function BirdSearch() {
  const [query, setQuery] = useState('he');
  const [ring, setRing] = useState('7');
  const shown = birds.filter((bird) =>
    bird.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <Field
        clearLabel="Clear search"
        label="Search birds"
        leading={
          <Glyph path="M7 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10z M10.5 10.5 14 14" />
        }
        onClear={() => setQuery('')}
        variant="search"
      >
        <input
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search birds"
          value={query}
        />
      </Field>
      <Text color="muted" data-testid="bird-results" variant="caption">
        {shown.length ? shown.join(', ') : 'No birds match.'}
      </Text>
      <Field
        clearLabel="Clear search"
        description="The ringing log is closed for the night."
        label="Search the ringing log"
        leading={
          <Glyph path="M7 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10z M10.5 10.5 14 14" />
        }
        onClear={() => undefined}
        variant="search"
      >
        <input disabled onChange={() => undefined} value="grebe" />
      </Field>
      <Field
        clearLabel="Clear ring number"
        error="Type at least two letters."
        label="Search ring numbers"
        leading={
          <Glyph path="M7 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10z M10.5 10.5 14 14" />
        }
        onClear={() => setRing('')}
        size="xs"
        variant="search"
      >
        <input
          onChange={(event) => setRing(event.currentTarget.value)}
          value={ring}
        />
      </Field>
    </>
  );
}
