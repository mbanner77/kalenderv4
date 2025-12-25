"use client";

import { useState, useEffect, FormEvent } from "react";
import { useCalendar } from "@/components/CalendarContext";

const EVENT_COLORS = [
  { name: "Blau", value: "#3b82f6" },
  { name: "Grün", value: "#10b981" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Rot", value: "#ef4444" },
  { name: "Lila", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Cyan", value: "#06b6d4" },
];

function formatDateForInput(date: Date): string {
  return date.toISOString().slice(0, 16);
}

export function EventModal() {
  const {
    isModalOpen,
    modalMode,
    selectedEvent,
    defaultEventStart,
    addEvent,
    updateEvent,
    deleteEvent,
    closeModal,
  } = useCalendar();

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isModalOpen) return;

    if (modalMode === "edit" && selectedEvent) {
      setTitle(selectedEvent.title);
      setStart(formatDateForInput(selectedEvent.start));
      setEnd(formatDateForInput(selectedEvent.end));
      setAllDay(selectedEvent.allDay);
      setDescription(selectedEvent.description);
      setColor(selectedEvent.color);
      setLocation(selectedEvent.location);
    } else {
      const baseStart = defaultEventStart || new Date();
      const baseEnd = new Date(baseStart.getTime() + 60 * 60 * 1000);

      setTitle("");
      setStart(formatDateForInput(baseStart));
      setEnd(formatDateForInput(baseEnd));
      setAllDay(false);
      setDescription("");
      setColor("#3b82f6");
      setLocation("");
    }

    setError("");
  }, [isModalOpen, modalMode, selectedEvent, defaultEventStart]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Titel ist erforderlich");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
      setError("Ungültiges Startdatum");
      return;
    }

    if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
      setError("Ungültiges Enddatum");
      return;
    }

    if (startDate >= endDate) {
      setError("Endzeit muss nach Startzeit liegen");
      return;
    }

    const eventData = {
      title: title.trim(),
      start: startDate,
      end: endDate,
      allDay,
      description: description.trim(),
      color,
      location: location.trim(),
    };

    if (modalMode === "edit" && selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    closeModal();
  };

  const handleDelete = () => {
    if (selectedEvent && window.confirm("Event wirklich löschen?")) {
      deleteEvent(selectedEvent.id);
      closeModal();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-height-[90vh] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-xl font-bold text-white mb-4">
            {modalMode === "edit" ? "Event bearbeiten" : "Neues Event"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Titel *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event-Titel"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Start
                </label>
                <input
                  id="start"
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="end"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Ende
                </label>
                <input
                  id="end"
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="allDay"
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="allDay" className="text-sm text-slate-300">
                Ganztägig
              </label>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Ort
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ort eingeben"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Beschreibung
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Beschreibung hinzufügen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Farbe
              </label>
              <div className="flex gap-2 flex-wrap">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      color === c.value
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                    aria-label={`Farbe ${c.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {modalMode === "edit" && selectedEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Löschen
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {modalMode === "edit" ? "Speichern" : "Erstellen"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}