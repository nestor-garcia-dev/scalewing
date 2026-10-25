import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LiveRegion, type LiveRegionProps } from './components/LiveRegion.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** Lets the region settle, after which its first words are swapped in. */
function settle() {
  act(() => {
    vi.advanceTimersByTime(100);
  });
}

describe('LiveRegion', () => {
  it('mounts an empty polite status and fills it once it has settled', () => {
    render(<LiveRegion>Saved</LiveRegion>);
    const region = screen.getByRole('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    // Words put in as the region appears are often not read.
    expect(region.textContent).toBe('');
    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(region.textContent).toBe('');
    settle();
    expect(region.textContent).toBe('Saved');
  });

  it('is an assertive alert when asked', () => {
    render(<LiveRegion politeness="assertive">Could not save</LiveRegion>);
    settle();
    const region = screen.getByRole('alert');
    expect(region.getAttribute('aria-live')).toBe('assertive');
    expect(region.textContent).toBe('Could not save');
  });

  it('swaps a new node in for new words, and for the same words with a new key', () => {
    const view = render(<LiveRegion announceKey={1}>Copied</LiveRegion>);
    settle();
    const region = screen.getByRole('status');
    const first = region.firstElementChild;
    expect(first?.textContent).toBe('Copied');

    // A re-render with nothing new keeps the node, so nothing is re-read.
    view.rerender(<LiveRegion announceKey={1}>Copied</LiveRegion>);
    expect(region.firstElementChild).toBe(first);

    view.rerender(<LiveRegion announceKey={2}>Copied</LiveRegion>);
    const second = region.firstElementChild;
    expect(second).not.toBe(first);
    expect(second?.textContent).toBe('Copied');

    view.rerender(<LiveRegion announceKey={2}>Copied twice</LiveRegion>);
    expect(region.firstElementChild).not.toBe(second);
    expect(region.textContent).toBe('Copied twice');
    // The region itself stays mounted throughout.
    expect(screen.getByRole('status')).toBe(region);
  });

  it('clears to nothing for empty words and fills again after', () => {
    const view = render(<LiveRegion>Saving…</LiveRegion>);
    settle();
    const region = screen.getByRole('status');
    view.rerender(<LiveRegion />);
    expect(region.childNodes).toHaveLength(0);
    view.rerender(<LiveRegion>Saving…</LiveRegion>);
    expect(region.textContent).toBe('Saving…');
  });

  it('keeps words that change before it settles until it has, then shows the latest', () => {
    const view = render(<LiveRegion>One</LiveRegion>);
    view.rerender(<LiveRegion>Two</LiveRegion>);
    expect(screen.getByRole('status').textContent).toBe('');
    settle();
    expect(screen.getByRole('status').textContent).toBe('Two');
  });

  it('draws inline in Text’s look, or hides its words for assistive technology', () => {
    const view = render(
      <LiveRegion color="muted" id="save-line" variant="caption">
        Saved
      </LiveRegion>,
    );
    settle();
    const drawn = screen.getByRole('status');
    expect(drawn.tagName).toBe('SPAN');
    expect(drawn.id).toBe('save-line');
    expect(drawn.className).toBe('sw-text-caption');
    expect(drawn.style.color).toBe('var(--sw-color-muted)');
    expect(drawn.className).not.toContain('sw-sr-only');

    view.rerender(<LiveRegion visuallyHidden>Saved</LiveRegion>);
    const hidden = screen.getByRole('status');
    expect(hidden.tagName).toBe('SPAN');
    expect(hidden.className).toBe('sw-sr-only');
    expect(hidden.getAttribute('style')).toBeNull();
  });

  it('rejects an unknown politeness, and a look on hidden words', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(
        <LiveRegion politeness={'rude' as LiveRegionProps['politeness']}>
          Saved
        </LiveRegion>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <LiveRegion variant="caption" visuallyHidden>
          Saved
        </LiveRegion>,
      ),
    ).toThrow(TypeError);
    expect(() =>
      render(
        <LiveRegion color="muted" visuallyHidden>
          Saved
        </LiveRegion>,
      ),
    ).toThrow(TypeError);
  });

  it('stops its settle timer when unmounted first', () => {
    const view = render(<LiveRegion>Saved</LiveRegion>);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
