import { CalendarView } from '../../types/calendar';
import { MONTHS } from '../../utils/date';

interface CalendarToolbarProps {
  currentDate: Date;
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarToolbar({
  currentDate,
  currentView,
  onViewChange,
  onPrev,
  onNext,
  onToday
}: CalendarToolbarProps) {
  const title = `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors"
        >
          Heute
        </button>
        <button
          onClick={onPrev}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold ml-4">{title}</h2>
      </div>

      <div className="flex bg-gray-700 rounded-lg p-1">
        {(['month', 'week', 'day'] as CalendarView[]).map(view => (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === view
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {view === 'month' ? 'Monat' : view === 'week' ? 'Woche' : 'Tag'}
          </button>
        ))}
      </div>
    </div>
  );
}