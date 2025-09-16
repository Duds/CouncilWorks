import { LocalDocumentStorage } from './local-storage';

export interface StorageConfig {
  provider: 'local' | 'azure';
  connectionString?: string;
  containerName?: string;
}

export interface UploadResult {
  fileName: string;
  filePath: string;
  publicUrl: string;
  fileSize: number;
  mimeType: string;
  storageTier?: string;
  compressed?: boolean;
  thumbnailPath?: string;
}

export interface StorageStats {
  totalSize: number;
  fileCount: number;
  assetsWithDocuments: number;
  monthlyCost?: number;
}

/**
 * Storage Service Abstraction
 * Handles document storage with support for local development and Azure production
 */
export class StorageService {
  private localStorage: LocalDocumentStorage;
  private config: StorageConfig;

  constructor(config: StorageConfig = { provider: 'local' }) {
    this.config = config;
    this.localStorage = new LocalDocumentStorage();
  }

  /**
   * Initialize storage service
   */
  async initialize(): Promise<void> {
    if (this.config.provider === 'local') {
      await this.localStorage.initialize();
    }
    // Azure initialization would go here
  }

  /**
   * Upload a file
   */
  async uploadFile(
    file: File,
    assetId: string,
    documentType: string,
    options: {
      generateThumbnail?: boolean;
      compress?: boolean;
      maxSize?: number;
    } = {}
  ): Promise<UploadResult> {
    // Validate file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${options.maxSize} bytes`);
    }

    // Validate file type
    if (!this.isAllowedFileType(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    if (this.config.provider === 'local') {
      return await this.localStorage.uploadFile(file, assetId, documentType);
    } else {
      // Azure upload implementation would go here
      throw new Error('Azure storage not implemented yet');
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(assetId: string, fileName: string): Promise<void> {
    if (this.config.provider === 'local') {
      return await this.localStorage.deleteFile(assetId, fileName);
    } else {
      // Azure delete implementation would go here
      throw new Error('Azure storage not implemented yet');
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(assetId: string, fileName: string) {
    if (this.config.provider === 'local') {
      return await this.localStorage.getFileInfo(assetId, fileName);
    } else {
      // Azure file info implementation would go here
      throw new Error('Azure storage not implemented yet');
    }
  }

  /**
   * List files for an asset
   */
  async listFiles(assetId: string): Promise<string[]> {
    if (this.config.provider === 'local') {
      return await this.localStorage.listFiles(assetId);
    } else {
      // Azure list files implementation would go here
      throw new Error('Azure storage not implemented yet');
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<StorageStats> {
    if (this.config.provider === 'local') {
      const stats = await this.localStorage.getStorageStats();
      return {
        ...stats,
        monthlyCost: this.calculateLocalStorageCost(stats.totalSize),
      };
    } else {
      // Azure storage stats implementation would go here
      throw new Error('Azure storage not implemented yet');
    }
  }

  /**
   * Generate thumbnail for images
   */
  async generateThumbnail(
    assetId: string,
    fileName: string,
    size: number = 150
  ): Promise<string | null> {
    if (this.config.provider === 'local') {
      return await this.localStorage.generateThumbnail(assetId, fileName, size);
    } else {
      // Azure thumbnail generation would go here
      throw new Error('Azure storage not implemented yet');
    }
  }

  /**
   * Validate file type
   */
  private isAllowedFileType(mimeType: string): boolean {
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Text files
      'text/plain',
      'text/csv',
      
      // Archives
      'application/zip',
      'application/x-rar-compressed',
      
      // CAD/Drawing files
      'application/dwg',
      'application/vnd.dwg',
      
      // Video (for inspections)
      'video/mp4',
      'video/quicktime',
    ];

    return allowedTypes.includes(mimeType);
  }

  /**
   * Calculate estimated local storage cost (for development)
   */
  private calculateLocalStorageCost(sizeInBytes: number): number {
    // Rough estimate based on Azure pricing
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    const costPerGB = 0.0184; // Azure hot tier pricing
    return sizeInGB * costPerGB;
  }

  /**
   * Get storage provider info
   */
  getProviderInfo(): { provider: string; isLocal: boolean } {
    return {
      provider: this.config.provider,
      isLocal: this.config.provider === 'local',
    };
  }
}

// Singleton instance with environment-based configuration
export const storageService = new StorageService({
  provider: process.env.STORAGE_PROVIDER === 'azure' ? 'azure' : 'local',
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'documents',
});
