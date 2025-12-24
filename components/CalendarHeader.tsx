import { CalendarView } from "@/lib/types";
import { formatDate, getWeekNumber } from "@/lib/date";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: "prev" | "next" | "today") => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
}: CalendarHeaderProps) {
  const getTitle = () => {
    switch (view) {
      case "month":
        return formatDate(currentDate, "MMMM yyyy");
      case "week":
        return `KW ${getWeekNumber(currentDate)}, ${formatDate(currentDate, "MMMM yyyy")}`;
      case "day":
        return formatDate(currentDate, "EEEE, d. MMMM yyyy");
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.title}>{getTitle()}</h1>
      </div>

      <div style={styles.center}>
        <button
          onClick={() => onNavigate("prev")}
          style={styles.navButton}
          aria-label="Zurück"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => onNavigate("today")}
          style={styles.todayButton}
        >
          Heute
        </button>
        <button
          onClick={() => onNavigate("next")}
          style={styles.navButton}
          aria-label="Weiter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div style={styles.right}>
        <div style={styles.viewSwitcher}>
          {(["month", "week", "day"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              style={{
                ...styles.viewButton,
                ...(view === v ? styles.viewButtonActive : {}),
              }}
            >
              {v === "month" ? "Monat" : v === "week" ? "Woche" : "Tag"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    background: "rgba(255, 255, 255, 0.05)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#fff",
  },
  center: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  todayButton: {
    padding: "8px 16px",
    background: "rgba(99, 102, 241, 0.2)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  viewSwitcher: {
    display: "flex",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "4px",
  },
  viewButton: {
    padding: "8px 16px",
    background: "transparent",
    border: "none",
    borderRadius: "6px",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  viewButtonActive: {
    background: "rgba(99, 102, 241, 0.8)",
    color: "#fff",
  },
};