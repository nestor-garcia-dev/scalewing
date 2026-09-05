import { Button, Inline, Stack, Text, Toast } from '@scalewing/react';
import { useRef, useState } from 'react';

import { Section } from '../layout/Section.js';

export function ToastSection() {
  const [open, setOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [target, setTarget] = useState<Element | null>(null);
  const nestRef = useRef<HTMLButtonElement>(null);
  const countRef = useRef<HTMLElement>(null);

  return (
    <Section
      id="toast"
      purpose="Toast is an ephemeral confirmation on the top layer. It auto-dismisses and does not trap focus. With anchor and target it blooms from a press, travels to a destination, lingers, then vanishes."
      title="Toast"
      usage={`<Toast
  open={open}
  onOpenChange={setOpen}
  anchor={nest}
  target={count}
>
  <Text variant="data">+3</Text>
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
