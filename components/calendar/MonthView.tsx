import { CalendarEvent } from '../../types/calendar';
import { getMonthMatrix, DAYS, isSameMonth, isToday, isSameDay } from '../../utils/date';
import { EventItem } from './EventItem';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent) => void;
  onDrop: (date: Date) => void;
}

export function MonthView({
  currentDate,
  events,
  onDayClick,
  onEventClick,
  onDragStart,
  onDrop
}: MonthViewProps) {
  const matrix = getMonthMatrix(currentDate);

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.start), date));
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 bg-gray-700">
        {DAYS.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-300">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {matrix.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => onDayClick(day)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onDrop(day);
                }}
                className={`min-h-[100px] p-2 border border-gray-700 cursor-pointer transition-colors hover:bg-gray-750 ${
                  !isCurrentMonth ? 'bg-gray-850 opacity-50' : ''
                }`}
              >
                <div className={`text-sm mb-1 ${
                  isTodayDate
                    ? 'w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center font-bold'
                    : 'text-gray-400'
                }`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <EventItem
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                      onDragStart={() => onDragStart(event)}
                      compact
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-400 pl-2">
                      +{dayEvents.length - 3} weitere
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}