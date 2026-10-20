import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Step, Steps, type StepStatus } from './components/Steps.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function described(element: HTMLElement): string {
  return (element.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent)
    .join(' | ');
}

describe('Step titleDetail', () => {
  it("draws an open list's muted words beside the title, outside the heading, describing the region", () => {
    render(
      <Steps open>
        <Step
          status="done"
          title="The field notes"
          titleDetail="Wetlands done · Woodlands empty"
        >
          <p>Note fields</p>
        </Step>
        <Step status="current" title="A note" titleDetail="Optional">
          <p>Note</p>
        </Step>
      </Steps>,
    );
    const region = screen.getByRole('region', { name: 'The field notes' });
    expect(described(region)).toBe('Wetlands done · Woodlands empty');
    const heading = screen.getByRole('heading', {
      name: 'The field notes, Done',
    });
    const line = heading.parentElement;
    expect(line?.className).toBe('sw-steps-title-line');
    const detail = line?.querySelector('.sw-steps-title-detail');
    expect(detail?.textContent).toBe('Wetlands done · Woodlands empty');
    expect(heading.contains(detail ?? null)).toBe(false);

    const note = screen.getByRole('region', { name: 'A note' });
    expect(described(note)).toBe('Optional');
    expect(screen.getByRole('heading', { name: 'A note' })).toBeTruthy();
  });

  it('draws the words only while a stepped list shows the step open, the heading kept in place', () => {
    function Survey({ status }: { status: StepStatus }) {
      return (
        <Steps>
          <Step
            editLabel="Edit"
            onEdit={() => undefined}
            status={status}
            summary="North marsh"
            title="A note"
            titleDetail="Optional"
          >
            <p>Note fields</p>
          </Step>
        </Steps>
      );
    }
    const { rerender } = render(<Survey status="current" />);
    const heading = screen.getByRole('heading', { name: 'A note' });
    expect(screen.getByText('Optional').className).toBe(
      'sw-steps-title-detail',
    );
    for (const status of ['done', 'upcoming', 'skipped'] as const) {
      rerender(<Survey status={status} />);
      expect(screen.queryByText('Optional')).toBeNull();
      // The same heading element: it is not remounted as the step folds.
      expect(document.querySelector('.sw-steps-title')).toBe(heading);
    }
    rerender(<Survey status="error" />);
    expect(screen.getByText('Optional')).toBeTruthy();
    expect(document.querySelector('.sw-steps-title')).toBe(heading);
  });

  it("keeps a skipped step's reason in the heading and the words beside it", () => {
    render(
      <Steps open>
        <Step
          skippedReason="· not needed"
          status="skipped"
          title="Nests"
          titleDetail="Optional"
        >
          <p>Nest fields</p>
        </Step>
      </Steps>,
    );
    const heading = screen.getByRole('heading', {
      name: 'Nests · not needed',
    });
    expect(heading.querySelector('.sw-steps-reason')?.textContent).toBe(
      '· not needed',
    );
    expect(heading.nextElementSibling?.textContent).toBe('Optional');
    expect(described(screen.getByRole('region', { name: 'Nests' }))).toBe(
      'Optional',
    );
  });

  it('draws the words on an open step with no fields too', () => {
    render(
      <Steps>
        <Step status="current" title="Review" titleDetail="Optional" />
      </Steps>,
    );
    expect(screen.getByText('Optional').className).toBe(
      'sw-steps-title-detail',
    );
  });

  it('leaves a step without titleDetail as it was: no line, no description', () => {
    render(
      <Steps open>
        <Step status="current" title="The site">
          <p>Site fields</p>
        </Step>
      </Steps>,
    );
    expect(document.querySelector('.sw-steps-title-line')).toBeNull();
    expect(
      screen
        .getByRole('region', { name: 'The site' })
        .hasAttribute('aria-describedby'),
    ).toBe(false);
  });

  it('throws on blank words', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    for (const titleDetail of ['', '  '])
      expect(() =>
        render(
          <Steps>
            <Step status="current" title="A note" titleDetail={titleDetail} />
          </Steps>,
        ),
      ).toThrow(new RangeError('Step titleDetail must not be empty'));
  });

  it('generates the line and the muted words from tokens, in the catalog', () => {
    const css = generateStylesheet();
    expect(css).toContain('.sw-steps-title-line {');
    expect(css).toMatch(
      /\.sw-steps-title-detail \{[^}]*color: var\(--sw-color-muted\);[^}]*font-weight: 400;/,
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-steps-title-line', 'sw-steps-title-detail']),
    );
  });
});
