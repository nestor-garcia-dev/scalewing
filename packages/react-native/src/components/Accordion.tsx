import { type ReactNode } from 'react';
import { Pressable } from 'react-native';

import {
  mapAccordionChevronStyle,
  mapAccordionHeaderStyle,
  mapAccordionPressStyle,
  mapAccordionStyle,
} from '../map-accordion-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Box } from './Box.js';
import { Text } from './Text.js';

export type AccordionProps = {
  accessibilityLabel: string;
  children: ReactNode;
  leading?: ReactNode;
  metadata?: ReactNode;
  onOpenChange: (open: boolean) => void;
  onTitlePress?: () => void;
  open: boolean;
  title: string;
  titleAccessibilityLabel?: string;
};

export function Accordion({
  accessibilityLabel,
  children,
  leading,
  metadata,
  onOpenChange,
  onTitlePress,
  open,
  title,
  titleAccessibilityLabel,
}: AccordionProps) {
  const theme = useTheme();
  const toggle = () => onOpenChange(!open);
  const chevron = (
    <Box
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={mapAccordionChevronStyle(theme, open)}
    />
  );

  return (
    <Box style={mapAccordionStyle(theme)}>
      <Box style={mapAccordionHeaderStyle(theme)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            onTitlePress
              ? (titleAccessibilityLabel ?? title)
              : accessibilityLabel
          }
          accessibilityState={onTitlePress ? undefined : { expanded: open }}
          onPress={onTitlePress ?? toggle}
          style={({ pressed }) => [
            mapAccordionPressStyle(theme, pressed),
            { flex: 1, minWidth: 0 },
          ]}
        >
          {leading}
          <Text variant="label" style={{ flex: 1, minWidth: 0 }}>
            {title}
          </Text>
          {!onTitlePress ? (
            <>
              {metadata}
              {chevron}
            </>
          ) : null}
        </Pressable>
        {onTitlePress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ expanded: open }}
            onPress={toggle}
            style={({ pressed }) => mapAccordionPressStyle(theme, pressed)}
          >
            {metadata}
            {chevron}
          </Pressable>
        ) : null}
      </Box>
      {open ? (
        <Box paddingX={1} paddingBottom={1}>
          {children}
        </Box>
      ) : null}
    </Box>
  );
}
