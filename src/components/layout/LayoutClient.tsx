"use client";

import { useState, useCallback } from "react";
import { Navbar } from "./Navbar";
import { CommandPalette } from "./CommandPalette";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  return (
    <>
      <Navbar onOpenSearch={openPalette} />
      <CommandPalette isOpen={paletteOpen} onClose={closePalette} />
      {children}
    </>
  );
}
