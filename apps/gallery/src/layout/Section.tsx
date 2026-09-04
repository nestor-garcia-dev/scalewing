import { Box, Stack, Text } from '@scalewing/react';
import { type ReactNode } from 'react';

export function CodeSample({ children }: { children: string }) {
  return (
    <pre className="gallery-code">
      <code>{children}</code>
    </pre>
  );
}

export function Section({
  children,
  id,
  purpose,
  title,
  usage,
}: {
  children: ReactNode;
  id: string;
  purpose: string;
  title: string;
  usage: string;
}) {
  return (
    <Box as="section" id={id} className="gallery-section">
      <Stack gap={3}>
        <Text variant="heading">{title}</Text>
        <Text color="muted">{purpose}</Text>
        <CodeSample>{usage}</CodeSample>
        {children}
      </Stack>
    </Box>
  );
}
