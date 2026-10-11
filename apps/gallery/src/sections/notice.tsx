import { Button, Checkbox, Field, Notice, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const info = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 16v-4 M12 8h.01';

export function NoticeSection() {
  const [checked, setChecked] = useState(false);

  return (
    <Section
      id="notice"
      purpose="Notice is a tinted note in the page's flow: info, success, warning or danger. A bold title leads, the message follows on the same row while it fits, and one action ends the row. Danger is announced as an alert and the others as a status; role none is for a note that is part of the page from the start. The note stays until the page removes it; pass tabIndex -1 and a ref to move focus to it."
      title="Notice"
      usage={`<Notice tone="danger" title="$30.00 short.">
  Add the bills or change the amount.
</Notice>

<Notice
  tone="info"
  role="none"
  title="Three surveys are due this week."
  action={<Button size="sm" variant="ghost" onPress={openTasks}>Open tasks</Button>}
/>

<Notice tone="danger" title="Two nests short.">
  <Stack gap={2}>
    <span>Recording it lowers the season's count.</span>
    <Checkbox label="I counted again" checked={checked} onCheckedChange={setChecked} />
  </Stack>
</Notice>`}
    >
      <Stack gap={3}>
        <Notice
          action={
            <Button onPress={() => undefined} size="sm" variant="ghost">
              Open the log
            </Button>
          }
          icon={<Glyph grid={24} path={info} size={16} />}
          role="none"
          title="Three surveys are due this week."
          tone="info"
        />
        <Notice title="Survey saved." tone="success">
          The wetland count is in the season's log.
        </Notice>
        <Notice title="Unconfirmed sighting." tone="warning">
          Look twice at the photo before you log the heron.
        </Notice>
        <Notice title="The river crossing is closed." tone="danger">
          Do not cross at the ford. Reason: the water rose overnight.
        </Notice>
        <Notice
          data-testid="notice-stacked"
          title="Two nests short."
          tone="danger"
        >
          <Stack gap={2}>
            <span>Recording it lowers the season&apos;s count by two.</span>
            <Field description="Required" label="Why is it short?">
              <input placeholder="For example: a fox took two eggs" />
            </Field>
            <Checkbox
              checked={checked}
              label="I counted again and it is still short"
              onCheckedChange={setChecked}
            />
          </Stack>
        </Notice>
        <Text color="muted" variant="caption">
          The words take the tone&apos;s ink on its tint; put the message in
          plain text, not a colored Text. A text message shares the title&apos;s
          row; any element stacks it under the title. A checkbox or field inside
          keeps its own colors, except muted words, which take the ink. In
          forced colors a border replaces the fill.
        </Text>
      </Stack>
    </Section>
  );
}
