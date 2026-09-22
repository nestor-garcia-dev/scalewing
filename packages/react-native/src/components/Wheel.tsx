import { useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import {
  mapWheelBandStyle,
  mapWheelColumnStyle,
  mapWheelContentStyle,
  mapWheelRowStyle,
  wheelRowColor,
  wheelRowHeight,
} from '../map-wheel-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import {
  wheelDragSettles,
  wheelIndexForOffset,
  wheelOffsetForIndex,
} from '../wheel-geometry.js';
import { Text } from './Text.js';

export type WheelItem = {
  id: string;
  label: string;
};

export type WheelProps = {
  accessibilityLabel: string;
  disabled: boolean;
  items: readonly WheelItem[];
  onSelect: (id: string) => void;
  selectedId: string;
  testID?: string;
};

/**
 * Private snapping column shared by the time columns: rows are radio targets,
 * a settled scroll selects the row in the band, and a tap centres its row.
 */
export function Wheel({
  accessibilityLabel,
  disabled,
  items,
  onSelect,
  selectedId,
  testID,
}: WheelProps) {
  const theme = useTheme();
  const rowHeight = wheelRowHeight(theme);
  const scroll = useRef<ScrollView>(null);
  const selectedIndex = Math.max(
    items.findIndex((item) => item.id === selectedId),
    0,
  );

  // The scroll position mirrors the selection, including one set by a parent.
  useEffect(() => {
    scroll.current?.scrollTo({
      animated: true,
      y: wheelOffsetForIndex(selectedIndex, rowHeight),
    });
  }, [rowHeight, selectedIndex]);

  function settle(offset: number) {
    const item = items[wheelIndexForOffset(offset, rowHeight, items.length)];
    if (item && item.id !== selectedId) onSelect(item.id);
  }

  function onDragEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (wheelDragSettles(event.nativeEvent.velocity?.y)) {
      settle(event.nativeEvent.contentOffset.y);
    }
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={mapWheelColumnStyle(theme, disabled)}
      testID={testID}
    >
      <ScrollView
        contentContainerStyle={mapWheelContentStyle(theme)}
        decelerationRate="fast"
        nestedScrollEnabled
        onMomentumScrollEnd={(event) =>
          settle(event.nativeEvent.contentOffset.y)
        }
        onScrollEndDrag={onDragEnd}
        ref={scroll}
        scrollEnabled={!disabled}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={rowHeight}
      >
        {items.map((item) => {
          const selected = item.id === selectedId;
          return (
            <Pressable
              accessibilityLabel={item.label}
              accessibilityRole="radio"
              accessibilityState={{ disabled, selected }}
              disabled={disabled}
              key={item.id}
              onPress={() => onSelect(item.id)}
              style={mapWheelRowStyle(theme)}
            >
              <Text color={wheelRowColor(selected)} variant="label">
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View pointerEvents="none" style={mapWheelBandStyle(theme)} />
    </View>
  );
}
