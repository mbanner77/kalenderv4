/**
 * Diese Datei existiert weiterhin, aber enthält jetzt JS-Dokumentation anstelle von TypeScript-Interfaces.
 * Sie kann optional importiert werden, aber ist nicht zwingend für JS-Laufzeit.
 */

export const doc = {
  CalendarEvent: {
    id: "string",
    title: "string",
    description: "string|undefined",
    start: "ISO string",
    end: "ISO string",
    allDay: "boolean|undefined",
    color: "string|undefined"
  },
  ViewType: ["month", "week", "day"]
};