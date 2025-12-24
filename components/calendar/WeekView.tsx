import { CalendarEvent } from '../../types/calendar';
import { getWeekDays, getHours, DAYS, isToday, isSameDay, getEventPosition } from '../../utils/date';
import { EventItem } from './EventItem';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent) => void;
  onDrop: (date: Date, hour: number) => void;
}

export function WeekView({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
  onDragStart,
  onDrop
}: WeekViewProps) {
  const weekDays = getWeekDays(currentDate);
  const hours = getHours();

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.start), date));
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="grid grid-cols-8 bg-gray-700">
        <div className="p-3 text-center text-sm font-medium text-gray-400">Zeit</div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`p-3 text-center ${isToday(day) ? 'bg-indigo-600/20' : ''}`}
          >
            <div className="text-sm font-medium text-gray-300">{DAYS[day.getDay()]}</div>
            <div className={`text-lg ${isToday(day) ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-8">
          <div className="border-r border-gray-700">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] px-2 py-1 text-xs text-gray-500 text-right border-b border-gray-700">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div key={dayIndex} className="relative border-r border-gray-700">
                {hours.map(hour => (
                  <div
                    key={hour}
                    onClick={() => onTimeSlotClick(day, hour)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      onDrop(day, hour);
                    }}
                    className="h-[60px] border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
                  />
                ))}
                {dayEvents.filter(e => !e.allDay).map(event => {
                  const pos = getEventPosition(event, day);
                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1"
                      style={{ top: pos.top, height: pos.height }}
                    >
                      <EventItem
                        event={event}
                        onClick={() => onEventClick(event)}
                        onDragStart={() => onDragStart(event)}
                        style={{ height: '100%' }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}