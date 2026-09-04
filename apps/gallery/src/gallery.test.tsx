import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { utilityClassCatalog } from '@scalewing/tokens';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { App } from './App.js';
import { catalog } from './catalog.js';
import { themeStorageKey } from './theme-preference.js';

describe('gallery', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders every catalog section with landmarks and controls', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByText('Workspace preview')).toBeTruthy();

    const navigation = screen.getByRole('navigation', { name: 'Gallery' });

    for (const entry of catalog) {
      expect(navigation.querySelector(`a[href="#${entry.id}"]`)).not.toBeNull();
      expect(document.getElementById(entry.id)).not.toBeNull();
      expect(screen.getByRole('heading', { name: entry.label })).toBeTruthy();
    }

    expect(screen.getByRole('button', { name: 'Light theme' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dark theme' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'System theme' })).toBeTruthy();

    const scoring = screen.getByLabelText('Scoring');
    expect(scoring.tagName).toBe('SELECT');
    expect(scoring.closest('label')).not.toBeNull();

    const disabledField = screen.getByLabelText('Disabled control');
    expect(disabledField).toHaveProperty('disabled', true);

    const layoutLink = screen.getByRole('link', {
      name: 'Layout link to Button',
    });
    expect(layoutLink.tagName).toBe('A');
    expect(layoutLink.getAttribute('href')).toBe('#button');

    const enabled = screen.getByRole('button', {
      name: 'primary md enabled',
    });
    expect(enabled).toHaveProperty('disabled', false);
    expect(enabled.tagName).toBe('BUTTON');

    const disabled = screen.getByRole('button', {
      name: 'primary md disabled',
    });
    expect(disabled).toHaveProperty('disabled', true);

    const submit = screen.getByRole('button', { name: 'submit md enabled' });
    expect(submit).toHaveProperty('type', 'submit');

    const reset = screen.getByRole('button', { name: 'reset md enabled' });
    expect(reset).toHaveProperty('type', 'reset');

    for (const button of screen.getAllByRole('button')) {
      expect(button.tagName).toBe('BUTTON');
      expect(button.textContent?.trim().length).toBeGreaterThan(0);
    }

    for (const link of screen.getAllByRole('link')) {
      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toMatch(/^#/);
    }

    for (const control of document.querySelectorAll('input, select')) {
      const labeled =
        control.getAttribute('aria-label') !== null ||
        control.closest('label') !== null;
      expect(labeled).toBe(true);
    }

    const classNames = new Set(utilityClassCatalog());
    for (const name of [
      'sw-container',
      'sw-full-width',
      'sw-grow',
      'sw-wrap',
      'sw-padding-4',
      'sw-gap-3',
    ]) {
      expect(classNames.has(name)).toBe(true);
    }
  });

  it('persists an explicit theme preference', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Dark theme' }));

    expect(window.localStorage.getItem(themeStorageKey)).toBe('dark');
    expect(document.querySelector('[data-theme="dark"]')).not.toBeNull();
  });
});
