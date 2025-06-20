"use client";

import React, { createContext, useContext, useState } from "react";

interface HoverStateContextType {
  hoveredComponentId: string | null;
  setHoveredComponentId: (id: string | null) => void;
}

const HoverStateContext = createContext<HoverStateContextType>({
  hoveredComponentId: null,
  setHoveredComponentId: () => {}
});

export function HoverStateProvider({ children }: { children: React.ReactNode }) {
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);

  return (
    <HoverStateContext.Provider value={{ hoveredComponentId, setHoveredComponentId }}>
      {children}
    </HoverStateContext.Provider>
  );
}

export function useHoverState() {
  return useContext(HoverStateContext);
}