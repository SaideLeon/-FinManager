
import React, { useState, useEffect } from 'react';
import { User } from './types';
import { SyncManager } from './sync/syncManager';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { SuppliersView } from './views/SuppliersView';
import { PayablesView } from './views/PayablesView';
import { ReceivablesView } from './views/ReceivablesView';
import { CashierView } from './views/CashierView';
import { ReportsView } from './views/ReportsView';
import { LandingView } from './views/LandingView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'reports' | 'cashier' | 'receivables' | 'payables' | 'suppliers'>('dashboard');
  const [unauthView, setUnauthView] = useState<'landing' | 'auth'>('landing');
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'register'>('login');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    const savedUser = localStorage.getItem('finmanager_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('finmanager_user');
      }
    }

    SyncManager.processQueue();
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('finmanager_user', JSON.stringify(user));
    setView('dashboard');
  };

  const startAuth = (mode: 'login' | 'register' = 'login') => {
    setInitialAuthMode(mode);
    setUnauthView('auth');
  };

  if (!currentUser) {
    if (unauthView === 'landing') {
      return <LandingView onStartAuth={startAuth} />;
    }
    return (
      <AuthView 
        onLoginSuccess={handleLoginSuccess} 
        isOnline={isOnline} 
        initialMode={initialAuthMode}
        onBack={() => setUnauthView('landing')}
      />
    );
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView user={currentUser} setView={setView} />;
      case 'suppliers': return <SuppliersView user={currentUser} isOnline={isOnline} setView={setView} />;
      case 'payables': return <PayablesView user={currentUser} isOnline={isOnline} setView={setView} />;
      case 'receivables': return <ReceivablesView user={currentUser} isOnline={isOnline} setView={setView} />;
      case 'cashier': return <CashierView user={currentUser} isOnline={isOnline} setView={setView} />;
      case 'reports': return <ReportsView user={currentUser} setView={setView} />;
      default: return <DashboardView user={currentUser} setView={setView} />;
    }
  };

  return renderView();
}
