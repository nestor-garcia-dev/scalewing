import { Button, Card, Grid, Skeleton, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import { Section } from '../layout/Section.js';

export function SkeletonSection() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Section
      id="skeleton"
      purpose="Skeleton is grey placeholder bars where content is loading, in place of a page spinner: a polite status named by label (read once), the bars hidden from assistive technology. variant lines (default) is bars of text with ragged ends, the last shorter; rows is list rows, a mark and a bar with hairlines between, 44 px on a touch screen. lines is how many, 1 to 6. The bars pulse gently, and stay still when reduced motion is asked for; forced colours keep their edges. Each Skeleton announces its label once as it appears, so keep one per loading region or accept several announcements; removing it announces nothing, so loaded needs its own cue."
      title="Skeleton"
      usage={`<Skeleton label="Loading this week's sightings" />
<Skeleton label="Loading rangers" variant="rows" lines={4} />`}
    >
      <Stack gap={4}>
        <Grid columns={2} columnsBelow={{ md: 1 }} gap={4}>
          <Card padding={4}>
            <Stack gap={3}>
              <Text variant="title">This week</Text>
              {loaded ? (
                <Text>
                  Twelve grey herons and four otters along the north reed bed.
                </Text>
              ) : (
                <Skeleton label="Loading this week's sightings" />
              )}
            </Stack>
          </Card>
          <Card padding={4}>
            <Stack gap={3}>
              <Text variant="title">On duty</Text>
              <Skeleton label="Loading rangers" lines={4} variant="rows" />
            </Stack>
          </Card>
        </Grid>
        <Card padding={4}>
          <Skeleton label="Loading the station's note" lines={1} />
        </Card>
        <div>
          <Button
            onPress={() => setLoaded((value) => !value)}
            variant="neutral"
          >
            {loaded ? 'Show loading' : 'Show loaded'}
          </Button>
        </div>
      </Stack>
    </Section>
  );
}
