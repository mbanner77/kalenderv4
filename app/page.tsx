"use client";

import { ViewType } from '../types/calendar';
import { MONTHS, formatDate, formatWeekRange } from '../lib/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: ViewType) => void;
  onAddEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onAddEvent
}: CalendarHeaderProps) {
  const getTitle = () => {
    switch (view) {
      case 'month':
        return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case 'week':
        return formatWeekRange(currentDate);
      case 'day':
        return formatDate(currentDate);
      default:
        return '';
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      background: '#1e1e2e',
      borderBottom: '1px solid #313244',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onAddEvent}
          style={{
            padding: '10px 20px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          + Neuer Termin
        </button>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={onPrev}
            style={{
              padding: '8px 12px',
              background: '#313244',
              color: '#cdd6f4',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ←
          </button>
          <button
            onClick={onToday}
            style={{
              padding: '8px 16px',
              background: '#313244',
              color: '#cdd6f4',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Heute
          </button>
          <button
            onClick={onNext}
            style={{
              padding: '8px 12px',
              background: '#313244',
              color: '#cdd6f4',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            →
          </button>
        </div>
      </div>

      <h1 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#cdd6f4',
        margin: 0
      }}>
        {getTitle()}
      </h1>

      <div style={{
        display: 'flex',
        background: '#313244',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {(['month', 'week', 'day'] as ViewType[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            style={{
              padding: '8px 16px',
              background: view === v ? '#6366f1' : 'transparent',
              color: view === v ? '#fff' : '#cdd6f4',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            {v === 'month' ? 'Monat' : v === 'week' ? 'Woche' : 'Tag'}
          </button>
        ))}
      </div>
    </header>
  );
}

export default CalendarHeader;