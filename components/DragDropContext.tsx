"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { CalendarEvent } from "@/components/CalendarContext";

interface DragState {
  isDragging: boolean;
  draggedEvent: CalendarEvent | null;
  dragStartY: number;
  dragStartHour: number;
}

interface DragDropContextType {
  dragState: DragState;
  startDrag: (event: CalendarEvent, startY: number, startHour: number) => void;
  endDrag: () => void;
  updateDragPosition: (y: number) => number;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

export function useDragDrop(): DragDropContextType {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within DragDropProvider");
  }
  return context;
}

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedEvent: null,
    dragStartY: 0,
    dragStartHour: 0,
  });

  const startDrag = useCallback(
    (event: CalendarEvent, startY: number, startHour: number) => {
      setDragState({
        isDragging: true,
        draggedEvent: event,
        dragStartY: startY,
        dragStartHour: startHour,
      });
    },
    []
  );

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedEvent: null,
      dragStartY: 0,
      dragStartHour: 0,
    });
  }, []);

  const updateDragPosition = useCallback(
    (y: number): number => {
      const deltaY = y - dragState.dragStartY;
      const hourDelta = Math.round((deltaY / 60) * 2) / 2;
      return dragState.dragStartHour + hourDelta;
    },
    [dragState.dragStartHour, dragState.dragStartY]
  );

  const value: DragDropContextType = {
    dragState,
    startDrag,
    endDrag,
    updateDragPosition,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
}