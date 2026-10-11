import { Button, Stack, Text, Toast } from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';

/**
 * The corner card: what was saved, its detail, an Open action and the time
 * left, held while the pointer or focus is on it.
 */
export function ToastCardExample() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(0);

  return (
    <Stack data-testid="toast-card" gap={2}>
      <Button onPress={() => setOpen(true)} size="sm" variant="secondary">
        Save the heron count
      </Button>
      <Text color="muted" variant="caption">
        Count opened: {opened}
      </Text>
      <Toast
        action={{ label: 'Open', onPress: () => setOpened((n) => n + 1) }}
        icon={<Glyph path="M3 8.5 6.5 12 13 4.5" />}
        onOpenChange={setOpen}
        open={open}
        placement="top-end"
        showRemaining
        timeoutMs={10000}
        title="Heron count saved"
        tone="success"
      >
        12 herons · 2 nests
      </Toast>
    </Stack>
  );
}
