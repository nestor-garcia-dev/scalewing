import { type ReactNode } from 'react';
import { Pressable } from 'react-native';

import {
  mapTabBarContentStyle,
  mapTabBarDestinationStyle,
  mapTabBarItemStyle,
  mapTabBarLabelStyle,
  mapTabBarStyle,
  mapTabBarTrailingStyle,
  tabBarItemColor,
} from '../map-tab-bar-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Box } from './Box.js';
import { Inline } from './Inline.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type TabBarItem = {
  icon: ReactNode;
  key: string;
  label: string;
  onPress: () => void;
  selected: boolean;
};

export type TabBarProps = {
  bottomInset?: number;
  items: readonly TabBarItem[];
  trailing?: ReactNode;
};

export type TabBarTrailingProps = {
  accessibilityLabel: string;
  children: ReactNode;
  onPress: () => void;
};

export function TabBarTrailing({
  accessibilityLabel,
  children,
  onPress,
}: TabBarTrailingProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={mapTabBarTrailingStyle(theme)}
    >
      {children}
    </Pressable>
  );
}

export function TabBar({ bottomInset = 0, items, trailing }: TabBarProps) {
  const theme = useTheme();

  return (
    <Box
      accessibilityRole="tablist"
      style={mapTabBarStyle(theme, { bottomInset })}
    >
      <Inline align="center" gap={3}>
        <Inline align="center" style={mapTabBarDestinationStyle()}>
          {items.map((item) => (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: item.selected }}
              key={item.key}
              onPress={item.onPress}
              style={mapTabBarItemStyle(theme)}
            >
              <Stack align="center" gap={1} style={mapTabBarContentStyle()}>
                {item.icon}
                <Text
                  color={tabBarItemColor(item.selected)}
                  style={mapTabBarLabelStyle()}
                  truncate
                  variant="caption"
                >
                  {item.label}
                </Text>
              </Stack>
            </Pressable>
          ))}
        </Inline>
        {trailing}
      </Inline>
    </Box>
  );
}
