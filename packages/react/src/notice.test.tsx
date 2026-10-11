import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { Notice, type NoticeTone } from './components/Notice.js';
import {
  noticeInkTextShare,
  noticeTintShare,
  noticeToneColor,
  noticeTones,
} from './css/css-notice.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';

afterEach(() => cleanup());

describe('Notice', () => {
  it('announces danger as an alert and the other tones as a status', () => {
    render(
      <>
        <Notice title="Saved." tone="success" />
        <Notice title="Heads up." tone="info" />
        <Notice title="No tens." tone="warning" />
        <Notice title="Blocked." tone="danger" />
      </>,
    );
    expect(screen.getAllByRole('status').map((node) => node.className)).toEqual(
      [
        'sw-notice sw-notice-success',
        'sw-notice sw-notice-info',
        'sw-notice sw-notice-warning',
      ],
    );
    expect(screen.getByRole('alert').className).toBe(
      'sw-notice sw-notice-danger',
    );
  });

  it('takes a role, or none for a notice that is part of the page', () => {
    const { container } = render(
      <>
        <Notice role="alert" title="Count again." tone="warning" />
        <Notice role="none" tone="info">
          Three tasks are due this week.
        </Notice>
      </>,
    );
    expect(screen.getByRole('alert').textContent).toBe('Count again.');
    const quiet = container.querySelector('.sw-notice-info');
    expect(quiet?.getAttribute('role')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('reads the bold lead, then the message, then the action', () => {
    render(
      <Notice
        action={<a href="#tasks">Open the log</a>}
        title="Two nests unchecked."
        tone="info"
      >
        Check them before dusk.
      </Notice>,
    );
    const notice = screen.getByRole('status');
    expect(notice.textContent).toBe(
      'Two nests unchecked.Check them before dusk.Open the log',
    );
    const title = notice.querySelector('strong.sw-notice-title');
    expect(title?.textContent).toBe('Two nests unchecked.');
    expect(notice.querySelector('.sw-notice-body')?.textContent).toBe(
      'Check them before dusk.',
    );
    expect(
      notice.querySelector('.sw-notice-action')?.querySelector('a')
        ?.textContent,
    ).toBe('Open the log');
  });

  it('stacks a message of elements under the title, and keeps text on its row', () => {
    render(
      <>
        <Notice title="Two nests short." tone="danger">
          <label>
            <input type="checkbox" /> I counted again
          </label>
        </Notice>
        <Notice title="Saved." tone="success">
          The count is in.
        </Notice>
      </>,
    );
    expect(
      screen.getByRole('alert').querySelector('.sw-notice-content')?.className,
    ).toBe('sw-notice-content sw-notice-stacked');
    expect(
      screen.getByRole('status').querySelector('.sw-notice-content')?.className,
    ).toBe('sw-notice-content');
    expect(
      screen.getByRole('checkbox', { name: 'I counted again' }),
    ).toBeTruthy();
  });

  it('keeps a sentence with interpolated values on the row, and drops empty parts', () => {
    const amount = '$30.00';
    const shown = false;
    render(
      <>
        <Notice title="Short." tone="warning">
          Add {amount} or change it.
        </Notice>
        <Notice title="Saved." tone="success">
          {shown && 'Never shown.'}
        </Notice>
        <Notice title="Empty." tone="success">
          {shown ? 'Never shown.' : ''}
        </Notice>
      </>,
    );
    const [short, saved, empty] = screen.getAllByRole('status');
    expect(empty?.querySelector('.sw-notice-body')).toBeNull();
    expect(short?.querySelector('.sw-notice-content')?.className).toBe(
      'sw-notice-content',
    );
    expect(short?.querySelector('.sw-notice-body')?.textContent).toBe(
      'Add $30.00 or change it.',
    );
    expect(saved?.querySelector('.sw-notice-body')).toBeNull();
    expect(saved?.querySelector('.sw-notice-content')?.className).toBe(
      'sw-notice-content',
    );
    expect(() =>
      render(<Notice tone="info">{shown && 'Never shown.'}</Notice>),
    ).toThrow(RangeError);
  });

  it('stacks any element message, a lone span included', () => {
    render(
      <Notice title="Heads up." tone="info">
        <span>Look twice.</span>
      </Notice>,
    );
    expect(
      screen.getByRole('status').querySelector('.sw-notice-content')?.className,
    ).toBe('sw-notice-content sw-notice-stacked');
  });

  it('hides the glyph from assistive technology and leaves out empty parts', () => {
    render(
      <Notice icon={<svg data-testid="glyph" />} tone="success">
        Survey saved.
      </Notice>,
    );
    const notice = screen.getByRole('status');
    const icon = notice.querySelector('.sw-notice-icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.contains(screen.getByTestId('glyph'))).toBe(true);
    expect(notice.querySelector('.sw-notice-title')).toBeNull();
    expect(notice.querySelector('.sw-notice-action')).toBeNull();
  });

  it('can take the focus when the page moves it there', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Notice ref={ref} tabIndex={-1} title="The river rose." tone="danger" />,
    );
    ref.current?.focus();
    expect(document.activeElement).toBe(screen.getByRole('alert'));
  });

  it('fails closed on an unknown tone or role, a blank title, or nothing to say', () => {
    expect(() =>
      render(<Notice title="x" tone={'neutral' as NoticeTone} />),
    ).toThrow(RangeError);
    expect(() =>
      render(<Notice role={'log' as 'status'} title="x" tone="info" />),
    ).toThrow(RangeError);
    expect(() => render(<Notice title=" " tone="info" />)).toThrow(RangeError);
    expect(() => render(<Notice tone="info" />)).toThrow(RangeError);
  });
});

describe('Notice CSS', () => {
  const css = generateStylesheet();

  it('emits one fill and ink per tone from the semantic colors', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-notice',
        'sw-notice-info',
        'sw-notice-success',
        'sw-notice-warning',
        'sw-notice-danger',
        'sw-notice-icon',
        'sw-notice-content',
        'sw-notice-stacked',
        'sw-notice-title',
        'sw-notice-body',
        'sw-notice-action',
      ]),
    );
    expect(css).toContain(
      '.sw-notice-info { --sw-notice-fill: var(--sw-color-accentSubtle); --sw-notice-ink: color-mix(in srgb, var(--sw-color-accent) 70%, var(--sw-color-text)); }',
    );
    expect(css).toContain(
      '.sw-notice-warning { --sw-notice-fill: color-mix(in srgb, var(--sw-color-warning) 10%, var(--sw-color-surface)); --sw-notice-ink: color-mix(in srgb, var(--sw-color-warning) 70%, var(--sw-color-text)); }',
    );
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-notice { border: 1px solid CanvasText; }\n}',
    );
    // A control's muted description inside takes the ink, tested below.
    expect(css).toContain('--sw-color-muted: var(--sw-notice-ink);');
  });

  it('keeps its words, and muted words inside it, at 4.5:1 on its fill in every palette and scheme', () => {
    const below: string[] = [];
    forEveryTheme((colors, label) => {
      for (const tone of noticeTones) {
        const toneColor = colors[noticeToneColor(tone) as 'accent'];
        const fill =
          tone === 'info'
            ? colors.accentSubtle
            : tintOver(toneColor, noticeTintShare, colors.surface);
        const ink = tintOver(toneColor, 1 - noticeInkTextShare, colors.text);
        const ratio = contrastRatio(ink, fill);
        if (ratio >= 4.5) continue;
        below.push(`${label} ${tone}`);
        // Never below what the bare tone already has on the surface.
        expect(ratio, `${label} ${tone}`).toBeGreaterThan(
          contrastRatio(toneColor, colors.surface),
        );
      }
    });
    // Only where the palette's own danger is under 4.5:1 on its surface.
    expect(below).toEqual(['harvest dark danger', 'mocha dark danger']);
  });
});
