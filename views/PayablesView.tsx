
import React, { useState, useEffect } from 'react';
import { Payable, User } from '../types';
import { Repository } from '../db/repository';
import { SyncManager } from '../sync/syncManager';
import { Sidebar } from '../components/Sidebar';

const payableRepo = new Repository<Payable>('payables');

export const PayablesView = ({ user, setView, isOnline }: any) => {
  const [payables, setPayables] = useState<Payable[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const all = await payableRepo.getAll();
    setPayables(all.sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
  };

  const handleAddPayable = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await payableRepo.save({
        supplierName: formData.get('fornecedor') as string,
        description: formData.get('descricao') as string,
        amount: parseFloat(formData.get('valor') as string),
        dueDate: formData.get('vencimento') as string,
        status: 'pending',
        notes: formData.get('notas') as string
      });
      
      setIsModalOpen(false);
      await loadData();
      SyncManager.processQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    await payableRepo.update(id, { status: 'paid' });
    await loadData();
    SyncManager.processQueue();
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display overflow-hidden text-white">
      <Sidebar activeView="payables" setView={setView} userName={user.name} handleLogout={() => { localStorage.removeItem('finmanager_user'); window.location.reload(); }} />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-8 gap-6">
        <div className="flex justify-between items-end border-b border-border-dark pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Contas a Pagar</h1>
            <p className="text-text-secondary">Gestão de obrigações e despesas</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-background-dark px-6 py-2.5 rounded-xl font-black text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 flex items-center gap-2">
            <span className="material-symbols-outlined">add_card</span>
            NOVA CONTA
          </button>
        </div>

        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#152a1d] text-text-secondary font-medium border-b border-border-dark">
              <tr>
                <th className="px-6 py-4">Vencimento</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark text-white">
              {payables.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-text-secondary italic">Nenhuma conta pendente registrada.</td></tr>
              ) : payables.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{new Date(p.dueDate).toLocaleDateString('pt-MZ')}</td>
                  <td className="px-6 py-4 font-bold">{p.supplierName}</td>
                  <td className="px-6 py-4">{p.description}</td>
                  <td className="px-6 py-4 text-right font-bold text-red-400">{p.amount.toLocaleString('pt-MZ')} MT</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${p.status === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {p.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status !== 'paid' && (
                      <button onClick={() => handleMarkAsPaid(p.id)} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors" title="Marcar como Pago">
                        <span className="material-symbols-outlined">check_circle</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-dark/80 backdrop-blur-sm p-4">
          <form onSubmit={handleAddPayable} className="bg-surface-dark w-full max-w-lg rounded-2xl border border-border-dark shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-dark bg-[#152a1d] flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Nova Conta a Pagar
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white" disabled={isSaving}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Fornecedor</label>
                <input required name="fornecedor" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:border-primary" placeholder="Nome da empresa..." disabled={isSaving} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Descrição do Gasto</label>
                <input required name="descricao" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:border-primary" placeholder="Ex: Fatura de Energia" disabled={isSaving} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Valor (MT)</label>
                  <input required name="valor" type="number" step="0.01" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:border-primary" placeholder="0.00" disabled={isSaving} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Vencimento</label>
                  <input required name="vencimento" type="date" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:border-primary" disabled={isSaving} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Observações (Opcional)</label>
                <textarea name="notas" className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:border-primary h-24 resize-none" disabled={isSaving}></textarea>
              </div>
            </div>
            <div className="p-6 bg-[#152a1d] border-t border-border-dark flex justify-end gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-sm font-bold text-text-secondary hover:text-white px-4" disabled={isSaving}>CANCELAR</button>
              <button type="submit" className="bg-primary text-background-dark px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-primary/20 disabled:opacity-50" disabled={isSaving}>
                {isSaving ? 'SALVANDO...' : 'SALVAR CONTA'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
