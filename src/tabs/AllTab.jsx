import { useState, useMemo } from 'react';

const AllTab = ({ transactions, categories }) => {
  const [filter, setFilter] = useState('All'); // All, Expenses, Income
  const [search, setSearch] = useState('');

  const groupedTransactions = useMemo(() => {
    let filtered = transactions;
    if (filter === 'Expenses') filtered = filtered.filter(t => t.type === 'expense');
    if (filter === 'Income') filtered = filtered.filter(t => t.type === 'income');
    if (search) {
      filtered = filtered.filter(t => {
        const catName = categories.find(c => c.id === t.categoryId)?.name.toLowerCase() || '';
        const note = (t.note || '').toLowerCase();
        const q = search.toLowerCase();
        return catName.includes(q) || note.includes(q);
      });
    }

    const groups = {};
    filtered.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
      if (!groups[key]) {
        groups[key] = { items: [], income: 0, expense: 0 };
      }
      groups[key].items.push(t);
      if (t.type === 'income') groups[key].income += t.amount;
      if (t.type === 'expense') groups[key].expense += t.amount;
    });

    return groups;
  }, [transactions, filter, search]);

  return (
    <div style={{ padding: '0 20px', paddingBottom: '20px' }}>
      <header style={{ paddingTop: '10px', paddingBottom: '16px' }}>
        <h1 style={{ marginTop: 0, marginBottom: 0, fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>All Transactions</h1>
      </header>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search note or category..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', fontSize: '1rem', color: 'var(--text-primary)', transition: 'border-color 0.3s' }}
        />
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', scrollbarWidth: 'none' }}>
        {['All', 'Expenses', 'Income'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            style={{ 
              padding: '8px 20px', borderRadius: 'var(--radius-xl)', fontSize: '0.95rem',
              background: filter === f ? 'var(--text-primary)' : 'var(--bg-secondary)',
              color: filter === f ? 'var(--bg-secondary)' : 'var(--text-secondary)',
              fontWeight: 600, border: filter === f ? '1px solid transparent' : '1px solid var(--border-color)',
              boxShadow: filter === f ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >{f}</button>
        ))}
      </div>

      {/* Grouped List */}
      <div>
        {Object.keys(groupedTransactions).map(monthGroup => {
          const group = groupedTransactions[monthGroup];
          return (
            <div key={monthGroup} style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{monthGroup}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <span className="gradient-income" style={{ fontWeight: 600 }}>+Rs {group.income.toLocaleString()}</span>
                  {' '} | {' '}
                  <span className="gradient-expense" style={{ fontWeight: 600 }}>-Rs {group.expense.toLocaleString()}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {group.items.map(t => {
                  const cat = categories.find(c => c.id === t.categoryId) || { icon: '🪙', name: 'Other' };
                  return (
                    <div key={t.id} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '16px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s' }}>
                      <div style={{ width: '48px', height: '48px', background: t.type === 'expense' ? 'rgba(var(--accent-expense-rgb), 0.1)' : 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '16px', border: '1px solid var(--border-color)' }}>
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
            </div>
          )
        })}
        {Object.keys(groupedTransactions).length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
            No transactions found.
          </div>
        )}
      </div>

    </div>
  );
};

export default AllTab;
