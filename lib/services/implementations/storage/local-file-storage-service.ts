/**
 * Local File Storage Service Implementation
 * 
 * This service provides local file system storage for on-premise deployments.
 */

import { promises as fs } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { StorageService, File, FileMetadata, UploadResult, DownloadResult, FileInfo } from '../../service-interfaces';
import { StorageConfig } from '@/lib/config/deployment-config';

export class LocalFileStorageService implements StorageService {
  private basePath: string;

  constructor(config: StorageConfig) {
    if (!config.basePath) {
      throw new Error('Base path is required for local file storage');
    }
    this.basePath = config.basePath;
  }

  async upload(file: File, path: string, metadata?: FileMetadata): Promise<UploadResult> {
    try {
      const fullPath = join(this.basePath, path);
      const dir = dirname(fullPath);
      
      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });
      
      // Write file content
      const content = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content);
      await fs.writeFile(fullPath, content);
      
      // Write metadata if provided
      if (metadata) {
        const metadataPath = `${fullPath}.meta`;
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      }

      return {
        path,
        url: this.getFileUrl(path),
        size: file.size,
      };
    } catch (error) {
      console.error('Local file upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async download(path: string): Promise<DownloadResult> {
    try {
      const fullPath = join(this.basePath, path);
      
      // Read file content
      const content = await fs.readFile(fullPath);
      
      // Read metadata if it exists
      const metadataPath = `${fullPath}.meta`;
      let metadata: FileMetadata = {};
      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf8');
        metadata = JSON.parse(metadataContent);
      } catch {
        // Metadata file doesn't exist, use defaults
      }

      // Get file stats
      const stats = await fs.stat(fullPath);
      
      // Determine content type from file extension
      const contentType = this.getContentType(path);

      return {
        content,
        metadata,
        size: stats.size,
        contentType,
      };
    } catch (error) {
      console.error('Local file download error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async delete(path: string): Promise<void> {
    try {
      const fullPath = join(this.basePath, path);
      const metadataPath = `${fullPath}.meta`;
      
      // Delete main file
      await fs.unlink(fullPath);
      
      // Delete metadata file if it exists
      try {
        await fs.unlink(metadataPath);
      } catch {
        // Metadata file doesn't exist, ignore
      }
    } catch (error) {
      console.error('Local file delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async list(prefix: string): Promise<FileInfo[]> {
    try {
      const files: FileInfo[] = [];
      const fullPrefix = join(this.basePath, prefix);
      const dir = dirname(fullPrefix);
      
      // Ensure directory exists
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch {
        // Directory might already exist
      }

      // Read directory contents
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && !entry.name.endsWith('.meta')) {
          const filePath = join(dir, entry.name);
          const relativePath = filePath.replace(this.basePath + '/', '');
          
          // Check if file matches prefix
          if (relativePath.startsWith(prefix)) {
            const stats = await fs.stat(filePath);
            
            // Read metadata if it exists
            const metadataPath = `${filePath}.meta`;
            let metadata: FileMetadata = {};
            try {
              const metadataContent = await fs.readFile(metadataPath, 'utf8');
              metadata = JSON.parse(metadataContent);
            } catch {
              // Metadata file doesn't exist, use defaults
            }

            files.push({
              path: relativePath,
              size: stats.size,
              lastModified: stats.mtime,
              contentType: this.getContentType(relativePath),
              metadata,
            });
          }
        }
      }

      return files;
    } catch (error) {
      console.error('Local file list error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async getUrl(path: string): Promise<string> {
    return this.getFileUrl(path);
  }

  async exists(path: string): Promise<boolean> {
    try {
      const fullPath = join(this.basePath, path);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate file URL for local storage
   */
  private getFileUrl(path: string): string {
    // For local storage, we'll use a file:// URL or a local server URL
    // In production, this might be served by a web server
    return `/api/files/${path}`;
  }

  /**
   * Determine content type from file extension
   */
  private getContentType(path: string): string {
    const ext = extname(path).toLowerCase();
    
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.zip': 'application/zip',
    };

    return contentTypes[ext] || 'application/octet-stream';
  }
}
