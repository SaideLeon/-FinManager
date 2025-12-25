
import React, { useState, useEffect } from 'react';
import { CashSession, User } from '../types';
import { Repository } from '../db/repository';
import { SyncManager } from '../sync/syncManager';
import { Sidebar } from '../components/Sidebar';

const sessionRepo = new Repository<CashSession>('cash_sessions');

export const CashierView = ({ user, setView, isOnline }: any) => {
  const [activeSession, setActiveSession] = useState<CashSession | null>(null);
  const [isOpeningModal, setIsOpeningModal] = useState(false);

  useEffect(() => { loadSession(); }, []);

  const loadSession = async () => {
    const all = await sessionRepo.getAll();
    const open = all.find(s => s.status === 'open');
    setActiveSession(open || null);
  };

  const handleOpenCash = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await sessionRepo.save({
      operatorName: user.name,
      openingBalance: parseFloat(formData.get('saldo') as string),
      status: 'open',
      openingTime: new Date().toISOString(),
      notes: formData.get('notas') as string
    });
    setIsOpeningModal(false);
    loadSession();
    SyncManager.processQueue();
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display overflow-hidden text-white">
      <Sidebar activeView="cashier" setView={setView} userName={user.name} handleLogout={() => { localStorage.removeItem('finmanager_user'); window.location.reload(); }} />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-8 gap-6">
        <div className="flex justify-between items-end border-b border-border-dark pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Caixa Diário</h1>
            <p className="text-text-secondary">Controle de entradas e saídas do dia</p>
          </div>
          {activeSession && (
             <div className="flex items-center gap-3">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-text-secondary uppercase">Sessão Ativa</p>
                  <p className="text-xs font-bold text-white">{new Date(activeSession.openingTime).toLocaleTimeString()}</p>
               </div>
               <button className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500/30 transition-all">FECHAR CAIXA</button>
             </div>
          )}
        </div>

        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
             <div className="size-24 rounded-full bg-surface-dark border border-border-dark flex items-center justify-center text-primary shadow-2xl">
                <span className="material-symbols-outlined text-5xl">lock_open</span>
             </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-bold">O Caixa está Fechado</h2>
                <p className="text-text-secondary max-w-sm">Para começar a registrar vendas e movimentações, você precisa abrir uma nova sessão de caixa.</p>
             </div>
             <button onClick={() => setIsOpeningModal(true)} className="bg-primary text-background-dark px-10 py-4 rounded-2xl font-black text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                ABRIR CAIXA AGORA
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-surface-dark border border-border-dark rounded-xl p-8 flex flex-col items-center gap-4 text-center">
                  <span className="material-symbols-outlined text-5xl text-primary">point_of_sale</span>
                  <h3 className="text-xl font-bold">Vendas e Movimentações</h3>
                  <p className="text-text-secondary text-sm">O módulo de vendas rápidas está sendo inicializado offline...</p>
                  <button className="bg-primary text-background-dark px-6 py-2 rounded-xl font-bold text-sm">+ Nova Venda</button>
               </div>
            </div>
            <div className="space-y-6">
               <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                  <h4 className="text-xs font-bold text-text-secondary uppercase mb-4 tracking-widest">Resumo do Caixa</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between border-b border-border-dark pb-2">
                        <span className="text-sm text-gray-400">Saldo Inicial</span>
                        <span className="text-sm font-bold text-white">{activeSession.openingBalance.toLocaleString('pt-MZ')} MT</span>
                     </div>
                     <div className="flex justify-between border-b border-border-dark pb-2">
                        <span className="text-sm text-gray-400">Vendas (Dinheiro)</span>
                        <span className="text-sm font-bold text-primary">0,00 MT</span>
                     </div>
                     <div className="flex justify-between pt-2">
                        <span className="text-base font-black text-white">Total em Caixa</span>
                        <span className="text-base font-black text-primary">{activeSession.openingBalance.toLocaleString('pt-MZ')} MT</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Abertura */}
      {isOpeningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/80 backdrop-blur-sm p-4">
          <form onSubmit={handleOpenCash} className="bg-surface-dark w-full max-w-md rounded-2xl border border-border-dark shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-dark bg-[#152a1d] flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">key</span>
                Abrir Caixa Diário
              </h3>
              <button type="button" onClick={() => setIsOpeningModal(false)} className="text-text-secondary hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Saldo Inicial em Dinheiro</label>
                <input required name="saldo" type="number" step="0.01" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white text-lg font-bold focus:border-primary" placeholder="0.00" autoFocus />
                <p className="text-[10px] text-gray-500 pl-1 mt-1 italic">Informe o valor de "fundo de troco" presente na gaveta.</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Observações da Abertura</label>
                <textarea name="notas" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:border-primary h-20 resize-none"></textarea>
              </div>
            </div>
            <div className="p-6 bg-[#152a1d] border-t border-border-dark">
              <button type="submit" className="w-full bg-primary text-background-dark py-4 rounded-xl font-black text-base shadow-lg shadow-primary/20">CONFIRMAR ABERTURA</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
