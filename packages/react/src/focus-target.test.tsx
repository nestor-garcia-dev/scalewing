import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
import { Card } from './components/Card.js';
import { Text } from './components/Text.js';
import { focusTargetSelector } from './css/css-document.js';
import { generateStylesheet } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(cleanup);

describe('a programmatic focus target in the canvas', () => {
  const css = generateStylesheet();
  const start = css.indexOf(`${focusTargetSelector} {`);
  const rule = css.slice(start, css.indexOf('}', start));

  it('takes the accent ring past the ring offset', () => {
    // Teisoro NSF-34, ENT-29, DRW-30: a focused notice showed the
    // browser's outline, not the accent ring every control shows.
    expect(start).toBeGreaterThan(-1);
    expect(rule).toContain(
      'outline: var(--sw-focus-ring-width) solid var(--sw-color-accent);',
    );
    expect(rule).toContain('outline-offset: var(--sw-focus-ring-offset);');
  });

  it('applies only to a script-only target, only when focus is visible', () => {
    expect(focusTargetSelector).toBe(
      ":where([data-theme] [tabindex='-1']:focus-visible)",
    );
  });

  it('stays at zero specificity, so a component ring wins over it', () => {
    // The whole selector sits inside :where(); nothing outside it counts.
    expect(focusTargetSelector.startsWith(':where(')).toBe(true);
    expect(focusTargetSelector.endsWith(')')).toBe(true);
    // It comes before the component classes, so even an equal rule wins.
    expect(start).toBeLessThan(css.indexOf('.sw-button {'));
  });

  it('matches a Box that takes focus inside the themed canvas', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Box radius="lg" tabIndex={-1} data-testid="notice">
          <Card padding={4} variant="outlined">
            <Text as="p">Survey saved.</Text>
          </Card>
        </Box>
      </ThemeProvider>,
    );
    const notice = screen.getByTestId('notice');
    expect(notice.getAttribute('tabindex')).toBe('-1');
    expect(notice.matches("[data-theme] [tabindex='-1']")).toBe(true);
    // The Box's radius is what the outline follows round the card.
    expect(notice.style.borderRadius).toBe('var(--sw-radius-lg)');
  });
});
