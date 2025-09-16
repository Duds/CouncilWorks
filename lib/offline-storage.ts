/**
 * Offline Storage Service
 * Handles IndexedDB operations for offline data storage and synchronization
 */

interface OfflineInspection {
  id: string;
  assetId: string;
  assetName: string;
  inspectionType: string;
  inspectionDate: string;
  condition: string;
  notes?: string;
  photos?: string[];
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: string;
  syncedAt?: string;
}

interface OfflineAsset {
  id: string;
  name: string;
  assetNumber: string;
  assetType: string;
  condition: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  lastSync: string;
  syncStatus: 'pending' | 'synced' | 'failed';
}

interface OfflineMaintenance {
  id: string;
  assetId: string;
  workOrderNumber: string;
  title: string;
  description: string;
  scheduledDate: string;
  dueDate: string;
  priority: string;
  status: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: string;
}

class OfflineStorageService {
  private dbName = 'AegridOffline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create inspections store
        if (!db.objectStoreNames.contains('inspections')) {
          const inspectionsStore = db.createObjectStore('inspections', { keyPath: 'id' });
          inspectionsStore.createIndex('assetId', 'assetId', { unique: false });
          inspectionsStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          inspectionsStore.createIndex('inspectionDate', 'inspectionDate', { unique: false });
        }

        // Create assets store
        if (!db.objectStoreNames.contains('assets')) {
          const assetsStore = db.createObjectStore('assets', { keyPath: 'id' });
          assetsStore.createIndex('assetType', 'assetType', { unique: false });
          assetsStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        // Create maintenance store
        if (!db.objectStoreNames.contains('maintenance')) {
          const maintenanceStore = db.createObjectStore('maintenance', { keyPath: 'id' });
          maintenanceStore.createIndex('assetId', 'assetId', { unique: false });
          maintenanceStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          maintenanceStore.createIndex('scheduledDate', 'scheduledDate', { unique: false });
        }

        // Create sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('status', 'status', { unique: false });
        }
      };
    });
  }

  // Inspection methods
  async saveInspection(inspection: Omit<OfflineInspection, 'id' | 'syncStatus' | 'createdAt'>): Promise<string> {
    await this.ensureDB();
    
    const id = `inspection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullInspection: OfflineInspection = {
      ...inspection,
      id,
      syncStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inspections'], 'readwrite');
      const store = transaction.objectStore('inspections');
      const request = store.add(fullInspection);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getInspections(): Promise<OfflineInspection[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inspections'], 'readonly');
      const store = transaction.objectStore('inspections');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getInspectionsByAsset(assetId: string): Promise<OfflineInspection[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inspections'], 'readonly');
      const store = transaction.objectStore('inspections');
      const index = store.index('assetId');
      const request = index.getAll(assetId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingInspections(): Promise<OfflineInspection[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inspections'], 'readonly');
      const store = transaction.objectStore('inspections');
      const index = store.index('syncStatus');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateInspectionSyncStatus(id: string, status: 'synced' | 'failed'): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['inspections'], 'readwrite');
      const store = transaction.objectStore('inspections');
      const request = store.get(id);

      request.onsuccess = () => {
        const inspection = request.result;
        if (inspection) {
          inspection.syncStatus = status;
          inspection.syncedAt = new Date().toISOString();
          
          const updateRequest = store.put(inspection);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Inspection not found'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Asset methods
  async saveAsset(asset: Omit<OfflineAsset, 'lastSync' | 'syncStatus'>): Promise<string> {
    await this.ensureDB();
    
    const fullAsset: OfflineAsset = {
      ...asset,
      lastSync: new Date().toISOString(),
      syncStatus: 'synced',
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readwrite');
      const store = transaction.objectStore('assets');
      const request = store.put(fullAsset);

      request.onsuccess = () => resolve(asset.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getAssets(): Promise<OfflineAsset[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readonly');
      const store = transaction.objectStore('assets');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAssetById(id: string): Promise<OfflineAsset | null> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['assets'], 'readonly');
      const store = transaction.objectStore('assets');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Maintenance methods
  async saveMaintenance(maintenance: Omit<OfflineMaintenance, 'id' | 'syncStatus' | 'createdAt'>): Promise<string> {
    await this.ensureDB();
    
    const id = `maintenance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullMaintenance: OfflineMaintenance = {
      ...maintenance,
      id,
      syncStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['maintenance'], 'readwrite');
      const store = transaction.objectStore('maintenance');
      const request = store.add(fullMaintenance);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getMaintenanceByAsset(assetId: string): Promise<OfflineMaintenance[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['maintenance'], 'readonly');
      const store = transaction.objectStore('maintenance');
      const index = store.index('assetId');
      const request = index.getAll(assetId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync methods
  async addToSyncQueue(type: 'inspection' | 'maintenance', data: any): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.add({
        type,
        data,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<any[]> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue(): Promise<void> {
    await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Utility methods
  async getStorageInfo(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
      };
    }
    return { used: 0, available: 0 };
  }

  async clearAllData(): Promise<void> {
    await this.ensureDB();
    
    const stores = ['inspections', 'assets', 'maintenance', 'syncQueue'];
    const promises = stores.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    await Promise.all(promises);
  }

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();

// Export types
export type { OfflineInspection, OfflineAsset, OfflineMaintenance };
