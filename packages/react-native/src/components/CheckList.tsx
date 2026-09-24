import { Pressable, View } from 'react-native';

import {
  checkMarkColor,
  mapCheckListStyle,
  mapCheckRowStyle,
} from '../map-check-list-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type CheckListItem = {
  id: string;
  label: string;
};

export type CheckListProps = {
  disabled: boolean;
  items: readonly CheckListItem[];
  label: string;
  onToggle: (id: string) => void;
  value: readonly string[];
};

/**
 * Private list of checkbox rows for MultiSelect's `list` variant: the label
 * on the start side and a check mark on the end side of each selected row.
 */
export function CheckList({
  disabled,
  items,
  label,
  onToggle,
  value,
}: CheckListProps) {
  const theme = useTheme();

  return (
    <View accessibilityLabel={label} style={mapCheckListStyle(theme)}>
      {items.map((item, index) => {
        const selected = value.includes(item.id);
        return (
          <Pressable
            accessibilityLabel={item.label}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected, disabled }}
            disabled={disabled}
            key={item.id}
            onPress={() => onToggle(item.id)}
            style={mapCheckRowStyle(theme, {
              disabled,
              first: index === 0,
            })}
          >
            <View style={{ flex: 1 }}>
              <Text variant={selected ? 'label' : 'body'}>{item.label}</Text>
            </View>
            {selected ? (
              <Text
                accessibilityElementsHidden
                color={checkMarkColor(selected)}
                importantForAccessibility="no"
                variant="label"
              >
                ✓
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
