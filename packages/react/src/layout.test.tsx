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
  it('maps Text align to a generated alignment class and leaves it off by default', () => {
    render(
      <>
        <Text align="center" variant="heading">
          Centered
        </Text>
        <Text>Plain</Text>
      </>,
    );
    expect(screen.getByText('Centered').className).toBe(
      'sw-text-heading sw-text-align-center',
    );
    expect(screen.getByText('Plain').className).toBe('sw-text-body');
  });

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
    expect(
      container.firstElementChild?.getAttribute('data-palette'),
    ).toBeNull();
    expect(
      (
        container.firstElementChild as HTMLElement | null
      )?.style.getPropertyValue('--sw-glass-fill'),
    ).toBeTruthy();
  });

  it('applies a named palette to data-palette and accent variables', () => {
    const { container } = render(
      <ThemeProvider colorScheme="light" palette="cerulean">
        <Text>Board</Text>
      </ThemeProvider>,
    );

    const root = container.firstElementChild as HTMLElement | null;
    expect(root?.getAttribute('data-palette')).toBe('cerulean');
    expect(root?.style.getPropertyValue('--sw-color-accent')).toBe('#0066CC');
  });

  it('picks the dark brand overlay when colorScheme is dark', () => {
    const { container } = render(
      <ThemeProvider
        colorScheme="dark"
        colors={{
          light: { accent: '#0066CC' },
          dark: { accent: '#5AC8FA' },
        }}
      >
        <Text>Night</Text>
      </ThemeProvider>,
    );

    const root = container.firstElementChild as HTMLElement | null;
    expect(root?.getAttribute('data-theme')).toBe('dark');
    expect(root?.style.getPropertyValue('--sw-color-accent')).toBe('#5AC8FA');
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
