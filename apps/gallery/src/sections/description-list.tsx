import {
  Card,
  DescriptionItem,
  DescriptionList,
  Inline,
  Stack,
  Text,
} from '@scalewing/react';

import { Section } from '../layout/Section.js';

/** One habitat's survey: the term, its finding, a note at the line's end, and a line under it. */
const habitats = [
  { term: 'Wetland', finding: '12 herons', note: 'Recounted', lines: [] },
  {
    term: 'Old-growth forest',
    finding: '2 nests to check',
    note: null,
    lines: ['Owl box 4: empty since spring', 'Owl box 9: door jammed'],
  },
  { term: 'Dunes', finding: 'No survey', note: null, lines: [] },
] as const;

export function DescriptionListSection() {
  return (
    <Section
      id="description-list"
      purpose="DescriptionList pairs terms with what each says, one per row: the term in a start column as wide as the widest term (up to 40%), the detail beside it, a hairline between rows, and every row aligned to its top. Below md a term sits over its detail. The terms and details are your own Text, so the list sets only the layout; each child of a term or a detail is its own line, so a detail may hold several."
      title="DescriptionList"
      usage={`<DescriptionList aria-label="Habitat survey">
  <DescriptionItem term={<Text variant="caption" color="muted">Wetland</Text>}>
    <Text variant="caption">12 herons</Text>
  </DescriptionItem>
</DescriptionList>`}
    >
      <Card padding={4}>
        <DescriptionList aria-label="Habitat survey">
          {habitats.map((habitat) => (
            <DescriptionItem
              key={habitat.term}
              term={
                <Text variant="caption" color="muted">
                  {habitat.term}
                </Text>
              }
            >
              <Stack gap={1}>
                <Inline align="start" gap={2} wrap>
                  <Text variant="data">{habitat.finding}</Text>
                  {habitat.note ? (
                    <Text variant="caption" color="muted">
                      {habitat.note}
                    </Text>
                  ) : null}
                </Inline>
                {habitat.lines.map((line) => (
                  <Text key={line} variant="caption" color="muted">
                    {line}
                  </Text>
                ))}
              </Stack>
            </DescriptionItem>
          ))}
        </DescriptionList>
      </Card>
    </Section>
  );
}
