import { Article, SegmentedControl, Stack, Text } from '@scalewing/react';
import { useState } from 'react';

import heronMarsh from '../assets/heron-marsh.svg';
import { Section } from '../layout/Section.js';

const copy = {
  en: {
    eyebrow: 'Field guide · Wetlands › Herons',
    title: 'How to count herons at the north hide',
    meta: 'Ranger 1 · Oct 16 · 4 min read',
    body: [
      'Herons feed at first light, so reach the hide before dawn and wait for the colony to settle.',
      'Count the nests from left to right, then count again ten minutes later. If the two counts differ, count a third time.',
    ],
  },
  es: {
    eyebrow: 'Guía de campo · Humedales › Garzas',
    title: 'Cómo contar garzas desde el observatorio norte',
    meta: 'Guardabosques 1 · 16 oct · 4 min de lectura',
    body: [
      'Las garzas comen al amanecer: llega al observatorio antes del alba y espera a que la colonia se calme.',
      'Cuenta los nidos de izquierda a derecha y vuelve a contarlos diez minutos después. Si no coinciden, cuenta una tercera vez.',
    ],
  },
} as const;

export function ArticleSection() {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const words = copy[language];
  return (
    <Section
      id="article"
      purpose="Article is a page that reads like a post, on a card at the reading width: an optional cover photo edge to edge across the top (3:1, 2:1 on a phone, with its alt words), an eyebrow with the consumer's actions at its row's end (such as a language switch), the title in heading type (an h1 on its own page; h2 or h3 under other headings), a muted meta line, a hairline and the body. It is an article landmark named by its title. The body is the consumer's own content: paragraphs, Markdown it draws, anything."
      title="Article"
      usage={`<Article
  cover={{ src: cover.url, alt: cover.alt }}
  eyebrow="Field guide · Wetlands › Herons"
  title="How to count herons at the north hide"
  meta="Ranger 1 · Oct 16 · 4 min read"
  actions={<SegmentedControl aria-label="Language" variant="raised" … />}
>
  <Stack gap={4}>{paragraphs}</Stack>
</Article>`}
    >
      <Stack gap={5}>
        <Article
          actions={
            <SegmentedControl
              aria-label="Language"
              items={[
                { id: 'en', label: <span lang="en">English</span> },
                { id: 'es', label: <span lang="es">Español</span> },
              ]}
              onChange={(next) => setLanguage(next === 'es' ? 'es' : 'en')}
              value={language}
              variant="raised"
            />
          }
          cover={{
            src: heronMarsh,
            alt: 'A grey heron standing in shallow water in front of reeds',
          }}
          eyebrow={words.eyebrow}
          lang={language}
          meta={words.meta}
          title={words.title}
          titleAs="h3"
          variant="outlined"
        >
          <Stack gap={4}>
            {words.body.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
          </Stack>
        </Article>
        <Article
          eyebrow="Bulletin"
          title="The east trail is closed for nesting season"
          titleAs="h3"
        >
          <Text>
            Plovers are nesting on the east trail until the end of the month.
            Use the boardwalk instead.
          </Text>
        </Article>
      </Stack>
    </Section>
  );
}
