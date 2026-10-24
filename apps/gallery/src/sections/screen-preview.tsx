import {
  Grid,
  PreviewGroup,
  PreviewRow,
  PreviewTiles,
  ScreenPreview,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';

export function ScreenPreviewSection() {
  return (
    <Section
      id="screen-preview"
      purpose="ScreenPreview is a drawn stand-in for an app's screen on a public page: a figure whose screen is one image named by its label, with an optional caption. Its rows (PreviewRow: plain, total, note, filled or alert) come in PreviewGroups, and PreviewTiles lay small counts three or six to a row. The device frame draws a phone from md and a plain card on a phone."
      title="ScreenPreview"
      usage={`<ScreenPreview
  frame="device"
  label="Today's census: 14 herons, 6 egrets, 20 birds in all"
  eyebrow="Census · Today"
  title="Birds on the marsh"
  caption="A photo of the real board goes here."
>
  <PreviewGroup>
    <PreviewRow label="Grey herons" value="14" />
    <PreviewRow kind="total" label="All birds" value="20" />
  </PreviewGroup>
</ScreenPreview>`}
    >
      <Grid align="start" fit="wide" gap={5}>
        <ScreenPreview
          caption="A photo of the real board goes here."
          eyebrow="Census · Today"
          frame="device"
          label="Today's census: 14 herons, 6 egrets, 20 birds in all"
          title="Birds on the marsh"
        >
          <PreviewGroup>
            <PreviewRow label="Grey herons" value="14" />
            <PreviewRow label="Little egrets" value="6" />
            <PreviewRow kind="total" label="All birds" value="20" />
          </PreviewGroup>
          <PreviewGroup>
            <PreviewRow
              kind="note"
              label="Last count"
              value="North hide · Ana · 9:12"
            />
          </PreviewGroup>
        </ScreenPreview>
        <ScreenPreview
          caption="A photo of the real board goes here."
          label="The north hide this week: counts by hour and a closed path"
          title="North hide"
        >
          <PreviewTiles
            items={[
              { id: '6', label: '6:00', value: '4' },
              { id: '7', label: '7:00', value: '9' },
              { id: '8', label: '8:00', value: '12' },
              { id: '9', label: '9:00', value: '7' },
              { id: '10', label: '10:00', value: '3' },
              { id: '11', label: '11:00', value: '1' },
            ]}
          />
          <PreviewRow kind="filled" label="Visitors" value="38" />
          <PreviewRow kind="alert" label="Path" value="Closed after rain" />
        </ScreenPreview>
      </Grid>
    </Section>
  );
}
