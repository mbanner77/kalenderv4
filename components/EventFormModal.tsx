import { useState, useEffect } from "react";
import { CalendarEvent, EVENT_COLORS } from "@/lib/types";
import { formatDate } from "@/lib/date";

interface EventFormModalProps {
  event?: CalendarEvent | null;
  defaultDate?: Date;
  defaultHour?: number;
  onSave: (event: Omit<CalendarEvent, "id"> | CalendarEvent) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function EventFormModal({
  event,
  defaultDate,
  defaultHour,
  onSave,
  onDelete,
  onClose,
}: EventFormModalProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [color, setColor] = useState(event?.color || EVENT_COLORS[0]);
  const [allDay, setAllDay] = useState(event?.allDay || false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    const start = event?.start || (defaultDate ? new Date(defaultDate) : new Date());
    if (defaultHour !== undefined && !event) {
      start.setHours(defaultHour, 0, 0, 0);
    }
    const end = event?.end || new Date(start.getTime() + 60 * 60 * 1000);

    setStartDate(formatDate(start, "yyyy-MM-dd"));
    setStartTime(formatDate(start, "HH:mm"));
    setEndDate(formatDate(end, "yyyy-MM-dd"));
    setEndTime(formatDate(end, "HH:mm"));
  }, [event, defaultDate, defaultHour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const eventData = {
      ...(event?.id ? { id: event.id } : {}),
      title: title.trim(),
      description: description.trim(),
      start,
      end,
      color,
      allDay,
    };

    onSave(eventData as any);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {event ? "Termin bearbeiten" : "Neuer Termin"}
          </h2>
          <button onClick={onClose} style={styles.closeButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Titel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Terminname eingeben..."
              style={styles.input}
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Beschreibung</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optionale Beschreibung..."
              style={{ ...styles.input, ...styles.textarea }}
              rows={3}
            />
          </div>

          <div style={styles.row}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                style={styles.checkbox}
              />
              Ganztägig
            </label>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={styles.input}
              />
            </div>
            {!allDay && (
              <div style={styles.field}>
                <label style={styles.label}>Uhrzeit</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={styles.input}
                />
              </div>
            )}
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Ende</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={styles.input}
              />
            </div>
            {!allDay && (
              <div style={styles.field}>
                <label style={styles.label}>Uhrzeit</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={styles.input}
                />
              </div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Farbe</label>
            <div style={styles.colors}>
              {EVENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    ...styles.colorButton,
                    background: c,
                    ...(color === c ? styles.colorButtonActive : {}),
                  }}
                />
              ))}
            </div>
          </div>

          <div style={styles.actions}>
            {event && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                style={styles.deleteButton}
              >
                Löschen
              </button>
            )}
            <div style={styles.rightActions}>
              <button type="button" onClick={onClose} style={styles.cancelButton}>
                Abbrechen
              </button>
              <button type="submit" style={styles.saveButton}>
                Speichern
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "linear-gradient(135deg, #1e1e3f 0%, #2d2d5a 100%)",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflow: "auto",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#fff",
  },
  closeButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  form: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.7)",
  },
  input: {
    padding: "12px 16px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    resize: "vertical",
    minHeight: "80px",
  },
  row: {
    display: "flex",
    gap: "16px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.875rem",
    color: "#fff",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#6366f1",
  },
  colors: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  colorButton: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "2px solid transparent",
    cursor: "pointer",
    transition: "transform 0.2s, border-color 0.2s",
  },
  colorButtonActive: {
    borderColor: "#fff",
    transform: "scale(1.1)",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
  },
  rightActions: {
    display: "flex",
    gap: "12px",
    marginLeft: "auto",
  },
  deleteButton: {
    padding: "10px 20px",
    background: "rgba(239, 68, 68, 0.2)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
    color: "#ef4444",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  saveButton: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};