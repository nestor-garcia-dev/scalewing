import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Tooltip } from './components/Tooltip.js';

afterEach(() => cleanup());

describe('Tooltip', () => {
  it('associates supplemental content without replacing the trigger name or click', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Tooltip
        content="Read more about the habitat"
        trigger={<button onClick={onClick}>Habitat details</button>}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'Habitat details' });
    const tooltip = screen.getByText('Read more about the habitat');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(tooltip).toHaveProperty('hidden', true);
    await user.hover(trigger);
    expect(tooltip).toHaveProperty('hidden', false);
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledOnce();
    await user.unhover(trigger);
    expect(tooltip).toHaveProperty('hidden', true);
  });

  it('opens on focus, closes on Escape and blur, and keeps trigger focus', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="Supplemental help" trigger={<button>More</button>} />
        <button>Next</button>
      </div>,
    );
    const trigger = screen.getByRole('button', { name: 'More' });
    const tooltip = screen.getByText('Supplemental help');
    await user.tab();
    expect(tooltip).toHaveProperty('hidden', false);
    await user.keyboard('{Escape}');
    expect(tooltip).toHaveProperty('hidden', true);
    expect(document.activeElement).toBe(trigger);
    await user.tab();
    expect(tooltip).toHaveProperty('hidden', true);
    await user.tab({ shift: true });
    expect(tooltip).toHaveProperty('hidden', false);
  });

  it('takes Escape only while the tooltip is visible', async () => {
    const user = userEvent.setup();
    const escapes: boolean[] = [];
    function record(event: KeyboardEvent) {
      if (event.key === 'Escape') escapes.push(event.defaultPrevented);
    }
    document.addEventListener('keydown', record);
    render(
      <Tooltip content="Supplemental help" trigger={<button>More</button>} />,
    );
    const tooltip = screen.getByText('Supplemental help');
    await user.tab();
    expect(tooltip).toHaveProperty('hidden', false);
    await user.keyboard('{Escape}');
    expect(tooltip).toHaveProperty('hidden', true);
    await user.keyboard('{Escape}');
    // The first Escape was used by the tooltip; the second reaches the page.
    expect(escapes).toEqual([true, false]);
    document.removeEventListener('keydown', record);
  });

  it('toggles on touch and dismisses from outside', () => {
    render(
      <div>
        <Tooltip content="Supplemental help" trigger={<button>More</button>} />
        <button>Outside</button>
      </div>,
    );
    const trigger = screen.getByRole('button', { name: 'More' });
    const tooltip = screen.getByText('Supplemental help');
    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    expect(tooltip).toHaveProperty('hidden', false);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }), {
      pointerType: 'touch',
    });
    expect(tooltip).toHaveProperty('hidden', true);
  });

  it('when disabled, neither describes the trigger nor opens, and leaves Escape alone', async () => {
    const user = userEvent.setup();
    const escapes: boolean[] = [];
    function record(event: KeyboardEvent) {
      if (event.key === 'Escape') escapes.push(event.defaultPrevented);
    }
    document.addEventListener('keydown', record);
    render(
      <div>
        <p id="hint">Opens the guide</p>
        <Tooltip
          content="Supplemental help"
          disabled
          trigger={<button aria-describedby="hint">More</button>}
        />
        <Tooltip
          content="Other help"
          disabled
          trigger={<button>Other</button>}
        />
      </div>,
    );
    const trigger = screen.getByRole('button', { name: 'More' });
    expect(trigger.getAttribute('aria-describedby')).toBe('hint');
    expect(
      screen
        .getByRole('button', { name: 'Other' })
        .hasAttribute('aria-describedby'),
    ).toBe(false);
    await user.hover(trigger);
    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    await user.tab();
    expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
    expect(screen.queryByText('Supplemental help')).toBeNull();
    await user.keyboard('{Escape}');
    expect(escapes).toEqual([false]);
    document.removeEventListener('keydown', record);
  });

  it('keeps the same focused trigger while it is disabled and enabled, and shows on it once enabled', async () => {
    const user = userEvent.setup();
    function Toggle({ disabled }: { disabled: boolean }) {
      return (
        <Tooltip
          content="Supplemental help"
          disabled={disabled}
          trigger={<button>More</button>}
        />
      );
    }
    const view = render(<Toggle disabled={false} />);
    const trigger = screen.getByRole('button', { name: 'More' });
    await user.tab();
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.textContent).toBe('Supplemental help');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);

    view.rerender(<Toggle disabled />);
    expect(screen.getByRole('button', { name: 'More' })).toBe(trigger);
    expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
    expect(trigger.hasAttribute('aria-describedby')).toBe(false);

    view.rerender(<Toggle disabled={false} />);
    expect(screen.getByRole('button', { name: 'More' })).toBe(trigger);
    expect(document.activeElement).toBe(trigger);
    // Still focused, so the tooltip is back without another focus.
    const again = screen.getByRole('tooltip');
    expect(again).toHaveProperty('hidden', false);
    expect(trigger.getAttribute('aria-describedby')).toBe(again.id);
  });

  it('stays hidden when enabled after a hover or touch opened and closed it while disabled', async () => {
    const user = userEvent.setup();
    function Toggle({ disabled }: { disabled: boolean }) {
      return (
        <div>
          <Tooltip
            content="Supplemental help"
            disabled={disabled}
            trigger={<button>More</button>}
          />
          <button>Outside</button>
        </div>
      );
    }
    const view = render(<Toggle disabled />);
    const trigger = screen.getByRole('button', { name: 'More' });
    await user.hover(trigger);
    await user.unhover(trigger);
    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }), {
      pointerType: 'touch',
    });
    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();

    view.rerender(<Toggle disabled={false} />);
    expect(screen.getByRole('button', { name: 'More' })).toBe(trigger);
    expect(screen.getByText('Supplemental help')).toHaveProperty(
      'hidden',
      true,
    );
  });

  it('lets Escape on a focused disabled trigger reach the page, and shows on it once enabled', async () => {
    const user = userEvent.setup();
    const escapes: boolean[] = [];
    function record(event: KeyboardEvent) {
      if (event.key === 'Escape') escapes.push(event.defaultPrevented);
    }
    document.addEventListener('keydown', record);
    function Toggle({ disabled }: { disabled: boolean }) {
      return (
        <Tooltip
          content="Supplemental help"
          disabled={disabled}
          trigger={<button>More</button>}
        />
      );
    }
    const view = render(<Toggle disabled />);
    await user.tab();
    await user.keyboard('{Escape}');
    expect(escapes).toEqual([false]);
    view.rerender(<Toggle disabled={false} />);
    expect(screen.getByText('Supplemental help')).toHaveProperty(
      'hidden',
      false,
    );
    document.removeEventListener('keydown', record);
  });

  it('rejects empty help text', () => {
    expect(() =>
      render(<Tooltip content="  " trigger={<button>More</button>} />),
    ).toThrow(RangeError);
  });
});
