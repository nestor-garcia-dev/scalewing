import { Pressable, ScrollView } from 'react-native';

import {
  mapSegmentedControlStyle,
  mapSegmentedItemStyle,
  segmentedItemColor,
} from '../map-segmented-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Box } from './Box.js';
import { Text } from './Text.js';

export type SegmentedItem = {
  id: string;
  label: string;
};

export type SegmentedControlProps = {
  accessibilityLabel: string;
  items: readonly SegmentedItem[];
  onChange: (id: string) => void;
  /**
   * Lets the track scroll sideways so every label keeps its width, for
   * more items than share a phone's width (five page sections, say).
   */
  scrollable?: boolean;
  value: string;
};

export function SegmentedControl({
  accessibilityLabel,
  items,
  onChange,
  scrollable = false,
  value,
}: SegmentedControlProps) {
  const theme = useTheme();
  const choices = items.map((item) => {
    const selected = item.id === value;

    return (
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        key={item.id}
        onPress={() => {
          if (!selected) {
            onChange(item.id);
          }
        }}
        style={mapSegmentedItemStyle(theme, selected, scrollable)}
      >
        <Text color={segmentedItemColor(selected)} variant="label">
          {item.label}
        </Text>
      </Pressable>
    );
  });

  if (scrollable)
    return (
      <ScrollView
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="radiogroup"
        contentContainerStyle={mapSegmentedControlStyle(theme, true)}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {choices}
      </ScrollView>
    );
  return (
    <Box
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radiogroup"
      style={mapSegmentedControlStyle(theme)}
    >
      {choices}
    </Box>
  );
}
