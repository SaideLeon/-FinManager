
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
import { supabase } from './lib/supabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'reports' | 'cashier' | 'receivables' | 'payables' | 'suppliers'>('dashboard');
  const [unauthView, setUnauthView] = useState<'landing' | 'auth'>('landing');
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'register'>('login');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    // Verificar sessão ativa no Supabase
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fix: Cast as User to ensure syncStatus matches literal type constraints
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || 'Usuário',
          email: session.user.email!,
          createdAt: session.user.created_at,
          updatedAt: new Date().toISOString(),
          syncStatus: 'synced'
        } as User);
      } else {
        // Tentar recuperar do localStorage se estiver offline (cache local)
        const savedUser = localStorage.getItem('finmanager_user');
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch (e) {
            localStorage.removeItem('finmanager_user');
          }
        }
      }
      setIsInitializing(false);
      SyncManager.processQueue();
    }

    checkSession();

    // Ouvir mudanças na autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Fix: Explicitly type as User to avoid 'syncStatus: string' error on line 69
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || 'Usuário',
          email: session.user.email!,
          createdAt: session.user.created_at,
          updatedAt: new Date().toISOString(),
          syncStatus: 'synced'
        };
        setCurrentUser(user);
        localStorage.setItem('finmanager_user', JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('finmanager_user');
      }
    });

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
      subscription.unsubscribe();
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

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full bg-background-dark items-center justify-center">
        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
