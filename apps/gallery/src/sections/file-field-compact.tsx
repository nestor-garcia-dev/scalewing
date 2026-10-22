import { Box, Field, FileField, Grid, Stack } from '@scalewing/react';
import { useEffect, useState } from 'react';

function size(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${Math.ceil(bytes / 1024)} KB`;
}

/**
 * FileField `compact` with Remove: a guide's cover photo in a form row
 * beside its title, at the title field's height. The consumer makes the
 * preview when a photo is chosen and revokes it when it is replaced or
 * removed.
 */
export function CompactCoverExample() {
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(
    null,
  );
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo.preview);
    },
    [photo],
  );
  return (
    <Stack gap={3}>
      <Grid
        columns={3}
        columnsBelow={{ md: 1 }}
        gap={3}
        id="file-field-compact"
      >
        <Box columnSpan={2}>
          <Field label="Guide title">
            <input defaultValue="Heron calls at dawn" name="guide-title" />
          </Field>
        </Box>
        <FileField
          accept="image/jpeg,image/png"
          changeLabel="Choose another"
          chooseLabel="Choose a photo"
          compact
          label="Guide cover"
          onChange={(file) =>
            setPhoto({ file, preview: URL.createObjectURL(file) })
          }
          onRemove={() => setPhoto(null)}
          removeLabel="Remove"
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
      </Grid>
      <Grid
        columns={3}
        columnsBelow={{ md: 1 }}
        gap={3}
        id="file-field-compact-off"
      >
        <Box columnSpan={2}>
          <Field label="Archived guide title">
            <input defaultValue="Owl boxes" disabled name="archived-title" />
          </Field>
        </Box>
        <FileField
          changeLabel="Choose another"
          chooseLabel="Choose a photo"
          compact
          disabled
          label="Archived guide cover"
          onChange={() => undefined}
          onRemove={() => undefined}
          removeLabel="Remove"
          value={{ name: 'owl-box-in-the-oak-by-the-north-gate.jpg' }}
        />
      </Grid>
    </Stack>
  );
}
