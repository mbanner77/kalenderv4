"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { CalendarHeader } from "@/components/CalendarHeader";
import { EventItem } from "@/components/EventItem";

export default function Page() {
  const {
    currentDate,
    view,
    events,
    colors,
    setView,
    goToToday,
    goNext,
    goPrev,
    goToDate,
    openCreateModal,
    openEditModal,
    getEventsForDate
  } = useCalendar();

  const todayEvents = getEventsForDate(currentDate);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#11111b',
      color: '#cdd6f4',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onViewChange={setView}
        onAddEvent={() => openCreateModal()}
      />
      
      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {view === 'month' && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '1px',
              background: '#313244',
              marginBottom: '24px'
            }}>
              {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
                <div key={day} style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: '600',
                  background: '#1e1e2e',
                  color: day === 'So' ? '#f38ba8' : '#cdd6f4'
                }}>
                  {day}
                </div>
              ))}
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '1px',
              height: '500px'
            }}>
              {Array.from({ length: 42 }).map((_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 7);
                const dayEvents = getEventsForDate(date);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                
                return (
                  <div key={i} style={{
                    padding: '12px',
                    background: isCurrentMonth ? '#1e1e2e' : '#313244',
                    borderRadius: '8px',
                    minHeight: '80px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => goToDate(date)}
                  style={{
                    ...(isToday(date) && { 
                      border: '2px solid #89b4fa',
                      background: '#313244' 
                    })
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '12px',
                      opacity: 0.7
                    }}>
                      {date.getDate()}
                    </div>
                    
                    <div style={{ marginTop: '20px' }}>
                      {dayEvents.slice(0, 3).map(event => (
                        <EventItem
                          key={event.id}
                          event={event}
                          compact={true}
                          onClick={openEditModal}
                          style={{ marginBottom: '2px', fontSize: '11px' }}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div style={{
                          fontSize: '10px',
                          color: '#a6adc8',
                          marginTop: '4px'
                        }}>
                          +{dayEvents.length - 3} mehr
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {view === 'week' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '1px',
              background: '#313244',
              marginBottom: '1px'
            }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const date = new Date(currentDate);
                date.setDate(date.getDate() + i - date.getDay() + (date.getDay() === 0 ? -6 : 1));
                return (
                  <div key={i} style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    background: '#1e1e2e',
                    fontWeight: i === 0 ? '600' : '500',
                    color: i === 0 ? '#f38ba8' : '#cdd6f4',
                    fontSize: '13px'
                  }}>
                    {date.getDate()}. {new Date(currentDate).toLocaleDateString('de-DE', { 
                      weekday: 'short' 
                    })}
                  </div>
                );
              })}
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '1px',
              height: '600px',
              background: '#313244'
            }}>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const date = new Date(currentDate);
                date.setDate(date.getDate() + dayIndex - date.getDay() + (date.getDay() === 0 ? -6 : 1));
                const dayEvents = getEventsForDate(date);
                
                return (
                  <div key={dayIndex} style={{
                    background: '#1e1e2e',
                    padding: '12px',
                    position: 'relative',
                    minHeight: '100px'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px' 
                    }}>
                      {dayEvents.map(event => (
                        <EventItem
                          key={event.id}
                          event={event}
                          onClick={openEditModal}
                          style={{ flex: '1', minHeight: '30px' }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {view === 'day' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #1e1e2e 0%, #313244 100%)',
              borderRadius: '12px',
              marginBottom: '1px'
            }}>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
                {currentDate.toLocaleDateString('de-DE', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flex: 1, 
              overflow: 'hidden',
              background: '#1e1e2e',
              borderRadius: '12px',
              padding: '20px',
              gap: '20px'
            }}>
              <div style={{
                width: '60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#313244',
                borderRadius: '8px',
                padding: '12px 0'
              }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} style={{
                    height: '40px',
                    width: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#a6adc8'
                  }}>
                    {i}:00
                  </div>
                ))}
              </div>
              
              <div style={{ 
                flex: 1, 
                position: 'relative',
                overflowY: 'auto'
              }}>
                {events.filter(event => 
                  isSameDay(event.start, currentDate)
                ).map(event => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onClick={openEditModal}
                    style={getEventPosition(event)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}