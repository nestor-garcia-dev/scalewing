import { createContext, useContext, type ReactNode } from 'react';
import { type PaletteId } from '@scalewing/tokens';

type GalleryPaletteContextValue = {
  palette: PaletteId;
  setPalette: (palette: PaletteId) => void;
};

const GalleryPaletteContext = createContext<GalleryPaletteContextValue | null>(
  null,
);

export function GalleryPaletteProvider({
  palette,
  setPalette,
  children,
}: GalleryPaletteContextValue & { children: ReactNode }) {
  return (
    <GalleryPaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </GalleryPaletteContext.Provider>
  );
}

export function useGalleryPalette(): GalleryPaletteContextValue {
  const value = useContext(GalleryPaletteContext);

  if (!value) {
    throw new Error(
      'useGalleryPalette must be used within GalleryPaletteProvider',
    );
  }

  return value;
}
