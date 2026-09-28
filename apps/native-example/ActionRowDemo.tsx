import {
  ActionRow,
  Stack,
  Text,
  useTheme,
  type ActionRowAction,
} from '@scalewing/react-native';
import { useState } from 'react';
import { View } from 'react-native';

/**
 * A token-sized placeholder for a consumer's Lucide glyph: spacing step 5
 * in the accent, as ADR 0008 asks of a real icon.
 */
function GlyphMark() {
  const theme = useTheme();

  return (
    <View
      style={{
        borderColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
        borderWidth: theme.focusRing.width,
        height: theme.space[5],
        width: theme.space[5],
      }}
    />
  );
}

/** Actions under a habitat's title: two, then more than four with More. */
export function ActionRowDemo() {
  const [last, setLast] = useState('None yet');
  const act = (label: string, extra: Partial<ActionRowAction> = {}) =>
    ({
      icon: <GlyphMark />,
      key: label,
      label,
      onPress: () => setLast(label),
      testID: `habitat-action-${label.toLowerCase()}`,
      ...extra,
    }) satisfies ActionRowAction;

  return (
    <Stack gap={3}>
      <Text variant="label">Wetland</Text>
      <ActionRow
        accessibilityLabel="Wetland actions"
        actions={[
          act('Sighting', { accessibilityLabel: 'Log a sighting' }),
          act('Feeding', { disabled: true }),
        ]}
      />
      <ActionRow
        accessibilityLabel="Forest actions"
        actions={[
          act('Sighting'),
          act('Photo'),
          act('Keeper'),
          act('Map'),
          act('Report'),
        ]}
        more={{
          accessibilityLabel: 'More habitat actions',
          icon: <GlyphMark />,
          label: 'More',
          onPress: (rest) =>
            setLast(`More: ${rest.map((item) => item.label).join(', ')}`),
          testID: 'habitat-action-more',
        }}
      />
      <Text color="muted" variant="caption">
        Last action: {last}
      </Text>
    </Stack>
  );
}
