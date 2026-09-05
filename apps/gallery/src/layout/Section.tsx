import { Box, Button, Stack, Text } from '@scalewing/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

export function CodeSample({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(copiedTimer.current);
    };
  }, []);

  function onCopy() {
    if (!navigator.clipboard) {
      return;
    }

    void navigator.clipboard.writeText(children).then(
      () => {
        setCopied(true);
        window.clearTimeout(copiedTimer.current);
        copiedTimer.current = window.setTimeout(() => {
          setCopied(false);
        }, 1500);
      },
      () => {
        return;
      },
    );
  }

  return (
    <div className="gallery-code-block">
      <div className="gallery-code-toolbar">
        <Button
          aria-label="Copy code"
          onPress={onCopy}
          size="xs"
          variant="secondary"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="gallery-code">
        <code>{children}</code>
      </pre>
    </div>
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
