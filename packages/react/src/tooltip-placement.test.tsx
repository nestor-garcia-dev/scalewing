import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Tooltip } from './components/Tooltip.js';
import { generateStylesheet } from './css/stylesheet.js';

const original = {
  showPopover: HTMLElement.prototype.showPopover,
  hidePopover: HTMLElement.prototype.hidePopover,
  matches: HTMLElement.prototype.matches,
  rect: HTMLElement.prototype.getBoundingClientRect,
  offsetWidth: Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth',
  ),
  offsetHeight: Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  ),
  innerWidth: window.innerWidth,
};

afterEach(() => {
  cleanup();
  HTMLElement.prototype.showPopover = original.showPopover;
  HTMLElement.prototype.hidePopover = original.hidePopover;
  HTMLElement.prototype.matches = original.matches;
  HTMLElement.prototype.getBoundingClientRect = original.rect;
  if (original.offsetWidth)
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetWidth',
      original.offsetWidth,
    );
  if (original.offsetHeight)
    Object.defineProperty(
      HTMLElement.prototype,
      'offsetHeight',
      original.offsetHeight,
    );
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: original.innerWidth,
  });
});

/** A 390 px screen, a trigger near its right edge and a 200 px bubble. */
function layOut() {
  // The focus each test gives is a keyboard's.
  HTMLElement.prototype.matches = function (selector: string) {
    if (selector === ':focus-visible') return true;
    return original.matches.call(this, selector);
  };
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 390,
  });
  HTMLElement.prototype.getBoundingClientRect = function () {
    return this.classList.contains('sw-tooltip-anchor')
      ? DOMRect.fromRect({ x: 340, y: 100, width: 40, height: 32 })
      : DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 });
  };
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return this.classList.contains('sw-tooltip') ? 200 : 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return this.classList.contains('sw-tooltip') ? 40 : 0;
    },
  });
}

describe('Tooltip placement', () => {
  it('keeps the bubble inside the screen, under its trigger', () => {
    layOut();
    render(<Tooltip content="Services reports" trigger={<button>▤</button>} />);
    fireEvent.focus(screen.getByRole('button'));
    const tooltip = screen.getByRole('tooltip');
    // Lined up with the trigger's start it would end at 540 px; lined up
    // with its end it fits: 380 − 200.
    expect(tooltip.style.left).toBe('180px');
    // A space-1 gap under the 32 px trigger at 100 px.
    expect(tooltip.style.top).toBe('136px');
  });

  it('shows the bubble on the top layer only while it is shown', () => {
    layOut();
    const open = new Set<Element>();
    HTMLElement.prototype.showPopover = vi.fn(function (this: HTMLElement) {
      open.add(this);
    });
    HTMLElement.prototype.hidePopover = vi.fn(function (this: HTMLElement) {
      open.delete(this);
    });
    HTMLElement.prototype.matches = function (selector: string) {
      if (selector === ':popover-open') return open.has(this);
      if (selector === ':focus-visible') return true;
      return original.matches.call(this, selector);
    };
    render(
      <Tooltip
        content="Services reports"
        relationship="label"
        trigger={<button>▤</button>}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Services reports' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.hasAttribute('popover')).toBe(false);
    fireEvent.focus(trigger);
    expect(tooltip.getAttribute('popover')).toBe('manual');
    expect(open.has(tooltip)).toBe(true);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(open.has(tooltip)).toBe(false);
    // Hidden, it is no popover, and it still names its trigger.
    expect(tooltip.hasAttribute('popover')).toBe(false);
    expect(trigger.getAttribute('aria-labelledby')).toBe(tooltip.id);
  });

  it('generates a fixed bubble capped inside the viewport', () => {
    const css = generateStylesheet();
    const rule = css.slice(css.indexOf('.sw-tooltip {'));
    const body = rule.slice(0, rule.indexOf('}'));
    expect(body).toContain('position: fixed;');
    expect(body).toContain('inset: auto;');
    expect(body).toContain(
      'max-width: min(18rem, calc(100% - 2 * var(--sw-space-2)));',
    );
    expect(body).not.toContain('100vw');
  });
});
