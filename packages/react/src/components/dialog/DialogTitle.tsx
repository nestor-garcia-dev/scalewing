import { type ReactNode } from 'react';

import { cx } from '../../class-names.js';
import { Button } from '../Button.js';
import { Text } from '../Text.js';

type DialogTitleProps = {
  id: string;
  level: 2 | 3;
  title: string;
  /** A muted line under the title, which describes the dialog. */
  description?: string;
  descriptionId?: string;
  /** A consumer glyph or tile before the title, hidden from assistive technology. */
  icon?: ReactNode;
  /** The close button's accessible name; without it there is no button. */
  closeLabel?: string;
  onClose: () => void;
  /** A banded dialog's title is always a row, which draws the band. */
  banded: boolean;
};

/**
 * The dialog's title, which names it through `aria-labelledby`. Alone it is
 * the heading, as it always was. With an icon, a description or a
 * `closeLabel`, or in a banded dialog, it is a row: the icon, the title over
 * its description, and an icon-only ghost close button at the end.
 */
export function DialogTitle({
  banded,
  closeLabel,
  description,
  descriptionId,
  icon,
  id,
  level,
  onClose,
  title,
}: DialogTitleProps) {
  const heading = (
    <Text as={level === 2 ? 'h2' : 'h3'} id={id} variant="title">
      {title}
    </Text>
  );
  if (!banded && !closeLabel && !icon && !description) return heading;

  return (
    <div
      className={cx(
        'sw-dialog-header',
        Boolean(icon || description) && 'sw-dialog-header-framed',
      )}
    >
      {icon ? (
        <span aria-hidden="true" className="sw-dialog-icon">
          {icon}
        </span>
      ) : null}
      {description ? (
        <div className="sw-dialog-titles">
          {heading}
          <Text
            as="p"
            className="sw-dialog-description"
            color="muted"
            id={descriptionId}
            variant="caption"
          >
            {description}
          </Text>
        </div>
      ) : (
        heading
      )}
      {closeLabel ? (
        <Button
          className="sw-dialog-close"
          onPress={onClose}
          size="sm"
          variant="ghost"
        >
          <span className="sw-sr-only">{closeLabel}</span>
          <span aria-hidden="true" className="sw-dialog-close-glyph" />
        </Button>
      ) : null}
    </div>
  );
}
