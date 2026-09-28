import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Accordion } from './components/Accordion.js';
import { Text } from './components/Text.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
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

  it('shows a muted subtitle under the title and a hidden chevron', () => {
    render(
      <Accordion
        onOpenChange={() => undefined}
        open={false}
        subtitle="Twelve sightings · Two nests"
        title="Wetlands"
      >
        <Text>Reed beds line the shore.</Text>
      </Accordion>,
    );

    const summary = document.querySelector('summary');
    const title = screen.getByText('Wetlands');
    const subtitle = screen.getByText('Twelve sightings · Two nests');
    expect(title.className).toContain('sw-text-title');
    expect(subtitle.tagName).toBe('SPAN');
    expect(subtitle.className).toContain('sw-text-caption');
    expect(subtitle.style.color).toBe('var(--sw-color-muted)');
    expect(title.parentElement?.className).toBe('sw-accordion-heading');
    expect(subtitle.parentElement).toBe(title.parentElement);
    expect(summary?.textContent).toBe('Wetlands Twelve sightings · Two nests');
    const marker = summary?.querySelector('.sw-accordion-marker');
    expect(marker?.getAttribute('aria-hidden')).toBe('true');
    expect(summary?.lastElementChild).toBe(marker);
  });

  it('leaves out the subtitle line when there is none', () => {
    render(
      <Accordion onOpenChange={() => undefined} open title="Range">
        <Text>Wintering grounds stay labeled.</Text>
      </Accordion>,
    );
    const heading = screen.getByText('Range').parentElement;
    expect(heading?.children).toHaveLength(1);
    expect(document.querySelector('.sw-accordion')?.className).toBe(
      'sw-accordion',
    );
  });

  it('size sm is a quieter nested disclosure with a label-size title', () => {
    render(
      <Accordion
        className="habitat-notes"
        onOpenChange={() => undefined}
        open
        size="sm"
        subtitle="Two methods"
        title="How the count is taken"
      >
        <Text>Transects at dawn.</Text>
      </Accordion>,
    );
    const disclosure = document.querySelector('details');
    expect(disclosure?.className).toBe(
      'sw-accordion sw-accordion-sm habitat-notes',
    );
    expect(screen.getByText('How the count is taken').className).toContain(
      'sw-text-label',
    );
    const summary = disclosure?.querySelector('summary');
    expect(summary?.className).toContain('sw-padding-3');
    expect(summary?.className).not.toContain('sw-padding-4');
    const body = screen.getByText('Transects at dawn.').parentElement;
    expect(body?.className).toContain('sw-gap-3');
    expect(body?.className).toContain('sw-padding-3');
  });

  it('generates a token chevron that turns on open and holds still on request', () => {
    const css = generateStylesheet();
    const catalog = utilityClassCatalog();
    for (const className of [
      'sw-accordion-sm',
      'sw-accordion-heading',
      'sw-accordion-marker',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain(
      '.sw-accordion-sm { border-radius: var(--sw-radius-md); }',
    );
    expect(css).toContain('list-style: none;');
    expect(css).not.toContain('display: list-item;');
    expect(css).toContain(
      '.sw-accordion-summary::-webkit-details-marker { display: none; }',
    );
    expect(css).toContain(
      '.sw-accordion[open] > .sw-accordion-summary .sw-accordion-marker {\n  transform: rotate(45deg);\n}',
    );
    expect(css).toContain(
      'transition: transform var(--sw-motion-default) var(--sw-motion-easing);',
    );
    expect(css).toContain(
      '@media (prefers-reduced-motion: reduce) {\n  .sw-accordion-marker { transition: none; }\n}',
    );
    expect(css).toContain(
      '.sw-accordion-marker:dir(rtl) { transform: rotate(135deg); }',
    );
  });
});
