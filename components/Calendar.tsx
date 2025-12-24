import { useState, useEffect, useCallback, DragEvent } from "react";
import { CalendarHeader } from "./CalendarHeader";
import { EventFormModal } from "./EventFormModal";
import { CalendarView, CalendarEvent, DragItem, EVENT_COLORS } from "@/lib/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  addWeeks,
  isSameDay,
  isSameMonth,
  isToday,
  formatDate,
  getMonthDays,
  getWeekDays,
  getHours,
  setTimeOnDate,
} from "@/lib/date";
import { saveEvents, loadEvents, saveView, loadView, saveDate, loadDate } from "@/lib/persistence";

export function Calendar() {
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();
  const [defaultHour, setDefaultHour] = useState<number | undefined>();

  useEffect(() => {
    const savedEvents = loadEvents();
    setEvents(savedEvents);
    
    const savedView = loadView();
    if (savedView) {
      (setView as any)(savedView);
    }
    
    const savedDate = loadDate();
    if (savedDate) {
      setCurrentDate(savedDate);
    }
  }, []);

  useEffect(() => {
    saveView(view);
    saveDate(currentDate);
    saveEvents(events);
  }, [view, currentDate, events]);

  const handleViewChange = useCallback((newView: CalendarView) => {
    setView(newView);
  }, []);

  const handleNavigate = useCallback((direction: "prev" | "next" | "today") => {
    setCurrentDate((prev) => {
      const date = new Date(prev);
      switch (direction) {
        case "prev":
          return view === "month" ? addMonths(date, -1) : addWeeks(date, -1);
        case "next":
          return view === "month" ? addMonths(date, 1) : addWeeks(date, 1);
        case "today":
          return new Date();
      }
    });
  }, [view]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setShowModal(true);
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    setDefaultDate(date);
    setDefaultHour(9);
    setModalMode("create");
    setShowModal(true);
  }, []);

  const handleSaveEvent = useCallback((eventData: Omit<CalendarEvent, "id"> | CalendarEvent) => {
    if ("id" in eventData && events.some(e => e.id === eventData.id)) {
      // Update existing event
      setEvents(prev => prev.map(e => e.id === eventData.id ? eventData as CalendarEvent : e));
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        ...eventData as Omit<CalendarEvent, "id">,
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setShowModal(false);
    setSelectedEvent(null);
  }, [events]);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setShowModal(false);
    setSelectedEvent(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedEvent(null);
  }, []);

  const handleDragStart = useCallback((e: DragEvent, event: CalendarEvent) => {
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("application/json", JSON.stringify({
      type: "event" as const,
      event,
    }));
  }, []);

  const handleDrop = useCallback((e: DragEvent, targetDate: Date) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer!.getData("application/json");
      const dragItem: DragItem = JSON.parse(data);
      if (dragItem.type === "event") {
        const updatedEvent = { ...dragItem.event, start: targetDate, end: new Date(targetDate.getTime() + (dragItem.event.end.getTime() - dragItem.event.start.getTime())) };
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      }
    } catch {}
  }, []);

  const renderMonthView = () => {
    const days = getMonthDays(currentDate);
    const monthStart = startOfMonth(currentDate);
    const rows: Date[][] = [];
    
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }

    return (
      <div style={styles.calendarGrid}>
        {rows.map((week, weekIndex) => (
          <div key={weekIndex} style={styles.weekRow}>
            {week.map((day) => {
              const dayEvents = events.filter(e => 
                isSameDay(e.start, day) || 
                (e.start <= day && e.end >= day)
              );
              return (
                <div
                  key={day.toISOString()}
                  style={{
                    ...styles.dayCell,
                    ...(isSameMonth(day, monthStart) ? styles.currentMonthCell : styles.otherMonthCell),
                    ...(isToday(day) ? styles.todayCell : {}),
                  }}
                  onClick={() => handleDayClick(day)}
                  onDrop={(e) => handleDrop(e, day)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div style={styles.dayHeader}>
                    {formatDate(day, "d")}
                  </div>
                  <div style={styles.eventsContainer}>
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        style={{
                          ...styles.eventPreview,
                          background: `${event.color}20`,
                          borderLeft: `3px solid ${event.color}`,
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div style={styles.moreEvents}>+{dayEvents.length - 3}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    return (
      <div style={styles.calendarGrid}>
        {days.map((day) => {
          const dayEvents = events.filter(e => 
            isSameDay(e.start, day) || 
            (e.start <= day && e.end >= day)
          );
          return (
            <div
              key={day.toISOString()}
              style={{
                ...styles.dayCell,
                width: "14.28%",
                ...(isToday(day) ? styles.todayCell : {}),
              }}
              onClick={() => handleDayClick(day)}
              onDrop={(e) => handleDrop(e, day)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div style={styles.dayHeader}>
                {formatDate(day, "EEE d")}
              </div>
              <div style={styles.eventsContainer}>
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    style={{
                      ...styles.eventPreview,
                      background: `${event.color}20`,
                      borderLeft: `3px solid ${event.color}`,
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div style={styles.moreEvents}>+{dayEvents.length - 2}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const hours = getHours();
    return (
      <div style={styles.dayView}>
        {hours.map(hour => (
          <div key={hour} style={styles.hourRow}>
            <div style={styles.hourLabel}>{hour}:00</div>
            <div style={styles.hourEvents}>
              {events
                .filter(e => {
                  const eventStart = setTimeOnDate(new Date(e.start), e.start.getHours());
                  const eventEnd = setTimeOnDate(new Date(e.end), e.end.getHours());
                  return e.start.getDate() === currentDate.getDate() &&
                         e.start.getMonth() === currentDate.getMonth() &&
                         e.start.getFullYear() === currentDate.getFullYear() &&
                         eventStart <= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour + 1) &&
                         eventEnd >= new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour);
                })
                .map(event => (
                  <div
                    key={event.id}
                    style={{
                      ...styles.eventTimeline,
                      background: event.color,
                      height: `${Math.max(30, (event.end.getTime() - event.start.getTime()) / 3600000 * 50)}px`,
                      top: `${((event.start.getHours() + event.start.getMinutes() / 60) - hour) * 50}px`,
                    }}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.app}>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
      />
      
      <main style={styles.main}>
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </main>

      {showModal && (
        <EventFormModal
          event={selectedEvent}
          defaultDate={defaultDate}
          defaultHour={defaultHour}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  },
  main: {
    padding: "24px",
    height: "calc(100vh - 80px)",
    overflow: "auto",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "1px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    overflow: "hidden",
  },
  weekRow: {
    display: "contents",
  },
  dayCell: {
    minHeight: "120px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "8px",
    padding: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  },
  currentMonthCell: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  otherMonthCell: {
    background: "rgba(255, 255, 255, 0.01)",
    opacity: 0.5,
  },
  todayCell: {
    background: "rgba(99, 102, 241, 0.2)",
    border: "2px solid rgba(99, 102, 241, 0.5)",
  },
  dayHeader: {
    fontSize: "0.875rem",
    fontWeight: 600,
    marginBottom: "8px",
    color: "rgba(255, 255, 255, 0.8)",
  },
  eventsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    height: "80px",
  },
  eventPreview: {
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  moreEvents: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.6)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    textAlign: "center",
  },
  dayView: {
    display: "grid",
    gridTemplateColumns: "60px 1fr",
    gap: "1px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    overflow: "hidden",
    height: "100%",
  },
  hourRow: {
    display: "contents",
    height: "50px",
    position: "relative",
  },
  hourLabel: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "12px",
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.5)",
    height: "50px",
  },
  hourEvents: {
    height: "50px",
    position: "relative",
    background: "rgba(255, 255, 255, 0.02)",
  },
  eventTimeline: {
    position: "absolute",
    left: "8px",
    right: "8px",
    borderRadius: "6px",
    color: "white",
    fontSize: "0.75rem",
    padding: "4px 8px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    cursor: "grab",
    fontWeight: 500,
  },
};