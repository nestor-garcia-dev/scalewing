import { Button, InfoTip, Inline, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

// A circled "i", standing in for the consumer's Lucide Info glyph.
const infoGlyph =
  'M8 1.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13z M8 7.5v3.5 M8 5h.01';

export function InfoTipSection() {
  const [submitted, setSubmitted] = useState(0);

  return (
    <Section
      id="info-tip"
      purpose="InfoTip is a toggletip: a ghost icon-only button whose only job is to show its tip. Hover and a keyboard focus show it as Tooltip does; a press (a tap, a click, Enter or Space) shows it and keeps it shown until the next press, Escape, blur or a press outside. The tip is the button's description, and a press also says it once in a polite live region. The button is 44 px by default and on any touch screen, and never submits a form. Use it for an icon-only hint; a Button that acts keeps Tooltip."
      title="InfoTip"
      usage={`<Inline gap={1}>
  <Text>Expected waders</Text>
  <InfoTip
    content="Counted at the last high tide, before the hides opened"
    label="About the expected waders"
  >
    <Info aria-hidden size={16} />
  </InfoTip>
</Inline>`}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted((count) => count + 1);
        }}
      >
        <Stack gap={3}>
          <Inline gap={2} justify="between">
            <Text>Expected waders: 128</Text>
            <InfoTip
              content="Counted at the last high tide, before the hides opened"
              label="About the expected waders"
            >
              <Glyph path={infoGlyph} />
            </InfoTip>
          </Inline>
          <Inline gap={1}>
            <Text color="muted" variant="caption">
              Tide table
            </Text>
            <InfoTip
              content="Times are local to the estuary"
              label="About the tide table"
              size="sm"
            >
              <Glyph path={infoGlyph} size={14} />
            </InfoTip>
          </Inline>
          <Inline gap={3}>
            <Button onPress={() => undefined} type="submit" variant="secondary">
              Submit the count
            </Button>
            <Text color="muted" variant="caption">
              Counts submitted: {submitted}
            </Text>
          </Inline>
        </Stack>
      </form>
    </Section>
  );
}
