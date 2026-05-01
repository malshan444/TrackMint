import { useState, useMemo } from 'react';

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CustomDatePicker = ({ selectedRange, onSelectRange }) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedRange?.startDate ? new Date(selectedRange.startDate) : new Date()
  );

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const calendarGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const grid = [];
    let currentWeek = Array(7).fill(null);
    let currentDayIter = 1;

    for (let i = firstDay; i < 7; i++) {
      if (currentDayIter <= daysInMonth) {
        currentWeek[i] = currentDayIter++;
      }
    }
    grid.push(currentWeek);

    while (currentDayIter <= daysInMonth) {
      const week = Array(7).fill(null);
      for (let i = 0; i < 7; i++) {
        if (currentDayIter <= daysInMonth) {
          week[i] = currentDayIter++;
        }
      }
      grid.push(week);
    }
    
    return grid;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const ts = selectedRange?.startDate ? new Date(selectedRange.startDate).setHours(0,0,0,0) : null;
  const te = selectedRange?.endDate ? new Date(selectedRange.endDate).setHours(0,0,0,0) : null;
  const tm = selectedRange?.endMode || 'exact';

  const isSelected = (day) => {
    if (!day) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime();
    if (tm === 'today') {
      const today = new Date().setHours(0,0,0,0);
      return (ts && d === ts) || (d === today);
    }
    return (ts && d === ts) || (te && d === te);
  };

  const isInRange = (day) => {
    if (!day || !ts) return false;
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime();
    let effectiveEnd = te;
    if (tm === 'today') {
       effectiveEnd = new Date().setHours(0,0,0,0);
    }
    if (ts && effectiveEnd) {
       return d > ts && d < effectiveEnd;
    }
    return false;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
  };

  const selectDay = (day) => {
    if (!day) return;
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0,0,0,0);
    
    if (!ts || (ts && (te || tm === 'today'))) {
      onSelectRange({ startDate: clickedDate.toISOString(), endDate: null, endMode: 'exact' });
    } else {
      if (clickedDate.getTime() < ts) {
        onSelectRange({ startDate: clickedDate.toISOString(), endDate: new Date(ts).toISOString(), endMode: 'exact' });
      } else {
        onSelectRange({ startDate: new Date(ts).toISOString(), endDate: clickedDate.toISOString(), endMode: 'exact' });
      }
    }
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
      padding: '16px', boxShadow: 'var(--shadow-md)', marginTop: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={handlePrevMonth} style={{ padding: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
        </button>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button onClick={handleNextMonth} style={{ padding: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {calendarGrid.map((week, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {week.map((day, j) => {
              const selected = isSelected(day);
              const inRange = isInRange(day);
              const cellBg = inRange ? 'rgba(var(--accent-primary-rgb), 0.15)' : 'transparent';
              
              return (
                <div key={j} style={{ display: 'flex', justifyContent: 'center', background: cellBg, borderRadius: '8px' }}>
                  {day ? (
                    <button
                      onClick={() => selectDay(day)}
                      style={{
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: selected ? '50%' : '8px',
                        background: selected ? 'var(--accent-primary)' : 'transparent',
                        color: selected ? '#fff' : 'var(--text-primary)',
                        border: isToday(day) && !selected && !inRange ? '1px solid var(--accent-primary)' : '1px solid transparent',
                        fontWeight: selected || isToday(day) ? 600 : 400,
                        fontSize: '0.9rem', transition: 'none'
                      }}
                    >
                      {day}
                    </button>
                  ) : <div style={{ width: '36px', height: '36px' }} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => onSelectRange({ startDate: null, endDate: null, endMode: 'exact' })} style={{ color: 'var(--text-secondary)', fontWeight: 500, padding: '8px' }}>Clear</button>
        <button 
          onClick={() => ts ? onSelectRange({ startDate: new Date(ts).toISOString(), endDate: null, endMode: 'today' }) : null} 
          style={{ opacity: ts ? 1 : 0.4, color: 'var(--accent-primary)', fontWeight: 600, padding: '8px' }}
          disabled={!ts}
        >
          Set End to Today
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;
