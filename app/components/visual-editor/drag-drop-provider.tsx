"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { DragItem } from "./types";

interface DragDropContextValue {
  isDragging: boolean;
  draggedItem: DragItem | null;
  dropTargetId: string | null;
  startDrag: (item: DragItem) => void;
  endDrag: () => void;
  setDropTarget: (id: string | null) => void;
}

const DragDropContext = createContext<DragDropContextValue | undefined>(undefined);

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within DragDropProvider");
  }
  return context;
}

interface DragDropProviderProps {
  children: ReactNode;
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const startDrag = useCallback((item: DragItem) => {
    setDraggedItem(item);
    setIsDragging(true);
  }, []);

  const endDrag = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
    setDropTargetId(null);
  }, []);

  const setDropTarget = useCallback((id: string | null) => {
    setDropTargetId(id);
  }, []);

  return (
    <DragDropContext.Provider 
      value={{
        isDragging,
        draggedItem,
        dropTargetId,
        startDrag,
        endDrag,
        setDropTarget
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}