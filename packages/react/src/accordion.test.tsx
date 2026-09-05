import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Accordion } from './components/Accordion.js';
import { Text } from './components/Text.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => {
  cleanup();
});

describe('Accordion', () => {
  it('renders a labeled details disclosure on the page flow', () => {
    const onOpenChange = vi.fn();
    render(
      <ThemeProvider colorScheme="light">
        <Accordion onOpenChange={onOpenChange} open title="Why we watch">
          <Text>Habitat loss is subtracted.</Text>
        </Accordion>
      </ThemeProvider>,
    );

    const disclosure = document.querySelector('details.sw-accordion');
    expect(disclosure).not.toBeNull();
    expect(disclosure).toHaveProperty('open', true);
    const title = screen.getByText('Why we watch');
    expect(title.tagName).toBe('SPAN');
    const summary = title.closest('summary');
    expect(summary).not.toBeNull();
    expect(summary?.className).toContain('sw-accordion-summary');
    expect(summary?.className).toContain('sw-padding-4');
    expect(screen.getByText('Habitat loss is subtracted.')).toBeTruthy();

    disclosure!.open = false;
    fireEvent(disclosure!, new Event('toggle', { bubbles: true }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
