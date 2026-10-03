import { Button } from '../Button.js';
import { Text } from '../Text.js';

type DialogTitleProps = {
  id: string;
  level: 2 | 3;
  title: string;
  /** The close button's accessible name; without it there is no button. */
  closeLabel?: string;
  onClose: () => void;
};

/**
 * The dialog's title, which names it through `aria-labelledby`. With a
 * `closeLabel` it shares a row with an icon-only ghost close button at its
 * end; without one it is the title alone, as it always was.
 */
export function DialogTitle({
  closeLabel,
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
  if (!closeLabel) return heading;

  return (
    <div className="sw-dialog-header">
      {heading}
      <Button
        className="sw-dialog-close"
        onPress={onClose}
        size="sm"
        variant="ghost"
      >
        <span className="sw-sr-only">{closeLabel}</span>
        <span aria-hidden="true" className="sw-dialog-close-glyph" />
      </Button>
    </div>
  );
}
