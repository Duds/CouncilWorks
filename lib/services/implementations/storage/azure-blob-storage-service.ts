/**
 * Azure Blob Storage Service Implementation
 * 
 * This service provides Azure Blob Storage functionality for both
 * multi-tenant and single-tenant deployments.
 */

import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import { StorageService, File, FileMetadata, UploadResult, DownloadResult, FileInfo } from '../../service-interfaces';
import { StorageConfig } from '@/lib/config/deployment-config';
import { getCurrentOrganisationId } from '@/lib/rls';

export class AzureBlobStorageService implements StorageService {
  private container: ContainerClient;
  private isIsolated: boolean;

  constructor(config: StorageConfig, isIsolated = false) {
    if (!config.connectionString) {
      throw new Error('Azure storage connection string is required');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);
    const containerName = config.container || 'councilworks';
    this.container = blobServiceClient.getContainerClient(containerName);
    this.isIsolated = isIsolated;
  }

  async upload(file: File, path: string, metadata?: FileMetadata): Promise<UploadResult> {
    try {
      // For multi-tenant deployments, prefix with organisation ID
      const blobPath = this.isIsolated ? path : `${this.getOrganisationId()}/${path}`;
      
      const blockBlobClient = this.container.getBlockBlobClient(blobPath);
      
      // Prepare blob metadata
      const blobMetadata: Record<string, string> = {};
      if (metadata?.organisationId) {
        blobMetadata.organisationId = metadata.organisationId;
      }
      if (metadata?.userId) {
        blobMetadata.userId = metadata.userId;
      }
      if (metadata?.contentType) {
        blobMetadata.contentType = metadata.contentType;
      }
      if (metadata?.tags) {
        blobMetadata.tags = JSON.stringify(metadata.tags);
      }

      // Upload the file
      const uploadResponse = await blockBlobClient.upload(file.content, file.size, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
        metadata: blobMetadata,
      });

      return {
        path: blobPath,
        url: blockBlobClient.url,
        size: file.size,
        etag: uploadResponse.etag,
      };
    } catch (error) {
      console.error('Azure Blob upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async download(path: string): Promise<DownloadResult> {
    try {
      const blockBlobClient = this.container.getBlockBlobClient(path);
      
      const downloadResponse = await blockBlobClient.download();
      const content = await this.streamToBuffer(downloadResponse.readableStreamBody!);
      
      const properties = await blockBlobClient.getProperties();
      
      const metadata: FileMetadata = {};
      if (properties.metadata?.organisationId) {
        metadata.organisationId = properties.metadata.organisationId;
      }
      if (properties.metadata?.userId) {
        metadata.userId = properties.metadata.userId;
      }
      if (properties.metadata?.contentType) {
        metadata.contentType = properties.metadata.contentType;
      }
      if (properties.metadata?.tags) {
        metadata.tags = JSON.parse(properties.metadata.tags);
      }

      return {
        content,
        metadata,
        size: properties.contentLength || 0,
        contentType: properties.contentType || 'application/octet-stream',
      };
    } catch (error) {
      console.error('Azure Blob download error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async delete(path: string): Promise<void> {
    try {
      const blockBlobClient = this.container.getBlockBlobClient(path);
      await blockBlobClient.delete();
    } catch (error) {
      console.error('Azure Blob delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async list(prefix: string): Promise<FileInfo[]> {
    try {
      const files: FileInfo[] = [];
      const listOptions = {
        prefix: this.isIsolated ? prefix : `${this.getOrganisationId()}/${prefix}`,
      };

      for await (const blob of this.container.listBlobsFlat(listOptions)) {
        const metadata: FileMetadata = {};
        if (blob.metadata?.organisationId) {
          metadata.organisationId = blob.metadata.organisationId;
        }
        if (blob.metadata?.userId) {
          metadata.userId = blob.metadata.userId;
        }
        if (blob.metadata?.contentType) {
          metadata.contentType = blob.metadata.contentType;
        }
        if (blob.metadata?.tags) {
          metadata.tags = JSON.parse(blob.metadata.tags);
        }

        files.push({
          path: blob.name,
          size: blob.properties.contentLength || 0,
          lastModified: blob.properties.lastModified || new Date(),
          contentType: blob.properties.contentType || 'application/octet-stream',
          metadata,
        });
      }

      return files;
    } catch (error) {
      console.error('Azure Blob list error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async getUrl(path: string): Promise<string> {
    const blockBlobClient = this.container.getBlockBlobClient(path);
    return blockBlobClient.url;
  }

  async exists(path: string): Promise<boolean> {
    try {
      const blockBlobClient = this.container.getBlockBlobClient(path);
      const exists = await blockBlobClient.exists();
      return exists;
    } catch (error) {
      console.error('Azure Blob exists check error:', error);
      return false;
    }
  }

  /**
   * Get organisation ID for multi-tenant deployments
   */
  private getOrganisationId(): string {
    if (this.isIsolated) {
      return 'isolated';
    }
    
    const orgId = getCurrentOrganisationId();
    if (!orgId) {
      throw new Error('Organisation ID is required for multi-tenant storage');
    }
    return orgId;
  }

  /**
   * Convert readable stream to buffer
   */
  private async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
  }
}
