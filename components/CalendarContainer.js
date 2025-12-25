import React from "react";
import { useCalendar } from "./CalendarContext";
import { EventChip } from "./EventChip";

/**
 * Ein einfacher Container, der existierende Events anzeigt.
 * Purpose: ersetzt den fehlenden CalendarContainer-Import, damit Build nicht mehr fehlschlägt.
 */

export function CalendarContainer() {
  const {
    events = [],
    currentDate
  } = useCalendar();

  return (
    <section className="bg-gray-800 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Datum:</h2>
        <p className="text-sm text-gray-300">{new Date(currentDate).toLocaleString()}</p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-2">Ereignisse</h3>
        <div className="space-y-2">
          {(events || []).map(event => (
            <EventChip
              key={event.id}
              event={event}
              onClick={() => {
                // kleines Demo-Verhalten: alert mit Titel
                // stopPropagation wird im EventChip gehandhabt
                alert(`Event: ${event.title}`);
              }}
            />
          ))}
          {(events || []).length === 0 && (
            <div className="text-gray-400">Keine Ereignisse vorhanden.</div>
          )}
        </div>
      </div>
    </section>
  );
}