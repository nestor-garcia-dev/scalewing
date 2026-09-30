import {
  Badge,
  Box,
  Card,
  Grid,
  RadioGroup,
  Stack,
  Text,
} from '@scalewing/react';
import { useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const habitatOptions = [
  { value: 'forest', label: 'Forest canopy' },
  { value: 'desert', label: 'Desert scrub', disabled: true },
  {
    value: 'wetland',
    label: 'Seasonal wetland with long migration observations',
  },
] as const;

const observerGlyph = (
  <Glyph path="M8 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 14c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
);
const cameraGlyph = (
  <Glyph path="M2 5.5h3L6.5 3.5h3L11 5.5h3v7H2v-7ZM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
);
const microphoneGlyph = (
  <Glyph path="M8 10a2 2 0 0 0 2-2V4a2 2 0 1 0-4 0v4a2 2 0 0 0 2 2Zm-4-2a4 4 0 0 0 8 0M8 12v2" />
);

// Each option carries its own history as its description.
const sourceOptions = [
  {
    value: 'observer',
    label: 'Field observer',
    icon: observerGlyph,
    description: <Badge size="sm">Most recent</Badge>,
  },
  {
    value: 'camera',
    label: 'Camera trap',
    icon: cameraGlyph,
    description: '2 sightings · last Sep 13, 2026',
  },
  {
    value: 'acoustic',
    label: 'Acoustic monitor',
    icon: microphoneGlyph,
    description: 'Offline since Aug 2, 2026',
    disabled: true,
  },
];

const sourceOptionsArabic = [
  {
    value: 'observer',
    label: 'مراقب ميداني',
    icon: observerGlyph,
    description: <Badge size="sm">الأحدث</Badge>,
  },
  {
    value: 'camera',
    label: 'مصيدة كاميرا',
    icon: cameraGlyph,
    description: 'مشاهدتان · آخرها ١٣ سبتمبر ٢٠٢٦',
  },
];

export function RadioGroupSection() {
  const [habitat, setHabitat] = useState('');
  const [source, setSource] = useState('observer');
  const [denSource, setDenSource] = useState('observer');
  const [arabicSource, setArabicSource] = useState('observer');
  const [changeCount, setChangeCount] = useState(0);

  return (
    <Section
      id="radio-group"
      purpose="RadioGroup presents one choice from a vertical set of longer form options. The browser supplies grouped radio keyboard behavior; the caller owns labels, values, and validation. An option's icon is a decorative glyph between the radio and its label, in the text color; the option's accessible name stays its label. An option's description is its own muted caption, such as its history: at the row's end while it fits, and on a second line under the label on a phone or in a narrow column. It is the radio's accessible description, and a press on it chooses the option."
      title="RadioGroup"
      usage={`<RadioGroup
  legend="Habitat"
  value={habitat}
  onChange={setHabitat}
  options={habitatOptions}
  required
/>

<RadioGroup
  legend="Sighting source"
  value={source}
  onChange={setSource}
  options={[
    { value: 'observer', label: 'Field observer', icon: <User />,
      description: <Badge size="sm">Most recent</Badge> },
    { value: 'camera', label: 'Camera trap', icon: <Camera />,
      description: '2 sightings · last Sep 13, 2026' },
  ]}
/>`}
    >
      <Stack gap={3}>
        <RadioGroup
          description="Choose the habitat where the sighting occurred"
          error={habitat ? undefined : 'Choose a habitat'}
          legend="Habitat"
          onChange={(next) => {
            setHabitat(next);
            setChangeCount((count) => count + 1);
          }}
          options={habitatOptions}
          required
          value={habitat}
        />
        <RadioGroup
          legend="Sighting source"
          onChange={setSource}
          options={sourceOptions}
          value={source}
        />
        <Grid columns={3} columnsBelow={{ md: 1 }} gap={3}>
          <Card padding={4}>
            <RadioGroup
              legend="Den survey source"
              onChange={setDenSource}
              options={sourceOptions}
              value={denSource}
            />
          </Card>
          <Box columnSpan={2} dir="rtl" lang="ar">
            <RadioGroup
              legend="مصدر المشاهدة"
              onChange={setArabicSource}
              options={sourceOptionsArabic}
              value={arabicSource}
            />
          </Box>
        </Grid>
        <Text color="muted" variant="caption">
          In a narrow column a description that does not fit beside its label
          wraps under the label text; right to left it sits at the left end.
        </Text>
        <RadioGroup
          disabled
          legend="Archived habitat"
          onChange={() => undefined}
          options={habitatOptions}
          value="forest"
        />
        <Text color="muted" variant="caption">
          Selected habitat: {habitat || 'none'}. Callbacks: {changeCount}.
        </Text>
      </Stack>
    </Section>
  );
}
