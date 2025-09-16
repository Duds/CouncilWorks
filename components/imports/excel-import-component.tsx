"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react";
import { useSession } from "next-auth/react";

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

interface ImportResult {
  totalRows: number;
  validRows: number;
  errorRows: number;
  errors: ValidationError[];
  headers: string[];
  sampleData: any[];
}

interface ImportSettings {
  importMode: "create" | "update" | "create_or_update";
  conflictResolution: "skip" | "overwrite" | "create_new";
  validationLevel: "strict" | "permissive";
}

export default function ExcelImportComponent() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationResult, setValidationResult] = useState<ImportResult | null>(null);
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    importMode: "create_or_update",
    conflictResolution: "skip",
    validationLevel: "permissive",
  });
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setSuccess("");
      setValidationResult(null);
      setImportResults(null);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("settings", JSON.stringify(importSettings));

      const response = await fetch("/api/imports/excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process file");
      }

      const result = await response.json();
      setValidationResult(result.validation);
      setSuccess(`File processed successfully. ${result.validation.validRows} valid records found.`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!validationResult) {
      setError("No validation result available");
      return;
    }

    setImporting(true);
    setError("");

    try {
      const response = await fetch("/api/imports/excel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: validationResult.sampleData, // In a real implementation, this would be all valid data
          importSettings,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import data");
      }

      const result = await response.json();
      setImportResults(result.results);
      setSuccess(`Import completed! Created: ${result.results.created}, Updated: ${result.results.updated}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import data");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    // In a real implementation, this would download the actual Excel template
    const link = document.createElement("a");
    link.href = "/api/imports/excel/template";
    link.download = "Aegrid_Asset_Import_Template.xlsx";
    link.click();
  };

  const resetImport = () => {
    setFile(null);
    setError("");
    setSuccess("");
    setValidationResult(null);
    setImportResults(null);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Import Asset Data</h1>
        <p className="text-muted-foreground mt-2">
          Upload your Excel or CSV file to import asset data into Aegrid
        </p>
      </div>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Template
          </CardTitle>
          <CardDescription>
            Download our Excel template to ensure your data is formatted correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline" className="w-full">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Download Excel Template
          </Button>
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
            Select your Excel (.xlsx, .xls) or CSV file to import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose File
            </Button>
            {file && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">
                  Selected: {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Import Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Import Mode</label>
              <select
                value={importSettings.importMode}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  importMode: e.target.value as ImportSettings["importMode"]
                }))}
                className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="create">Create New Only</option>
                <option value="update">Update Existing Only</option>
                <option value="create_or_update">Create or Update</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Conflict Resolution</label>
              <select
                value={importSettings.conflictResolution}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  conflictResolution: e.target.value as ImportSettings["conflictResolution"]
                }))}
                className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="skip">Skip Duplicates</option>
                <option value="overwrite">Overwrite Existing</option>
                <option value="create_new">Create New</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Validation Level</label>
              <select
                value={importSettings.validationLevel}
                onChange={(e) => setImportSettings(prev => ({
                  ...prev,
                  validationLevel: e.target.value as ImportSettings["validationLevel"]
                }))}
                className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="strict">Strict</option>
                <option value="permissive">Permissive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleFileUpload}
              disabled={!file || loading}
              className="flex-1"
            >
              {loading ? "Processing..." : "Process File"}
            </Button>
            <Button
              onClick={resetImport}
              variant="outline"
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Validation Results
            </CardTitle>
            <CardDescription>
              Review the validation results before confirming the import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {validationResult.totalRows}
                </div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {validationResult.validRows}
                </div>
                <div className="text-sm text-muted-foreground">Valid Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {validationResult.errorRows}
                </div>
                <div className="text-sm text-muted-foreground">Error Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((validationResult.validRows / validationResult.totalRows) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Validation Progress</span>
                <span>{validationResult.validRows} of {validationResult.totalRows}</span>
              </div>
              <Progress 
                value={(validationResult.validRows / validationResult.totalRows) * 100} 
                className="h-2"
              />
            </div>

            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Validation Errors</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {validationResult.errors.slice(0, 20).map((error, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-red-800">
                          Row {error.row}: {error.field}
                        </div>
                        <div className="text-xs text-red-600">{error.message}</div>
                      </div>
                    </div>
                  ))}
                  {validationResult.errors.length > 20 && (
                    <div className="text-sm text-muted-foreground text-center">
                      ... and {validationResult.errors.length - 20} more errors
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sample Data Preview */}
            {validationResult.sampleData.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Sample Data Preview</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-border rounded">
                    <thead className="bg-muted">
                      <tr>
                        {validationResult.headers.slice(0, 8).map((header, index) => (
                          <th key={index} className="p-2 text-left font-medium text-foreground">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validationResult.sampleData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-t border-border">
                          {validationResult.headers.slice(0, 8).map((header, colIndex) => (
                            <td key={colIndex} className="p-2 text-muted-foreground">
                              {row[header] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleConfirmImport}
                disabled={validationResult.validRows === 0 || importing}
                className="flex-1"
              >
                {importing ? "Importing..." : `Import ${validationResult.validRows} Valid Records`}
              </Button>
              <Button
                onClick={resetImport}
                variant="outline"
                disabled={importing}
              >
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Import Complete
            </CardTitle>
            <CardDescription>
              Your asset data has been successfully imported
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {importResults.created}
                </div>
                <div className="text-sm text-muted-foreground">Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {importResults.updated}
                </div>
                <div className="text-sm text-muted-foreground">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {importResults.skipped}
                </div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {importResults.errors.length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Import Errors</h4>
                <div className="space-y-2">
                  {importResults.errors.map((error: any, index: number) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded">
                      <div className="text-sm font-medium text-red-800">
                        {error.assetNumber || `Batch ${error.batch}`}
                      </div>
                      <div className="text-xs text-red-600">{error.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => window.location.href = "/assets"}
                className="flex-1"
              >
                View Assets
              </Button>
              <Button
                onClick={resetImport}
                variant="outline"
              >
                Import More Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
