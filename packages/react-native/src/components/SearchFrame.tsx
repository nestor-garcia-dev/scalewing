import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { type ControlFrameState } from '../map-control-frame-style.js';
import {
  mapSearchClearDiscStyle,
  mapSearchClearStrokeStyle,
  mapSearchClearStyle,
  mapSearchFrameStyle,
  mapSearchLeadingStyle,
  searchClearHitSlop,
} from '../map-search-field-style.js';
import { useTheme } from '../theme/ThemeProvider.js';

export type SearchFrameProps = {
  /** The text input the frame holds. */
  children: ReactNode;
  /** The clear button's accessible name; product copy. */
  clearLabel: string;
  leading?: ReactNode;
  /** Shows the clear button; omitted while there is nothing to clear. */
  onClear?: () => void;
  state: ControlFrameState;
  testID?: string;
};

/**
 * The search Field's filled capsule: a consumer glyph, the input, and a
 * clear button drawn as private control chrome.
 */
export function SearchFrame({
  children,
  clearLabel,
  leading,
  onClear,
  state,
  testID,
}: SearchFrameProps) {
  const theme = useTheme();

  return (
    <View style={mapSearchFrameStyle(theme, state)}>
      {leading ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={mapSearchLeadingStyle(theme)}
        >
          {leading}
        </View>
      ) : null}
      {children}
      {onClear ? (
        <Pressable
          accessibilityLabel={clearLabel}
          accessibilityRole="button"
          hitSlop={searchClearHitSlop()}
          onPress={onClear}
          style={mapSearchClearStyle(theme)}
          testID={testID ? `${testID}-clear` : undefined}
        >
          <View style={mapSearchClearDiscStyle(theme)}>
            <View style={mapSearchClearStrokeStyle(theme, '45deg')} />
            <View style={mapSearchClearStrokeStyle(theme, '-45deg')} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}
