import { CalendarEvent } from "@/lib/types";
import { formatDate } from "@/lib/date";

interface EventBadgeProps {
  event: CalendarEvent;
  onClick?: () => void;
  compact?: boolean;
  showTime?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function EventBadge({
  event,
  onClick,
  compact = false,
  showTime = false,
  draggable = true,
  onDragStart,
  onDragEnd,
}: EventBadgeProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        ...styles.badge,
        background: `${event.color}20`,
        borderLeft: `3px solid ${event.color}`,
        cursor: draggable ? "grab" : "pointer",
      }}
    >
      {showTime && !event.allDay && (
        <span style={styles.time}>
          {formatDate(event.start, "HH:mm")}
        </span>
      )}
      <span style={{ ...styles.title, ...(compact ? styles.titleCompact : {}) }}>
        {event.title}
      </span>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    color: "#fff",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    transition: "transform 0.1s, box-shadow 0.1s",
  },
  time: {
    fontWeight: 600,
    opacity: 0.8,
  },
  title: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  titleCompact: {
    fontSize: "0.7rem",
  },
};