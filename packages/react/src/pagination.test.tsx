import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Pagination, type PaginationLabels } from './index.js';
import { chevronStrokeIn } from './css/chevron.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const labels: PaginationLabels = {
  previous: 'Previous page',
  next: 'Next page',
};

function renderPager(page: number, pageCount = 6) {
  const onPageChange = vi.fn();
  const view = render(
    <Pagination
      aria-label="Sightings pages"
      labels={labels}
      onPageChange={onPageChange}
      page={page}
      pageCount={pageCount}
      rangeLabel={`${(page - 1) * 25 + 1}–${Math.min(page * 25, 130)} of 130 sightings`}
    />,
  );
  return {
    ...view,
    onPageChange,
    previous: screen.getByRole('button', { name: 'Previous page' }),
    next: screen.getByRole('button', { name: 'Next page' }),
  };
}

describe('Pagination', () => {
  it('is a navigation landmark named by the consumer', () => {
    renderPager(2);
    const nav = screen.getByRole('navigation', { name: 'Sightings pages' });
    expect(nav.tagName).toBe('NAV');
    expect(nav.className).toBe('sw-pagination');
  });

  it('can be named by another element instead', () => {
    render(
      <>
        <h2 id="list-title">Sightings</h2>
        <Pagination
          aria-labelledby="list-title"
          labels={labels}
          onPageChange={() => {}}
          page={1}
          pageCount={2}
          rangeLabel="1–25 of 30 sightings"
        />
      </>,
    );
    expect(
      screen.getByRole('navigation', { name: 'Sightings' }),
    ).not.toBeNull();
  });

  it('shows the range in the consumer words, announced politely when it changes', () => {
    renderPager(2);
    const range = screen.getByText('26–50 of 130 sightings');
    expect(range.getAttribute('aria-live')).toBe('polite');
    expect(range.getAttribute('aria-atomic')).toBe('true');
    expect(range.className).toBe('sw-pagination-range');
  });

  it('names each step by its label, its glyph hidden', () => {
    const { previous, next } = renderPager(2);
    for (const step of [previous, next]) {
      expect(step.textContent).toBe('');
      expect(step.querySelector('[aria-hidden="true"]')).not.toBeNull();
      expect(step.className).toContain('sw-pagination-step');
      expect(step.className).toContain('sw-button-neutral');
    }
  });

  it('steps to the page before and after', () => {
    const { previous, next, onPageChange } = renderPager(3);
    fireEvent.click(previous);
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(next);
    expect(onPageChange).toHaveBeenLastCalledWith(4);
  });

  it('marks the step at an end disabled but keeps it a Tab stop, and a press there does nothing', () => {
    const first = renderPager(1);
    expect(first.previous.getAttribute('aria-disabled')).toBe('true');
    expect(first.previous.hasAttribute('disabled')).toBe(false);
    expect(first.previous.tabIndex).toBe(0);
    expect(first.next.hasAttribute('aria-disabled')).toBe(false);
    fireEvent.click(first.previous);
    expect(first.onPageChange).not.toHaveBeenCalled();
    cleanup();

    const last = renderPager(6);
    expect(last.next.getAttribute('aria-disabled')).toBe('true');
    expect(last.next.tabIndex).toBe(0);
    expect(last.previous.hasAttribute('aria-disabled')).toBe(false);
    fireEvent.click(last.next);
    expect(last.onPageChange).not.toHaveBeenCalled();
  });

  it('keeps focus on a step that reaches the end', () => {
    const { next, rerender, onPageChange } = renderPager(5);
    next.focus();
    fireEvent.click(next);
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    rerender(
      <Pagination
        aria-label="Sightings pages"
        labels={labels}
        onPageChange={onPageChange}
        page={6}
        pageCount={6}
        rangeLabel="126–130 of 130 sightings"
      />,
    );
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Next page' }),
    );
  });

  it('greys both steps of a single page', () => {
    const { previous, next } = renderPager(1, 1);
    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(next.getAttribute('aria-disabled')).toBe('true');
  });

  it('keeps a consumer class and ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Pagination
        ref={ref}
        aria-label="Pages"
        className="list-pager"
        labels={labels}
        onPageChange={() => {}}
        page={1}
        pageCount={1}
        rangeLabel="1–3 of 3"
      />,
    );
    expect(ref.current?.tagName).toBe('NAV');
    expect(ref.current?.className).toBe('sw-pagination list-pager');
  });

  it('throws for a page outside the count', () => {
    expect(() => renderPager(7)).toThrow(RangeError);
  });

  it.each(['previous', 'next'] as const)(
    'throws for an empty %s label',
    (key) => {
      expect(() =>
        render(
          <Pagination
            aria-label="Pages"
            labels={{ ...labels, [key]: ' ' }}
            onPageChange={() => {}}
            page={1}
            pageCount={2}
            rangeLabel="1–25 of 30"
          />,
        ),
      ).toThrow(
        new RangeError(`Pagination labels.${key} must be a word or two`),
      );
    },
  );
});

describe('Pagination CSS', () => {
  const css = generateStylesheet();

  it('lists its classes', () => {
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-pagination',
        'sw-pagination-range',
        'sw-pagination-steps',
        'sw-pagination-step',
        'sw-pagination-glyph',
        'sw-pagination-glyph-previous',
        'sw-pagination-glyph-next',
      ]),
    );
  });

  it('puts the range at the start and the steps at the end, wrapping', () => {
    expect(css).toContain(`.sw-pagination {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sw-space-2) var(--sw-space-3);
}`);
    expect(css).toContain(
      '.sw-pagination-steps {\n  display: flex;\n  gap: var(--sw-space-2);\n  margin-inline-start: auto;\n}',
    );
  });

  it('makes each step a square icon button with the touch target on a coarse pointer', () => {
    expect(css).toContain(
      '.sw-button-sm.sw-pagination-step { min-width: var(--sw-control-sm-min-height); }',
    );
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-button.sw-pagination-step {\n    min-height: var(--sw-control-md-min-height);\n    min-width: var(--sw-control-md-min-height);\n  }\n}',
    );
  });

  it('draws the glyph in the button colour, pointing each way and mirrored right to left', () => {
    expect(css).toContain(`.sw-pagination-glyph {
  ${chevronStrokeIn('currentColor')}
  display: block;
}`);
    expect(css).toContain(
      '.sw-pagination-glyph-previous { transform: translateX(25%) rotate(135deg); }',
    );
    expect(css).toContain(
      '.sw-pagination-glyph-next { transform: translateX(-25%) rotate(-45deg); }',
    );
    expect(css).toContain('.sw-pagination-glyph:dir(rtl) { scale: -1 1; }');
  });
});
