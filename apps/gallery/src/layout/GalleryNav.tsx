import { Box, Stack, Text } from '@scalewing/react';
import { useEffect, useState } from 'react';

import { catalog, groupedCatalog, type CatalogEntry } from '../catalog.js';

function isCatalogId(value: string): value is CatalogEntry['id'] {
  return catalog.some((entry) => entry.id === value);
}

export function GalleryNav() {
  const [activeId, setActiveId] = useState<CatalogEntry['id']>(catalog[0].id);
  const groups = groupedCatalog();

  useEffect(() => {
    const sections = catalog
      .map((entry) => document.getElementById(entry.id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          );
        const nextId = visible[0]?.target.id;

        if (nextId && isCatalogId(nextId)) {
          setActiveId(nextId);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box as="nav" aria-label="Gallery" className="gallery-nav">
      <div className="gallery-nav-groups">
        {groups.map((group) => (
          <Stack gap={2} key={group.id}>
            <Text color="muted" variant="caption">
              {group.label}
            </Text>
            <div className="gallery-nav-group">
              {group.entries.map((entry) => (
                <Box
                  aria-current={activeId === entry.id ? 'page' : undefined}
                  as="a"
                  href={`#${entry.id}`}
                  key={entry.id}
                  onClick={() => {
                    setActiveId(entry.id);
                  }}
                >
                  {entry.label}
                </Box>
              ))}
            </div>
          </Stack>
        ))}
      </div>
    </Box>
  );
}
