import { useState, useEffect, useCallback } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

import HomeTab from './tabs/HomeTab';
import SettingsTab from './tabs/SettingsTab';
import StatsTab from './tabs/StatsTab';
import AllTab from './tabs/AllTab';
import EntrySheet from './components/EntrySheet';

// SVG Icons
const Icons = {
  Home: () => <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  Stats: () => <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>,
  All: () => <svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  Add: () => <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
};

const DEFAULT_CATEGORIES = [
  { id: 'food', icon: '🍔', name: 'Food', type: 'expense' },
  { id: 'transport', icon: '🚕', name: 'Transport', type: 'expense' },
  { id: 'shopping', icon: '🛍️', name: 'Shopping', type: 'expense' },
  { id: 'bills', icon: '📄', name: 'Bills', type: 'expense' },
  { id: 'salary', icon: '💼', name: 'Salary', type: 'income' },
  { id: 'gift', icon: '🎁', name: 'Gifts', type: 'both' },
];

function App() {
  const [theme, setTheme] = useLocalStorage('app-theme', 'system');
  const [activeTab, setActiveTab] = useLocalStorage('app-active-tab', 'home');
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [transactions, setTransactions] = useLocalStorage('app-transactions', []);
  const [categories, setCategories] = useLocalStorage('app-categories', DEFAULT_CATEGORIES);
  const [goals, setGoals] = useLocalStorage('app-goals', []);
  const [accentColor, setAccentColor] = useLocalStorage('app-accent', '#10b981');

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync accent color
  useEffect(() => {
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '16, 185, 129';
    };

    if (accentColor) {
      const rgb = hexToRgb(accentColor);
      document.documentElement.style.setProperty('--accent-primary', accentColor);
      document.documentElement.style.setProperty('--accent-primary-rgb', rgb);
      document.documentElement.style.setProperty('--accent-primary-gradient', `linear-gradient(135deg, ${accentColor} 0%, rgba(${rgb}, 0.7) 100%)`);
      document.documentElement.style.setProperty('--accent-hover', accentColor);
    }
  }, [accentColor]);

  // History API for Android Back Button behavior
  useEffect(() => {
    const handlePopState = (event) => {
      // If entry is open, popstate means user clicked back button
      if (isEntryOpen) {
        setIsEntryOpen(false);
      } else if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Native Capacitor Back Button Intercept
    let backListener;
    const setupNativeBack = async () => {
      backListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });
    };
    setupNativeBack();

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (backListener && backListener.remove) backListener.remove();
    };
  }, [isEntryOpen]);

  // Safe navigation function
  const navigateTo = useCallback((tab) => {
    if (tab !== activeTab) {
      window.history.pushState({ tab }, '', `#${tab}`);
      setActiveTab(tab);
    }
  }, [activeTab]);

  const openEntry = useCallback(() => {
    window.history.pushState({ panel: 'entry' }, '', '#entry');
    setIsEntryOpen(true);
  }, []);

  const closeEntry = useCallback(() => {
    if (isEntryOpen) {
      // Trigger popstate so history stays clean
      window.history.back();
    }
  }, [isEntryOpen]);

  const handleSaveEntry = (entry) => {
    setTransactions(prev => [entry, ...prev]);
  };

  // Initial state setup on mount
  useEffect(() => {
    window.history.replaceState({ tab: 'home' }, '', '#home');
  }, []);

  const renderTab = () => {
    switch(activeTab) {
      case 'home': return <HomeTab transactions={transactions} categories={categories} goals={goals} setGoals={setGoals} />;
      case 'stats': return <StatsTab transactions={transactions} categories={categories} />;
      case 'all': return <AllTab transactions={transactions} categories={categories} />;
      case 'settings': return <SettingsTab theme={theme} setTheme={setTheme} accentColor={accentColor} setAccentColor={setAccentColor} categories={categories} setCategories={setCategories} setTransactions={setTransactions} />;
      default: return <HomeTab transactions={transactions} categories={categories} />;
    }
  };

  return (
    <div className="app-container">
      <div className="content-area">
        {renderTab()}
      </div>

      <EntrySheet isOpen={isEntryOpen} onClose={closeEntry} onSave={handleSaveEntry} categories={categories} />

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>
          <Icons.Home />
          <span>Home</span>
        </button>
        <button className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => navigateTo('stats')}>
          <Icons.Stats />
          <span>Stats</span>
        </button>

        <button className="fab" onClick={openEntry} aria-label="Add entry">
          <Icons.Add />
        </button>

        <button className={`nav-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => navigateTo('all')}>
          <Icons.All />
          <span>All</span>
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => navigateTo('settings')}>
          <Icons.Settings />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
