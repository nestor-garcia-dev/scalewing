import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Step, Steps } from './components/Steps.js';

afterEach(cleanup);

/**
 * The heading's parts assistive technology reads: its child elements that
 * are not `aria-hidden`, as their text. A browser lays a visually hidden
 * box out as a block and puts a space before it in the computed name, so
 * the title and its status word must share one exposed box.
 */
function exposedParts(heading: HTMLElement): string[] {
  return [...heading.children]
    .filter((child) => child.getAttribute('aria-hidden') !== 'true')
    .map((child) => child.textContent ?? '');
}

describe('Steps status words', () => {
  it("reads a folded step's title and status word as one hidden line, the drawn title hidden", () => {
    render(
      <Steps labels={{ done: 'Listo', upcoming: 'Sin empezar' }}>
        <Step
          editLabel="Editar"
          onEdit={() => undefined}
          status="done"
          summary="Un PDF"
          title="Qué vas a agregar"
        />
        <Step status="current" title="El archivo">
          <p>Campos</p>
        </Step>
        <Step status="upcoming" title="Revisar" />
      </Steps>,
    );
    // jsdom lays nothing out, so a name query passed on the old markup too:
    // the exposed parts are what tell one box from two.
    const done = screen.getByRole('heading', {
      name: 'Qué vas a agregar, Listo',
    });
    expect(exposedParts(done)).toEqual(['Qué vas a agregar, Listo']);
    expect(done.querySelector('.sw-sr-only')?.textContent).toBe(
      'Qué vas a agregar, Listo',
    );
    // The drawn title is the same words, hidden from assistive technology.
    const drawn = done.querySelector('[aria-hidden="true"]');
    expect(drawn?.textContent).toBe('Qué vas a agregar');
    // The Edit button still takes the drawn title by its id.
    expect(
      screen.getByRole('button', { name: 'Editar Qué vas a agregar' }),
    ).toBeTruthy();

    const upcoming = screen.getByRole('heading', {
      name: 'Revisar, Sin empezar',
    });
    expect(exposedParts(upcoming)).toEqual(['Revisar, Sin empezar']);

    // A current step has no status word: its title is drawn and read as is.
    const current = screen.getByRole('heading', { name: 'El archivo' });
    expect(current.querySelector('.sw-sr-only')).toBeNull();
    expect(current.querySelector('[aria-hidden]')).toBeNull();
  });

  it("keeps an open list's regions named by the title alone", () => {
    render(
      <Steps labels={{ done: 'Listo' }} open>
        <Step status="done" title="Qué vas a agregar">
          <p>Campos</p>
        </Step>
      </Steps>,
    );
    expect(
      screen.getByRole('region', { name: 'Qué vas a agregar' }),
    ).toBeTruthy();
    expect(
      exposedParts(
        screen.getByRole('heading', { name: 'Qué vas a agregar, Listo' }),
      ),
    ).toEqual(['Qué vas a agregar, Listo']);
  });

  it("leaves a skipped step's reason drawn and read, with no status word", () => {
    render(
      <Steps>
        <Step skippedReason="· not needed" status="skipped" title="Nests" />
      </Steps>,
    );
    const heading = screen.getByRole('heading', {
      name: 'Nests · not needed',
    });
    expect(heading.querySelector('.sw-sr-only')).toBeNull();
    expect(heading.querySelector('[aria-hidden]')).toBeNull();
  });
});
