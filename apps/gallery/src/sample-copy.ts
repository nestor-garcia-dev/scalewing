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
