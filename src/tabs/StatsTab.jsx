import { useMemo } from 'react';

const StatsTab = ({ transactions, categories }) => {
  
  // Calculate 6-month spending data
  const chartData = useMemo(() => {
    const data = [0, 0, 0, 0, 0, 0];
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];

    for (let i = 5; i >= 0; i--) {
      let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(months[d.getMonth()]);
    }

    transactions.forEach(t => {
      if (t.type === 'expense') {
        const d = new Date(t.date);
        const monthDiff = (today.getFullYear() - d.getFullYear()) * 12 + today.getMonth() - d.getMonth();
        if (monthDiff >= 0 && monthDiff < 6) {
          data[5 - monthDiff] += t.amount;
        }
      }
    });

    return { data, labels };
  }, [transactions]);

  // Compute SVG Path
  const { data, labels } = chartData;
  const maxVal = Math.max(...data, 100); // minimum scale 100
  
  const width = 300;
  const height = 150;
  
  // Create path points
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  });
  
  const pathData = `M0,${height} L${points.join(' ')} L${width},${height} Z`;
  const linePathData = `M${points.join(' L')}`;

  // Priority Breakdown
  const priorityData = useMemo(() => {
    const map = { Urgent: 0, Planned: 0, Optional: 0, None: 0 };
    let total = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        map[t.priority || 'None'] += t.amount;
        total += t.amount;
      }
    });
    return { map, total };
  }, [transactions]);

  // Category Breakdown
  const categoryData = useMemo(() => {
    const map = {};
    let total = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const cat = (categories || []).find(c => c.id === t.categoryId);
        const catName = cat ? `${cat.icon} ${cat.name}` : '🪙 Other';
        map[catName] = (map[catName] || 0) + t.amount;
        total += t.amount;
      }
    });
    
    // Sort array descending
    const sorted = Object.keys(map).map(k => ({ name: k, amount: map[k] })).sort((a,b) => b.amount - a.amount);
    
    return { list: sorted, total };
  }, [transactions, categories]);


  return (
    <div style={{ padding: '0 20px', paddingBottom: '30px' }}>
      <header style={{ paddingTop: '10px', paddingBottom: '16px' }}>
        <h1 style={{ marginTop: 0, marginBottom: 0, fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>Stats</h1>
      </header>

      {/* SVG Chart */}
      <div className="glass" style={{ 
        borderRadius: 'var(--radius-lg)', 
        padding: '24px 16px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600 }}>6-Month Spending</h3>
        
        <div style={{ position: 'relative', width: '100%', aspectRatio: '2/1' }}>
          <svg viewBox={`0 -10 ${width} ${height + 20}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-expense)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-expense)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={pathData} fill="url(#gradientFill)" />
            <path d={linePathData} fill="none" stroke="var(--accent-expense)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Draw data points */}
            {points.map((pt, i) => {
              const [x, y] = pt.split(',');
              return <circle key={i} cx={x} cy={y} r="4" fill="var(--bg-secondary)" stroke="var(--accent-expense)" strokeWidth="2" />
            })}
          </svg>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
          {labels.map((l, i) => (
            <div key={i} style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Breakdown Grids */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Category Breakdown */}
        <div>
           <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>By Category</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {categoryData.list.length > 0 ? categoryData.list.map(c => {
                const pct = (c.amount / categoryData.total) * 100;
                return (
                  <div key={c.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                      <span style={{ fontWeight: 600 }}>Rs {c.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-primary-gradient)', borderRadius: '4px' }} />
                    </div>
                  </div>
                )
              }) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No expense data</div>
              )}
           </div>
        </div>

        {/* Priority Breakdown */}
        <div>
           <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>By Priority</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.keys(priorityData.map).filter(k => priorityData.map[k] > 0).map(p => {
                const amt = priorityData.map[p];
                const pct = (amt / priorityData.total) * 100;
                return (
                  <div key={p}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 500 }}>{p}</span>
                      <span style={{ fontWeight: 600 }}>Rs {amt.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-expense-gradient)', borderRadius: '4px' }} />
                    </div>
                  </div>
                )
              })}
              {priorityData.total === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No expense data</div>}
           </div>
        </div>

      </div>
    </div>
  );
};

export default StatsTab;
