import { Pressable } from 'react-native';

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
  value: string;
};

export function SegmentedControl({
  accessibilityLabel,
  items,
  onChange,
  value,
}: SegmentedControlProps) {
  const theme = useTheme();

  return (
    <Box
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radiogroup"
      style={mapSegmentedControlStyle(theme)}
    >
      {items.map((item) => {
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
            style={mapSegmentedItemStyle(theme, selected)}
          >
            <Text color={segmentedItemColor(selected)} variant="label">
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
}
