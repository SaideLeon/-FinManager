
import React from 'react';

interface SidebarProps {
  activeView: string;
  setView: (view: any) => void;
  userName: string;
  handleLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, userName, handleLogout }) => {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border-dark bg-background-dark shrink-0">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-primary/20 flex items-center justify-center rounded-xl size-10 ring-1 ring-primary/30">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold tracking-tight">FinManager</h1>
              <p className="text-text-secondary text-xs">{userName}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            <NavItem icon="dashboard" label="Visão Geral" active={activeView === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavItem icon="storefront" label="Caixa Diário" active={activeView === 'cashier'} onClick={() => setView('cashier')} />
            <NavItem icon="payments" label="Contas a Pagar" active={activeView === 'payables'} onClick={() => setView('payables')} />
            <NavItem icon="group" label="Contas a Receber" active={activeView === 'receivables'} onClick={() => setView('receivables')} />
            <NavItem icon="business_center" label="Fornecedores" active={activeView === 'suppliers'} onClick={() => setView('suppliers')} />
            <NavItem icon="analytics" label="Relatórios" active={activeView === 'reports'} onClick={() => setView('reports')} />
          </nav>
        </div>

        <div className="px-2">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-text-secondary hover:bg-surface-dark hover:text-white'}`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);
