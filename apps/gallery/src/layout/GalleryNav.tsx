import { Box } from '@scalewing/react';

import { catalog } from '../catalog.js';

export function GalleryNav() {
  return (
    <Box as="nav" aria-label="Gallery" className="gallery-nav">
      <div className="gallery-nav-list">
        {catalog.map((entry) => (
          <Box as="a" href={`#${entry.id}`} key={entry.id}>
            {entry.label}
          </Box>
        ))}
      </div>
    </Box>
  );
}
