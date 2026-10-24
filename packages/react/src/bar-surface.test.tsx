import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { AppHeader, type AppHeaderAppearance } from './components/AppHeader.js';
import { Box } from './components/Box.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('Box border bottom', () => {
  it('draws a hairline under the box only', () => {
    render(
      <Box aria-label="Sections" as="nav" background="surface" border="bottom">
        x
      </Box>,
    );
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav.className).toContain('sw-border-bottom');
    expect(nav.className).not.toMatch(/sw-border(\s|$)/);
  });

  it('generates the bottom hairline after the component frames', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-border-bottom');
    const rule =
      '.sw-border-bottom { border-width: 0 0 1px; border-style: solid; border-color: var(--sw-color-border); }';
    expect(css).toContain(rule);
    expect(css.indexOf(rule)).toBeGreaterThan(css.indexOf('.sw-app-header {'));
  });
});

describe('AppHeader appearance', () => {
  it('forwards a ref to its header element', () => {
    const ref = createRef<HTMLElement>();
    render(<AppHeader ref={ref}>Brand</AppHeader>);
    expect(ref.current).toBe(screen.getByRole('banner'));
    expect(ref.current?.tagName).toBe('HEADER');
  });

  it('keeps the glass card by default', () => {
    render(<AppHeader>Brand</AppHeader>);
    expect(screen.getByRole('banner').className).toBe(
      'sw-padding-4 sw-app-header sw-app-header-sticky',
    );
  });

  it('draws a full-width bar', () => {
    render(
      <AppHeader appearance="bar" sticky={false}>
        Brand
      </AppHeader>,
    );
    expect(screen.getByRole('banner').className).toBe(
      'sw-padding-4 sw-app-header sw-app-header-bar',
    );
  });

  it('fails closed on an unknown appearance', () => {
    expect(() =>
      render(<AppHeader appearance={'card' as AppHeaderAppearance} />),
    ).toThrow(RangeError);
  });

  it('generates the solid band with a hairline under it, after the glass frame', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-app-header-bar');
    const rule = `.sw-app-header-bar {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--sw-color-surface);
  border-color: var(--sw-color-border);
  border-radius: 0;
  border-style: solid;
  border-width: 0 0 1px;
  box-shadow: none;
}`;
    expect(css).toContain(rule);
    expect(css.indexOf(rule)).toBeGreaterThan(css.indexOf('.sw-app-header {'));
  });

  it('lets a Box border on a bar header win: the border classes come later at the same specificity', () => {
    const { container } = render(
      <AppHeader appearance="bar" border="dashed" sticky={false} />,
    );
    const classes = container.firstElementChild?.classList;
    expect(classes?.contains('sw-app-header-bar')).toBe(true);
    expect(classes?.contains('sw-border-dashed')).toBe(true);
    const css = generateStylesheet();
    const bar = css.indexOf('.sw-app-header-bar {');
    expect(css.indexOf('.sw-border-dashed {')).toBeGreaterThan(bar);
    expect(css.indexOf('.sw-border {')).toBeGreaterThan(bar);
  });
});
