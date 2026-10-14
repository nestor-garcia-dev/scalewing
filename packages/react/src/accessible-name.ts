/**
 * A component's accessible name, given one way: `aria-label` with the words,
 * or `aria-labelledby` with the id of an element that holds them, never both.
 * Shared by the components whose name is required (a group, a list of tabs,
 * a navigation landmark).
 */
export type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };
