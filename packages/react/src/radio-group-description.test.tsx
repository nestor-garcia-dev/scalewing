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

const companies = [
  {
    value: 'acme',
    label: 'Acme Freight · Company',
    icon: <svg data-testid="building" viewBox="0 0 16 16" />,
    description: <Badge size="sm">Most recent</Badge>,
  },
  {
    value: 'rivera',
    label: 'Ana Rivera · Personal',
    description: '2 checks · last Sep 13, 2026',
  },
  {
    value: 'harbor',
    label: 'Harbor Supply · Company',
    description: 'Closed account',
    disabled: true,
  },
  { value: 'other', label: 'Another company' },
];

function renderCompanies(onChange = vi.fn()) {
  render(
    <RadioGroup
      legend="Company"
      onChange={onChange}
      options={companies}
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
    renderCompanies();
    // Teisoro F-007-S05 task 1365: each company's history belongs to its row.
    const acme = screen.getByRole('radio', {
      name: 'Acme Freight · Company',
      description: 'Most recent',
    });
    const rivera = screen.getByRole('radio', {
      name: 'Ana Rivera · Personal',
      description: '2 checks · last Sep 13, 2026',
    });
    expect(acme.getAttribute('aria-describedby')).not.toBe(
      rivera.getAttribute('aria-describedby'),
    );
    // The description is a separate relation, never part of the name.
    expect(
      screen.queryByRole('radio', { name: /Most recent|2 checks/ }),
    ).toBeNull();
    const description = document.getElementById(
      acme.getAttribute('aria-describedby') ?? '',
    )!;
    expect(description.className).toBe('sw-radio-group-option-description');
    expect(description.querySelector('.sw-badge')?.textContent).toBe(
      'Most recent',
    );
  });

  it('puts the label and the description in one body after the glyph', () => {
    renderCompanies();
    const option = screen
      .getByRole('radio', { name: 'Acme Freight · Company' })
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
    renderCompanies();
    const radio = screen.getByRole('radio', { name: 'Another company' });
    expect(radio.hasAttribute('aria-describedby')).toBe(false);
    expect(radio.hasAttribute('aria-labelledby')).toBe(false);
    const option = radio.closest('label')!;
    expect(Array.from(option.children).map((child) => child.className)).toEqual(
      ['sw-radio-group-control', 'sw-radio-group-text'],
    );
    expect(option.querySelector('.sw-radio-group-text')?.id).toBe('');
  });

  it('chooses the option on a press on its description, but not a disabled one', async () => {
    const onChange = renderCompanies();
    await userEvent.click(screen.getByText('2 checks · last Sep 13, 2026'));
    expect(onChange).toHaveBeenCalledExactlyOnceWith('rivera');
    await userEvent.click(screen.getByText('Most recent'));
    expect(onChange).toHaveBeenLastCalledWith('acme');
    await userEvent.click(screen.getByText('Closed account'));
    expect(onChange).toHaveBeenCalledTimes(2);
    // The disabled option's description is inside the faded option.
    expect(
      screen
        .getByRole('radio', { name: 'Harbor Supply · Company' })
        .closest('label')
        ?.contains(screen.getByText('Closed account')),
    ).toBe(true);
  });

  it('generates a wrapping body with the description muted at the inline end', () => {
    const css = cssRadioGroupClasses();
    expect(css).toContain(
      '.sw-radio-group-option:has(> .sw-radio-group-body) {\n  align-items: flex-start;\n  box-sizing: border-box;',
    );
    expect(css).toContain(
      '.sw-radio-group-body {\n  align-items: baseline;\n  column-gap: var(--sw-space-3);\n  display: flex;\n  flex: 1 1 0;\n  flex-wrap: wrap;',
    );
    // The label grows, so the description sits at the end while both fit
    // and starts its own line under the label when they do not.
    expect(css).toContain(
      '.sw-radio-group-body > .sw-radio-group-text { flex: 1 1 auto; }',
    );
    expect(css).toContain(
      '.sw-radio-group-option-description {\n  color: var(--sw-color-muted);\n  flex: 0 1 auto;',
    );
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
