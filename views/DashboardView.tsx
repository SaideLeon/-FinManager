
import React, { useState, useEffect, useMemo } from 'react';
import { User, Sale } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Repository } from '../db/repository';

const salesRepo = new Repository<Sale>('sales');

export const DashboardView = ({ user, setView }: any) => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    salesRepo.getAll().then(setSales);
  }, []);

  const stats = useMemo(() => {
    const total = sales.reduce((acc, curr) => acc + curr.total, 0);
    return { totalBalance: total };
  }, [sales]);

  const handleLogout = () => {
    localStorage.removeItem('finmanager_user');
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display overflow-hidden text-white">
      <Sidebar activeView="dashboard" setView={setView} userName={user.name} handleLogout={handleLogout} />
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-white text-3xl font-black">Olá, {user.name.split(' ')[0]}</h1>
            <p className="text-text-secondary">Dashboard financeiro unificado.</p>
          </div>
          <button onClick={() => setView('cashier')} className="px-6 py-2 bg-primary text-background-dark rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-hover shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">point_of_sale</span> Caixa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon="account_balance_wallet" label="Saldo Total" value={`${stats.totalBalance.toLocaleString('pt-MZ')} MT`} trend="+5%" color="primary" />
          <StatCard icon="shopping_cart" label="Vendas (Hoje)" value="0 MT" trend="0 transações" color="primary" />
          <StatCard icon="payments" label="Contas Pendentes" value="0 MT" trend="0%" color="red" />
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }: any) => (
  <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all">
    <div className="flex justify-between mb-4">
      <div className={`p-2 rounded-lg bg-background-dark ${color === 'red' ? 'text-red-400' : 'text-primary'}`}><span className="material-symbols-outlined">{icon}</span></div>
      <span className="text-[10px] font-black px-2 py-1 rounded-full bg-white/5">{trend}</span>
    </div>
    <p className="text-text-secondary text-sm mb-1">{label}</p>
    <p className="text-white text-2xl font-black">{value}</p>
  </div>
);
