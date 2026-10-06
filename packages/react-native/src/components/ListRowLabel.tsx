import { type SemanticColorKey } from '@scalewing/tokens';
import { View } from 'react-native';

import { mapListRowLabelStyle } from '../map-list-style.js';
import { Text } from './Text.js';

export type ListRowLabelProps = {
  detail?: string;
  title: string;
  titleColor?: SemanticColorKey;
};

/** A list row's title with its optional muted detail line under it. */
export function ListRowLabel({
  detail,
  title,
  titleColor = 'text',
}: ListRowLabelProps) {
  return (
    <View style={mapListRowLabelStyle()}>
      <Text color={titleColor} variant="label">
        {title}
      </Text>
      {detail ? (
        <Text color="muted" variant="caption">
          {detail}
        </Text>
      ) : null}
    </View>
  );
}
