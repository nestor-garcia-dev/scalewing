import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ButtonLink } from './components/ButtonLink.js';
import { Hero } from './components/Hero.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('Hero', () => {
  it('names its section by the title and draws eyebrow, title, lead, actions and picture', () => {
    render(
      <Hero
        actions={<ButtonLink href="/visit">Plan a visit</ButtonLink>}
        eyebrow="For birdwatchers"
        lead="The marsh in every season."
        media={<img alt="A heron" src="/heron.png" />}
        title="Every heron counted."
      />,
    );
    const hero = screen.getByRole('region', { name: 'Every heron counted.' });
    expect(hero.tagName).toBe('SECTION');
    expect(hero.className).toBe('sw-hero sw-hero-with-media');
    const title = screen.getByRole('heading', {
      level: 1,
      name: 'Every heron counted.',
    });
    expect(title.className).toBe('sw-text-hero');
    const eyebrow = screen.getByText('For birdwatchers');
    expect(eyebrow.tagName).toBe('P');
    expect(eyebrow.className).toBe('sw-text-label');
    expect(eyebrow.style.color).toBe('var(--sw-color-muted)');
    expect(screen.getByText('The marsh in every season.').className).toBe(
      'sw-text-lead',
    );
    const text = hero.querySelector('.sw-hero-text') as HTMLElement;
    expect([...text.children].map((child) => child.className)).toEqual([
      'sw-text-label',
      'sw-text-hero',
      'sw-text-lead',
      'sw-hero-actions',
    ]);
    expect(
      screen.getByRole('link', { name: 'Plan a visit' }).parentElement
        ?.className,
    ).toBe('sw-hero-actions');
    expect(
      screen.getByRole('img', { name: 'A heron' }).parentElement?.className,
    ).toBe('sw-hero-media');
  });

  it("leaves out what it is not given, the picture's column too", () => {
    render(
      <Hero
        className="extra"
        data-testid="hero"
        eyebrow="  "
        title="The marsh"
      />,
    );
    const hero = screen.getByTestId('hero');
    expect(hero.className).toBe('sw-hero extra');
    expect(hero.querySelector('.sw-hero-media')).toBeNull();
    const text = hero.querySelector('.sw-hero-text') as HTMLElement;
    expect(text.children).toHaveLength(1);
  });

  it("keeps the title as the section's name", () => {
    render(
      <Hero
        {...({ 'aria-labelledby': 'elsewhere' } as object)}
        title="The marsh"
      />,
    );
    expect(screen.getByRole('region', { name: 'The marsh' })).toBeTruthy();
  });

  it('throws on a blank title', () => {
    expect(() => render(<Hero title=" " />)).toThrow(
      new RangeError('A Hero needs a title'),
    );
    expect(() => render(<Hero title={null} />)).toThrow(RangeError);
  });

  it('puts the picture beside the words from md and stacks the actions below it', () => {
    expect(css).toContain(
      '@media (min-width: 48rem) {\n  .sw-hero-text { gap: var(--sw-space-5); }\n  .sw-hero-with-media { grid-template-columns: minmax(0, 1fr) auto; }\n}',
    );
    expect(css).toContain(
      '.sw-hero-actions { align-items: stretch; flex-direction: column; }',
    );
    expect(css).toContain(
      '.sw-hero:not(.sw-hero-with-media) .sw-hero-text {\n  max-width: var(--sw-reading-max);\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-hero',
        'sw-hero-with-media',
        'sw-hero-text',
        'sw-hero-actions',
        'sw-hero-media',
      ]),
    );
  });
});
