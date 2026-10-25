import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  useRef,
} from 'react';

import { cx } from '../../class-names.js';
import {
  assertTableRowRule,
  assertTableRowVariant,
  type TableRowRule,
  type TableRowVariant,
} from '../../css/css-table-ledger.js';
import { rowPressAction } from './row-press.js';

export type { TableRowRule, TableRowVariant };

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
  /**
   * `sub` sets the row under the one above it, as an item of a batch: its
   * row header (`TableCell as="th" scope="row"`) is indented with a guide
   * bar at the indent; a sub row without a row header is not indented.
   * `total` is a total mid-table, such as a subtotal the rows above add up
   * to: its cells at weight 600 under a 2 px rule, as a
   * `TableFooter` total is; name it with a row header and keep it in the
   * body. `default` is a row of its own.
   */
  variant?: TableRowVariant;
  /**
   * A voided row kept on the record: the subtle fill and the text muted
   * and struck through, toned cells included. A line-through is not read
   * aloud, so say why in the row, such as a `Badge` "Voided" in the
   * title's line (a Badge in a line of text is not struck; one that is a
   * flex item, a direct child of `Inline`, is). Works with either variant.
   */
  struck?: boolean;
  /**
   * `after` draws a rule under the row, 2 px in the muted grey across
   * every cell, such as the cut under the last playoff place. It is not
   * colour-coded and is not read aloud: say what it means in words beside
   * the table ("The line under 4th place marks the playoff places").
   * Works with any variant.
   */
  rule?: TableRowRule;
  /**
   * Makes the whole row a press target for its one action, such as a
   * search result that is picked: the row's first link or button (a
   * `TableCell onPress`, or a `Box as="a"`), so keep one control in the
   * row. A plain pointer press anywhere else on the row activates that
   * control, unless it is disabled; a press with a modifier key, on another
   * control, or one that ends a text selection is left alone. The row takes
   * the pointer cursor and the quiet fill while hovered, pressed, or while
   * its action has keyboard focus. Keyboard and assistive technology use
   * the action itself: the row is not a control and adds no tab stop.
   * A consumer `onClick` runs once per press, not again for the click the
   * row hands its action. Each click of a double click presses the action,
   * as a native button's would, so keep the action safe to repeat.
   */
  pressable?: boolean;
};

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    {
      className,
      onClick,
      pressable = false,
      rule,
      selected = false,
      struck = false,
      variant = 'default',
      ...rest
    },
    ref,
  ) {
    assertTableRowVariant(variant);
    assertTableRowRule(rule);
    // The click the row hands its action bubbles back to the row; it is
    // the action's, so neither the row nor a consumer onClick takes it.
    const forwarding = useRef(false);
    const press = (event: MouseEvent<HTMLTableRowElement>) => {
      if (forwarding.current) return;
      onClick?.(event);
      if (!pressable) return;
      const action = rowPressAction(event.currentTarget, event);
      if (action === null) return;
      forwarding.current = true;
      try {
        action.click();
      } finally {
        forwarding.current = false;
      }
    };
    return (
      <tr
        ref={ref}
        aria-selected={selected || undefined}
        className={cx(
          selected && 'sw-table-row-selected',
          variant === 'sub' && 'sw-table-row-sub',
          variant === 'total' && 'sw-table-row-total',
          struck && 'sw-table-row-struck',
          rule === 'after' && 'sw-table-row-rule-after',
          pressable && 'sw-table-row-press',
          className,
        )}
        onClick={pressable || onClick ? press : undefined}
        {...rest}
      />
    );
  },
);
