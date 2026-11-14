import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  RadioGroup,
  radioGroupDescriptionLayouts,
} from './components/RadioGroup.js';
import { cssRadioGroupClasses } from './css/css-radio-group.js';

afterEach(() => cleanup());

const options = [
  {
    value: 'keeper',
    label: 'Keeper',
    description: 'Feeds the herd and logs each count',
  },
  { value: 'visitor', label: 'Visitor', description: 'Sees the logs' },
];

describe('RadioGroup descriptionLayout', () => {
  it('stacks every description under its label with "stacked", keeping names and descriptions', () => {
    render(
      <RadioGroup
        descriptionLayout="stacked"
        legend="Role"
        onChange={() => undefined}
        options={options}
        value="keeper"
      />,
    );
    const keeper = screen.getByRole('radio', {
      name: 'Keeper',
      description: 'Feeds the herd and logs each count',
    });
    expect(keeper.closest('fieldset')?.className).toBe(
      'sw-radio-group sw-radio-group-stacked',
    );
  });

  it('keeps auto the default and fails closed on an unknown layout', () => {
    render(
      <RadioGroup
        legend="Role"
        onChange={() => undefined}
        options={options}
        value=""
      />,
    );
    expect(screen.getByRole('group', { name: 'Role' }).className).toBe(
      'sw-radio-group',
    );
    expect(radioGroupDescriptionLayouts).toEqual(['auto', 'stacked']);
    expect(() =>
      render(
        <RadioGroup
          // @ts-expect-error a layout RadioGroup does not have
          descriptionLayout="beside"
          legend="Role"
          onChange={() => undefined}
          options={options}
          value=""
        />,
      ),
    ).toThrow(RangeError);
  });

  it('puts a stacked description on its own line at every width', () => {
    const css = cssRadioGroupClasses();
    expect(css).toContain(
      '.sw-radio-group-stacked .sw-radio-group-option-description { flex-basis: 100%; }',
    );
    // Outside any media query: the rule follows the closing of the below-md block.
    const stacked = css.indexOf('.sw-radio-group-stacked');
    expect(css.lastIndexOf('@media', stacked)).toBeLessThan(
      css.lastIndexOf('}\n', stacked),
    );
  });
});
