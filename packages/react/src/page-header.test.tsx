import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PageHeader } from './components/PageHeader.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const css = generateStylesheet();

describe('PageHeader', () => {
  it('is the page title alone when given nothing else', () => {
    const { container } = render(<PageHeader title="Spring census" />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Spring census',
    });
    expect(heading.className).toContain('sw-text-heading');
    expect(container.querySelector('.sw-page-header-back')).toBeNull();
    expect(container.querySelector('.sw-page-header-actions')).toBeNull();
    expect(container.querySelector('.sw-page-header-below')).toBeNull();
  });

  it('draws the subtitle in the muted bodySm, the actions and the row below', () => {
    const { container } = render(
      <PageHeader
        actions={<button type="button">Publish</button>}
        below={<div>Switcher</div>}
        subtitle="Week 5 of 12"
        title="Spring census"
      />,
    );
    const subtitle = screen.getByText('Week 5 of 12');
    expect(subtitle.tagName).toBe('P');
    expect(subtitle.className).toContain('sw-text-bodySm');
    expect(subtitle.style.color).toBe('var(--sw-color-muted)');
    expect(
      container.querySelector('.sw-page-header-actions')?.textContent,
    ).toBe('Publish');
    expect(container.querySelector('.sw-page-header-below')?.textContent).toBe(
      'Switcher',
    );
  });

  it('puts the back link first, in the tab order', () => {
    const { container } = render(
      <PageHeader
        back={{ href: '/surveys', label: 'All surveys' }}
        title="Spring census"
      />,
    );
    const back = screen.getByRole('link', { name: 'All surveys' });
    expect(back.getAttribute('href')).toBe('/surveys');
    expect(back.getAttribute('tabindex')).toBe('0');
    expect(container.querySelector('.sw-page-header')?.firstElementChild).toBe(
      back,
    );
  });

  it('hands a plain press on the back link to a client router', () => {
    const onNavigate = vi.fn();
    render(
      <PageHeader
        back={{ href: '/surveys', label: 'All surveys', onNavigate }}
        title="Spring census"
      />,
    );
    const back = screen.getByRole('link', { name: 'All surveys' });
    expect(fireEvent.click(back)).toBe(false);
    expect(onNavigate).toHaveBeenCalledOnce();
    // A press with a modifier key keeps the browser's own behaviour.
    expect(fireEvent.click(back, { metaKey: true })).toBe(true);
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it('leaves a back link without onNavigate to the browser', () => {
    render(
      <PageHeader
        back={{ href: '/surveys', label: 'All surveys' }}
        title="Spring census"
      />,
    );
    expect(
      fireEvent.click(screen.getByRole('link', { name: 'All surveys' })),
    ).toBe(true);
  });

  it('passes other attributes and a class to its header', () => {
    const { container } = render(
      <PageHeader className="own" data-testid="header" title="Spring census" />,
    );
    const header = container.querySelector('header')!;
    expect(header.className).toBe('sw-page-header own');
    expect(header.getAttribute('data-testid')).toBe('header');
  });

  it('fails closed on a blank title or back link', () => {
    expect(() => render(<PageHeader title="  " />)).toThrow(RangeError);
    expect(() =>
      render(<PageHeader back={{ href: '', label: 'Back' }} title="Census" />),
    ).toThrow(RangeError);
    expect(() =>
      render(<PageHeader back={{ href: '/', label: ' ' }} title="Census" />),
    ).toThrow(RangeError);
  });

  it('is in the class catalog and wraps from the generated rules', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-page-header',
        'sw-page-header-back',
        'sw-page-header-row',
        'sw-page-header-words',
        'sw-page-header-actions',
        'sw-page-header-below',
      ]),
    );
    expect(css).toContain(
      '.sw-page-header-row {\n  align-items: flex-start;\n  display: flex;\n  flex-wrap: wrap;',
    );
    expect(css).toContain('flex: 1 1 min(100%, 20rem);');
    expect(css).toContain('.sw-page-header-back:dir(rtl)::before');
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-page-header-back { min-height: var(--sw-control-md-min-height); }',
    );
  });
});
