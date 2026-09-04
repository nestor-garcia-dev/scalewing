import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
import { Card } from './components/Card.js';
import { Inline } from './components/Inline.js';
import { Stack } from './components/Stack.js';
import { Text } from './components/Text.js';
import { spacingClassNames } from './spacing-classes.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

describe('spacingClassNames', () => {
  it('maps directional padding props to generated class names', () => {
    expect(
      spacingClassNames({
        padding: 4,
        paddingTop: 2,
      }),
    ).toEqual(['sw-padding-4', 'sw-padding-top-2']);
  });
});

describe('layout components', () => {
  it('places card content with token classes', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Card padding={4}>
          <Stack gap={2}>
            <Text variant="title">Sunday kickoff</Text>
            <Inline gap={2} className="sw-padding-top-4">
              <Text color="muted">Home</Text>
              <Box as="span" paddingX={2}>
                2–1
              </Box>
            </Inline>
          </Stack>
        </Card>
      </ThemeProvider>,
    );

    const card = screen.getByText('Sunday kickoff').closest('section');
    expect(card?.className).toContain('sw-card');
    expect(card?.className).toContain('sw-card-glass');
    expect(card?.className).toContain('sw-padding-4');
    expect(screen.getByText('Home').className).toContain('sw-text-body');
    expect(screen.getByText('2–1').parentElement?.className).toContain(
      'sw-padding-top-4',
    );
  });

  it('sets data-theme from the provider', () => {
    const { container } = render(
      <ThemeProvider colorScheme="dark">
        <Text>Night</Text>
      </ThemeProvider>,
    );

    expect(container.firstElementChild?.getAttribute('data-theme')).toBe(
      'dark',
    );
  });

  it('renders a real anchor when as is a', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Box as="a" href="/draft" padding={2}>
          Draft board
        </Box>
      </ThemeProvider>,
    );

    const link = screen.getByRole('link', { name: 'Draft board' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/draft');
    expect(link.className).toContain('sw-padding-2');
  });
});
