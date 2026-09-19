import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { utilityClassCatalog } from '@scalewing/tokens';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { App } from './App.js';
import { catalog, catalogGroups } from './catalog.js';
import { themeStorageKey } from './theme-preference.js';
import { paletteStorageKey } from './palette-preference.js';

describe('gallery', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders every catalog section with landmarks and controls', () => {
    render(<App />);

    expect(screen.getAllByRole('banner').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByText('Workspace preview')).toBeTruthy();

    const navigation = screen.getByRole('navigation', { name: 'Gallery' });

    for (const group of catalogGroups) {
      expect(navigation.textContent).toContain(group.label);
    }

    for (const entry of catalog) {
      expect(navigation.querySelector(`a[href="#${entry.id}"]`)).not.toBeNull();
      expect(document.getElementById(entry.id)).not.toBeNull();
      expect(screen.getByRole('heading', { name: entry.label })).toBeTruthy();
    }

    expect(
      screen
        .getByRole('link', { name: 'Skip to catalog' })
        .getAttribute('href'),
    ).toBe('#gallery-main');
    expect(
      screen.getByRole('radiogroup', { name: 'Color scheme' }),
    ).toBeTruthy();
    expect(
      within(
        screen.getByRole('radiogroup', { name: 'Color scheme' }),
      ).getByRole('radio', { name: 'Light' }),
    ).toBeTruthy();
    expect(screen.getByText('Web')).toBeTruthy();
    expect(screen.getByText('React Native')).toBeTruthy();
    expect(
      screen.getAllByText(/@scalewing\/react-native/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Copy code' })).toHaveLength(
      catalog.length + 2,
    );

    const habitat = screen.getByLabelText('Habitat');
    expect(habitat.tagName).toBe('SELECT');
    expect(habitat.closest('label')).not.toBeNull();

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
      expect(['BUTTON', 'SUMMARY']).toContain(button.tagName);
      expect(button.textContent?.trim().length).toBeGreaterThan(0);
    }

    for (const link of screen.getAllByRole('link')) {
      expect(link.tagName).toBe('A');
      expect(link.getAttribute('href')).toMatch(/^#/);
    }

    for (const control of document.querySelectorAll('input, select')) {
      const labeled =
        control.getAttribute('aria-label') !== null ||
        control.closest('label') !== null ||
        (control.id !== '' &&
          Array.from(
            document.querySelectorAll<HTMLLabelElement>('label[for]'),
          ).some((label) => label.htmlFor === control.id));
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
      'sw-badge',
      'sw-segmented',
      'sw-table',
      'sw-tabular',
      'sw-bar-chart',
      'sw-dialog',
      'sw-accordion',
      'sw-select',
      'sw-split',
      'sw-nav',
    ]) {
      expect(classNames.has(name)).toBe(true);
    }

    expect(screen.getByRole('radiogroup', { name: 'Class' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Watch range' })).toBeTruthy();
    expect(screen.getByRole('table', { name: 'Example census' })).toBeTruthy();
    expect(screen.getByRole('table', { name: 'Watch list' })).toBeTruthy();
    expect(
      screen.getByRole('list', { name: 'Trait contributions' }),
    ).toBeTruthy();
    expect(document.querySelector('.sw-app-header')).not.toBeNull();
    expect(
      screen.getByRole('separator', { name: 'Resize Watch list' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('navigation', { name: 'Example workspace' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('navigation', { name: 'Example habitats' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Palette save' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Overlay save' })).toBeTruthy();
  });

  it('persists an explicit theme preference', () => {
    render(<App />);

    fireEvent.click(
      within(
        screen.getByRole('radiogroup', { name: 'Color scheme' }),
      ).getByRole('radio', { name: 'Dark' }),
    );

    expect(window.localStorage.getItem(themeStorageKey)).toBe('dark');
    expect(document.querySelector('[data-theme="dark"]')).not.toBeNull();
  });

  it('applies a named palette from the header control', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Palette'), {
      target: { value: 'cerulean' },
    });

    expect(window.localStorage.getItem(paletteStorageKey)).toBe('cerulean');
    expect(document.querySelector('[data-palette="cerulean"]')).not.toBeNull();
  });
});
