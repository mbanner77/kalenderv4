"use client";

import { useState, useEffect } from "react";
import { useCalendar, CalendarEvent, EVENT_COLORS } from "./CalendarContext";

export function EventModal() {
  const { 
    isModalOpen, modalMode, selectedEvent, newEventDate,
    addEvent, updateEvent, deleteEvent, closeModal 
  } = useCalendar();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState(EVENT_COLORS[0]);

  useEffect(() => {
    if (isModalOpen) {
      if (modalMode === "edit" && selectedEvent) {
        setTitle(selectedEvent.title);
        setDescription(selectedEvent.description);
        setLocation(selectedEvent.location);
        setStartDate(selectedEvent.start.toISOString().split("T")[0]);
        setStartTime(selectedEvent.start.toTimeString().slice(0, 5));
        setEndDate(selectedEvent.end.toISOString().split("T")[0]);
        setEndTime(selectedEvent.end.toTimeString().slice(0, 5));
        setAllDay(selectedEvent.allDay);
        setColor(selectedEvent.color);
      } else {
        const date = newEventDate || new Date();
        const dateStr = date.toISOString().split("T")[0];
        setTitle("");
        setDescription("");
        setLocation("");
        setStartDate(dateStr);
        setStartTime("09:00");
        setEndDate(dateStr);
        setEndTime("10:00");
        setAllDay(false);
        setColor(EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)]);
      }
    }
  }, [isModalOpen, modalMode, selectedEvent, newEventDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const start = new Date(`${startDate}T${allDay ? "00:00" : startTime}`);
    const end = new Date(`${endDate}T${allDay ? "23:59" : endTime}`);

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      start,
      end,
      allDay,
      color
    };

    if (modalMode === "edit" && selectedEvent) {
      updateEvent({ ...eventData, id: selectedEvent.id });
    } else {
      addEvent(eventData);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (selectedEvent && confirm("Termin wirklich löschen?")) {
      deleteEvent(selectedEvent.id);
      closeModal();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">
            {modalMode === "edit" ? "Termin bearbeiten" : "Neuer Termin"}
          </h3>
          <button onClick={closeModal} className="p-1 hover:bg-gray-700 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Titel *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Terminname"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Beschreibung</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={2}
              placeholder="Details zum Termin"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Ort</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Veranstaltungsort"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={e => setAllDay(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="allDay" className="text-sm text-gray-300">Ganztägig</label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Startdatum</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {!allDay && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Startzeit</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Enddatum</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {!allDay && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Endzeit</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Farbe</label>
            <div className="flex gap-2">
              {EVENT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? "ring-2 ring-white scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {modalMode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Löschen
              </button>
            )}
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {modalMode === "edit" ? "Speichern" : "Erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}