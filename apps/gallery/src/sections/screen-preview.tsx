import {
  Grid,
  Stack,
  PreviewGroup,
  PreviewImage,
  PreviewRow,
  PreviewTiles,
  ScreenPreview,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';

/** A small drawing that stands in for a screenshot. */
/** A phone screenshot's stand-in: a tall list of rows. */
const LIST =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 390 844'%3E%3Crect width='390' height='844' fill='%23ffffff'/%3E%3Crect x='20' y='60' width='200' height='28' rx='6' fill='%231d1d1f'/%3E%3Cg fill='%23f2f2f5'%3E%3Crect x='20' y='120' width='350' height='72' rx='12'/%3E%3Crect x='20' y='208' width='350' height='72' rx='12'/%3E%3Crect x='20' y='296' width='350' height='72' rx='12'/%3E%3C/g%3E%3Crect x='20' y='760' width='350' height='50' rx='25' fill='%235b3df5'/%3E%3C/svg%3E";

const MARSH =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'%3E%3Crect width='320' height='200' fill='%23a7c7a0'/%3E%3Cpath d='M0 150 Q80 90 160 140 T320 120 V200 H0Z' fill='%234f7a55'/%3E%3C/svg%3E";

export function ScreenPreviewSection() {
  return (
    <Section
      id="screen-preview"
      purpose="ScreenPreview is a drawn stand-in for an app's screen on a public page: a figure whose screen is one image named by its label, with an optional caption. Its rows (PreviewRow: plain, total, note, filled or alert) come in PreviewGroups, and PreviewTiles lay small counts three or six to a row. PreviewImage holds a real screenshot in the same frame. The device frame draws a phone at every width, its bezel near black in both schemes: 20rem from md, and below md its column's width with a thinner bezel, so two screenshots side by side on a phone stay phones (the last row). A screenshot alone fills the phone's screen."
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
      <Stack gap={6}>
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
          <ScreenPreview label="A photo of the marsh from the north hide">
            <PreviewImage height={200} src={MARSH} width={320} />
          </ScreenPreview>
        </Grid>
        <Grid align="start" columns={2} data-sample="side-by-side" gap={3}>
          <ScreenPreview
            caption="The count"
            frame="device"
            label="The census list with three counts and a Save button"
          >
            <PreviewImage height={844} src={LIST} width={390} />
          </ScreenPreview>
          <ScreenPreview
            caption="The board"
            frame="device"
            label="A photo of the marsh on the board"
          >
            <PreviewImage height={200} src={MARSH} width={320} />
          </ScreenPreview>
        </Grid>
      </Stack>
    </Section>
  );
}
