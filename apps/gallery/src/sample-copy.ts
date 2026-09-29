export const sampleHabitats = [
  { value: 'forest', label: 'Forest' },
  { value: 'savanna', label: 'Savanna' },
  { value: 'ocean', label: 'Ocean' },
] as const;

export const sampleRegions = [
  { value: 'amazon', label: 'Amazon' },
  { value: 'serengeti', label: 'Serengeti' },
] as const;

export const sampleCensusRows = [
  { species: 'Red fox', habitat: 'Forest', sightings: 42, delta: 3 },
  { species: 'Snow leopard', habitat: 'Alpine', sightings: 8, delta: -1 },
  { species: 'Green sea turtle', habitat: 'Ocean', sightings: 21, delta: 2 },
] as const;

export const sampleWatchRows = [
  {
    slot: 'Common',
    animal: 'Red fox · Forest',
    sightings: 42,
    delta: 3,
    chips: ['Nocturnal', 'Adaptive'],
    selected: true,
  },
  {
    slot: 'Scarce',
    animal: 'Snow leopard · Alpine',
    sightings: 8,
    delta: -1,
    chips: ['Camouflage', 'Range'],
    selected: false,
  },
  {
    slot: 'Rare',
    animal: 'Blue whale · Ocean',
    sightings: 3,
    delta: 0,
    chips: ['Migration'],
    selected: false,
  },
] as const;

/** Habitats in Arabic, for a right-to-left full-width select. */
export const sampleHabitatsArabic = [
  { value: 'forest', label: 'الغابة' },
  { value: 'savanna', label: 'السافانا' },
  { value: 'ocean', label: 'المحيط' },
] as const;

/** The same collars in Arabic, for a right-to-left table. */
export const sampleCollarRowsArabic = [
  { id: 'c-104', animal: 'ذئب رمادي', habitat: 'التايغا' },
  { id: 'c-221', animal: 'فيل أفريقي', habitat: 'السافانا' },
  { id: 'c-317', animal: 'نمر الثلج', habitat: 'جبال الألب' },
] as const;

/** Tracking collars to pick one from, for a table with a selectable row. */
export const sampleCollarRows = [
  { id: 'c-104', animal: 'Grey wolf', habitat: 'Taiga', battery: '82%' },
  {
    id: 'c-221',
    animal: 'African elephant',
    habitat: 'Savanna',
    battery: '64%',
  },
  { id: 'c-317', animal: 'Snow leopard', habitat: 'Alpine', battery: '91%' },
] as const;

export const sampleTraitFactors = [
  { label: 'Speed', value: 5 },
  { label: 'Camouflage', value: 4.4 },
  { label: 'Range', value: 3.3 },
  { label: 'Social', value: 5.8 },
  { label: 'Endurance', value: 3 },
  { label: 'Vocal', value: 2 },
  { label: 'Climbing', value: 1 },
  { label: 'Habitat loss', value: -1.5 },
] as const;
