import { CalendarEvent } from '../../types/calendar';
import { getHours, isToday, isSameDay, getEventPosition, DAYS, MONTHS } from '../../utils/date';
import { EventItem } from './EventItem';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (hour: number) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent) => void;
  onDrop: (hour: number) => void;
}

export function DayView({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
  onDragStart,
  onDrop
}: DayViewProps) {
  const hours = getHours();
  const dayEvents = events.filter(event => isSameDay(new Date(event.start), currentDate));
  const isTodayDate = isToday(currentDate);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className={`p-4 text-center ${isTodayDate ? 'bg-indigo-600/20' : 'bg-gray-700'}`}>
        <div className="text-lg font-medium text-gray-300">
          {DAYS[currentDate.getDay()]}, {currentDate.getDate()}. {MONTHS[currentDate.getMonth()]}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {dayEvents.length} Termin{dayEvents.length !== 1 ? 'e' : ''}
        </div>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-[80px_1fr]">
          <div className="border-r border-gray-700">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] px-2 py-1 text-xs text-gray-500 text-right border-b border-gray-700">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
          <div className="relative">
            {hours.map(hour => (
              <div
                key={hour}
                onClick={() => onTimeSlotClick(hour)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onDrop(hour);
                }}
                className="h-[60px] border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
              />
            ))}
            {dayEvents.filter(e => !e.allDay).map(event => {
              const pos = getEventPosition(event, currentDate);
              return (
                <div
                  key={event.id}
                  className="absolute left-2 right-2"
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
        </div>
      </div>
    </div>
  );
}