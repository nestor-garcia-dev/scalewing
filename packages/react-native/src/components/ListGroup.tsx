import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { View } from 'react-native';

import { mapListGroupStyle, mapListSeparatorStyle } from '../map-list-style.js';
import { useTheme } from '../theme/ThemeProvider.js';

export type ListGroupProps = {
  /** Names the group for assistive technology, like a section heading. */
  accessibilityLabel?: string;
  /** `ListRow` elements; the group draws a hairline between each pair. */
  children: ReactNode;
};

/** One bordered panel of rows with hairlines between them. */
export function ListGroup({ accessibilityLabel, children }: ListGroupProps) {
  const theme = useTheme();
  const rows = Children.toArray(children);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={mapListGroupStyle(theme)}
    >
      {rows.map((row, index) => (
        // Keep each row's own key so reordering moves rows, not remounts them.
        <Fragment key={isValidElement(row) ? row.key : index}>
          {index > 0 ? <View style={mapListSeparatorStyle(theme)} /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}
