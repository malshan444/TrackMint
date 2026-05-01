import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const SettingsTab = ({ theme, setTheme, accentColor, setAccentColor, categories, setCategories, setTransactions }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [catToDelete, setCatToDelete] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };


  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('📌');
  const [newCatType, setNewCatType] = useState('expense');

  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('');
  const [editCatType, setEditCatType] = useState('expense');

  const handleClearData = () => {
    setTransactions([]);
    setShowDeleteModal(false);
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return showToast('Category name cannot be empty');
    
    // Simple id generation
    const id = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    if (categories.find(c => c.id === id)) return showToast('Category already exists');

    const newCategory = {
      id,
      name: newCatName.trim(),
      icon: newCatIcon,
      type: newCatType
    };

    setCategories([...categories, newCategory]);
    setNewCatName('');
    setNewCatIcon('📌');
  };

  const confirmDeleteCategory = () => {
    if (catToDelete) {
      setCategories(categories.filter(c => c.id !== catToDelete));
      setCatToDelete(null);
    }
  };

  const startEditCategory = (c) => {
    setEditingCatId(c.id);
    setEditCatName(c.name);
    setEditCatIcon(c.icon);
    setEditCatType(c.type);
  };

  const cancelEditCategory = () => {
    setEditingCatId(null);
  };

  const saveEditCategory = () => {
    if (!editCatName.trim()) return showToast('Category name cannot be empty');
    
    setCategories(categories.map(c => {
      if (c.id === editingCatId) {
        return { ...c, name: editCatName.trim(), icon: editCatIcon, type: editCatType };
      }
      return c;
    }));
    setEditingCatId(null);
  };

  return (
    <div style={{ padding: '0 20px', paddingBottom: '30px' }}>
      <header style={{ paddingTop: '10px', paddingBottom: '16px' }}>
        <h1 style={{ marginTop: 0, marginBottom: 0, fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>Settings</h1>
      </header>

      {/* Appearance */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Appearance</h3>
        
        <div className="glass" style={{ 
          borderRadius: 'var(--radius-lg)', 
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: 600, fontSize: '1.1rem' }}>Display Theme</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Choose your preferred visual style</p>
          </div>
          
          <div style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '6px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            {['light', 'dark', 'system'].map(t => (
              <button 
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: '12px',
                  background: theme === t ? 'var(--bg-secondary)' : 'transparent',
                  color: theme === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: theme === t ? 700 : 500,
                  boxShadow: theme === t ? 'var(--shadow-sm)' : 'none',
                  textTransform: 'capitalize', transition: 'all 0.3s'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '24px', marginBottom: '16px' }}>
            <label style={{ fontWeight: 600, fontSize: '1.1rem' }}>App Color</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Customize the primary accent color</p>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            {['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#eab308'].map(color => (
              <div
                key={color}
                role="button"
                onClick={() => setAccentColor(color)}
                style={{
                  width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', background: color, flexShrink: 0,
                  border: accentColor === color ? '3px solid var(--text-primary)' : '2px solid transparent',
                  boxShadow: accentColor === color ? `0 0 10px ${color}80` : 'none',
                  transition: 'all 0.2s', cursor: 'pointer', boxSizing: 'border-box'
                }}
              />
            ))}
            <div
                 role="button"
                 onClick={() => setShowColorPicker(true)}
                 style={{
                 width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', flexShrink: 0, position: 'relative',
                 background: 'var(--bg-secondary)',
                 border: (!['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#eab308'].includes(accentColor)) ? '3px solid var(--text-primary)' : '1px solid var(--border-color)',
                 boxShadow: (!['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#eab308'].includes(accentColor)) ? `0 0 10px ${accentColor}80` : 'none',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer', boxSizing: 'border-box'
                 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: (!['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#eab308'].includes(accentColor)) ? 1 : 0.6 }}>
                <path d="m2 22 1-1h3l9-9"/>
                <path d="M3 21v-3l9-9"/>
                <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Manager */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Manage Categories</h3>
        
        <div className="glass" style={{ 
          borderRadius: 'var(--radius-lg)', 
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)'
        }}>
          
          {/* Add Category Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>Add New Category</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={newCatIcon} 
                onChange={e => setNewCatIcon(e.target.value)} 
                style={{ width: '50px', textAlign: 'center', fontSize: '1.2rem', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                placeholder="🍔"
                maxLength={2}
              />
              <input 
                type="text" 
                value={newCatName} 
                onChange={e => setNewCatName(e.target.value)} 
                placeholder="Category Name"
                style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.95rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flex: '1 1 220px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '6px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                {[
                  { value: 'expense', label: 'Expense' },
                  { value: 'income', label: 'Income' },
                  { value: 'both', label: 'Both' }
                ].map(typeObj => (
                  <button 
                    key={typeObj.value}
                    onClick={() => setNewCatType(typeObj.value)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: '8px',
                      background: newCatType === typeObj.value ? 'var(--bg-secondary)' : 'transparent',
                      color: newCatType === typeObj.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: newCatType === typeObj.value ? 700 : 500,
                      boxShadow: newCatType === typeObj.value ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.3s', fontSize: '0.9rem'
                    }}
                  >
                    {typeObj.label}
                  </button>
                ))}
              </div>
              <button onClick={handleAddCategory} style={{ padding: '12px 24px', flex: '1 0 auto', background: 'var(--accent-primary-gradient)', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                Add
              </button>
            </div>
          </div>

          {/* List existing categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map(c => {
              if (editingCatId === c.id) {
                return (
                  <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={editCatIcon} 
                        onChange={e => setEditCatIcon(e.target.value)} 
                        style={{ width: '50px', textAlign: 'center', fontSize: '1.2rem', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                        maxLength={2}
                      />
                      <input 
                        type="text" 
                        value={editCatName} 
                        onChange={e => setEditCatName(e.target.value)} 
                        style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button onClick={cancelEditCategory} style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Cancel</button>
                      <button onClick={saveEditCategory} style={{ padding: '8px 16px', background: 'var(--accent-primary-gradient)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.9rem' }}>Save</button>
                    </div>
                  </div>
                );
              }

              return (
              <div key={c.id} style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '1.4rem', background: 'var(--bg-secondary)', width: '48px', height: '48px', minWidth: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>{c.icon}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{c.type}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => startEditCategory(c)} style={{ width: '36px', height: '36px', background: 'rgba(var(--accent-primary-rgb), 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s', padding: 0 }} aria-label="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button onClick={() => setCatToDelete(c.id)} style={{ width: '36px', height: '36px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-expense)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'all 0.2s', padding: 0 }} aria-label="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            )})}
          </div>

        </div>
      </div>

      {/* Data Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Data</h3>
        
        <div className="glass" style={{ 
          borderRadius: 'var(--radius-lg)', 
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)',
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--accent-expense)' }}>Danger Zone</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>This action will permanently delete all your tracking history. It cannot be undone.</p>
          </div>
          
          <button 
            onClick={() => setShowDeleteModal(true)}
            style={{
              padding: '16px', borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--accent-expense)',
              border: '1px solid var(--accent-expense)',
              fontWeight: 700, transition: 'all 0.3s',
              textAlign: 'center'
            }}
          >
            Clear All Data
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '350px',
            padding: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--accent-expense)'
          }}>
            <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700, color: 'var(--accent-expense)', textAlign: 'center' }}>Clear All Data?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', textAlign: 'center', lineHeight: '1.5' }}>
              Are you absolutely sure? This will wipe out all of your transactions and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={handleClearData} 
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-expense)', color: 'white', fontWeight: 600 }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showColorPicker && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '350px',
            padding: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 700, textAlign: 'center' }}>Custom Color</h3>
            
            <div style={{ marginBottom: '24px', width: '100%', display: 'flex', justifyContent: 'center' }}>
               <HexColorPicker color={accentColor} onChange={setAccentColor} style={{ width: '100%', height: '200px' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: accentColor, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}></div>
              <input 
                type="text" 
                value={accentColor} 
                onChange={(e) => setAccentColor(e.target.value)}
                style={{ flex: 1, padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <button 
              onClick={() => setShowColorPicker(false)} 
              style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--accent-primary-gradient)', color: 'white', fontWeight: 600, fontSize: '1rem', boxShadow: 'var(--shadow-sm)' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: 'var(--bg-primary)',
          padding: '12px 24px', borderRadius: 'var(--radius-xl)',
          fontSize: '0.95rem', fontWeight: 600, boxShadow: 'var(--shadow-lg)',
          zIndex: 1000, transition: 'all 0.3s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Delete Category Confirm Modal */}
      {catToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '350px',
            padding: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>Delete Category?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', textAlign: 'center', lineHeight: '1.5' }}>
              Are you sure you want to delete this category? Past transactions with this category will show as "Other".
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setCatToDelete(null)} 
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteCategory} 
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--accent-expense)', color: 'white', fontWeight: 600 }}
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

export default SettingsTab;
