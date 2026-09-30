import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Badge } from './components/Badge.js';
import { RadioGroup } from './components/RadioGroup.js';
import { cssRadioGroupClasses } from './css/css-radio-group.js';
import { utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => cleanup());

const sources = [
  {
    value: 'observer',
    label: 'Field observer',
    icon: <svg data-testid="person" viewBox="0 0 16 16" />,
    description: <Badge size="sm">Most recent</Badge>,
  },
  {
    value: 'camera',
    label: 'Camera trap',
    description: '2 sightings · last Sep 13, 2026',
  },
  {
    value: 'acoustic',
    label: 'Acoustic monitor',
    description: 'Offline since Aug 2, 2026',
    disabled: true,
  },
  { value: 'other', label: 'Another source' },
];

function renderSources(onChange = vi.fn()) {
  render(
    <RadioGroup
      legend="Sighting source"
      onChange={onChange}
      options={sources}
      value=""
    />,
  );
  return onChange;
}

/** An `rgba()` fill composited over an opaque hex ground, as a hex color. */
function over(fill: string, ground: string): string {
  const [red, green, blue, alpha] = fill.match(/[\d.]+/g)!.map(Number);
  const channels = [red!, green!, blue!];
  const hex = ground.replace('#', '');
  return `#${channels
    .map((channel, index) => {
      const below = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
      const mixed = Math.round(channel * alpha! + below * (1 - alpha!));
      return mixed.toString(16).padStart(2, '0');
    })
    .join('')}`;
}

describe('RadioGroup option descriptions', () => {
  it('describes each radio by its own description and keeps its name the label', () => {
    renderSources();
    // Teisoro F-007-S05 task 1365: each option's history belongs to its row.
    const observer = screen.getByRole('radio', {
      name: 'Field observer',
      description: 'Most recent',
    });
    const camera = screen.getByRole('radio', {
      name: 'Camera trap',
      description: '2 sightings · last Sep 13, 2026',
    });
    expect(observer.getAttribute('aria-describedby')).not.toBe(
      camera.getAttribute('aria-describedby'),
    );
    // The description is a separate relation, never part of the name.
    expect(
      screen.queryByRole('radio', { name: /Most recent|2 sightings/ }),
    ).toBeNull();
    const description = document.getElementById(
      observer.getAttribute('aria-describedby') ?? '',
    )!;
    expect(description.className).toBe('sw-radio-group-option-description');
    expect(description.querySelector('.sw-badge')?.textContent).toBe(
      'Most recent',
    );
  });

  it('puts the label and the description in one body after the glyph', () => {
    renderSources();
    const option = screen
      .getByRole('radio', { name: 'Field observer' })
      .closest('label')!;
    expect(Array.from(option.children).map((child) => child.className)).toEqual(
      ['sw-radio-group-control', 'sw-radio-group-icon', 'sw-radio-group-body'],
    );
    const body = option.querySelector('.sw-radio-group-body')!;
    expect(Array.from(body.children).map((child) => child.className)).toEqual([
      'sw-radio-group-text',
      'sw-radio-group-option-description',
    ]);
  });

  it('leaves an option without a description as it was', () => {
    renderSources();
    const radio = screen.getByRole('radio', { name: 'Another source' });
    expect(radio.hasAttribute('aria-describedby')).toBe(false);
    expect(radio.hasAttribute('aria-labelledby')).toBe(false);
    const option = radio.closest('label')!;
    expect(Array.from(option.children).map((child) => child.className)).toEqual(
      ['sw-radio-group-control', 'sw-radio-group-text'],
    );
    expect(option.querySelector('.sw-radio-group-text')?.id).toBe('');
  });

  it('chooses the option on a press on its description, but not a disabled one', async () => {
    const onChange = renderSources();
    await userEvent.click(screen.getByText('2 sightings · last Sep 13, 2026'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('camera');
    await userEvent.click(screen.getByText('Most recent'));
    expect(onChange).toHaveBeenLastCalledWith('observer');
    await userEvent.click(screen.getByText('Offline since Aug 2, 2026'));
    expect(onChange).toHaveBeenCalledTimes(2);
    // The disabled option's description is inside the faded option.
    expect(
      screen
        .getByRole('radio', { name: 'Acoustic monitor' })
        .closest('label')
        ?.contains(screen.getByText('Offline since Aug 2, 2026')),
    ).toBe(true);
  });

  it('counts 0 as a description, as React renders it', () => {
    render(
      <RadioGroup
        legend="Sighting source"
        onChange={vi.fn()}
        options={[{ value: 'camera', label: 'Camera trap', description: 0 }]}
        value=""
      />,
    );
    const radio = screen.getByRole('radio', {
      name: 'Camera trap',
      description: '0',
    });
    expect(
      radio.closest('label')?.querySelector('.sw-radio-group-body'),
    ).not.toBeNull();
  });

  it.each([
    ['false', false],
    ['true', true],
    ["''", ''],
    ['null', null],
  ])('treats %s as no description', (_name, description) => {
    render(
      <RadioGroup
        legend="Sighting source"
        onChange={vi.fn()}
        options={[{ value: 'camera', label: 'Camera trap', description }]}
        value=""
      />,
    );
    const radio = screen.getByRole('radio', { name: 'Camera trap' });
    expect(radio.hasAttribute('aria-describedby')).toBe(false);
    expect(radio.hasAttribute('aria-labelledby')).toBe(false);
    expect(
      Array.from(radio.closest('label')!.children).map(
        (child) => child.className,
      ),
    ).toEqual(['sw-radio-group-control', 'sw-radio-group-text']);
  });

  it('generates a wrapping body with the description muted at the inline end', () => {
    const css = cssRadioGroupClasses();
    expect(css).toContain(
      '.sw-radio-group-option:has(> .sw-radio-group-body) {\n  align-items: flex-start;\n  box-sizing: border-box;',
    );
    expect(css).toContain(
      '.sw-radio-group-body {\n  align-items: flex-start;\n  column-gap: var(--sw-space-3);\n  display: flex;\n  flex: 1 1 0;\n  flex-wrap: wrap;',
    );
    // The label grows, so the description sits at the end while both fit
    // and starts its own line under the label when they do not.
    expect(css).toContain(
      '.sw-radio-group-body > .sw-radio-group-text { flex: 1 1 auto; }',
    );
    expect(css).toContain(
      '.sw-radio-group-option-description {\n  color: var(--sw-color-muted);\n  flex: 0 1 auto;',
    );
    // A caption line is centred on the label's line box, and a taller
    // description grows the row downward instead of moving the label.
    expect(css).toContain('  margin-block-start: calc((20px - 18px) / 2);');
    expect(css).not.toContain('align-items: baseline');
    expect(css).toContain(
      '@media not all and (min-width: 48rem) {\n  .sw-radio-group-option-description { flex-basis: 100%; }\n}',
    );
    // A disabled option fades as a whole, description included.
    expect(css).toContain(
      '.sw-radio-group-option:has(.sw-radio-group-input:disabled) {\n  cursor: not-allowed;\n  opacity: var(--sw-disabled-opacity);',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-radio-group-body',
        'sw-radio-group-option-description',
      ]),
    );
  });

  it('keeps the muted description at 4.5:1 on the page, a surface and glass in every palette and scheme', () => {
    forEveryTheme((colors, label, theme) => {
      const glass = over(theme.glass.fill, colors.background);
      for (const ground of [colors.background, colors.surface, glass])
        expect(
          contrastRatio(colors.muted, ground),
          `${label} on ${ground}`,
        ).toBeGreaterThanOrEqual(4.5);
    });
  });
});
