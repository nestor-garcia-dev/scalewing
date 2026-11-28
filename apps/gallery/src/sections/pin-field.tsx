import { Button, Card, Inline, PinField, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

/** A new code typed twice, as a settings sheet asks for it. */
function NewCode() {
  const [code, setCode] = useState('');
  const [again, setAgain] = useState('');
  const differs = again.length === 6 && again !== code;
  return (
    <Stack gap={4}>
      <PinField
        description="Six digits. The dots fill as you type."
        label="New gate code"
        onChange={setCode}
        value={code}
      />
      <PinField
        error={differs ? 'The two codes are not the same.' : undefined}
        label="Enter it again"
        onChange={setAgain}
        value={again}
      />
    </Stack>
  );
}

/** A code pressed on the pad and checked at its last digit. */
function HideDoor() {
  const [code, setCode] = useState('');
  const [checks, setChecks] = useState(0);
  return (
    <Stack align="center" gap={3}>
      <PinField
        description="Checked at the sixth digit."
        label="Hide door code"
        onChange={setCode}
        onComplete={() => setChecks((count) => count + 1)}
        pad
        value={code}
      />
      {/* Says that a code was sent, never which. */}
      <Text color="muted" role="status" variant="caption">
        {checks === 0
          ? 'No code checked yet'
          : `Codes checked: ${checks === 1 ? 'one' : 'more than one'}`}
      </Text>
      <Button onPress={() => setCode('')} size="sm" variant="secondary">
        Clear the dots
      </Button>
    </Stack>
  );
}

/** A code that was refused: the dots emptied and the reason under the keys. */
function RefusedCode() {
  const [code, setCode] = useState('');
  const [refused, setRefused] = useState(true);
  return (
    <PinField
      error={refused ? 'That code is not right. Try again.' : undefined}
      label="Boat shed code"
      length={4}
      onChange={(next) => {
        setRefused(false);
        setCode(next);
      }}
      onComplete={() => {
        setRefused(true);
        setCode('');
      }}
      pad
      value={code}
    />
  );
}

export function PinFieldSection() {
  return (
    <Section
      id="pin-field"
      purpose={
        'PinField is a code of a fixed number of digits (length, 6 by default) that is never shown: a dot per digit, typed in one real input (inputmode="numeric", never a password field, kept out of autofill) or pressed on an optional pad. The input holds a mask character per digit, never the digits, which live only in the value you hold, so the page’s text, attributes and names never carry them. The count ("3 of 6 digits entered", your words in labels.count) describes the input and is announced politely after each entry. Typing and pasting keep digits only; Backspace removes the last. onComplete is called once at the last digit. pad adds twelve keys, 1 to 9, 0 and Delete, each a button of at least 64 px that keeps the focus when pressed; with it the field is a centred column and its hint and error sit under the keys. error, description and disabled are Field’s.'
      }
      title="PinField"
      usage={`<PinField
  label="New gate code"
  description="Six digits."
  value={code}
  onChange={setCode}
/>

<PinField
  label="Hide door code"
  labelVisuallyHidden
  pad
  autoFocus
  value={code}
  onChange={setCode}
  onComplete={check}
  error={refused ? 'That code is not right. Try again.' : undefined}
  labels={{
    count: '{count} of {length} digits entered',
    delete: 'Delete the last digit',
    pad: 'Number pad',
  }}
/>`}
    >
      <Stack gap={5}>
        <div data-testid="pin-field-typed">
          <NewCode />
        </div>
        <Inline align="start" gap={5} wrap>
          <Card data-testid="pin-field-pad">
            <HideDoor />
          </Card>
          <Card data-testid="pin-field-refused">
            <RefusedCode />
          </Card>
        </Inline>
        {/* Full-width blocks: the padded field centres itself in one. */}
        <Stack gap={5}>
          <div data-testid="pin-field-disabled">
            <PinField
              disabled
              label="Old gate code, locked"
              onChange={() => {}}
              value="123"
            />
          </div>
          <div data-testid="pin-field-disabled-pad">
            <PinField
              disabled
              label="Nest box code, while it is checked"
              length={4}
              onChange={() => {}}
              pad
              value="1234"
            />
          </div>
        </Stack>
      </Stack>
    </Section>
  );
}
