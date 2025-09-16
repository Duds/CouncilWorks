"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Eye,
  Loader2
} from "lucide-react";

interface ImportResults {
  total: number;
  success: number;
  errors: Array<{
    row: number;
    assetNumber: string;
    error: string;
    details?: string;
  }>;
  imported: Array<{
    row: number;
    assetNumber: string;
    name: string;
    id?: string;
    status?: string;
  }>;
}

interface ImportTemplate {
  headers: string[];
  sampleData: Record<string, string>;
  validationRules: {
    required: string[];
    assetTypes: string[];
    statuses: string[];
    conditions: string[];
    priorities: string[];
    coordinateRanges: {
      latitude: [number, number];
      longitude: [number, number];
    };
  };
}

/**
 * Asset Import Component
 * Handles CSV/Excel file upload and import with validation
 */
export function AssetImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [template, setTemplate] = useState<ImportTemplate | null>(null);
  const [importOptions, setImportOptions] = useState({
    skipFirstRow: true,
    validateOnly: false,
  });

  // Fetch import template
  const fetchTemplate = useCallback(async () => {
    try {
      const response = await fetch("/api/assets/import");
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  }, []);

  // Load template on component mount
  useState(() => {
    fetchTemplate();
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const handleImport = async (validateOnly = false) => {
    if (!file) return;

    if (validateOnly) {
      setValidating(true);
    } else {
      setImporting(true);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("options", JSON.stringify({
        ...importOptions,
        validateOnly,
      }));

      const response = await fetch("/api/assets/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        setResults({
          total: 0,
          success: 0,
          errors: [{ row: 0, assetNumber: "", error: data.error }],
          imported: [],
        });
      }
    } catch (error) {
      setResults({
        total: 0,
        success: 0,
        errors: [{ row: 0, assetNumber: "", error: "Network error" }],
        imported: [],
      });
    } finally {
      setImporting(false);
      setValidating(false);
    }
  };

  const downloadTemplate = () => {
    if (!template) return;

    const csvContent = [
      template.headers.join(","),
      template.headers.map(header => template.sampleData[header] || "").join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asset-import-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Import Assets</h2>
        <p className="text-muted-foreground">
          Upload CSV or Excel files to import assets into the system
        </p>
      </div>

      {/* Import Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Options
          </CardTitle>
          <CardDescription>
            Configure how your file will be processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="skipFirstRow"
              checked={importOptions.skipFirstRow}
              onChange={(e) => setImportOptions(prev => ({ ...prev, skipFirstRow: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="skipFirstRow" className="text-sm font-medium">
              Skip first row (header row)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="validateOnly"
              checked={importOptions.validateOnly}
              onChange={(e) => setImportOptions(prev => ({ ...prev, validateOnly: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="validateOnly" className="text-sm font-medium">
              Validate only (don't import)
            </label>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload File
          </CardTitle>
          <CardDescription>
            Drag and drop your CSV or Excel file, or click to browse
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
            {file ? (
              <div>
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isDragActive ? "Drop the file here" : "Drag & drop your file here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports CSV, XLS, and XLSX files
                </p>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => handleImport(true)}
                disabled={validating || importing}
                variant="outline"
                className="flex-1"
              >
                {validating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Validate Only
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleImport(false)}
                disabled={validating || importing}
                className="flex-1"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Assets
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Download */}
      {template && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Import Template
            </CardTitle>
            <CardDescription>
              Download a template file with the correct format and sample data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {results.errors.length === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Import Results
            </CardTitle>
            <CardDescription>
              {results.total} rows processed, {results.success} successful
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{results.total}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.success}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.errors.length}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>

            {/* Errors */}
            {results.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Errors:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Row {error.row}</strong> - {error.assetNumber}: {error.error}
                        {error.details && (
                          <div className="text-xs mt-1 opacity-75">{error.details}</div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Successful Imports */}
            {results.imported.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Imported Assets:</h4>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {results.imported.map((asset, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{asset.assetNumber}</span>
                      <span className="text-muted-foreground">-</span>
                      <span>{asset.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
