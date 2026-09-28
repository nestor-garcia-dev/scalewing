import {
  Button,
  Inline,
  Stack,
  Text,
  Toast,
  type ToastTone,
} from '@scalewing/react';
import { useRef, useState } from 'react';

import { Section } from '../layout/Section.js';

function ToneGlyph({ tone }: { tone: ToastTone }) {
  const path =
    tone === 'success'
      ? 'M3 8.5 6.5 12 13 4.5'
      : tone === 'danger'
        ? 'M8 3v6m0 3.5v.5'
        : 'M8 2 14.5 13.5h-13L8 2Zm0 4.5v3.5m0 2v.5';
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 16 16"
      width="16"
    >
      <path d={path} />
    </svg>
  );
}

const tonedToasts: ReadonlyArray<{
  tone: ToastTone;
  press: string;
  message: string;
}> = [
  { tone: 'success', press: 'Save survey', message: 'Survey saved.' },
  {
    tone: 'warning',
    press: 'Sync offline notes',
    message: 'Two notes wait for a signal.',
  },
  {
    tone: 'danger',
    press: 'Close the reserve log',
    message: 'The reserve log is already closed.',
  },
];

export function ToastSection() {
  const [toned, setToned] = useState<ToastTone | null>(null);
  const [open, setOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [target, setTarget] = useState<Element | null>(null);
  const nestRef = useRef<HTMLButtonElement>(null);
  const countRef = useRef<HTMLElement>(null);

  return (
    <Section
      id="toast"
      purpose="Toast is an ephemeral confirmation on the top layer. It auto-dismisses and does not trap focus. With anchor and target it blooms from a press, travels to a destination, lingers, then vanishes. tone success, warning, or danger tints the border and the consumer's icon; danger is announced as an alert, the others as a status. Warning and danger stay 6000 ms unless timeoutMs says otherwise."
      title="Toast"
      usage={`<Toast
  open={open}
  onOpenChange={setOpen}
  anchor={nest}
  target={count}
>
  <Text variant="data">+3</Text>
</Toast>

<Toast open={saved} onOpenChange={setSaved} tone="success" icon={<Check />}>
  <Text>Survey saved.</Text>
</Toast>`}
    >
      <Stack gap={4}>
        <Button
          onPress={() => {
            setOpen(true);
          }}
        >
          Log sighting
        </Button>
        <Toast onOpenChange={setOpen} open={open} timeoutMs={800}>
          <Text variant="data">+3</Text>
        </Toast>
        <Inline gap={2} wrap>
          {tonedToasts.map((item) => (
            <Button
              key={item.tone}
              onPress={() => setToned(item.tone)}
              size="sm"
              variant="secondary"
            >
              {item.press}
            </Button>
          ))}
        </Inline>
        {tonedToasts.map((item) => (
          <Toast
            icon={<ToneGlyph tone={item.tone} />}
            key={item.tone}
            onOpenChange={(next) => {
              if (!next) setToned(null);
            }}
            open={toned === item.tone}
            // Warning and danger keep their 6000 ms default; the success
            // demo stays longer than its 800 ms default so it can be read.
            timeoutMs={item.tone === 'success' ? 4000 : undefined}
            tone={item.tone}
          >
            <Text>{item.message}</Text>
          </Toast>
        ))}
        <Inline align="center" gap={4}>
          <Button
            ref={nestRef}
            onPress={() => {
              setAnchor(nestRef.current);
              setTarget(countRef.current);
              setTravelOpen(true);
            }}
            size="xs"
            variant="ghost"
          >
            Nest
          </Button>
          <Text ref={countRef} variant="data">
            12
          </Text>
        </Inline>
        {travelOpen ? (
          <Toast
            anchor={anchor}
            onOpenChange={setTravelOpen}
            open={travelOpen}
            target={target}
            timeoutMs={800}
          >
            <Text variant="data">+3</Text>
          </Toast>
        ) : null}
      </Stack>
    </Section>
  );
}
