import { describe, expect, it } from 'vitest';

import { tooltipTriggerAria } from './components/tooltip-trigger-aria.js';

describe('tooltipTriggerAria', () => {
  it('describes the trigger by default, after its own description', () => {
    expect(tooltipTriggerAria({}, 'tip', 'description')).toEqual({
      'aria-describedby': 'tip',
      'aria-labelledby': undefined,
    });
    expect(
      tooltipTriggerAria(
        { 'aria-describedby': 'hint', 'aria-labelledby': 'heading' },
        'tip',
        'description',
      ),
    ).toEqual({ 'aria-describedby': 'hint tip', 'aria-labelledby': 'heading' });
  });

  it('labels the trigger instead of describing it, after its own label', () => {
    expect(tooltipTriggerAria({}, 'tip', 'label')).toEqual({
      'aria-describedby': undefined,
      'aria-labelledby': 'tip',
    });
    expect(
      tooltipTriggerAria(
        { 'aria-describedby': 'hint', 'aria-labelledby': 'heading' },
        'tip',
        'label',
      ),
    ).toEqual({ 'aria-describedby': 'hint', 'aria-labelledby': 'heading tip' });
  });

  it('keeps only the trigger’s own references when there is no tooltip', () => {
    for (const relationship of ['description', 'label'] as const) {
      expect(tooltipTriggerAria({}, undefined, relationship)).toEqual({
        'aria-describedby': undefined,
        'aria-labelledby': undefined,
      });
      expect(
        tooltipTriggerAria(
          { 'aria-describedby': 'hint', 'aria-labelledby': 'heading' },
          undefined,
          relationship,
        ),
      ).toEqual({ 'aria-describedby': 'hint', 'aria-labelledby': 'heading' });
    }
  });
});
