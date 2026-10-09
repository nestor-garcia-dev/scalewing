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

  it('toggles on a tap on a trigger that does nothing else, and dismisses from outside', () => {
    render(
      <div>
        <Tooltip
          content="Supplemental help"
          trigger={
            <span data-testid="badge" tabIndex={0}>
              View only
            </span>
          }
        />
        <button>Outside</button>
      </div>,
    );
    const trigger = screen.getByTestId('badge');
    const tooltip = screen.getByText('Supplemental help');
    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    expect(tooltip).toHaveProperty('hidden', false);
    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    expect(tooltip).toHaveProperty('hidden', true);
    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }), {
      pointerType: 'touch',
    });
    expect(tooltip).toHaveProperty('hidden', true);
  });

  it('does not open on a tap on a control, which does what it does', () => {
    const onClick = vi.fn();
    render(
      <Tooltip
        content="Supplemental help"
        trigger={
          <button onClick={onClick}>
            <span data-testid="glyph">⌖</span>
          </button>
        }
      />,
    );
    const tooltip = screen.getByText('Supplemental help');
    // A tap on the button, or on its glyph, leaves the help closed.
    fireEvent.pointerDown(screen.getByRole('button'), { pointerType: 'touch' });
    expect(tooltip).toHaveProperty('hidden', true);
    fireEvent.pointerDown(screen.getByTestId('glyph'), {
      pointerType: 'touch',
    });
    expect(tooltip).toHaveProperty('hidden', true);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('opens on a visible focus only, not on the focus a click or a tap gives', () => {
    const matches = HTMLElement.prototype.matches;
    let visible = false;
    HTMLElement.prototype.matches = function (selector: string) {
      if (selector === ':focus-visible') return visible;
      return matches.call(this, selector);
    };
    try {
      render(
        <Tooltip content="Supplemental help" trigger={<button>More</button>} />,
      );
      const trigger = screen.getByRole('button', { name: 'More' });
      const tooltip = screen.getByText('Supplemental help');
      fireEvent.focus(trigger);
      expect(tooltip).toHaveProperty('hidden', true);
      fireEvent.blur(trigger);
      visible = true;
      fireEvent.focus(trigger);
      expect(tooltip).toHaveProperty('hidden', false);
    } finally {
      HTMLElement.prototype.matches = matches;
    }
  });

  it('counts a focus as visible where the browser has no :focus-visible', () => {
    const matches = HTMLElement.prototype.matches;
    HTMLElement.prototype.matches = function (selector: string) {
      if (selector === ':focus-visible') throw new SyntaxError(selector);
      return matches.call(this, selector);
    };
    try {
      render(
        <Tooltip content="Supplemental help" trigger={<button>More</button>} />,
      );
      fireEvent.focus(screen.getByRole('button', { name: 'More' }));
      expect(screen.getByText('Supplemental help')).toHaveProperty(
        'hidden',
        false,
      );
    } finally {
      HTMLElement.prototype.matches = matches;
    }
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
    const enabledThenDisabled = () => {
      view.rerender(<Toggle disabled={false} />);
      expect(screen.getByRole('button', { name: 'More' })).toBe(trigger);
      expect(screen.getByText('Supplemental help')).toHaveProperty(
        'hidden',
        true,
      );
      view.rerender(<Toggle disabled />);
    };

    await user.hover(trigger);
    await user.unhover(trigger);
    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
    enabledThenDisabled();

    fireEvent.pointerDown(trigger, { pointerType: 'touch' });
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }), {
      pointerType: 'touch',
    });
    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
    enabledThenDisabled();
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

  describe('relationship="label"', () => {
    it('names an icon-only trigger once, while the tooltip is hidden', () => {
      render(
        <div>
          <p id="hint">Opens the range map</p>
          <Tooltip
            content="Habitat map"
            relationship="label"
            trigger={<button aria-describedby="hint">⌖</button>}
          />
        </div>,
      );
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveProperty('hidden', true);
      // Named by the hidden tooltip, described only by its own hint, so the
      // name is not read again as a description.
      const trigger = screen.getByRole('button', {
        description: 'Opens the range map',
        name: 'Habitat map',
      });
      expect(trigger.getAttribute('aria-labelledby')).toBe(tooltip.id);
      expect(trigger.getAttribute('aria-describedby')).toBe('hint');
    });

    it('wins over the trigger’s aria-label and keeps its own aria-labelledby', () => {
      render(
        <div>
          <h2 id="reserve">Wetland reserve</h2>
          <Tooltip
            content="Habitat map"
            relationship="label"
            trigger={<button aria-label="Map">⌖</button>}
          />
          <Tooltip
            content="Species list"
            relationship="label"
            trigger={<button aria-labelledby="reserve">≡</button>}
          />
        </div>,
      );
      expect(screen.getByRole('button', { name: 'Habitat map' })).toBeTruthy();
      const list = screen.getByRole('button', {
        name: 'Wetland reserve Species list',
      });
      expect(list.hasAttribute('aria-describedby')).toBe(false);
    });

    it('opens on hover and focus, not on a tap, and hides on Escape, as a description does', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Tooltip
            content="Habitat map"
            relationship="label"
            trigger={<button>⌖</button>}
          />
          <button>Outside</button>
        </div>,
      );
      const trigger = screen.getByRole('button', { name: 'Habitat map' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      await user.hover(trigger);
      expect(tooltip).toHaveProperty('hidden', false);
      await user.unhover(trigger);
      expect(tooltip).toHaveProperty('hidden', true);
      await user.tab();
      expect(tooltip).toHaveProperty('hidden', false);
      await user.keyboard('{Escape}');
      expect(tooltip).toHaveProperty('hidden', true);
      expect(document.activeElement).toBe(trigger);
      // Hidden again, it still names the trigger.
      expect(screen.getByRole('button', { name: 'Habitat map' })).toBe(trigger);
      await user.tab();
      // A tap on the control presses it and leaves the name hidden.
      fireEvent.pointerDown(trigger, { pointerType: 'touch' });
      expect(tooltip).toHaveProperty('hidden', true);
    });

    it('when disabled, leaves no reference to a missing tooltip and the trigger’s own name stands', () => {
      render(
        <div>
          <h2 id="reserve">Wetland reserve</h2>
          <Tooltip
            content="Habitat map"
            disabled
            relationship="label"
            trigger={<button aria-label="Map">⌖</button>}
          />
          <Tooltip
            content="Species list"
            disabled
            relationship="label"
            trigger={<button>Species list</button>}
          />
          <Tooltip
            content="Sightings"
            disabled
            relationship="label"
            trigger={<button aria-labelledby="reserve">≡</button>}
          />
        </div>,
      );
      expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
      const map = screen.getByRole('button', { name: 'Map' });
      const list = screen.getByRole('button', { name: 'Species list' });
      const sightings = screen.getByRole('button', { name: 'Wetland reserve' });
      for (const trigger of [map, list])
        expect(trigger.hasAttribute('aria-labelledby')).toBe(false);
      expect(sightings.getAttribute('aria-labelledby')).toBe('reserve');
      for (const trigger of [map, list, sightings])
        expect(trigger.hasAttribute('aria-describedby')).toBe(false);
    });

    it('keeps the same focused trigger across disabled, named by the tooltip only while enabled', async () => {
      const user = userEvent.setup();
      // A destination that shows its label from a breakpoint up: the label
      // names it there, and the tooltip names the glyph below it.
      function Destination({ wide }: { wide: boolean }) {
        return (
          <Tooltip
            content="Habitat map"
            disabled={wide}
            relationship="label"
            trigger={
              <button>
                <span aria-hidden="true">⌖</span>
                {wide ? 'Habitat map' : null}
              </button>
            }
          />
        );
      }
      const view = render(<Destination wide={false} />);
      const trigger = screen.getByRole('button', { name: 'Habitat map' });
      await user.tab();
      const tooltip = screen.getByRole('tooltip');
      expect(trigger.getAttribute('aria-labelledby')).toBe(tooltip.id);

      view.rerender(<Destination wide />);
      expect(screen.getByRole('button', { name: 'Habitat map' })).toBe(trigger);
      expect(document.activeElement).toBe(trigger);
      expect(trigger.hasAttribute('aria-labelledby')).toBe(false);
      expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();

      view.rerender(<Destination wide={false} />);
      expect(screen.getByRole('button', { name: 'Habitat map' })).toBe(trigger);
      expect(document.activeElement).toBe(trigger);
      const again = screen.getByRole('tooltip');
      expect(trigger.getAttribute('aria-labelledby')).toBe(again.id);
      expect(trigger.hasAttribute('aria-describedby')).toBe(false);
    });
  });

  it('rejects empty help text', () => {
    expect(() =>
      render(<Tooltip content="  " trigger={<button>More</button>} />),
    ).toThrow(RangeError);
  });
});
