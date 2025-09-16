/**
 * Advanced Azure Blob Storage Features
 * 
 * Implements advanced document management features using Azure Blob Storage
 * 
 * @fileoverview Advanced Azure Blob Storage document management
 */

import { BlobServiceClient, ContainerClient, BlobClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

export interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
  uploadedBy: string;
  organisationId: string;
  tags: string[];
  version: number;
  checksum: string;
  thumbnailUrl?: string;
  previewUrl?: string;
}

export interface StorageConfig {
  connectionString: string;
  containerName: string;
  enableVersioning: boolean;
  enableSoftDelete: boolean;
  retentionPolicy: {
    enabled: boolean;
    days: number;
  };
  accessTier: 'Hot' | 'Cool' | 'Archive';
  enableEncryption: boolean;
}

export interface SearchCriteria {
  name?: string;
  type?: string;
  tags?: string[];
  uploadedBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
}

export interface DocumentAnalytics {
  totalDocuments: number;
  totalSize: number;
  documentsByType: Record<string, number>;
  documentsByUser: Record<string, number>;
  storageUsage: {
    hot: number;
    cool: number;
    archive: number;
  };
  costAnalysis: {
    monthly: number;
    yearly: number;
    breakdown: Record<string, number>;
  };
}

export class AdvancedBlobStorage {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
    this.blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);
    this.containerClient = this.blobServiceClient.getContainerClient(config.containerName);
  }

  /**
   * Upload document with metadata
   */
  async uploadDocument(
    file: Buffer | Uint8Array | ArrayBuffer,
    metadata: Omit<DocumentMetadata, 'id' | 'uploadedAt' | 'version' | 'checksum'>,
    options?: {
      generateThumbnail?: boolean;
      generatePreview?: boolean;
      compress?: boolean;
    }
  ): Promise<DocumentMetadata> {
    const id = this.generateDocumentId();
    const version = 1;
    const checksum = await this.calculateChecksum(file);
    const blobName = this.generateBlobName(id, metadata.name);

    // Upload main document
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    await blobClient.upload(file, file.byteLength, {
      blobHTTPHeaders: {
        blobContentType: metadata.contentType,
      },
      metadata: {
        id,
        name: metadata.name,
        type: metadata.type,
        size: metadata.size.toString(),
        uploadedBy: metadata.uploadedBy,
        organisationId: metadata.organisationId,
        tags: metadata.tags.join(','),
        version: version.toString(),
        checksum,
      },
    });

    // Generate thumbnail if requested
    let thumbnailUrl: string | undefined;
    if (options?.generateThumbnail && this.isImage(metadata.contentType)) {
      thumbnailUrl = await this.generateThumbnail(blobClient, id);
    }

    // Generate preview if requested
    let previewUrl: string | undefined;
    if (options?.generatePreview) {
      previewUrl = await this.generatePreview(blobClient, id);
    }

    // Compress if requested
    if (options?.compress) {
      await this.compressDocument(blobClient);
    }

    return {
      id,
      name: metadata.name,
      type: metadata.type,
      size: metadata.size,
      contentType: metadata.contentType,
      uploadedAt: new Date(),
      uploadedBy: metadata.uploadedBy,
      organisationId: metadata.organisationId,
      tags: metadata.tags,
      version,
      checksum,
      thumbnailUrl,
      previewUrl,
    };
  }

  /**
   * Download document
   */
  async downloadDocument(id: string): Promise<{
    data: Buffer;
    metadata: DocumentMetadata;
  }> {
    const blobName = this.generateBlobName(id);
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    
    const downloadResponse = await blobClient.download();
    const data = await this.streamToBuffer(downloadResponse.readableStreamBody!);
    
    const metadata = await this.getDocumentMetadata(id);
    
    return { data, metadata };
  }

  /**
   * Search documents
   */
  async searchDocuments(criteria: SearchCriteria): Promise<DocumentMetadata[]> {
    const documents: DocumentMetadata[] = [];
    
    for await (const blob of this.containerClient.listBlobsFlat()) {
      if (blob.metadata) {
        const metadata = this.parseBlobMetadata(blob.metadata);
        
        if (this.matchesCriteria(metadata, criteria)) {
          documents.push(metadata);
        }
      }
    }
    
    return documents;
  }

  /**
   * Get document analytics
   */
  async getDocumentAnalytics(organisationId: string): Promise<DocumentAnalytics> {
    const documents: DocumentMetadata[] = [];
    const storageUsage = { hot: 0, cool: 0, archive: 0 };
    const documentsByType: Record<string, number> = {};
    const documentsByUser: Record<string, number> = {};
    
    for await (const blob of this.containerClient.listBlobsFlat()) {
      if (blob.metadata?.organisationId === organisationId) {
        const metadata = this.parseBlobMetadata(blob.metadata);
        documents.push(metadata);
        
        // Count by type
        documentsByType[metadata.type] = (documentsByType[metadata.type] || 0) + 1;
        
        // Count by user
        documentsByUser[metadata.uploadedBy] = (documentsByUser[metadata.uploadedBy] || 0) + 1;
        
        // Calculate storage usage
        const accessTier = blob.properties.accessTier || 'Hot';
        storageUsage[accessTier.toLowerCase() as keyof typeof storageUsage] += metadata.size;
      }
    }
    
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
    
    // Calculate cost analysis (simplified)
    const costAnalysis = this.calculateCostAnalysis(storageUsage);
    
    return {
      totalDocuments,
      totalSize,
      documentsByType,
      documentsByUser,
      storageUsage,
      costAnalysis,
    };
  }

  /**
   * Delete document
   */
  async deleteDocument(id: string, softDelete: boolean = true): Promise<void> {
    const blobName = this.generateBlobName(id);
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    
    if (softDelete && this.config.enableSoftDelete) {
      // Move to deleted container
      const deletedContainer = this.blobServiceClient.getContainerClient('deleted-documents');
      await deletedContainer.createIfNotExists();
      
      const deletedBlob = deletedContainer.getBlockBlobClient(blobName);
      await deletedBlob.beginCopyFromURL(blobClient.url);
      await blobClient.delete();
    } else {
      await blobClient.delete();
    }
  }

  /**
   * Restore deleted document
   */
  async restoreDocument(id: string): Promise<void> {
    const blobName = this.generateBlobName(id);
    const deletedContainer = this.blobServiceClient.getContainerClient('deleted-documents');
    const deletedBlob = deletedContainer.getBlockBlobClient(blobName);
    
    const restoredBlob = this.containerClient.getBlockBlobClient(blobName);
    await restoredBlob.beginCopyFromURL(deletedBlob.url);
    await deletedBlob.delete();
  }

  /**
   * Generate document ID
   */
  private generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate blob name
   */
  private generateBlobName(id: string, name?: string): string {
    const extension = name ? name.split('.').pop() : 'bin';
    return `documents/${id}.${extension}`;
  }

  /**
   * Calculate checksum
   */
  private async calculateChecksum(data: Buffer | Uint8Array | ArrayBuffer): Promise<string> {
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }

  /**
   * Check if content type is image
   */
  private isImage(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

  /**
   * Generate thumbnail
   */
  private async generateThumbnail(blobClient: BlobClient, id: string): Promise<string> {
    // This would integrate with Azure Cognitive Services or similar
    // For now, return a placeholder URL
    return `https://storage.azure.com/thumbnails/${id}_thumb.jpg`;
  }

  /**
   * Generate preview
   */
  private async generatePreview(blobClient: BlobClient, id: string): Promise<string> {
    // This would integrate with Azure Cognitive Services or similar
    // For now, return a placeholder URL
    return `https://storage.azure.com/previews/${id}_preview.pdf`;
  }

  /**
   * Compress document
   */
  private async compressDocument(blobClient: BlobClient): Promise<void> {
    // This would implement compression logic
    // For now, it's a placeholder
  }

  /**
   * Stream to buffer
   */
  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  /**
   * Get document metadata
   */
  private async getDocumentMetadata(id: string): Promise<DocumentMetadata> {
    const blobName = this.generateBlobName(id);
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    const properties = await blobClient.getProperties();
    
    return this.parseBlobMetadata(properties.metadata!);
  }

  /**
   * Parse blob metadata
   */
  private parseBlobMetadata(metadata: Record<string, string>): DocumentMetadata {
    return {
      id: metadata.id,
      name: metadata.name,
      type: metadata.type,
      size: parseInt(metadata.size),
      contentType: metadata.contentType || 'application/octet-stream',
      uploadedAt: new Date(metadata.uploadedAt),
      uploadedBy: metadata.uploadedBy,
      organisationId: metadata.organisationId,
      tags: metadata.tags ? metadata.tags.split(',') : [],
      version: parseInt(metadata.version),
      checksum: metadata.checksum,
    };
  }

  /**
   * Check if document matches search criteria
   */
  private matchesCriteria(metadata: DocumentMetadata, criteria: SearchCriteria): boolean {
    if (criteria.name && !metadata.name.toLowerCase().includes(criteria.name.toLowerCase())) {
      return false;
    }
    
    if (criteria.type && metadata.type !== criteria.type) {
      return false;
    }
    
    if (criteria.tags && !criteria.tags.every(tag => metadata.tags.includes(tag))) {
      return false;
    }
    
    if (criteria.uploadedBy && metadata.uploadedBy !== criteria.uploadedBy) {
      return false;
    }
    
    if (criteria.dateRange) {
      const uploadDate = metadata.uploadedAt;
      if (uploadDate < criteria.dateRange.start || uploadDate > criteria.dateRange.end) {
        return false;
      }
    }
    
    if (criteria.sizeRange) {
      if (metadata.size < criteria.sizeRange.min || metadata.size > criteria.sizeRange.max) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Calculate cost analysis
   */
  private calculateCostAnalysis(storageUsage: { hot: number; cool: number; archive: number }): {
    monthly: number;
    yearly: number;
    breakdown: Record<string, number>;
  } {
    // Simplified cost calculation (actual costs would be retrieved from Azure pricing)
    const hotCostPerGB = 0.0184; // USD per GB per month
    const coolCostPerGB = 0.01; // USD per GB per month
    const archiveCostPerGB = 0.00099; // USD per GB per month
    
    const hotCost = (storageUsage.hot / (1024 * 1024 * 1024)) * hotCostPerGB;
    const coolCost = (storageUsage.cool / (1024 * 1024 * 1024)) * coolCostPerGB;
    const archiveCost = (storageUsage.archive / (1024 * 1024 * 1024)) * archiveCostPerGB;
    
    const monthly = hotCost + coolCost + archiveCost;
    const yearly = monthly * 12;
    
    return {
      monthly: Math.round(monthly * 100) / 100,
      yearly: Math.round(yearly * 100) / 100,
      breakdown: {
        hot: Math.round(hotCost * 100) / 100,
        cool: Math.round(coolCost * 100) / 100,
        archive: Math.round(archiveCost * 100) / 100,
      },
    };
  }
}

// Export singleton instance
export const advancedBlobStorage = new AdvancedBlobStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
  containerName: 'documents',
  enableVersioning: true,
  enableSoftDelete: true,
  retentionPolicy: {
    enabled: true,
    days: 90,
  },
  accessTier: 'Hot',
  enableEncryption: true,
});
