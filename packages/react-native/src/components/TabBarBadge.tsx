import { mapTabBarBadgeStyle } from '../map-tab-bar-style.js';
import { tabBarBadgeText } from '../tab-bar-badge.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Box } from './Box.js';
import { Text } from './Text.js';

/**
 * A tab's count drawn over its icon's top end corner. Hidden from
 * assistive technology: the tab announces the count as its value.
 */
export function TabBarBadge({ count }: { count: number | undefined }) {
  const theme = useTheme();
  const text = tabBarBadgeText(count);

  if (text === undefined) return null;

  return (
    <Box
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={mapTabBarBadgeStyle(theme)}
    >
      <Text color="onDanger" variant="caption">
        {text}
      </Text>
    </Box>
  );
}
