"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertCircle,
    Download,
    Eye,
    FileText,
    Loader2,
    Plus,
    Search,
    Trash2,
    Upload
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  description?: string;
  uploadedBy: string;
  createdAt: string;
  publicUrl: string;
}

interface DocumentManagerProps {
  assetId: string;
  assetName: string;
}

/**
 * Document Manager Component
 * Handles document upload, listing, and management for assets
 */
export function DocumentManager({ assetId, assetName }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("OTHER");
  const [description, setDescription] = useState("");

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Document types
  const documentTypes = [
    "MANUAL", "WARRANTY", "INSPECTION", "PHOTO", "DRAWING",
    "CERTIFICATE", "PERMIT", "CONTRACT", "OTHER"
  ];

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, [assetId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/${assetId}/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        setError("Failed to load documents");
      }
    } catch (error) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadFile(file);
      setShowUploadForm(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("documentType", documentType);
      formData.append("description", description);

      const response = await fetch(`/api/assets/${assetId}/documents`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(prev => [data.document, ...prev]);
        setUploadFile(null);
        setDescription("");
        setDocumentType("OTHER");
        setShowUploadForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to upload document");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/assets/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      } else {
        setError("Failed to delete document");
      }
    } catch (error) {
      setError("Failed to delete document");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU");
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType === "application/pdf") return "📄";
    if (mimeType.includes("word")) return "📝";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📈";
    return "📎";
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || doc.documentType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Documents</h3>

      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      {!showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Documents
            </CardTitle>
            <CardDescription>
              Drag and drop files here or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-primary hover:bg-primary/5"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-sm font-medium text-foreground">Drop the file here</p>
              ) : (
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drag & drop your file here, or click to browse
                  </p>

                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      {showUploadForm && uploadFile && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Configure document details before uploading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label>Selected File</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span>{getFileIcon(uploadFile.type)}</span>
                  <span className="font-medium">{uploadFile.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({formatFileSize(uploadFile.size)})
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <select
                  id="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  title="Select the type of document"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the document"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadFile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents ({filteredDocuments.length})
              </CardTitle>
              <CardDescription>
                All documents attached to this asset
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploadForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border rounded-md"
                title="Filter by document type"
              >
                <option value="">All Types</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading documents...</span>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No documents found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-lg">{getFileIcon(doc.mimeType)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate" title={doc.originalName}>
                          {doc.originalName}
                        </p>

                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.publicUrl, '_blank')}
                        title="View document"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.publicUrl, '_blank')}
                        title="Download document"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {doc.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {doc.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploaded by {doc.uploadedBy}</span>
                    <span>{formatDate(doc.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
