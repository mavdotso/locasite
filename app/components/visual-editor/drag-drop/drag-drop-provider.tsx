"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { DragItem } from "../core/types";

interface DragDropContextValue {
  isDragging: boolean;
  draggedItem: DragItem | null;
  dropTargetId: string | null;
  draggedElement: HTMLElement | null;
  startDrag: (item: DragItem, element?: HTMLElement) => void;
  endDrag: () => void;
  setDropTarget: (id: string | null) => void;
}

const DragDropContext = createContext<DragDropContextValue | undefined>(
  undefined,
);

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
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
    null,
  );

  const startDrag = useCallback((item: DragItem, element?: HTMLElement) => {
    setDraggedItem(item);
    setIsDragging(true);
    if (element) {
      setDraggedElement(element);
      // Add dragging class for visual feedback
      element.classList.add("opacity-50");
    }
  }, []);

  const endDrag = useCallback(() => {
    if (draggedElement) {
      draggedElement.classList.remove("opacity-50");
      setDraggedElement(null);
    }
    setDraggedItem(null);
    setIsDragging(false);
    setDropTargetId(null);
  }, [draggedElement]);

  const setDropTarget = useCallback((id: string | null) => {
    setDropTargetId(id);
  }, []);

  // Add global drag end listener to handle edge cases
  useEffect(() => {
    const handleDragEnd = () => {
      if (isDragging) {
        endDrag();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDragging) {
        endDrag();
      }
    };

    document.addEventListener("dragend", handleDragEnd);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDragging, endDrag]);

  return (
    <DragDropContext.Provider
      value={{
        isDragging,
        draggedItem,
        dropTargetId,
        draggedElement,
        startDrag,
        endDrag,
        setDropTarget,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}
