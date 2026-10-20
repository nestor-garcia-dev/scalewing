import { FileField, type FileFieldValue, Stack, Text } from '@scalewing/react';
import { useEffect, useState } from 'react';

import { Glyph } from '../glyph.js';
import { Section } from '../layout/Section.js';

const page = 'M4 2h5l3 3v9H4zM9 2v3h3';
const limit = 2 * 1024 * 1024;

/** The consumer's own check of a chosen or dropped file, as a form does it. */
function check(file: File): string | undefined {
  if (!/\.pdf$/i.test(file.name))
    return `${file.name} isn’t a PDF. Choose a PDF field guide.`;
  if (file.size > limit)
    return `${file.name} is over 2 MB. Choose a smaller field guide.`;
  return undefined;
}

function size(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${Math.ceil(bytes / 1024)} KB`;
}

/** The line under a chosen guide's name. */
function describe(file: File): string {
  return `${size(file.size)} · ready`;
}

/**
 * A cover photo shown as a thumbnail: the consumer makes an object URL when
 * a photo is chosen and revokes it when another is chosen or the field goes.
 */
function CoverPhotoField() {
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(
    null,
  );
  // Made in the handler, not during render; revoked when replaced or gone.
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo.preview);
    },
    [photo],
  );
  return (
    <FileField
      accept="image/jpeg,image/png"
      changeLabel="Choose another"
      chooseLabel="Choose a photo"
      description="Optional. A JPEG or PNG of the habitat"
      label="Cover photo"
      onChange={(file) =>
        setPhoto({ file, preview: URL.createObjectURL(file) })
      }
      value={
        photo
          ? {
              name: photo.file.name,
              detail: size(photo.file.size),
              preview: photo.preview,
            }
          : null
      }
    />
  );
}

export function FileFieldSection() {
  const [guide, setGuide] = useState<FileFieldValue | null>(null);
  const [error, setError] = useState<string | undefined>();
  return (
    <Section
      id="file-field"
      purpose="FileField is one file, chosen with the system picker or dropped on the field. Empty, it is a wide zone that opens the picker (dropLabel adds words for a pointer that can drag); chosen, it shows the file's name and a detail line the consumer writes, with a button to choose another. It has Field's label, description and error. It hands the File to onChange and shows what the consumer passes back as value: it never reads or uploads the file, and a dropped file is not filtered by accept, so the consumer checks it and says why in error. A value's preview, an image address the consumer makes from a chosen photo, draws a thumbnail before its name in place of the icon."
      title="FileField"
      usage={`<FileField
  label="Field guide"
  description="A PDF up to 2 MB"
  accept=".pdf,application/pdf"
  chooseLabel="Choose a PDF"
  dropLabel="or drop it here"
  changeLabel="Choose another"
  icon={<Glyph path={page} size={20} />}
  value={guide}
  error={error}
  onChange={(file) => {
    const problem = check(file);
    setError(problem);
    setGuide(problem ? null : { name: file.name, detail: describe(file) });
  }}
/>`}
    >
      <Stack gap={5}>
        <FileField
          accept=".pdf,application/pdf"
          changeLabel="Choose another"
          chooseLabel="Choose a PDF"
          description="A PDF up to 2 MB"
          dropLabel="or drop it here"
          error={error}
          icon={<Glyph path={page} size={20} />}
          label="Field guide"
          onChange={(file) => {
            const problem = check(file);
            setError(problem);
            setGuide(
              problem ? null : { name: file.name, detail: describe(file) },
            );
          }}
          value={guide}
        />
        <FileField
          changeLabel="Choose another"
          chooseLabel="Choose a PDF"
          icon={<Glyph path={page} size={20} />}
          label="Heron survey map"
          onChange={() => undefined}
          value={{
            name: 'wetland-survey-map-north-marsh-2026.pdf',
            detail: '4 pages · 1.6 MB · opens fine',
          }}
        />
        <FileField
          changeLabel="Choose another"
          chooseLabel="Choose a photo"
          error="nest.heic isn’t a JPEG or PNG. Choose a JPEG or PNG photo."
          label="Nest photo"
          onChange={() => undefined}
        />
        <FileField
          changeLabel="Choose another"
          chooseLabel="Choose a cover photo for the field guide"
          label="Nest cover photo"
          labelVisuallyHidden
          onChange={() => undefined}
        />
        <CoverPhotoField />
        <FileField
          changeLabel="Choose another"
          chooseLabel="Choose a PDF"
          description="Opens when the herons arrive"
          disabled
          label="Migration report"
          onChange={() => undefined}
        />
        <Text color="muted" variant="caption">
          Field guide checks what it is given: a file that is not a PDF or is
          over 2 MB shows why. Heron survey map has a file chosen, Nest photo an
          error, Migration report is disabled.
        </Text>
      </Stack>
    </Section>
  );
}
