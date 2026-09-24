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

  it('rejects empty help text', () => {
    expect(() =>
      render(<Tooltip content="  " trigger={<button>More</button>} />),
    ).toThrow(RangeError);
  });
});
