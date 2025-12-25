export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
}