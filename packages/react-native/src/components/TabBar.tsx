import { type ReactNode } from 'react';
import { Pressable } from 'react-native';

import {
  mapTabBarContentStyle,
  mapTabBarDestinationStyle,
  mapTabBarIconStyle,
  mapTabBarItemStyle,
  mapTabBarLabelStyle,
  mapTabBarStyle,
  mapTabBarTrailingStyle,
  tabBarItemColor,
  tabBarLabelMinimumFontScale,
  tabBarTrailingGap,
} from '../map-tab-bar-style.js';
import { tabBarBadgeAccessibilityValue } from '../tab-bar-badge.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Box } from './Box.js';
import { Inline } from './Inline.js';
import { Stack } from './Stack.js';
import { TabBarBadge } from './TabBarBadge.js';
import { Text } from './Text.js';

export type TabBarItem = {
  /**
   * A count of things waiting on this tab, drawn as a danger pill over the
   * icon's top end corner and read after the label. Hidden unless a
   * positive whole number; past 99 it shows `99+`.
   */
  badge?: number;
  /**
   * What a screen reader hears for the badge after the label, such as
   * "3 pendientes". Defaults to "1 item" / "N items".
   */
  badgeAccessibilityLabel?: string;
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

function TabBarDestination({ item }: { item: TabBarItem }) {
  const theme = useTheme();
  const badgeValue = tabBarBadgeAccessibilityValue(
    item.badge,
    item.badgeAccessibilityLabel,
  );

  return (
    <Pressable
      accessibilityLabel={item.label}
      accessibilityRole="tab"
      accessibilityState={{ selected: item.selected }}
      accessibilityValue={badgeValue ? { text: badgeValue } : undefined}
      onPress={item.onPress}
      style={mapTabBarItemStyle(theme)}
    >
      <Stack align="center" gap={1} style={mapTabBarContentStyle()}>
        <Box style={mapTabBarIconStyle()}>
          {item.icon}
          <TabBarBadge count={item.badge} />
        </Box>
        <Text
          adjustsFontSizeToFit
          color={tabBarItemColor(item.selected)}
          minimumFontScale={tabBarLabelMinimumFontScale}
          style={mapTabBarLabelStyle()}
          truncate
          variant="caption"
        >
          {item.label}
        </Text>
      </Stack>
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
      <Inline align="center" gap={tabBarTrailingGap}>
        <Inline align="center" style={mapTabBarDestinationStyle()}>
          {items.map((item) => (
            <TabBarDestination item={item} key={item.key} />
          ))}
        </Inline>
        {trailing}
      </Inline>
    </Box>
  );
}
