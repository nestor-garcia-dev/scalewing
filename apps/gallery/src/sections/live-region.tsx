import {
  Button,
  Card,
  Inline,
  LiveRegion,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function LiveRegionSection() {
  const [sightings, setSightings] = useState(0);
  const [copies, setCopies] = useState(0);
  const [countError, setCountError] = useState('');

  return (
    <Section
      id="live-region"
      purpose="LiveRegion is a status line whose words change and are read out: a region that is always in the page and starts empty, its words swapped in as a new node each time children or announceKey changes, so new words are read, and the same words again when the key changes (a second Copied). It waits a moment after it first appears before taking its first words, which screen readers would otherwise miss. politeness polite (the default) is a status read when the reader is idle; assertive is an alert read at once, for an error the person must hear first. It is drawn inline in Text's look (variant, color), or visuallyHidden for a change the page already shows another way, such as a button's label turning to Copied. Use it rather than a role status of your own whenever the words change on a region already in the page, a save line, a count after a filter, a copy confirmation, and never on a heading or a whole card. Toast, Notice, Skeleton, Field's error and Pagination's range already own their regions; do not wrap them."
      title="LiveRegion"
      usage={`<LiveRegion color="muted" variant="caption">
  {saving ? 'Saving…' : 'Saved'}
</LiveRegion>

<Button onPress={copy}>{copied ? 'Copied' : 'Copy ring code'}</Button>
<LiveRegion announceKey={copies} visuallyHidden>
  {copies > 0 ? 'Ring code copied' : ''}
</LiveRegion>

<LiveRegion color="danger" politeness="assertive">{error}</LiveRegion>`}
    >
      <Card padding={4}>
        <Stack gap={4}>
          <Stack gap={2}>
            <Inline align="center" gap={3}>
              <Button
                onPress={() => setSightings((count) => count + 1)}
                variant="neutral"
              >
                Log a heron
              </Button>
              <LiveRegion color="muted" variant="caption">
                {sightings === 0
                  ? 'No herons logged yet'
                  : `${sightings} ${sightings === 1 ? 'heron' : 'herons'} logged`}
              </LiveRegion>
            </Inline>
            <Text color="muted" variant="caption">
              Polite and drawn: the count is read each time it changes.
            </Text>
          </Stack>
          <Stack gap={2}>
            <Inline align="center" gap={3}>
              <Button
                onPress={() => setCopies((count) => count + 1)}
                variant="neutral"
              >
                {copies > 0 ? 'Copied' : 'Copy ring code'}
              </Button>
              <LiveRegion announceKey={copies} visuallyHidden>
                {copies > 0 ? 'Ring code copied' : ''}
              </LiveRegion>
            </Inline>
            <Text color="muted" variant="caption">
              Hidden, with a key: each press is read again, though the words are
              the same.
            </Text>
          </Stack>
          <Stack gap={2}>
            <Inline align="center" gap={3}>
              <Button
                onPress={() => setCountError('Add a species before you send')}
                variant="neutral"
              >
                Send the count
              </Button>
              <LiveRegion color="danger" politeness="assertive">
                {countError}
              </LiveRegion>
            </Inline>
            <Text color="muted" variant="caption">
              Assertive: an error read at once.
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Section>
  );
}
