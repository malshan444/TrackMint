import { useState, useMemo } from 'react';
import GoalsSection from '../components/GoalsSection';
import CustomDatePicker from '../components/CustomDatePicker';
import useLocalStorage from '../hooks/useLocalStorage';

const HomeTab = ({ transactions, categories, goals, setGoals }) => {
  const [filter, setFilter] = useLocalStorage('trackmint_filter_mode', 'Month');
  const [customRange, setCustomRange] = useLocalStorage('trackmint_custom_range', { startDate: null, endDate: null, endMode: 'exact' });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      const tTime = d.getTime();
      const today = new Date();
      
      if (filter === 'Day') {
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      }
      if (filter === 'Week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
        startOfWeek.setHours(0,0,0,0);
        return tTime >= startOfWeek.getTime();
      }
      if (filter === 'Month') {
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      }
      if (filter === 'Custom') {
        const ts = customRange.startDate ? new Date(customRange.startDate).setHours(0,0,0,0) : null;
        let te = customRange.endDate ? new Date(customRange.endDate).setHours(23,59,59,999) : null;
        
        if (customRange.endMode === 'today') {
           te = new Date().setHours(23,59,59,999);
        }
        
        if (ts && te) {
           return tTime >= ts && tTime <= te;
        } else if (ts && !te) {
           return tTime >= ts && tTime <= new Date(ts).setHours(23,59,59,999);
        }
        return true; 
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filter, customRange]);

  const { balance, income, spent } = useMemo(() => {
    let inc = 0, exp = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      if (t.type === 'expense') exp += t.amount;
    });
    return { balance: inc - exp, income: inc, spent: exp };
  }, [filteredTransactions]);


  return (
    <div style={{ padding: '0 20px' }}>
      <header style={{ paddingTop: '10px', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Balance</h1>
        <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-1px' }}>
          Rs {balance.toLocaleString()}
        </div>
      </header>

      {/* Summary Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div className="glass" style={{
          flex: 1, borderRadius: 'var(--radius-lg)', padding: '20px',
          boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--accent-income)', opacity: '0.1', borderRadius: '50%', filter: 'blur(10px)' }}></div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Income</div>
          <div className="gradient-income" style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            +Rs {income.toLocaleString()}
          </div>
        </div>
        <div className="glass" style={{
          flex: 1, borderRadius: 'var(--radius-lg)', padding: '20px',
          boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: 'var(--accent-expense)', opacity: '0.1', borderRadius: '50%', filter: 'blur(10px)' }}></div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Spent</div>
          <div className="gradient-expense" style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            -Rs {spent.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '6px', marginBottom: '32px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {['Day', 'Week', 'Month', 'Custom'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '12px',
              background: filter === f ? 'var(--bg-primary)' : 'transparent',
              color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: filter === f ? 600 : 500,
              boxShadow: filter === f ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filter === 'Custom' && (
        <div style={{ marginBottom: '32px' }}>
          <CustomDatePicker 
            selectedRange={customRange} 
            onSelectRange={setCustomRange} 
          />
          {customRange.startDate && (
            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
              Showing {new Date(customRange.startDate).toLocaleDateString()} 
              {' '}—{' '} 
              {customRange.endMode === 'today' ? 'Today' : customRange.endDate ? new Date(customRange.endDate).toLocaleDateString() : 'Single Day'}
            </div>
          )}
        </div>
      )}

      {/* Recent Transactions list */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Recent Transactions</h3>
          <button style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600 }}>See All</button>
        </div>
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💸</div>
            No transactions found for this period.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
            {filteredTransactions.slice(0, 15).map(t => {
              const cat = categories.find(c => c.id === t.categoryId) || { icon: '🪙', name: 'Other' };
              return (
                <div key={t.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s' }}>
                  <div style={{ width: '48px', height: '48px', background: t.type === 'expense' ? 'rgba(var(--accent-expense), 0.1)' : 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '16px', border: '1px solid var(--border-color)' }}>
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{cat.name}</div>
                    {t.note && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.note}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: t.type === 'expense' ? 'var(--text-primary)' : 'var(--accent-income)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
                      {t.type === 'expense' ? '-' : '+'}Rs {t.amount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {new Date(t.date).getDate()} {new Date(t.date).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ marginTop: '32px' }}>
        <GoalsSection goals={goals} setGoals={setGoals} />
      </div>

    </div>
  );
};

export default HomeTab;
