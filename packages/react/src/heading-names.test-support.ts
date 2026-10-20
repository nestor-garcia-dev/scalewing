import { screen } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * Asserts the headings at a level, in document order, by their accessible
 * names: each name must find exactly one heading, and together they must
 * be every heading at that level. Text content is not a name: a heading
 * may hold drawn words hidden from assistive technology.
 */
export function expectHeadingNames(level: number, names: string[]): void {
  expect(screen.getAllByRole('heading', { level })).toEqual(
    names.map((name) => screen.getByRole('heading', { level, name })),
  );
}
