import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Step, Steps, type StepStatus } from './components/Steps.js';
import { cssStepsClasses } from './css/css-steps.js';
import { utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

function OpenSurvey({
  statuses,
}: {
  statuses: [StepStatus, StepStatus, StepStatus, StepStatus];
}) {
  return (
    <Steps aria-label="Survey" open>
      <Step status={statuses[0]} title="The site">
        <p>Site fields</p>
      </Step>
      <Step status={statuses[1]} title="The count">
        <p>Count fields</p>
      </Step>
      <Step status={statuses[2]} title="Nests">
        <p>Nest fields</p>
      </Step>
      <Step status={statuses[3]} title="Review" />
    </Steps>
  );
}

describe('Steps open', () => {
  it('shows every step with children, whatever its status, each a region named by its title', () => {
    render(<OpenSurvey statuses={['done', 'current', 'upcoming', 'error']} />);
    const list = screen.getByRole('list', { name: 'Survey' });
    expect(list.className).toBe('sw-steps sw-steps-open');
    for (const fields of ['Site fields', 'Count fields', 'Nest fields'])
      expect(screen.getByText(fields)).toBeTruthy();
    const regions = screen.getAllByRole('region');
    expect(regions.map((region) => region.tagName)).toEqual([
      'SECTION',
      'SECTION',
      'SECTION',
      'SECTION',
    ]);
    expect(
      screen.getByRole('region', { name: 'The site' }).textContent,
    ).toContain('Site fields');
    expect(screen.getByRole('region', { name: 'Review' })).toBeTruthy();
    // A step with no children has no body.
    const review = screen.getByRole('region', { name: 'Review' });
    expect(review.querySelector('.sw-steps-body')).toBeNull();
    expect(review.className).toBe('sw-steps-region');
  });

  it('keeps the markers and status words, and marks no step current', () => {
    render(<OpenSurvey statuses={['done', 'current', 'upcoming', 'error']} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.hasAttribute('aria-current'))).toEqual([
      false,
      false,
      false,
      false,
    ]);
    expect(
      items.map((item) => item.querySelector('.sw-steps-marker')!.textContent),
    ).toEqual(['', '2', '3', '!']);
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      'The site, Done',
      'The count',
      'Nests, Not started',
      'Review, Needs attention',
    ]);
  });

  it('shows a skipped step body too, and a done step its summary and Edit when given', () => {
    render(
      <Steps open>
        <Step
          editLabel="Edit"
          onEdit={() => undefined}
          status="done"
          summary="North marsh"
          title="The site"
        >
          <p>Site fields</p>
        </Step>
        <Step skippedReason="· not needed" status="skipped" title="Nests">
          <p>Nest fields</p>
        </Step>
      </Steps>,
    );
    expect(screen.getByText('Site fields')).toBeTruthy();
    expect(screen.getByText('North marsh')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Edit The site' })).toBeTruthy();
    expect(screen.getByText('Nest fields')).toBeTruthy();
  });

  it('moves no focus when a step changes status', async () => {
    const field = document.createElement('input');
    document.body.append(field);
    field.focus();
    const { rerender } = render(
      <OpenSurvey statuses={['current', 'upcoming', 'upcoming', 'upcoming']} />,
    );
    await act(async () => {
      rerender(
        <OpenSurvey statuses={['done', 'current', 'current', 'upcoming']} />,
      );
    });
    expect(document.activeElement).toBe(field);
    await act(async () => {
      rerender(
        <OpenSurvey statuses={['current', 'done', 'done', 'current']} />,
      );
    });
    expect(document.activeElement).toBe(field);
    field.remove();
  });

  it('a list without open keeps its folded steps and no regions', () => {
    render(
      <Steps>
        <Step status="done" title="The site">
          <p>Site fields</p>
        </Step>
        <Step status="current" title="The count">
          <p>Count fields</p>
        </Step>
      </Steps>,
    );
    expect(screen.queryByText('Site fields')).toBeNull();
    expect(screen.queryAllByRole('region')).toHaveLength(0);
    expect(screen.getByRole('list').className).toBe('sw-steps');
  });
});

describe('Steps open CSS', () => {
  const css = cssStepsClasses();

  it('is in the catalog', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining(['sw-steps-open', 'sw-steps-region']),
    );
  });

  it('gives every step of an open list the open padding and title, its region the item gap', () => {
    expect(css).toMatch(
      /\.sw-steps-open > \.sw-steps-item \{\n {2}--sw-steps-padding: var\(--sw-space-4\);/,
    );
    expect(css).toMatch(
      /\.sw-steps-open > \.sw-steps-item \.sw-steps-title \{\n {2}font-size: 20px;/,
    );
    expect(css).toMatch(
      /\.sw-steps-region \{\n {2}display: flex;\n {2}flex-direction: column;\n {2}gap: var\(--sw-space-4\);/,
    );
  });

  it('draws the line under a done step in the success colour, an open list too', () => {
    expect(css).toMatch(
      /\.sw-steps-item-done:not\(:last-child\)::after \{\n {2}background: var\(--sw-color-success\);\n\}/,
    );
    // No open-list rule repaints the line.
    expect(css).not.toMatch(/\.sw-steps-open[^{]*::after/);
  });
});
