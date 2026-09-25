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
  /** A muted line under the label, read after it. */
  detail?: string;
};

export type CheckListProps = {
  disabled: boolean;
  items: readonly CheckListItem[];
  label: string;
  onPress: (id: string) => void;
  /** `checkbox` rows toggle; `radio` rows form one radiogroup. */
  role: 'checkbox' | 'radio';
  value: readonly string[];
};

function rowName(item: CheckListItem): string {
  return item.detail ? `${item.label}, ${item.detail}` : item.label;
}

/**
 * Private list of rows for the `list` variants of MultiSelect (checkboxes)
 * and SingleSelect (radios): the label, and an optional muted detail, on the
 * start side and a check mark on the end side of each selected row.
 */
export function CheckList({
  disabled,
  items,
  label,
  onPress,
  role,
  value,
}: CheckListProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole={role === 'radio' ? 'radiogroup' : undefined}
      style={mapCheckListStyle(theme)}
    >
      {items.map((item, index) => {
        const selected = value.includes(item.id);
        return (
          <Pressable
            accessibilityLabel={rowName(item)}
            accessibilityRole={role}
            accessibilityState={
              role === 'checkbox'
                ? { checked: selected, disabled }
                : { disabled, selected }
            }
            disabled={disabled}
            key={item.id}
            onPress={() => onPress(item.id)}
            style={mapCheckRowStyle(theme, {
              disabled,
              first: index === 0,
            })}
          >
            <View style={{ flex: 1 }}>
              <Text variant={selected ? 'label' : 'body'}>{item.label}</Text>
              {item.detail ? (
                <Text color="muted" variant="caption">
                  {item.detail}
                </Text>
              ) : null}
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
