export type StepTitleWordsProps = {
  /** The id the step's region and its Edit button are named by. */
  titleId: string;
  title: string;
} & (
  | {
      /** The status word read after the title. */
      word: string;
      reason?: never;
    }
  | {
      word: null;
      /** A skipped step's muted reason after its title. */
      reason?: string;
    }
);

/**
 * The words inside a step's heading. Without a status word they are the
 * title (and a skipped step's reason, which never comes with a word) as
 * drawn. With one, the drawn title is hidden from assistive technology and
 * one visually hidden line holds the whole spoken name ("The site, Done"):
 * a hidden box is laid out as a block, so a browser computing the name
 * puts a space before it ("The site , Done") when the title and the word
 * sit in separate boxes.
 *
 * `aria-hidden` goes on the title's own box, never a wrapper: the region
 * and the Edit button name themselves by its id, and Chrome reads a
 * referenced box inside a hidden wrapper into the heading's name too.
 */
export function StepTitleWords(props: StepTitleWordsProps) {
  const { titleId, title } = props;
  if (props.word !== null)
    return (
      <>
        <span aria-hidden="true" id={titleId}>
          {title}
        </span>
        <span className="sw-sr-only">{`${title}, ${props.word}`}</span>
      </>
    );
  const { reason } = props;
  return (
    <>
      <span id={titleId}>{title}</span>
      {reason ? (
        <>
          {' '}
          <span className="sw-steps-reason">{reason}</span>
        </>
      ) : null}
    </>
  );
}
