import {
  ActionMenu,
  Box,
  Button,
  ButtonGroup,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';

/**
 * A crowded header row from `md`: a long title beside a nested row of a
 * small neutral Button and a text ActionMenu (the colony being counted),
 * in an Inline that does not wrap. The actions' Inline keeps its natural
 * width (`shrink={false}`) and the button's and the trigger's words stay
 * on one line; the title gives way and wraps instead.
 */
export function ButtonOneLineExample({
  onPress,
}: {
  onPress: (what: string) => void;
}) {
  return (
    <Stack gap={2}>
      <Text as="h3" variant="label">
        One line in a crowded row
      </Text>
      {/* From md: on a phone a header puts its actions on a row of their own. */}
      <Box
        border="bottom"
        data-sample="crowded-row"
        hideBelow="md"
        paddingY={2}
      >
        <Inline align="center" gap={3} justify="between" wrap={false}>
          <Text as="span" variant="title">
            North marsh boardwalk · heron colony night count, west hides
          </Text>
          <Inline align="center" gap={2} shrink={false} wrap={false}>
            <Button
              onPress={() => onPress('Switch to the night roost')}
              size="sm"
              variant="neutral"
            >
              Switch to the night roost
            </Button>
            <ActionMenu
              align="end"
              items={[
                {
                  id: 'colony-habitat',
                  label: 'Habitat',
                  onSelect: () => onPress('Habitat'),
                },
              ]}
              label="Great crested grebe colony · Wetland"
              trigger="Great crested grebe colony"
              triggerAppearance="text"
            />
          </Inline>
        </Inline>
      </Box>
      <Box data-sample="crowded-direct" hideBelow="md">
        <Inline align="center" gap={3} justify="between" wrap={false}>
          <Text as="span" variant="label">
            Every hide on the west boardwalk counted twice tonight, then again
            at dawn
          </Text>
          <Button
            onPress={() => onPress('Hand the count to the next hide')}
            size="sm"
            variant="neutral"
          >
            Hand the count to the next hide
          </Button>
        </Inline>
      </Box>
      {(['row-of-buttons', 'row-of-buttons-wrap'] as const).map((sample) => (
        <Box data-sample={sample} hideBelow="md" key={sample}>
          <Inline gap={2} wrap={sample === 'row-of-buttons-wrap'}>
            {['Log a sighting', 'Count the nests', 'Close the hide'].map(
              (label) => (
                <Button
                  key={label}
                  onPress={() => onPress(label)}
                  size="sm"
                  variant="neutral"
                >
                  {label}
                </Button>
              ),
            )}
          </Inline>
        </Box>
      ))}
      <Box data-sample="joined-words">
        <ButtonGroup aria-label="Sighting window" attached>
          {['Earlier sightings', 'This morning only', 'Later sightings'].map(
            (label) => (
              <Button
                key={label}
                onPress={() => onPress(label)}
                variant="secondary"
              >
                {label}
              </Button>
            ),
          )}
        </ButtonGroup>
      </Box>
      <Text color="muted" variant="caption">
        A Button and a menu keep their natural width in a crowded row, and their
        own Inline (shrink false) keeps its: the title beside them gives way and
        wraps, while their words stay on one line. Only a container narrower
        than a button&apos;s words wraps them, inside the pill, every word
        shown. A row of Buttons that does not fit overflows its Inline; with
        wrap, the Buttons move to the next line instead. An attached ButtonGroup
        keeps its one row: in a narrow column its segments share it and wrap
        their words.
      </Text>
    </Stack>
  );
}
