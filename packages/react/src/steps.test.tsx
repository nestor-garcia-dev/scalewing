import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { useEffect, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Step, Steps, type StepStatus } from './components/Steps.js';
import {
  isOpenStep,
  stepStatusWord,
  stepTakesFocus,
  defaultStepsLabels,
} from './components/steps/step-status.js';
import { cssStepsClasses } from './css/css-steps.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { expectHeadingNames } from './heading-names.test-support.js';

afterEach(() => cleanup());

function Survey({
  statuses,
  onEdit = vi.fn(),
}: {
  statuses: [StepStatus, StepStatus, StepStatus];
  onEdit?: () => void;
}) {
  return (
    <Steps aria-label="Survey">
      <Step
        editLabel="Edit"
        onEdit={onEdit}
        status={statuses[0]}
        summary="Wetland · 12 herons"
        title="The site"
      >
        <p>Site fields</p>
      </Step>
      <Step skippedReason="· not needed" status={statuses[1]} title="Nests">
        <p>Nest fields</p>
      </Step>
      <Step status={statuses[2]} title="Review">
        <p>Review fields</p>
      </Step>
    </Steps>
  );
}

describe('step status rules', () => {
  it('opens current and error steps only', () => {
    expect(['current', 'error'].every((s) => isOpenStep(s as StepStatus))).toBe(
      true,
    );
    for (const status of ['upcoming', 'done', 'skipped'] as const)
      expect(isOpenStep(status)).toBe(false);
  });

  it('takes focus only when a folded step opens', () => {
    expect(stepTakesFocus(undefined, 'current')).toBe(false);
    expect(stepTakesFocus('upcoming', 'current')).toBe(true);
    expect(stepTakesFocus('done', 'current')).toBe(true);
    expect(stepTakesFocus('skipped', 'current')).toBe(true);
    // An error is the consumer's to focus (its first invalid field).
    expect(stepTakesFocus('done', 'error')).toBe(false);
    expect(stepTakesFocus('current', 'error')).toBe(false);
    expect(stepTakesFocus('error', 'current')).toBe(false);
    expect(stepTakesFocus('current', 'done')).toBe(false);
  });

  it('reads a status word except for the current step and a shown reason', () => {
    expect(stepStatusWord('done', defaultStepsLabels, false)).toBe('Done');
    expect(stepStatusWord('current', defaultStepsLabels, false)).toBeNull();
    expect(stepStatusWord('skipped', defaultStepsLabels, true)).toBeNull();
    expect(stepStatusWord('skipped', defaultStepsLabels, false)).toBe(
      'Not needed',
    );
  });
});

describe('Steps semantics', () => {
  it('is a named ordered list of numbered steps with headings', () => {
    render(<Survey statuses={['current', 'upcoming', 'upcoming']} />);
    const list = screen.getByRole('list', { name: 'Survey' });
    expect(list.tagName).toBe('OL');
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]!.getAttribute('aria-current')).toBe('step');
    expect(items[1]!.hasAttribute('aria-current')).toBe(false);
    expect(
      items.map((item) => item.querySelector('.sw-steps-marker')!.textContent),
    ).toEqual(['1', '2', '3']);
    expectHeadingNames(2, [
      'The site',
      'Nests, Not started',
      'Review, Not started',
    ]);
    for (const marker of document.querySelectorAll('.sw-steps-marker'))
      expect(marker.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows only the open step fields', () => {
    render(<Survey statuses={['done', 'error', 'upcoming']} />);
    expect(screen.queryByText('Site fields')).toBeNull();
    expect(screen.getByText('Nest fields')).toBeTruthy();
    expect(screen.queryByText('Review fields')).toBeNull();
    const error = screen.getAllByRole('listitem')[1]!;
    expect(error.className).toBe('sw-steps-item sw-steps-item-error');
    expect(error.querySelector('.sw-steps-marker')!.textContent).toBe('!');
    expect(
      screen.getByRole('heading', { name: 'Nests, Needs attention' }),
    ).toBeTruthy();
  });

  it('folds a done step to its summary and an Edit named by its title', () => {
    const onEdit = vi.fn();
    render(
      <Survey onEdit={onEdit} statuses={['done', 'current', 'upcoming']} />,
    );
    const done = screen.getAllByRole('listitem')[0]!;
    expect(done.querySelector('.sw-steps-marker')!.textContent).toBe('');
    expect(done.querySelector('.sw-steps-summary')!.textContent).toBe(
      'Wetland · 12 herons',
    );
    const edit = screen.getByRole('button', { name: 'Edit The site' });
    expect(edit.className).toContain('sw-button-ghost');
    expect(edit.className).toContain('sw-button-sm');
    fireEvent.click(edit);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('shows no summary or Edit unless done', () => {
    render(<Survey statuses={['current', 'upcoming', 'upcoming']} />);
    expect(screen.queryByText('Wetland · 12 herons')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows a skipped step reason instead of its status word', () => {
    render(<Survey statuses={['done', 'skipped', 'current']} />);
    const heading = screen.getByRole('heading', { name: 'Nests · not needed' });
    expect(heading.querySelector('.sw-steps-reason')).toBeTruthy();
    expect(screen.queryByText('Nest fields')).toBeNull();
  });

  it('takes its heading level and status words from the list, and a step may override the level', () => {
    render(
      <Steps headingLevel={3} labels={{ done: 'Hecho', upcoming: 'Pendiente' }}>
        <Step status="done" title="El sitio" />
        <Step headingLevel={4} status="upcoming" title="Nidos" />
      </Steps>,
    );
    expectHeadingNames(3, ['El sitio, Hecho']);
    expectHeadingNames(4, ['Nidos, Pendiente']);
  });
});

describe('Steps focus', () => {
  it('moves focus to a step heading when it opens, not on first render', async () => {
    const { rerender } = render(
      <Survey statuses={['current', 'upcoming', 'upcoming']} />,
    );
    expect(document.activeElement).toBe(document.body);
    await act(async () => {
      rerender(<Survey statuses={['done', 'current', 'upcoming']} />);
    });
    const nests = screen.getByRole('heading', { name: 'Nests' });
    expect(document.activeElement).toBe(nests);
    expect(nests.tabIndex).toBe(-1);
    // Current to error keeps focus where the person is.
    const field = document.createElement('input');
    document.body.append(field);
    field.focus();
    await act(async () => {
      rerender(<Survey statuses={['done', 'error', 'upcoming']} />);
    });
    expect(document.activeElement).toBe(field);
    field.remove();
    // Edit reopens a done step: focus goes to it.
    await act(async () => {
      rerender(<Survey statuses={['current', 'upcoming', 'upcoming']} />);
    });
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'The site' }),
    );
  });
});

describe('Steps focus among several steps', () => {
  it('gives focus to the first step that opens in a commit, then again on the next change', async () => {
    const list = (a: StepStatus, b: StepStatus) => (
      <Steps>
        <Step status={a} title="First" />
        <Step status={b} title="Second" />
      </Steps>
    );
    const { rerender } = render(list('upcoming', 'upcoming'));
    await act(async () => {
      rerender(list('current', 'current'));
    });
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'First' }),
    );
    await act(async () => {
      rerender(list('done', 'upcoming'));
    });
    await act(async () => {
      rerender(list('done', 'current'));
    });
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Second' }),
    );
  });
});

describe('Steps focus with a step that renders on its own', () => {
  it('moves focus each time, whichever component re-rendered', async () => {
    const opener = new EventTarget();
    function OwnStep() {
      const [status, setStatus] = useState<StepStatus>('upcoming');
      useEffect(() => {
        const open = () => setStatus('current');
        opener.addEventListener('open', open);
        return () => opener.removeEventListener('open', open);
      }, []);
      return <Step status={status} title="Own" />;
    }
    const list = (other: StepStatus) => (
      <Steps>
        <OwnStep />
        <Step status={other} title="Other" />
      </Steps>
    );
    const { rerender } = render(list('upcoming'));
    await act(async () => {
      opener.dispatchEvent(new Event('open'));
    });
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Own' }),
    );
    await act(async () => {
      rerender(list('current'));
    });
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Other' }),
    );
  });
});

describe('Steps validation', () => {
  it('refuses a blank title, an unknown status or level, Edit without words, and blank words', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const one =
      (step: React.ReactNode, props = {}) =>
      () =>
        render(<Steps {...props}>{step}</Steps>);
    expect(one(<Step status="current" title=" " />)).toThrow(RangeError);
    expect(one(<Step status={'later' as StepStatus} title="A" />)).toThrow(
      RangeError,
    );
    expect(
      one(<Step status="current" title="A" />, { headingLevel: 5 }),
    ).toThrow(RangeError);
    expect(one(<Step onEdit={vi.fn()} status="done" title="A" />)).toThrow(
      'Step onEdit needs an editLabel',
    );
    expect(one(<Step skippedReason="" status="skipped" title="A" />)).toThrow(
      RangeError,
    );
    expect(
      one(<Step status="done" title="A" />, { labels: { done: '' } }),
    ).toThrow('Steps labels must not be empty');
    expect(
      one(<Step status="done" title="A" />, { labels: { done: undefined } }),
    ).toThrow('Steps labels must not be empty');
    expect(() => render(<Steps headingLevel={5 as 2}>{null}</Steps>)).toThrow(
      'Steps headingLevel must be 2, 3 or 4',
    );
    expect(() => render(<Step status="current" title="Alone" />)).toThrow(
      'Step must be a child of Steps',
    );
    expect(
      one(
        <>
          <Step status="current" title="A" />
          <Step status="upcoming" title="B" />
        </>,
      ),
    ).toThrow('Steps children must be Steps, not a Fragment');
    vi.restoreAllMocks();
  });
});

describe('Steps CSS', () => {
  const css = cssStepsClasses();

  it('is in the catalog, the stylesheet and the Reduce Transparency fallback', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-steps',
        'sw-steps-item',
        'sw-steps-item-current',
        'sw-steps-item-done',
        'sw-steps-item-error',
        'sw-steps-item-skipped',
        'sw-steps-item-upcoming',
        'sw-steps-marker',
        'sw-steps-title',
        'sw-steps-reason',
        'sw-steps-summary',
        'sw-steps-edit',
        'sw-steps-body',
        'sw-steps-header',
      ]),
    );
    const sheet = generateStylesheet();
    expect(sheet).toContain(css);
    const reduce = sheet.slice(
      sheet.lastIndexOf('@media (prefers-reduced-transparency: reduce)'),
    );
    expect(reduce).toContain('.sw-steps-item');
  });

  it('draws from tokens: the xs control marker, status colors and a connector', () => {
    expect(css).toContain('height: var(--sw-control-xs-min-height);');
    expect(css).toContain('background: var(--sw-color-accent);');
    expect(css).toContain('background: var(--sw-color-success);');
    expect(css).toContain('background: var(--sw-color-danger);');
    expect(css).toContain('.sw-steps-item:not(:last-child)::after');
    expect(css).toMatch(/forced-colors: active[\s\S]*CanvasText/);
    expect(css).not.toMatch(/#[0-9a-f]{3,6}\b/i);
  });
});
