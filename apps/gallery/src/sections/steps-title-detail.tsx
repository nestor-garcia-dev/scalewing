import { Field, Step, Steps, Text } from '@scalewing/react';
import { useState } from 'react';

/**
 * Step `titleDetail`: muted words beside an open step's title, on its
 * line. A field-notes form with every step open: a done step with its
 * words and summary, a long title whose words ("Wetlands done · Woodlands
 * empty") wrap under it on a phone, and an optional note.
 */
export function StepsTitleDetailExample() {
  const [note, setNote] = useState('');
  return (
    <Steps aria-label="Field notes, every step open" open>
      <Step
        status="done"
        summary="North marsh"
        title="The site"
        titleDetail="Checked Oct 16"
      >
        <Text color="muted">North marsh, by the boardwalk.</Text>
      </Step>
      <Step
        status="current"
        title="Where the colony nests along the north marsh"
        titleDetail="Wetlands done · Woodlands empty"
      >
        <Text color="muted">Write each habitat's notes in its own tab.</Text>
      </Step>
      <Step
        status={note.trim() ? 'done' : 'current'}
        title="A note"
        titleDetail="Optional"
      >
        <Field label="Note">
          <textarea
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            value={note}
          />
        </Field>
      </Step>
    </Steps>
  );
}
