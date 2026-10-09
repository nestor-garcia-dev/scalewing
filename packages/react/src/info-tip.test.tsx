import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import { InfoTip } from './components/InfoTip.js';
import { Tooltip } from './components/Tooltip.js';

afterEach(() => cleanup());

const tip = 'Counted at the start of the survey, before any visit';

function renderInfoTip() {
  const view = render(
    <div>
      <p>Expected count</p>
      <InfoTip content={tip} label="About the expected count">
        <svg aria-hidden="true" data-testid="glyph" />
      </InfoTip>
      <button>Outside</button>
    </div>,
  );
  const button = screen.getByRole('button', {
    name: 'About the expected count',
  });
  const tooltip = screen.getByRole('tooltip', { hidden: true });
  const status = screen.getByRole('status');
  return { button, status, tooltip, view };
}

/** A tap: a touch pointer down, then the click the browser sends. */
function tap(element: Element) {
  fireEvent.pointerDown(element, { pointerType: 'touch' });
  fireEvent.click(element);
}

describe('InfoTip', () => {
  it('is a ghost glyph button named by its label and described by its tip', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <InfoTip content={tip} label="About the expected count" ref={ref}>
        <svg aria-hidden="true" data-testid="glyph" />
      </InfoTip>,
    );
    const button = screen.getByRole('button', {
      description: tip,
      name: 'About the expected count',
    });
    expect(ref.current).toBe(button);
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className.split(' ')).toEqual(
      expect.arrayContaining([
        'sw-button',
        'sw-button-ghost',
        'sw-button-md',
        'sw-info-tip',
      ]),
    );
    expect(button.contains(screen.getByTestId('glyph'))).toBe(true);
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).toHaveProperty('hidden', true);
    expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
    // The live region is in the page from the start, and empty.
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('maps size to the Button size', () => {
    render(
      <InfoTip content={tip} label="About the expected count" size="sm">
        i
      </InfoTip>,
    );
    expect(screen.getByRole('button').className).toContain('sw-button-sm');
  });

  it('toggles on a tap, and says the tip once in the live region while a press keeps it open', () => {
    const { button, status, tooltip } = renderInfoTip();
    tap(button);
    expect(tooltip).toHaveProperty('hidden', false);
    expect(status.textContent).toBe(tip);
    tap(screen.getByTestId('glyph'));
    expect(tooltip).toHaveProperty('hidden', true);
    expect(status.textContent).toBe('');
    tap(button);
    expect(tooltip).toHaveProperty('hidden', false);
  });

  it('toggles on a mouse click, and a tip a click opened stays when the pointer leaves', async () => {
    const user = userEvent.setup();
    const { button, status, tooltip } = renderInfoTip();
    await user.hover(button);
    // Hover shows it as Tooltip does, without the live region.
    expect(tooltip).toHaveProperty('hidden', false);
    expect(status.textContent).toBe('');
    await user.click(button);
    expect(tooltip).toHaveProperty('hidden', false);
    expect(status.textContent).toBe(tip);
    await user.unhover(button);
    expect(tooltip).toHaveProperty('hidden', false);
    await user.click(button);
    expect(tooltip).toHaveProperty('hidden', true);
    expect(status.textContent).toBe('');
    await user.unhover(button);
    expect(tooltip).toHaveProperty('hidden', true);
  });

  it('opens on hover and closes when the pointer leaves, without a press', async () => {
    const user = userEvent.setup();
    const { button, tooltip } = renderInfoTip();
    await user.hover(button);
    expect(tooltip).toHaveProperty('hidden', false);
    await user.unhover(button);
    expect(tooltip).toHaveProperty('hidden', true);
  });

  it('toggles on Enter and Space, after a visible focus showed it', async () => {
    const user = userEvent.setup();
    const { button, status, tooltip } = renderInfoTip();
    await user.tab();
    expect(document.activeElement).toBe(button);
    expect(tooltip).toHaveProperty('hidden', false);
    // The focus reads it as the description; the region stays empty.
    expect(status.textContent).toBe('');
    // A press asks for it, so the region says it.
    await user.keyboard('{Enter}');
    expect(tooltip).toHaveProperty('hidden', false);
    expect(status.textContent).toBe(tip);
    await user.keyboard('{Enter}');
    expect(tooltip).toHaveProperty('hidden', true);
    expect(status.textContent).toBe('');
    await user.keyboard(' ');
    expect(tooltip).toHaveProperty('hidden', false);
    expect(status.textContent).toBe(tip);
    await user.keyboard(' ');
    expect(tooltip).toHaveProperty('hidden', true);
    expect(document.activeElement).toBe(button);
  });

  it('closes a pressed tip on Escape, which it takes only while shown', async () => {
    const user = userEvent.setup();
    const escapes: boolean[] = [];
    function record(event: KeyboardEvent) {
      if (event.key === 'Escape') escapes.push(event.defaultPrevented);
    }
    document.addEventListener('keydown', record);
    const { button, status, tooltip } = renderInfoTip();
    button.focus();
    await user.keyboard('{Enter}');
    expect(tooltip).toHaveProperty('hidden', false);
    await user.keyboard('{Escape}');
    expect(tooltip).toHaveProperty('hidden', true);
    expect(status.textContent).toBe('');
    await user.keyboard('{Escape}');
    expect(escapes).toEqual([true, false]);
    expect(document.activeElement).toBe(button);
    // The next press opens it again.
    await user.keyboard('{Enter}');
    expect(tooltip).toHaveProperty('hidden', false);
    document.removeEventListener('keydown', record);
  });

  it('closes a pressed tip on a press outside and on blur', async () => {
    const user = userEvent.setup();
    const { button, tooltip } = renderInfoTip();
    tap(button);
    expect(tooltip).toHaveProperty('hidden', false);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }), {
      pointerType: 'touch',
    });
    expect(tooltip).toHaveProperty('hidden', true);

    await user.click(button);
    await user.unhover(button);
    expect(tooltip).toHaveProperty('hidden', false);
    await user.click(screen.getByText('Expected count'));
    expect(tooltip).toHaveProperty('hidden', true);

    button.focus();
    await user.keyboard('{Enter}');
    expect(tooltip).toHaveProperty('hidden', false);
    await user.tab();
    expect(tooltip).toHaveProperty('hidden', true);
    // The press was undone with the blur: the next press opens it.
    button.focus();
    await user.keyboard('{Enter}');
    expect(tooltip).toHaveProperty('hidden', false);
  });

  it('does not toggle on a press inside the bubble', () => {
    const { button, tooltip } = renderInfoTip();
    tap(button);
    tap(tooltip);
    expect(tooltip).toHaveProperty('hidden', false);
  });

  it('never submits a form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <InfoTip content={tip} label="About the expected count">
          i
        </InfoTip>
      </form>,
    );
    const button = screen.getByRole('button');
    await user.click(button);
    button.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    tap(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects an empty label or tip', () => {
    expect(() =>
      render(
        <InfoTip content={tip} label=" ">
          i
        </InfoTip>,
      ),
    ).toThrow(RangeError);
    expect(() =>
      render(
        <InfoTip content=" " label="About the expected count">
          i
        </InfoTip>,
      ),
    ).toThrow(RangeError);
  });
});

describe('Tooltip on an ordinary Button, beside InfoTip', () => {
  it('still does not open on a tap or a click, and has no live region', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Tooltip
        content={tip}
        trigger={
          <Button aria-label="Expected count" onPress={onPress}>
            i
          </Button>
        }
      />,
    );
    const button = screen.getByRole('button', { name: 'Expected count' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    tap(button);
    expect(onPress).toHaveBeenCalledOnce();
    expect(tooltip).toHaveProperty('hidden', true);
    tap(button);
    expect(tooltip).toHaveProperty('hidden', true);
    // A click shows it only through the hover that comes with it.
    await user.click(button);
    await user.unhover(button);
    expect(tooltip).toHaveProperty('hidden', true);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
