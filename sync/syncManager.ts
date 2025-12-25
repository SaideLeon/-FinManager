
import { SyncAction } from '../types';
import { getStore } from '../db/database';
import { Repository } from '../db/repository';
import { supabase } from '../lib/supabase';

export class SyncManager {
  private static isSyncing = false;

  static async processQueue() {
    if (this.isSyncing || !navigator.onLine) return;

    // Verificar se existe um usuário logado no Supabase para taguear os dados
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    this.isSyncing = true;

    try {
      const syncStore = await getStore('sync_queue', 'readwrite');
      const actions: SyncAction[] = await new Promise((resolve, reject) => {
        const request = syncStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (actions.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`[Sync] Processando ${actions.length} pendências para Supabase...`);

      for (const action of actions) {
        try {
          await this.sendToBackend(action, session.user.id);
          
          // Atualizar entidade local como sincronizada
          const repo = new Repository<any>(action.entityName);
          await repo.update(action.entityId, { syncStatus: 'synced' });

          // Remover da fila de sincronização
          const store = await getStore('sync_queue', 'readwrite');
          await new Promise((resolve, reject) => {
            const request = store.delete(action.id);
            request.onsuccess = () => resolve(null);
            request.onerror = () => reject(request.error);
          });
        } catch (err) {
          console.error(`[Sync] Erro na ação ${action.id}:`, err);
          // Interrompe o loop se for erro de rede, mantém na fila
          if (!navigator.onLine) break;
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private static async sendToBackend(action: SyncAction, userId: string) {
    // Adicionamos o user_id ao payload para segurança RLS no Supabase
    const payloadWithUser = { 
      ...action.payload, 
      user_id: userId,
      // Garantir que campos de data do IndexedDB não conflitem com os do Supabase se necessário
      updated_at: new Date().toISOString() 
    };

    if (action.action === 'DELETE') {
      const { error } = await supabase
        .from(action.entityName)
        .delete()
        .eq('id', action.entityId)
        .eq('user_id', userId);
      
      if (error) throw error;
    } else {
      // CREATE ou UPDATE usamos upsert (insert or update based on ID)
      const { error } = await supabase
        .from(action.entityName)
        .upsert(payloadWithUser);

      if (error) throw error;
    }
  }
}

// Escutar mudanças de rede
window.addEventListener('online', () => {
  SyncManager.processQueue();
});
