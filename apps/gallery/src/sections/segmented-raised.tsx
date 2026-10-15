import { Card, SegmentedControl, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { surveyItems } from './segmented-icons.js';

const logs = [
  { id: 'changes', label: 'Changes 57' },
  { id: 'audits', label: 'Audits 3' },
  { id: 'people', label: 'People 12' },
];

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
  const [log, setLog] = useState('changes');
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
      <Text variant="label">Raised, small, full width on a phone</Text>
      <Card padding={4}>
        <SegmentedControl
          aria-label="Field log"
          fullWidthBelow="md"
          items={logs}
          onChange={setLog}
          size="sm"
          value={log}
          variant="raised"
        />
      </Card>
      <Text variant="label">
        Compact, small, with marks, full width on a phone
      </Text>
      <SegmentedControl
        aria-label="Survey, small"
        fullWidthBelow="md"
        items={surveyItems}
        onChange={setSurvey}
        size="sm"
        value={survey}
      />
    </Stack>
  );
}
