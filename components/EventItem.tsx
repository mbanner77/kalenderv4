import { CalendarEvent } from '../types/calendar';

interface EventItemProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  compact?: boolean;
  style?: React.CSSProperties;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, event: CalendarEvent) => void;
}

export function EventItem({ 
  event, 
  onClick, 
  compact = false, 
  style = {},
  draggable = true,
  onDragStart
}: EventItemProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, event)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event);
      }}
      style={{
        padding: compact ? '2px 6px' : '6px 10px',
        background: event.color,
        color: '#fff',
        borderRadius: '4px',
        fontSize: compact ? '11px' : '13px',
        cursor: 'grab',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        transition: 'transform 0.1s, box-shadow 0.1s',
        position: 'absolute',
        left: 0,
        right: 0,
        borderRadius: '6px',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
      }}
    >
      {!event.allDay && !compact && (
        <span style={{ opacity: 0.9, marginRight: '6px' }}>
          {formatTime(event.start)}
        </span>
      )}
      <span style={{ fontWeight: '500' }}>{event.title}</span>
    </div>
  );
}