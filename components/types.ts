export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO-String
  end: string; // ISO-String
  allDay?: boolean;
  color?: string;
}

export type ViewType = "month" | "week" | "day";

export interface CalendarContextType {
  events: CalendarEvent[];
  currentDate: Date;
  currentView: ViewType;
  selectedEvent: CalendarEvent | null;
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  selectedSlotDate: Date | null;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, newStart: string, newEnd: string) => void;
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: ViewType) => void;
  openModal: (mode: "create" | "edit", event?: CalendarEvent, slotDate?: Date) => void;
  closeModal: () => void;
  navigateDate: (direction: "prev" | "next" | "today") => void;
}