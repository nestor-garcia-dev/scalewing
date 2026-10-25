import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderShell } from './app-shell.test-support.js';
import { cssAppShellClasses } from './css/css-app-shell.js';
import { cssSiteHeaderSkipLinkRules } from './css/css-site-header-skip-link.js';
import { skipLinkRules } from './css/skip-link.js';
import { stackingOrder } from './css/stacking.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

const skipLink = { label: 'Skip to main content' };

describe('AppShell skipLink', () => {
  it('puts the link first, before every other focusable element', () => {
    const { container } = renderShell({ skipLink });
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    expect(container.querySelector('.sw-app-shell')!.firstElementChild).toBe(
      link,
    );
    expect(container.querySelector('a, button, [tabindex]')).toBe(link);
    expect(link.className).toBe('sw-app-shell-skip-link');
    expect(link.getAttribute('tabindex')).toBe('0');
  });

  it('targets the shell’s own main, which it makes a focus target', () => {
    renderShell({ skipLink });
    const main = screen.getByRole('main');
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    expect(main.id).toBeTruthy();
    expect(link.getAttribute('href')).toBe(`#${main.id}`);
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('moves focus to main on a press without changing the address', () => {
    renderShell({ skipLink });
    const link = screen.getByRole('link', { name: 'Skip to main content' });
    link.focus();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    fireEvent(link, event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(window.location.hash).toBe('');
  });

  it('takes the consumer’s words, such as another language’s', () => {
    renderShell({ skipLink: { label: 'Saltar al contenido principal' } });
    expect(
      screen.getByRole('link', { name: 'Saltar al contenido principal' }),
    ).toBeTruthy();
  });

  it('draws no link and leaves main unnamed and out of focus without the prop', () => {
    const { container } = renderShell();
    expect(container.querySelector('.sw-app-shell-skip-link')).toBeNull();
    const main = screen.getByRole('main');
    expect(main.hasAttribute('id')).toBe(false);
    expect(main.hasAttribute('tabindex')).toBe(false);
  });

  it('rejects blank words', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderShell({ skipLink: { label: ' ' } })).toThrow(
      'AppShell skipLink needs a nonempty label',
    );
  });
});

describe('AppShell skip link CSS', () => {
  const css = cssAppShellClasses();

  it('draws the shared skip link look, hidden until focused', () => {
    expect(css).toContain(skipLinkRules('.sw-app-shell-skip-link'));
    expect(css).toContain(
      '.sw-app-shell-skip-link:not(:focus) { position: absolute; width: 1px;',
    );
  });

  it('fixes it at the window’s top start over the top chrome, under popups', () => {
    expect(css).toContain(`.sw-app-shell-skip-link {
  inset-block-start: var(--sw-space-2);
  inset-inline-start: var(--sw-space-2);
  position: fixed;
  z-index: ${stackingOrder.skipLink};
}`);
    expect(stackingOrder.skipLink).toBeGreaterThan(stackingOrder.topChrome);
    expect(stackingOrder.skipLink).toBeLessThan(stackingOrder.popup);
  });

  it('gives main no ring once it holds focus', () => {
    expect(css).toContain('.sw-app-shell-main:focus { outline: none; }');
  });

  it('shares the look with SiteHeader’s skip link', () => {
    expect(cssSiteHeaderSkipLinkRules()).toContain(
      skipLinkRules('.sw-site-header-skip-link'),
    );
  });
});
