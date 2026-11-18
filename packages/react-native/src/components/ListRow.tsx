import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import {
  listCheckColor,
  listRowAccessory,
  listRowTitleColor,
  mapListChevronStyle,
  mapListRowStyle,
  type ListRowAccessory,
  type ListRowTone,
} from '../map-list-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { ListRowLabel } from './ListRowLabel.js';
import { ListRowSwitch } from './ListRowSwitch.js';
import { Text } from './Text.js';

type ListRowBaseProps = {
  /** Replaces the default name: title, detail, and value joined by commas. */
  accessibilityLabel?: string;
  /** A muted line under the title. */
  detail?: string;
  disabled?: boolean;
  /** A consumer mark or glyph on the start side (ADR 0008). */
  leading?: ReactNode;
  testID?: string;
  title: string;
  /**
   * `danger` draws the title in the danger colour, for a row that ends
   * something, such as Sign out. Any confirm stays the consumer's.
   */
  tone?: ListRowTone;
  /** A muted value on the end side, before the accessory. */
  value?: string;
};

/** A row that opens something, picks an option, or only shows a value. */
export type ListRowPressProps = ListRowBaseProps & {
  /** `none` hides the chevron of a pressable row that acts in place. */
  accessory?: 'chevron' | 'none';
  /** Without it the row is read-only: no chevron and no pressed state. */
  onPress?: () => void;
  onSwitchChange?: never;
  /** Makes the row a choice: a check while true, and the selected state. */
  selected?: boolean;
  switchValue?: never;
};

/**
 * A row that turns a setting on or off in place with a native switch on
 * its end side. A tap anywhere on the row toggles it; it never navigates.
 */
export type ListRowSwitchProps = ListRowBaseProps & {
  accessory: 'switch';
  onPress?: never;
  /** Called with the new value when the row or its switch is tapped. */
  onSwitchChange: (value: boolean) => void;
  selected?: never;
  /** Whether the switch is on; the consumer owns the state. */
  switchValue: boolean;
};

export type ListRowProps = ListRowPressProps | ListRowSwitchProps;

function rowName({ detail, title, value }: ListRowProps): string {
  return [title, detail, value].filter(Boolean).join(', ');
}

function Accessory({
  kind,
  switchValue,
}: {
  kind: ListRowAccessory;
  switchValue: boolean;
}) {
  const theme = useTheme();
  if (kind === 'none') return null;
  if (kind === 'switch') return <ListRowSwitch value={switchValue} />;
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
  const { detail, leading, onPress, selected, title, tone, value } = props;
  const accessory = listRowAccessory({
    accessory: props.accessory,
    pressable: onPress !== undefined,
    selected,
  });

  return (
    <>
      {leading}
      <ListRowLabel
        detail={detail}
        title={title}
        titleColor={listRowTitleColor(tone)}
      />
      {value ? <Text color="muted">{value}</Text> : null}
      <Accessory kind={accessory} switchValue={props.switchValue ?? false} />
    </>
  );
}

/**
 * A switch row: one switch element named by the row's lines, its checked
 * state announced, toggled by a tap anywhere on it. Like iOS Settings it
 * does not fill while pressed; the switch moving is the feedback.
 */
function SwitchRow(props: ListRowSwitchProps) {
  const theme = useTheme();
  const disabled = props.disabled ?? false;
  const { onSwitchChange, switchValue } = props;

  return (
    <Pressable
      accessibilityLabel={props.accessibilityLabel ?? rowName(props)}
      accessibilityRole="switch"
      accessibilityState={{ checked: switchValue, disabled }}
      disabled={disabled}
      onPress={() => onSwitchChange(!switchValue)}
      style={mapListRowStyle(theme, { disabled, pressed: false })}
      testID={props.testID}
    >
      <RowContent {...props} />
    </Pressable>
  );
}

/**
 * One row of a `ListGroup`: it opens another screen (a chevron), picks one
 * option in place (`selected`), turns a setting on or off in place
 * (`accessory="switch"`), or only shows a value (no `onPress`).
 */
export function ListRow(props: ListRowProps) {
  const theme = useTheme();
  if (props.accessory === 'switch') return <SwitchRow {...props} />;
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
