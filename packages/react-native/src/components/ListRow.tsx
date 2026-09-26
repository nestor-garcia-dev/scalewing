import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import {
  listCheckColor,
  listRowAccessory,
  mapListChevronStyle,
  mapListRowStyle,
  type ListRowAccessory,
} from '../map-list-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type ListRowProps = {
  /** Replaces the default name: title, detail, and value joined by commas. */
  accessibilityLabel?: string;
  /** `none` hides the chevron of a pressable row that acts in place. */
  accessory?: 'chevron' | 'none';
  /** A muted line under the title. */
  detail?: string;
  disabled?: boolean;
  /** A consumer mark or glyph on the start side (ADR 0008). */
  leading?: ReactNode;
  /** Without it the row is read-only: no chevron and no pressed state. */
  onPress?: () => void;
  /** Makes the row a choice: a check while true, and the selected state. */
  selected?: boolean;
  testID?: string;
  title: string;
  /** A muted value on the end side, before the accessory. */
  value?: string;
};

function rowName({ detail, title, value }: ListRowProps): string {
  return [title, detail, value].filter(Boolean).join(', ');
}

function Accessory({ kind }: { kind: ListRowAccessory }) {
  const theme = useTheme();
  if (kind === 'none') return null;
  if (kind === 'check')
    return (
      <Text
        accessibilityElementsHidden
        color={listCheckColor}
        importantForAccessibility="no"
        variant="label"
      >
        ✓
      </Text>
    );
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={mapListChevronStyle(theme)}
    />
  );
}

function RowContent(props: ListRowProps) {
  const { detail, leading, onPress, selected, title, value } = props;
  const accessory = listRowAccessory({
    accessory: props.accessory,
    pressable: onPress !== undefined,
    selected,
  });

  return (
    <>
      {leading}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="label">{title}</Text>
        {detail ? (
          <Text color="muted" variant="caption">
            {detail}
          </Text>
        ) : null}
      </View>
      {value ? <Text color="muted">{value}</Text> : null}
      <Accessory kind={accessory} />
    </>
  );
}

/**
 * One row of a `ListGroup`: it opens another screen (a chevron), picks one
 * option in place (`selected`), or only shows a value (no `onPress`).
 */
export function ListRow(props: ListRowProps) {
  const theme = useTheme();
  const disabled = props.disabled ?? false;
  const name = props.accessibilityLabel ?? rowName(props);

  if (!props.onPress)
    return (
      <View
        accessibilityLabel={name}
        accessibilityState={{ disabled }}
        accessible
        style={mapListRowStyle(theme, { disabled, pressed: false })}
        testID={props.testID}
      >
        <RowContent {...props} />
      </View>
    );

  return (
    <Pressable
      accessibilityLabel={name}
      accessibilityRole="button"
      accessibilityState={
        props.selected === undefined
          ? { disabled }
          : { disabled, selected: props.selected }
      }
      disabled={disabled}
      onPress={props.onPress}
      style={({ pressed }) => mapListRowStyle(theme, { disabled, pressed })}
      testID={props.testID}
    >
      <RowContent {...props} />
    </Pressable>
  );
}
