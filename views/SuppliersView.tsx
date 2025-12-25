
import React, { useState, useEffect, useMemo } from 'react';
import { Supplier, Purchase, User } from '../types';
import { Repository } from '../db/repository';
import { SyncManager } from '../sync/syncManager';
import { Sidebar } from '../components/Sidebar';

const supplierRepo = new Repository<Supplier>('suppliers');
const purchaseRepo = new Repository<Purchase>('purchases');

interface SuppliersViewProps {
  user: User;
  isOnline: boolean;
  setView: (view: any) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({ user, isOnline, setView }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { loadSuppliers(); }, []);
  useEffect(() => { if (selectedSupplierId) loadPurchases(selectedSupplierId); }, [selectedSupplierId]);

  const loadSuppliers = async () => {
    const all = await supplierRepo.getAll();
    setSuppliers(all.sort((a, b) => a.name.localeCompare(b.name)));
  };

  const loadPurchases = async (supplierId: string) => {
    const all = await purchaseRepo.getAll();
    setPurchases(all.filter(p => p.supplierId === supplierId).sort((a, b) => b.date.localeCompare(a.date)));
  };

  const handleAddSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await supplierRepo.save({
        name: formData.get('name') as string,
        representative: formData.get('representative') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        category: formData.get('category') as string,
        bankDetails: formData.get('bankDetails') as string,
        status: 'active'
      });
      
      form.reset();
      await loadSuppliers(); // Garante que a lista atualiza ANTES de liberar o formulário
      SyncManager.processQueue();
    } catch (err) {
      console.error("Erro ao salvar fornecedor:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.representative.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display overflow-hidden text-white">
      <Sidebar activeView="suppliers" setView={setView} userName={user.name} handleLogout={() => { localStorage.removeItem('finmanager_user'); window.location.reload(); }} />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-8 gap-6">
        <div className="flex justify-between items-end border-b border-border-dark pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Fornecedores</h1>
            <p className="text-text-secondary">Gestão de parceiros e suprimentos</p>
          </div>
          <div className={`text-[10px] font-bold px-2 py-1 rounded border ${isOnline ? 'text-primary border-primary/20 bg-primary/5' : 'text-orange-400 border-orange-400/20 bg-orange-400/5'}`}>
            {isOnline ? 'CONECTADO' : 'OFFLINE'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cadastro */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-border-dark bg-[#152a1d]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person_add</span> Novo Registro
                </h3>
              </div>
              <form onSubmit={handleAddSupplier} className="p-5 space-y-4">
                <input required name="name" className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:border-primary disabled:opacity-50" placeholder="Nome da Empresa" disabled={isLoading} />
                <input name="representative" className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50" placeholder="Representante" disabled={isLoading} />
                <input name="phone" className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50" placeholder="Telefone" disabled={isLoading} />
                <select name="category" className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white disabled:opacity-50" disabled={isLoading}>
                  <option value="mercearia">Mercearia</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="limpeza">Limpeza</option>
                </select>
                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-background-dark font-bold py-3 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                  {isLoading ? 'SALVANDO...' : 'SALVAR'}
                </button>
              </form>
            </div>
          </div>

          {/* Lista */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
             <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border-dark flex items-center gap-4">
                   <span className="material-symbols-outlined text-text-secondary">search</span>
                   <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent border-none text-white focus:ring-0 w-full" placeholder="Buscar fornecedor..." />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#152a1d] text-text-secondary">
                      <tr>
                        <th className="px-6 py-4">Empresa</th>
                        <th className="px-6 py-4">Categoria</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                      {filteredSuppliers.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-10 text-center text-text-secondary italic">Nenhum fornecedor encontrado.</td></tr>
                      ) : filteredSuppliers.map(s => (
                        <tr key={s.id} className={`hover:bg-white/5 cursor-pointer transition-colors ${selectedSupplierId === s.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`} onClick={() => setSelectedSupplierId(s.id)}>
                          <td className="px-6 py-4 font-bold">{s.name}</td>
                          <td className="px-6 py-4"><span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{s.category}</span></td>
                          <td className="px-6 py-4 text-center">
                            <span className="size-2 rounded-full bg-primary inline-block mr-2"></span>
                            Ativo
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>

             {selectedSupplier && (
               <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden animate-in slide-in-from-bottom-2">
                 <div className="p-4 border-b border-border-dark bg-[#152a1d] flex justify-between items-center">
                   <h3 className="font-bold">Histórico: {selectedSupplier.name}</h3>
                   <button onClick={() => setSelectedSupplierId(null)} className="text-text-secondary hover:text-white"><span className="material-symbols-outlined">close</span></button>
                 </div>
                 <div className="p-6 text-center text-text-secondary italic text-sm">Nenhuma compra registrada para este fornecedor.</div>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};
