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
 * A description tooltip adds its id to the trigger's own `aria-describedby`.
 * A label tooltip adds it to the trigger's own `aria-labelledby` instead, so
 * its text is the trigger's name (it wins over an `aria-label`) and is read
 * once, not as both name and description. A disabled tooltip is not rendered
 * (`tooltipId` undefined), so the trigger keeps only its own references and
 * never points at a missing element.
 */
export function tooltipTriggerAria(
  own: TooltipTriggerAria,
  tooltipId: string | undefined,
  relationship: TooltipRelationship,
): TooltipTriggerAria {
  const labelId = relationship === 'label' ? tooltipId : undefined;
  const descriptionId = relationship === 'description' ? tooltipId : undefined;
  return {
    'aria-describedby': joinIdRefs(own['aria-describedby'], descriptionId),
    'aria-labelledby': joinIdRefs(own['aria-labelledby'], labelId),
  };
}

function joinIdRefs(...ids: (string | undefined)[]): string | undefined {
  return ids.filter(Boolean).join(' ') || undefined;
}
