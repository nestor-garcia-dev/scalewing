import {
  ActionMenu,
  Button,
  Card,
  Dialog,
  Grid,
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
      purpose="ActionMenu holds independent commands. Select chooses a value; ActionMenu does not. The caller supplies localized names, icons, and callbacks. Focus returns to the trigger before a command runs, so a dialog opened from the menu hands focus back to it on close. The menu opens a small gap below its trigger (above it near the bottom of the screen), keeps clear of the screen edges, and lines up with the trigger's end when the trigger ends a row. align end lines it up with the trigger's end even where the start would fit, so a menu from the end of a card stays over that card. On a touch screen the trigger is at least 44 px square and each command 44 px tall. A long command wraps inside the screen. header puts a non-interactive block above the commands, such as the station a ranger is working from: muted, set off by a hairline, outside the arrow keys, and read as the menu's description when it opens. An item's lang marks a label in another language, such as English on a Spanish page."
      title="ActionMenu"
      usage={`<ActionMenu
  label="Sighting actions"
  items={[{ id: 'share', label: 'Share sighting', onSelect: share }]}
/>

<ActionMenu
  label="Estación Laguna Azul · Aves acuáticas"
  header={<><Text as="strong" variant="label">Estación Laguna Azul</Text><Text as="span" variant="caption" color="muted">Aves acuáticas</Text></>}
  items={[
    { id: 'language', label: 'English', lang: 'en', onSelect: toEnglish },
    { id: 'station', label: 'Cambiar de estación', onSelect: changeStation },
  ]}
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
        <Inline gap={3} lang="es">
          <ActionMenu
            align="end"
            header={
              <>
                <Text as="strong" variant="label">
                  Estación Laguna Azul
                </Text>
                <Text as="span" variant="caption" color="muted">
                  Aves acuáticas · Censo de invierno: 42 avistamientos esta
                  temporada.
                </Text>
              </>
            }
            items={[
              {
                id: 'language',
                label: 'English',
                lang: 'en',
                onSelect: () => setLastAction('English'),
              },
              {
                id: 'station',
                label: 'Cambiar de estación',
                onSelect: () => setLastAction('Cambiar de estación'),
              },
            ]}
            label="Estación Laguna Azul · Aves acuáticas"
            trigger="Estación"
          />
          <ActionMenu
            items={[
              {
                id: 'move-campaign',
                label:
                  'Mover este avistamiento a otra campaña de censo de la misma región y temporada',
                onSelect: () => setLastAction('Mover a otra campaña'),
              },
              {
                id: 'archive-es',
                label: 'Archivar avistamiento',
                onSelect: () => setLastAction('Archivar avistamiento'),
              },
            ]}
            label="Acciones del avistamiento"
            trigger="Acciones"
          />
        </Inline>
        <Card padding={3}>
          <Inline gap={3} justify="between">
            <Text variant="label">Snow leopard · Alpine</Text>
            <ActionMenu
              items={[
                {
                  id: 'move',
                  label: 'Move to another survey',
                  onSelect: () => setLastAction('Move to another survey'),
                },
                {
                  id: 'remove',
                  label: 'Remove from census',
                  destructive: true,
                  onSelect: () => setLastAction('Remove from census'),
                },
              ]}
              label="More actions for Snow leopard"
              trigger="⋯"
            />
          </Inline>
        </Card>
        <Grid columns={2} columnsBelow={{ md: 1 }} gap={3}>
          {['Red fox', 'Green sea turtle'].map((animal) => (
            <Card key={animal} padding={3}>
              <Inline gap={3} justify="between">
                <Text variant="label">{animal}</Text>
                <ActionMenu
                  align="end"
                  items={[
                    {
                      id: 'flag',
                      label: 'Flag for review',
                      onSelect: () => setLastAction(`Flag ${animal}`),
                    },
                    {
                      id: 'remove',
                      label: 'Remove',
                      destructive: true,
                      onSelect: () => setLastAction(`Remove ${animal}`),
                    },
                  ]}
                  label={`Actions for ${animal}`}
                  trigger="⋯"
                />
              </Inline>
            </Card>
          ))}
        </Grid>
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
