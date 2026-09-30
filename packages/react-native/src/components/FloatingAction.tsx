import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import {
  mapFloatingActionBandStyle,
  mapFloatingActionCapsuleStyle,
} from '../map-floating-action-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type FloatingActionProps = {
  /** The action's label; a string is also its accessible name. */
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
};

/**
 * A screen's one action as a capsule floating at the bottom in thumb
 * reach, over a fade from clear to the page colour. It places nothing
 * itself: the consumer puts it at the bottom of the screen, below or over
 * the scroll, and lets the platform's keyboard avoidance lift it. Only the
 * capsule takes touches; the fade lets them through to the content.
 */
export function FloatingAction({
  children,
  disabled = false,
  onPress,
  testID,
}: FloatingActionProps) {
  const theme = useTheme();
  const label = typeof children === 'string' ? children : undefined;

  return (
    <View pointerEvents="box-none" style={mapFloatingActionBandStyle(theme)}>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) =>
          mapFloatingActionCapsuleStyle(theme, { disabled, pressed })
        }
        testID={testID}
      >
        {typeof children === 'string' ? (
          <Text color="onAccent" variant="label">
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </View>
  );
}
