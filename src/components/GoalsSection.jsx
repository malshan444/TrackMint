import { useState, useRef } from 'react';

const GoalsSection = ({ goals, setGoals }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [fundingGoal, setFundingGoal] = useState(null); // the goal being funded
  const [fundAmount, setFundAmount] = useState('');
  const [goalToDelete, setGoalToDelete] = useState(null);

  // form states
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [target, setTarget] = useState('');
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Downscale image to save LocalStorage space
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          setImage(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveGoal = () => {
    if (!name || (!target && parseFloat(target) <= 0)) return;
    const newGoal = {
      id: Date.now().toString(),
      name,
      description: desc,
      targetAmount: parseFloat(target),
      savedAmount: 0,
      image: image || '',
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [newGoal, ...prev]);
    setIsAdding(false);
    
    // reset
    setName('');
    setDesc('');
    setTarget('');
    setImage(null);
  };

  const closeGoalModal = () => {
    setIsAdding(false);
    setName('');
    setDesc('');
    setTarget('');
    setImage(null);
  }

  const addFunds = () => {
    if (!fundAmount || isNaN(parseFloat(fundAmount))) return;
    setGoals(prev => prev.map(g => {
      if (g.id === fundingGoal.id) {
        return { ...g, savedAmount: g.savedAmount + parseFloat(fundAmount) };
      }
      return g;
    }));
    setFundingGoal(null);
    setFundAmount('');
  };

  const executeDelete = () => {
    if (!goalToDelete) return;
    setGoals(prev => prev.filter(g => g.id !== goalToDelete.id));
    setGoalToDelete(null);
  };

  // Add styles that match the app's aesthetic
  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
  };

  const modalStyle = {
    background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px',
    padding: '24px', boxShadow: 'var(--shadow-lg)'
  };

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
    color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1rem'
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Your Goals</h3>
        <button onClick={() => setIsAdding(true)} style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600 }}>+ Add Goal</button>
      </div>

      {goals && goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No goals set up yet. Start saving!
        </div>
      ) : (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '16px', scrollbarWidth: 'none' }}>
          {goals && goals.map(g => {
            const progress = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
            const remaining = Math.max(g.targetAmount - g.savedAmount, 0);
            
            return (
              <div key={g.id} className="glass" style={{
                minWidth: '240px', maxWidth: '240px', borderRadius: 'var(--radius-lg)', padding: '16px',
                boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', position: 'relative'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', paddingRight: '24px' }}>
                  <div style={{ 
                    width: '50px', height: '50px', borderRadius: '12px', background: 'var(--bg-secondary)',
                    backgroundImage: g.image ? `url(${g.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center',
                    border: '1px solid var(--border-color)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'
                  }}>
                    {!g.image && '🎯'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{g.name}</h4>
                    {g.description && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>{g.description}</p>}
                  </div>
                </div>

                <button 
                  onClick={() => setGoalToDelete(g)}
                  style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(220,38,38,0.1)', color: 'var(--accent-expense)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', transition: 'all 0.2s' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>Saved: Rs {g.savedAmount.toLocaleString()}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>of Rs {g.targetAmount.toLocaleString()}</span>
                  </div>
                  
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-primary-gradient)', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                  
                  {remaining > 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-expense)', marginTop: '8px', fontWeight: 500 }}>
                      Need Rs {remaining.toLocaleString()} more
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '8px', fontWeight: 500 }}>
                      🎉 Goal Reached!
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setFundingGoal(g)}
                  style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  Add Funds
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isAdding && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 700 }}>Create a New Goal</h3>
            
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{ 
                  width: '60px', height: '60px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', 
                  backgroundImage: image ? `url(${image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center',
                  border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current.click()}
              >
                {!image && <span style={{ fontSize: '1.5rem' }}>📷</span>}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Tap to select a goal image
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
            </div>

            <input style={inputStyle} placeholder="Goal Name (e.g. PS5 Console)" value={name} onChange={e => setName(e.target.value)} />
            <input style={inputStyle} placeholder="Description (Optional)" value={desc} onChange={e => setDesc(e.target.value)} />
            <input style={inputStyle} type="number" placeholder="Target Amount (Rs)" value={target} onChange={e => setTarget(e.target.value)} />

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={closeGoalModal} 
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={saveGoal} 
                disabled={!name || !target}
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary-gradient)', color: 'white', fontWeight: 600, opacity: (!name || !target) ? 0.5 : 1 }}
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {fundingGoal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>Add Funds</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Add money towards your <strong>{fundingGoal.name}</strong> goal.
            </p>
            
            <input 
              style={{...inputStyle, fontSize: '1.5rem', fontWeight: 700 }} 
              type="number" 
              placeholder="Amount (Rs)" 
              value={fundAmount} 
              onChange={e => setFundAmount(e.target.value)} 
              autoFocus
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={() => { setFundingGoal(null); setFundAmount(''); }} 
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={addFunds} 
                disabled={!fundAmount}
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary-gradient)', color: 'white', fontWeight: 600, opacity: !fundAmount ? 0.5 : 1 }}
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700, color: 'var(--accent-expense)' }}>Delete Goal?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete your <strong>{goalToDelete.name}</strong> goal? This action cannot be undone and your saved progress will be lost.
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setGoalToDelete(null)}
                style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, border: '1px solid var(--border-color)' }}
              >
                Keep It
              </button>
              <button 
                onClick={executeDelete} 
                style={{ flex: 1, padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--accent-expense-gradient)', color: 'white', fontWeight: 600, boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GoalsSection;
