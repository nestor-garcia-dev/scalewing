import { Button, Inline, Stack, Switch, Text, Tooltip } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const destinations = [
  { name: 'Range map', path: 'M8 14s-5-4.5-5-8a5 5 0 0 1 10 0c0 3.5-5 8-5 8z' },
  { name: 'Field notes', path: 'M4 2h8v12H4z M6 5h4 M6 8h4 M6 11h2' },
];

/*
 * Icon-only buttons named by their tooltips, the way a navigation shows only
 * glyphs on a phone. With the names shown as text, each tooltip is off and
 * the visible name names the same, still-mounted button.
 */
function NamedByTooltip() {
  const [namesShown, setNamesShown] = useState(false);
  const [opened, setOpened] = useState('none');

  return (
    <Stack gap={2}>
      <Inline gap={3}>
        {destinations.map(({ name, path }) => (
          <Tooltip
            content={name}
            disabled={namesShown}
            key={name}
            relationship="label"
            trigger={
              <Button onPress={() => setOpened(name)} variant="secondary">
                <Glyph path={path} />
                {namesShown ? name : null}
              </Button>
            }
          />
        ))}
      </Inline>
      <Switch
        checked={namesShown}
        description="Each button shows its name, so its tooltip is off"
        label="Show the destinations' names"
        onCheckedChange={setNamesShown}
      />
      <Text color="muted" variant="caption">
        Opened: {opened}. Each tooltip is its button's name, read once.
      </Text>
    </Stack>
  );
}

export function TooltipSection() {
  const [pressCount, setPressCount] = useState(0);
  const [helpShown, setHelpShown] = useState(false);

  return (
    <Section
      id="tooltip"
      purpose="Tooltip adds supplementary help to an already named trigger. Hover, focus, or touch exposes the text; required instructions stay visible. Disabled turns the tooltip off, not its trigger, which stays mounted and keeps its focus, for help that is shown as text at some widths. Relationship label makes the tooltip the name of an icon-only trigger instead of its description, so the name is read once; while disabled, the trigger needs its own visible name or aria-label."
      title="Tooltip"
      usage={`<Tooltip
  content="Sighting records include the observation time"
  trigger={<Button aria-label="Sighting details" onPress={openDetails}>?</Button>}
/>

<Tooltip
  content="Where each species lives"
  disabled={helpShown}
  trigger={<Button aria-label="Habitat map" onPress={openMap}>{icon}</Button>}
/>
{helpShown ? <Text variant="caption">Where each species lives</Text> : null}

<Tooltip
  content="Range map"
  disabled={namesShown}
  relationship="label"
  trigger={
    <Button onPress={openMap}>
      {icon}
      {namesShown ? 'Range map' : null}
    </Button>
  }
/>`}
    >
      <Stack gap={3}>
        <Inline gap={3}>
          <Tooltip
            content="Sighting records include the observation time"
            trigger={
              <Button
                aria-label="Sighting details"
                onPress={() => setPressCount((count) => count + 1)}
                variant="secondary"
              >
                ?
              </Button>
            }
          />
          <Tooltip
            content="The habitat guide describes local species"
            trigger={
              <Button
                onPress={() => setPressCount((count) => count + 1)}
                variant="secondary"
              >
                Habitat guide
              </Button>
            }
          />
          <Tooltip
            content="Where each species lives"
            disabled={helpShown}
            trigger={
              <Button
                aria-label="Habitat map"
                onPress={() => setPressCount((count) => count + 1)}
                variant="secondary"
              >
                ⌖
              </Button>
            }
          />
          {helpShown ? (
            <Text color="muted" variant="caption">
              Where each species lives
            </Text>
          ) : null}
        </Inline>
        <Switch
          checked={helpShown}
          description="The map's help shows as text, so its tooltip is off"
          label="Show the map's help"
          onCheckedChange={setHelpShown}
        />
        <Text color="muted" variant="caption">
          Actions pressed: {pressCount}. The tooltip supplements each button
          name.
        </Text>
        <NamedByTooltip />
      </Stack>
    </Section>
  );
}
