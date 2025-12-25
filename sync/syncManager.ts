
import { SyncAction } from '../types';
import { getStore } from '../db/database';
import { Repository } from '../db/repository';

export class SyncManager {
  private static isSyncing = false;

  static async processQueue() {
    if (this.isSyncing || !navigator.onLine) return;
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

      console.log(`Sincronizando ${actions.length} ações...`);

      for (const action of actions) {
        try {
          // Simulate backend call
          await this.sendToBackend(action);
          
          // Update local entity status to 'synced'
          const repo = new Repository<any>(action.entityName);
          await repo.updateStatus(action.entityId, 'synced');

          // Remove from queue
          const store = await getStore('sync_queue', 'readwrite');
          await new Promise((resolve, reject) => {
            const request = store.delete(action.id);
            request.onsuccess = () => resolve(null);
            request.onerror = () => reject(request.error);
          });
        } catch (err) {
          console.error(`Falha ao sincronizar ação ${action.id}:`, err);
          // Keep in queue to retry later
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  private static async sendToBackend(action: SyncAction) {
    // Em um cenário real, aqui seria o fetch('/api/sync', ...)
    // Para este desafio, simulamos uma latência de rede
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}

// Auto-trigger sync on reconnect
window.addEventListener('online', () => {
  SyncManager.processQueue();
});
