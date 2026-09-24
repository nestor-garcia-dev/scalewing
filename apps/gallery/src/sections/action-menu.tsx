import {
  ActionMenu,
  Button,
  Dialog,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function ActionMenuSection() {
  const [lastAction, setLastAction] = useState('None yet');
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Section
      id="action-menu"
      purpose="ActionMenu holds independent commands. Select chooses a value; ActionMenu does not. The caller supplies localized names, icons, and callbacks. Focus returns to the trigger before a command runs, so a dialog opened from the menu hands focus back to it on close."
      title="ActionMenu"
      usage={`<ActionMenu
  label="Sighting actions"
  items={[{ id: 'share', label: 'Share sighting', onSelect: share }]}
/>`}
    >
      <Stack gap={3}>
        <Inline gap={3} wrap>
          <ActionMenu
            items={[
              {
                id: 'share',
                label: 'Share sighting',
                onSelect: () => setLastAction('Share sighting'),
              },
              {
                id: 'archive',
                label: 'Archive sighting',
                onSelect: () => setLastAction('Archive sighting'),
              },
              {
                id: 'delete',
                label: 'Delete sighting',
                destructive: true,
                onSelect: () => setConfirmDelete(true),
              },
            ]}
            label="Sighting actions"
          />
          <ActionMenu
            items={[
              {
                id: 'edit',
                label: 'Edit observation',
                onSelect: () => setLastAction('Edit observation'),
              },
              {
                id: 'closed',
                label: 'Unavailable action',
                disabled: true,
                onSelect: () => setLastAction('Unavailable action'),
              },
            ]}
            label="Observation actions"
            trigger="More"
          />
          <ActionMenu disabled items={[]} label="Unavailable menu" />
        </Inline>
        <Dialog
          onClose={() => setConfirmDelete(false)}
          open={confirmDelete}
          title="Delete this sighting?"
        >
          <Text>The snow leopard sighting leaves the census.</Text>
          <Inline gap={2} justify="end">
            <Button onPress={() => setConfirmDelete(false)} variant="secondary">
              Keep sighting
            </Button>
            <Button
              onPress={() => {
                setConfirmDelete(false);
                setLastAction('Delete sighting');
              }}
              variant="danger"
            >
              Delete sighting
            </Button>
          </Inline>
        </Dialog>
        <Text color="muted" variant="caption">
          Last action: {lastAction}. Try Enter or Space, Arrow keys, Home, End,
          and Escape.
        </Text>
      </Stack>
    </Section>
  );
}
