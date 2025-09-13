import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local File Storage Service
 * Handles document uploads and management for local development
 */
export class LocalDocumentStorage {
  private basePath: string;
  private publicPath: string;

  constructor() {
    this.basePath = path.join(process.cwd(), 'uploads', 'documents');
    this.publicPath = path.join(process.cwd(), 'public', 'documents');
  }

  /**
   * Initialize storage directories
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.basePath, { recursive: true });
    await fs.mkdir(this.publicPath, { recursive: true });
  }

  /**
   * Upload a file to local storage
   */
  async uploadFile(
    file: File,
    assetId: string,
    documentType: string
  ): Promise<{
    fileName: string;
    filePath: string;
    publicUrl: string;
    fileSize: number;
    mimeType: string;
  }> {
    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    
    // Create asset-specific directory
    const assetDir = path.join(this.basePath, assetId);
    const publicAssetDir = path.join(this.publicPath, assetId);
    
    await fs.mkdir(assetDir, { recursive: true });
    await fs.mkdir(publicAssetDir, { recursive: true });

    // Save file to storage
    const filePath = path.join(assetDir, uniqueFileName);
    const publicFilePath = path.join(publicAssetDir, uniqueFileName);
    
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    
    await fs.writeFile(filePath, fileBuffer);
    await fs.writeFile(publicFilePath, fileBuffer); // Copy to public for serving

    return {
      fileName: uniqueFileName,
      filePath: filePath,
      publicUrl: `/documents/${assetId}/${uniqueFileName}`,
      fileSize: fileBuffer.length,
      mimeType: file.type,
    };
  }

  /**
   * Delete a file from local storage
   */
  async deleteFile(assetId: string, fileName: string): Promise<void> {
    const filePath = path.join(this.basePath, assetId, fileName);
    const publicFilePath = path.join(this.publicPath, assetId, fileName);
    
    try {
      await fs.unlink(filePath);
      await fs.unlink(publicFilePath);
    } catch (error) {
      // File might not exist, which is fine
      console.warn(`File not found for deletion: ${filePath}`);
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(assetId: string, fileName: string): Promise<{
    exists: boolean;
    size: number;
    modified: Date;
  }> {
    const filePath = path.join(this.basePath, assetId, fileName);
    
    try {
      const stats = await fs.stat(filePath);
      return {
        exists: true,
        size: stats.size,
        modified: stats.mtime,
      };
    } catch (error) {
      return {
        exists: false,
        size: 0,
        modified: new Date(),
      };
    }
  }

  /**
   * List files for an asset
   */
  async listFiles(assetId: string): Promise<string[]> {
    const assetDir = path.join(this.basePath, assetId);
    
    try {
      const files = await fs.readdir(assetDir);
      return files;
    } catch (error) {
      return [];
    }
  }

  /**
   * Generate thumbnail for images (basic implementation)
   */
  async generateThumbnail(
    assetId: string,
    fileName: string,
    size: number = 150
  ): Promise<string | null> {
    // For local development, we'll skip thumbnail generation
    // In production, this would use Sharp.js
    console.log(`Thumbnail generation requested for ${fileName} (${size}px) - skipped in local mode`);
    return null;
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    totalSize: number;
    fileCount: number;
    assetsWithDocuments: number;
  }> {
    let totalSize = 0;
    let fileCount = 0;
    let assetsWithDocuments = 0;

    try {
      const assetDirs = await fs.readdir(this.basePath);
      
      for (const assetDir of assetDirs) {
        const assetPath = path.join(this.basePath, assetDir);
        const stats = await fs.stat(assetPath);
        
        if (stats.isDirectory()) {
          const files = await fs.readdir(assetPath);
          
          if (files.length > 0) {
            assetsWithDocuments++;
            
            for (const file of files) {
              const filePath = path.join(assetPath, file);
              const fileStats = await fs.stat(filePath);
              totalSize += fileStats.size;
              fileCount++;
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error calculating storage stats:', error);
    }

    return {
      totalSize,
      fileCount,
      assetsWithDocuments,
    };
  }
}

// Singleton instance
export const localStorage = new LocalDocumentStorage();
