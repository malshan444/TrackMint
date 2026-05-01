import { useState, useRef, useEffect } from 'react';
import CustomDatePicker from './CustomDatePicker';

const PRIORITIES = ['None', 'Urgent', 'Planned', 'Optional'];

const EntrySheet = ({ isOpen, onClose, onSave, categories }) => {
  const [type, setType] = useState('expense'); // expense | income
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState(null);
  const [priority, setPriority] = useState('None');
  const [errorMsg, setErrorMsg] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 3000);
  };
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setNote('');
      setDate(new Date());
      setCategory(null);
      setPriority('None');
      setErrorMsg('');
      setShowDatePicker(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validCategories = (categories || []).filter(c => c.type === type || c.type === 'both');

  const handleSave = () => {
    if (!amount || isNaN(amount) || amount <= 0) return showError('Enter a valid amount');
    if (!category) return showError('Please select a category');
    
    // Pass back to parent
    const entry = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      note,
      date: date.toISOString(),
      categoryId: category,
      priority: type === 'expense' ? priority : null
    };

    if(onSave) onSave(entry);
    onClose();
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease'
    }} onClick={onClose}>
      
      <div 
        ref={sheetRef}
        onClick={e => e.stopPropagation()}
        style={{ 
          background: 'var(--bg-secondary)', 
          borderTopLeftRadius: 'var(--radius-xl)', 
          borderTopRightRadius: 'var(--radius-xl)', 
          padding: '30px 24px', 
          paddingBottom: 'calc(30px + env(safe-area-inset-bottom, 0px))',
          height: '88vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-up)',
          transform: `translateY(${isOpen ? '0' : '100%'})`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2)'
        }}>
        
        {/* Handle bar */}
        <div style={{ width: '48px', height: '6px', background: 'var(--border-color)', borderRadius: '3px', margin: '0 auto 24px' }} />

        {/* Type Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '6px', marginBottom: '32px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setType('expense')}
            style={{ 
              flex: 1, padding: '12px 0', borderRadius: '12px',
              background: type === 'expense' ? 'var(--bg-secondary)' : 'transparent',
              color: type === 'expense' ? 'var(--accent-expense)' : 'var(--text-secondary)',
              fontWeight: 600, boxShadow: type === 'expense' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.3s'
            }}>Expense</button>
          <button 
            onClick={() => setType('income')}
            style={{ 
              flex: 1, padding: '12px 0', borderRadius: '12px',
              background: type === 'income' ? 'var(--bg-secondary)' : 'transparent',
              color: type === 'income' ? 'var(--accent-income)' : 'var(--text-secondary)',
              fontWeight: 600, boxShadow: type === 'income' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.3s'
            }}>Income</button>
        </div>

        {/* Amount Input */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Amount (LKR)</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Rs</span>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                fontSize: '3.5rem', fontWeight: 700, background: 'transparent', textAlign: 'right',
                width: '180px', color: type === 'expense' ? 'var(--accent-expense)' : 'var(--accent-income)',
                fontFamily: 'var(--font-heading)', padding: '0', caretColor: 'var(--accent-primary)'
              }}
            />
          </div>
        </div>

        {/* Date Field */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', transition: 'all 0.3s' }}
          >
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Date</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{date ? date.toDateString() : 'Select Date'}</span>
          </button>
          
          {showDatePicker && (
            <div style={{ marginTop: '12px', padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <CustomDatePicker 
                selectedDate={date} 
                onSelectDate={(d) => { setDate(d); setShowDatePicker(false); }} 
              />
            </div>
          )}
        </div>

        {/* Note Field */}
        <div style={{ marginBottom: '28px' }}>
          <input 
            type="text" 
            placeholder="Add a sweet note..." 
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}
          />
        </div>

        {/* Category Grid */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 500 }}>Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {validCategories.map(c => (
              <button 
                key={c.id} 
                onClick={() => setCategory(c.id)}
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  padding: '12px 4px', borderRadius: 'var(--radius-md)',
                  background: category === c.id ? `linear-gradient(135deg, rgba(var(--accent-${type === 'expense' ? 'expense' : 'income'})-rgb, 0.15) 0%, rgba(var(--accent-primary-rgb), 0.05) 100%)` : 'var(--bg-primary)',
                  border: category === c.id ? `1px solid var(--accent-${type === 'expense' ? 'expense' : 'income'})` : '1px solid var(--border-color)',
                  opacity: category === c.id || !category ? 1 : 0.6,
                  transform: category === c.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: category === c.id ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: category === c.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <div style={{ fontSize: '1.8rem', filter: category === c.id ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none' }}>{c.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: category === c.id ? 700 : 500 }}>{c.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Toggle - Only for Expenses */}
        <div style={{ 
          marginBottom: '32px', 
          visibility: type === 'expense' ? 'visible' : 'hidden',
          opacity: type === 'expense' ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out'
        }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 500 }}>Priority</div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {PRIORITIES.map(p => (
              <button 
                key={p}
                onClick={() => setPriority(p)}
                style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-xl)', whiteSpace: 'nowrap',
                  background: priority === p ? 'var(--text-primary)' : 'var(--bg-primary)',
                  color: priority === p ? 'var(--bg-secondary)' : 'var(--text-secondary)',
                  fontWeight: 600, border: priority === p ? '1px solid transparent' : '1px solid var(--border-color)',
                  boxShadow: priority === p ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.3s'
                }}
              >{p}</button>
            ))}
          </div>
        </div>

        {/* Inline Custom Error Message */}
        {errorMsg && (
          <div style={{
            marginBottom: '16px', padding: '12px', background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.5)', borderRadius: 'var(--radius-md)',
            color: 'var(--accent-expense)', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
            animation: 'fadeInUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {errorMsg}
          </div>
        )}

        <button 
          onClick={handleSave}
          style={{ 
            width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', 
            background: 'var(--accent-primary-gradient)', color: '#fff', fontSize: '1.10rem', fontWeight: 700,
            boxShadow: 'var(--shadow-glow)', letterSpacing: '1px',
            transform: 'translateY(0)', transition: 'all 0.2s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Save Entry
        </button>

      </div>
    </div>
  );
};

export default EntrySheet;
