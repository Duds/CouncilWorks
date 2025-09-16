import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import * as XLSX from "xlsx";

// Validation schemas
const assetImportSchema = z.object({
  asset_number: z.string().min(1, "Asset number is required"),
  name: z.string().min(1, "Asset name is required"),
  asset_type: z.enum([
    "BUILDING", "ROAD", "BRIDGE", "FOOTPATH", "PARK", "PLAYGROUND",
    "SPORTS_FACILITY", "LIBRARY", "COMMUNITY_CENTRE", "CAR_PARK",
    "STREET_FURNITURE", "TRAFFIC_LIGHT", "STREET_LIGHT", "DRAINAGE",
    "WATER_SUPPLY", "SEWER", "ELECTRICAL_INFRASTRUCTURE", 
    "TELECOMMUNICATIONS", "OTHER"
  ]),
  status: z.enum([
    "ACTIVE", "INACTIVE", "UNDER_CONSTRUCTION", "UNDER_MAINTENANCE",
    "DECOMMISSIONED", "PLANNED"
  ]),
  address: z.string().min(1, "Address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  postcode: z.string().regex(/^\d{4}$/, "Postcode must be 4 digits"),
  state: z.enum(["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"]),
  
  // Optional fields
  description: z.string().optional(),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL", "UNKNOWN"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  installation_date: z.string().optional(),
  warranty_expiry: z.string().optional(),
  expected_lifespan: z.number().positive().optional(),
  purchase_price: z.number().positive().optional(),
  current_value: z.number().positive().optional(),
  replacement_cost: z.number().positive().optional(),
  depreciation_rate: z.number().min(0).max(100).optional(),
  last_inspection: z.string().optional(),
  next_inspection: z.string().optional(),
  inspection_frequency: z.number().positive().optional(),
  maintenance_cost: z.number().positive().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
  latitude: z.number().min(-44).max(-10).optional(),
  longitude: z.number().min(113).max(154).optional(),
});

const importSettingsSchema = z.object({
  importMode: z.enum(["create", "update", "create_or_update"]).default("create_or_update"),
  conflictResolution: z.enum(["skip", "overwrite", "create_new"]).default("skip"),
  validationLevel: z.enum(["strict", "permissive"]).default("permissive"),
});

// POST /api/imports/excel - Upload and process Excel file
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user with organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organisation: true },
    });

    if (!user?.organisationId) {
      return NextResponse.json({ error: "User must have an organisation" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const settings = formData.get("settings") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Parse import settings
    const importSettings = settings ? 
      importSettingsSchema.parse(JSON.parse(settings)) : 
      importSettingsSchema.parse({});

    console.log("Excel import request:", {
      fileName: file.name,
      fileSize: file.size,
      importSettings,
      userId: session.user.id,
      organisationId: user.organisationId,
    });

    // Validate file type and size
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file." 
      }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return NextResponse.json({ 
        error: "File too large. Maximum size is 50MB." 
      }, { status: 400 });
    }

    // Parse Excel/CSV file
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawData.length < 2) {
      return NextResponse.json({ 
        error: "File must contain at least a header row and one data row." 
      }, { status: 400 });
    }

    // Extract headers and data
    const headers = rawData[0] as string[];
    const dataRows = rawData.slice(1) as any[][];

    console.log("Parsed file:", {
      headers: headers.length,
      dataRows: dataRows.length,
      headers: headers.slice(0, 10), // First 10 headers
    });

    // Validate headers
    const requiredHeaders = [
      "asset_number", "name", "asset_type", "status", 
      "address", "suburb", "postcode", "state"
    ];

    const missingHeaders = requiredHeaders.filter(
      header => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      return NextResponse.json({
        error: `Missing required columns: ${missingHeaders.join(", ")}`,
        missingHeaders,
      }, { status: 400 });
    }

    // Process and validate data
    const processedData = [];
    const validationErrors = [];
    const duplicateAssetNumbers = new Set<string>();

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // +2 because we start from row 2 (after header)

      try {
        // Create object from row data
        const rowData: any = {};
        headers.forEach((header, index) => {
          const value = row[index];
          
          // Clean and convert values
          if (value === null || value === undefined || value === "") {
            rowData[header] = undefined;
          } else if (header.includes("date")) {
            // Handle date fields
            rowData[header] = parseDate(value);
          } else if (header.includes("price") || header.includes("cost") || header.includes("value")) {
            // Handle currency fields
            rowData[header] = parseCurrency(value);
          } else if (header.includes("rate") || header.includes("frequency") || header.includes("lifespan")) {
            // Handle numeric fields
            rowData[header] = parseNumber(value);
          } else if (header === "latitude" || header === "longitude") {
            // Handle GPS coordinates
            rowData[header] = parseNumber(value);
          } else {
            // Handle text fields
            rowData[header] = String(value).trim();
          }
        });

        // Validate row data
        const validatedData = assetImportSchema.parse(rowData);
        
        // Check for duplicate asset numbers
        if (duplicateAssetNumbers.has(validatedData.asset_number)) {
          validationErrors.push({
            row: rowNumber,
            field: "asset_number",
            message: `Duplicate asset number: ${validatedData.asset_number}`,
            value: validatedData.asset_number,
          });
          continue;
        }

        // Check if asset number already exists in database
        const existingAsset = await prisma.asset.findFirst({
          where: {
            assetNumber: validatedData.asset_number,
            organisationId: user.organisationId,
          },
        });

        if (existingAsset && importSettings.importMode === "create") {
          validationErrors.push({
            row: rowNumber,
            field: "asset_number",
            message: `Asset number already exists: ${validatedData.asset_number}`,
            value: validatedData.asset_number,
          });
          continue;
        }

        duplicateAssetNumbers.add(validatedData.asset_number);
        processedData.push({
          ...validatedData,
          organisationId: user.organisationId,
          createdById: session.user.id,
          updatedById: session.user.id,
        });

      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            validationErrors.push({
              row: rowNumber,
              field: err.path.join("."),
              message: err.message,
              value: row[headers.indexOf(err.path[0] as string)],
            });
          });
        } else {
          validationErrors.push({
            row: rowNumber,
            field: "general",
            message: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
            value: null,
          });
        }
      }
    }

    console.log("Validation results:", {
      totalRows: dataRows.length,
      validRows: processedData.length,
      errorRows: validationErrors.length,
    });

    // Return validation results
    return NextResponse.json({
      success: true,
      validation: {
        totalRows: dataRows.length,
        validRows: processedData.length,
        errorRows: validationErrors.length,
        errors: validationErrors,
        headers,
        sampleData: processedData.slice(0, 5), // First 5 valid records
      },
      importSettings,
    });

  } catch (error) {
    console.error("Excel import error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid import settings", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process Excel file" },
      { status: 500 }
    );
  }
}

// POST /api/imports/excel/confirm - Confirm and execute import
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, importSettings } = body;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    console.log("Confirming import:", {
      recordCount: data.length,
      importSettings,
      userId: session.user.id,
    });

    // Process import in batches
    const batchSize = 100;
    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      try {
        for (const assetData of batch) {
          try {
            // Check if asset already exists
            const existingAsset = await prisma.asset.findFirst({
              where: {
                assetNumber: assetData.asset_number,
                organisationId: assetData.organisationId,
              },
            });

            if (existingAsset) {
              if (importSettings.importMode === "create") {
                results.skipped++;
                continue;
              } else if (importSettings.importMode === "update" || importSettings.importMode === "create_or_update") {
                // Update existing asset
                await prisma.asset.update({
                  where: { id: existingAsset.id },
                  data: {
                    ...assetData,
                    updatedAt: new Date(),
                  },
                });
                results.updated++;
              }
            } else {
              // Create new asset
              await prisma.asset.create({
                data: assetData,
              });
              results.created++;
            }
          } catch (error) {
            results.errors.push({
              assetNumber: assetData.asset_number,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      } catch (error) {
        console.error("Batch processing error:", error);
        results.errors.push({
          batch: Math.floor(i / batchSize) + 1,
          error: error instanceof Error ? error.message : "Batch processing error",
        });
      }
    }

    console.log("Import completed:", results);

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error("Import confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to confirm import" },
      { status: 500 }
    );
  }
}

// Helper functions
function parseDate(value: any): string | undefined {
  if (!value) return undefined;
  
  // Handle Excel date numbers
  if (typeof value === "number") {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toISOString().split("T")[0];
  }
  
  // Handle string dates
  if (typeof value === "string") {
    const cleaned = value.trim();
    
    // Try DD/MM/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleaned)) {
      const [day, month, year] = cleaned.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    
    // Try YYYY-MM-DD format
    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(cleaned)) {
      return cleaned;
    }
  }
  
  return undefined;
}

function parseCurrency(value: any): number | undefined {
  if (!value) return undefined;
  
  if (typeof value === "number") return value;
  
  if (typeof value === "string") {
    const cleaned = value.replace(/[$,]/g, "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }
  
  return undefined;
}

function parseNumber(value: any): number | undefined {
  if (!value) return undefined;
  
  if (typeof value === "number") return value;
  
  if (typeof value === "string") {
    const cleaned = value.replace(/[%,]/g, "").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }
  
  return undefined;
}
