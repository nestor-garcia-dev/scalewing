/**
 * What a tooltip is to its trigger. A `description` supplements a trigger
 * that already has a name; a `label` is the trigger's name, for an icon-only
 * control whose tooltip says what it is.
 */
export type TooltipRelationship = 'description' | 'label';

/** The trigger's own references, kept and joined with the tooltip's id. */
export type TooltipTriggerAria = {
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
};

/*
 * A description tooltip adds its id to the trigger's own `aria-describedby`
 * and leaves its `aria-labelledby` exactly as it was. A label tooltip adds
 * its id to the trigger's own `aria-labelledby` instead and leaves its
 * `aria-describedby` as it was, so its text is the trigger's name (it wins
 * over an `aria-label`) and is read once, not as both name and description.
 * A disabled tooltip is not rendered (`tooltipId` undefined), so the trigger
 * never points at a missing element.
 */
export function tooltipTriggerAria(
  own: TooltipTriggerAria,
  tooltipId: string | undefined,
  relationship: TooltipRelationship,
): TooltipTriggerAria {
  if (relationship === 'label')
    return {
      'aria-describedby': own['aria-describedby'],
      'aria-labelledby': joinIdRefs(own['aria-labelledby'], tooltipId),
    };
  return {
    'aria-describedby': joinIdRefs(own['aria-describedby'], tooltipId),
    'aria-labelledby': own['aria-labelledby'],
  };
}

function joinIdRefs(...ids: (string | undefined)[]): string | undefined {
  return ids.filter(Boolean).join(' ') || undefined;
}
