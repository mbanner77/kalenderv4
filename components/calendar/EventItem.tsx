import { CalendarEvent } from '../../types/calendar';
import { formatTime } from '../../utils/date';

interface EventItemProps {
  event: CalendarEvent;
  onClick: () => void;
  onDragStart: () => void;
  compact?: boolean;
  style?: React.CSSProperties;
}

export function EventItem({ event, onClick, onDragStart, compact = false, style }: EventItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', event.id);
        onDragStart();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`rounded px-2 py-1 text-xs font-medium cursor-pointer truncate transition-transform hover:scale-[1.02] ${
        compact ? 'mb-1' : ''
      }`}
      style={{
        backgroundColor: event.color + '33',
        borderLeft: `3px solid ${event.color}`,
        color: event.color,
        ...style
      }}
    >
      {!compact && !event.allDay && (
        <span className="opacity-75 mr-1">{formatTime(event.start)}</span>
      )}
      {event.title}
    </div>
  );
}