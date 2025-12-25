
import React from 'react';
import { User } from '../types';
import { Sidebar } from '../components/Sidebar';

export const ReportsView = ({ user, setView }: any) => {
  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display overflow-hidden text-white">
      <Sidebar activeView="reports" setView={setView} userName={user.name} handleLogout={() => { localStorage.removeItem('finmanager_user'); window.location.reload(); }} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Relatórios Financeiros</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-surface-dark border border-border-dark p-6 rounded-xl">
              <h3 className="font-bold text-primary mb-2">Vendas por Período</h3>
              <div className="h-40 bg-background-dark/50 rounded flex items-end justify-around p-4 gap-2">
                 {[40, 70, 45, 90, 65, 80].map((h, i) => <div key={i} className="bg-primary/40 w-full rounded-t" style={{height: `${h}%`}}></div>)}
              </div>
           </div>
           <div className="bg-surface-dark border border-border-dark p-6 rounded-xl">
              <h3 className="font-bold text-red-400 mb-2">Despesas por Categoria</h3>
              <div className="space-y-3 pt-4">
                 <div className="flex justify-between text-xs"><span>Aluguel</span><span>45%</span></div>
                 <div className="w-full bg-background-dark rounded-full h-1.5"><div className="bg-red-400 h-1.5 rounded-full" style={{width: '45%'}}></div></div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};
