import {
  Accordion,
  Button,
  Card,
  DateField,
  Field,
  Inline,
  MultiSelect,
  SingleSelect,
  Stack,
  TabBar,
  TabBarTrailing,
  SegmentedControl,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  ThemeProvider,
  TimeField,
  useTheme,
} from '@scalewing/react-native';
import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

const demoPalettes = ['indigo', 'cerulean', 'sunburst'] as const;

function TabMark({ selected }: { selected: boolean }) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: selected ? theme.colors.accent : theme.colors.border,
        borderRadius: theme.radius.sm,
        height: theme.space[4],
        width: theme.space[4],
      }}
    />
  );
}

function TrailingMark() {
  const theme = useTheme();

  return (
    <View
      style={{
        borderColor: theme.colors.text,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        height: theme.space[3],
        width: theme.space[3],
      }}
    />
  );
}

export default function App() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [palette, setPalette] =
    useState<(typeof demoPalettes)[number]>('indigo');
  const [tab, setTab] = useState('one');
  const [section, setSection] = useState('table');
  const [searchCount, setSearchCount] = useState(0);
  const [rowPresses, setRowPresses] = useState(0);
  const [teamName, setTeamName] = useState('Harbor United');
  const [visitDate, setVisitDate] = useState('');
  const [feedingTime, setFeedingTime] = useState('09:30');
  const [habitats, setHabitats] = useState<string[]>(['river']);
  const [enclosure, setEnclosure] = useState('paddock');
  const [groupOpen, setGroupOpen] = useState(true);
  const [titlePresses, setTitlePresses] = useState(0);

  return (
    <ThemeProvider colorScheme={scheme} palette={palette}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Stack gap={4} padding={4} style={{ flex: 1 }}>
            <Inline justify="between" align="center">
              <Text variant="heading">Scalewing</Text>
              <Button
                onPress={() => {
                  const index = demoPalettes.indexOf(palette);
                  const next = demoPalettes[(index + 1) % demoPalettes.length];
                  if (next) {
                    setPalette(next);
                  }
                }}
                size="sm"
                variant="secondary"
              >
                {palette}
              </Button>
              <Button
                onPress={() =>
                  setScheme((current) =>
                    current === 'light' ? 'dark' : 'light',
                  )
                }
                size="sm"
                variant="secondary"
              >
                {scheme === 'light' ? 'Dark theme' : 'Light theme'}
              </Button>
            </Inline>
            <Text color="muted">
              Native uses spacing step props, not CSS class names.
            </Text>
            <Field
              hint="Shown on schedules and standings."
              label="Team name"
              onChangeText={setTeamName}
              value={teamName}
            />
            <DateField
              hint="Trail walks run on weekends."
              label="Visit date"
              nextMonthLabel="Next month"
              onChange={setVisitDate}
              placeholder="Choose a day"
              previousMonthLabel="Previous month"
              value={visitDate}
            />
            <TimeField
              hoursLabel="Hour"
              label="Feeding time"
              minutesLabel="Minutes"
              minuteStep={30}
              onChange={setFeedingTime}
              placeholder="Choose a time"
              value={feedingTime}
            />
            <MultiSelect
              error={
                habitats.length === 0 ? 'Pick at least one habitat.' : undefined
              }
              items={[
                { id: 'woodland', label: 'Woodland' },
                { id: 'river', label: 'River' },
                { id: 'meadow', label: 'Meadow' },
                { id: 'coast', label: 'Coast' },
              ]}
              label="Habitats"
              onChange={setHabitats}
              value={habitats}
            />
            <SingleSelect
              hint="One enclosure per visit."
              items={[
                { id: 'paddock', label: 'Paddock' },
                { id: 'aviary', label: 'Aviary' },
                { id: 'pond', label: 'Pond' },
                { id: 'nocturnal', label: 'Nocturnal house' },
                { id: 'reptile', label: 'Reptile house' },
              ]}
              label="Enclosure"
              onChange={setEnclosure}
              value={enclosure}
            />
            <SegmentedControl
              accessibilityLabel="Sections"
              items={[
                { id: 'table', label: 'Table' },
                { id: 'fixtures', label: 'Fixtures' },
              ]}
              onChange={setSection}
              value={section}
            />
            <Text color="muted">Selected section {section}.</Text>
            <Text color="muted">Row presses {rowPresses}.</Text>
            <Accordion
              title="Woodland habitats"
              accessibilityLabel={
                groupOpen ? 'Collapse habitats' : 'Expand habitats'
              }
              titleAccessibilityLabel="Open woodland habitats"
              onTitlePress={() => setTitlePresses((count) => count + 1)}
              open={groupOpen}
              onOpenChange={setGroupOpen}
              metadata={<Text variant="data">2</Text>}
            >
              <Text>Oak grove</Text>
              <Text>Birch forest</Text>
            </Accordion>
            <Text color="muted">Title presses {titlePresses}.</Text>
            <Card padding={4}>
              <Stack gap={2}>
                <Text variant="title">Sunday kickoff</Text>
                <Table density="compact">
                  <TableBody>
                    <TableRow
                      accessibilityLabel="North FC 2–1 Harbor United"
                      onPress={() => {
                        setRowPresses((count) => count + 1);
                      }}
                    >
                      <TableCell truncate>North FC</TableCell>
                      <TableCell flex={0} numeric>
                        2–1
                      </TableCell>
                      <TableCell align="end" truncate>
                        Harbor United
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Stack>
            </Card>
            <Text color="muted">
              Selected tab {tab}. Trailing presses {searchCount}.
            </Text>
          </Stack>
        </ScrollView>
        <TabBar
          items={[
            {
              icon: <TabMark selected={tab === 'one'} />,
              key: 'one',
              label: 'Woodlands',
              onPress: () => {
                setTab('one');
              },
              selected: tab === 'one',
            },
            {
              icon: <TabMark selected={tab === 'two'} />,
              key: 'two',
              label: 'River habitats',
              onPress: () => {
                setTab('two');
              },
              selected: tab === 'two',
            },
            {
              icon: <TabMark selected={tab === 'three'} />,
              key: 'three',
              label: 'Conservation',
              onPress: () => {
                setTab('three');
              },
              selected: tab === 'three',
            },
            {
              icon: <TabMark selected={tab === 'four'} />,
              key: 'four',
              label: 'Settings',
              onPress: () => {
                setTab('four');
              },
              selected: tab === 'four',
            },
          ]}
          trailing={
            <TabBarTrailing
              accessibilityLabel="Search"
              onPress={() => {
                setSearchCount((count) => count + 1);
              }}
            >
              <TrailingMark />
            </TabBarTrailing>
          }
        />
      </SafeAreaView>
    </ThemeProvider>
  );
}
