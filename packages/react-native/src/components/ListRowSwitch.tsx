import { Switch, View } from 'react-native';

import { mapListSwitchColors } from '../map-list-style.js';
import { useTheme } from '../theme/ThemeProvider.js';

/**
 * The native switch drawn at a switch row's end. The row owns the touch,
 * the switch role, and the checked state, so the switch takes no touches
 * and is hidden from assistive technology: a tap anywhere on the row,
 * the switch included, toggles it once.
 */
export function ListRowSwitch({ value }: { value: boolean }) {
  const theme = useTheme();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      <Switch value={value} {...mapListSwitchColors(theme)} />
    </View>
  );
}
