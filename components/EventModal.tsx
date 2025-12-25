"use client";

import { useState, useEffect } from "react";
import { useCalendar } from "./CalendarContext";
import { CalendarEvent } from "./types";
import { COLORS } from "./utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  editEvent?: CalendarEvent | null;
}

export function EventModal({ isOpen, onClose, initialDate, editEvent }: EventModalProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendar();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || "");
      setStartDate(editEvent.start.toISOString().split("T")[0]);
      setStartTime(editEvent.start.toTimeString().slice(0, 5));
      setEndDate(editEvent.end.toISOString().split("T")[0]);
      setEndTime(editEvent.end.toTimeString().slice(0, 5));
      setColor(editEvent.color);
    } else if (initialDate) {
      const dateStr = initialDate.toISOString().split("T")[0];
      setStartDate(dateStr);
      setEndDate(dateStr);
      setStartTime("09:00");
      setEndTime("10:00");
      setTitle("");
      setDescription("");
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
  }, [editEvent, initialDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= start) {
      alert("Endzeit muss nach Startzeit liegen");
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description.trim() || undefined,
      start,
      end,
      color
    };

    if (editEvent) {
      updateEvent(editEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (editEvent && confirm("Termin wirklich löschen?")) {
      deleteEvent(editEvent.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">
          {editEvent ? "Termin bearbeiten" : "Neuer Termin"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titel *</label>
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
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={2}
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">&nbsp;</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ende</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">&nbsp;</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Farbe</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
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

          <div className="flex gap-3 pt-4">
            {editEvent && (
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
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors ml-auto"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {editEvent ? "Speichern" : "Erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}