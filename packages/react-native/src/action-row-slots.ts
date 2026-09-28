/** An action row always lays out this many equal slots. */
export const actionRowSlotCount = 4;

/** What one of the row's four slots holds. */
export type ActionRowSlot<Action> =
  | { action: Action; kind: 'action' }
  | { kind: 'more'; rest: readonly Action[] }
  | { index: number; kind: 'empty' };

/**
 * Up to four actions each take a slot, and the slots they leave stay empty
 * so a tile keeps its size and place as actions come and go. Past four,
 * the first three stay and the fourth slot is More, holding the rest.
 */
export function actionRowSlots<Action>(
  actions: readonly Action[],
): ActionRowSlot<Action>[] {
  if (actions.length > actionRowSlotCount) {
    const shown = actions.slice(0, actionRowSlotCount - 1);
    return [
      ...shown.map((action) => ({ action, kind: 'action' as const })),
      { kind: 'more', rest: actions.slice(actionRowSlotCount - 1) },
    ];
  }

  const slots: ActionRowSlot<Action>[] = actions.map((action) => ({
    action,
    kind: 'action',
  }));
  for (let index = actions.length; index < actionRowSlotCount; index += 1) {
    slots.push({ index, kind: 'empty' });
  }
  return slots;
}
