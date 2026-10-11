import { SegmentedControl, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { surveyItems } from './segmented-icons.js';

const orders = [
  { id: 'largest', label: 'Largest first' },
  { id: 'tens', label: 'Tens only' },
];

/**
 * The raised track: a grey track whose selected segment is the surface
 * raised off it, with marks and with words only, then disabled and with
 * an error.
 */
export function SegmentedRaisedExample() {
  const [survey, setSurvey] = useState('forest');
  const [order, setOrder] = useState('largest');
  const [retake, setRetake] = useState('');
  return (
    <Stack gap={3}>
      <Text variant="label">Raised, with marks</Text>
      <SegmentedControl
        aria-label="Survey, raised"
        items={surveyItems}
        onChange={setSurvey}
        value={survey}
        variant="raised"
      />
      <Text variant="label">Raised, words only</Text>
      <SegmentedControl
        aria-label="Count order"
        items={orders}
        onChange={setOrder}
        value={order}
        variant="raised"
      />
      <Text variant="label">Raised, disabled</Text>
      <SegmentedControl
        aria-label="Closed count order"
        disabled
        items={orders}
        value="tens"
        variant="raised"
      />
      <Text variant="label">Raised, with an error</Text>
      <SegmentedControl
        aria-label="Count order to retake"
        error={retake ? '' : 'Pick how to count the herd.'}
        items={orders}
        onChange={setRetake}
        required
        value={retake}
        variant="raised"
      />
    </Stack>
  );
}
