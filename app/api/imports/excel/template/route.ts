import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Define the template data
    const templateData = [
      // Headers
      [
        "asset_number", "name", "asset_type", "status", "address", "suburb", "postcode", "state",
        "description", "condition", "priority", "manufacturer", "model", "serial_number",
        "installation_date", "warranty_expiry", "expected_lifespan", "purchase_price",
        "current_value", "replacement_cost", "depreciation_rate", "last_inspection",
        "next_inspection", "inspection_frequency", "maintenance_cost", "tags", "notes",
        "latitude", "longitude"
      ],
      // Sample data
      [
        "BLD-001", "Main Administration Building", "BUILDING", "ACTIVE", "123 Main Street", "Melbourne", "3000", "VIC",
        "3-storey office building", "GOOD", "MEDIUM", "Custom Build", "Office Complex", "SN123456789",
        "2020-01-15", "2025-01-15", "25", "1500000", "1200000", "1800000", "4.00", "2023-12-01",
        "2024-03-01", "90", "50000", "office,admin,headquarters", "Recently renovated",
        "-37.8136", "144.9631"
      ],
      [
        "RD-001", "Main Street Road", "ROAD", "ACTIVE", "Main Street", "Melbourne", "3000", "VIC",
        "Primary arterial road", "FAIR", "HIGH", "Road Construction Co", "Asphalt Surface", "RD001",
        "2018-06-01", "2028-06-01", "15", "2000000", "1500000", "2500000", "6.67", "2023-11-15",
        "2024-02-15", "90", "100000", "road,arterial,main", "Requires resurfacing",
        "-37.8140", "144.9635"
      ],
      [
        "PL-001", "Central Park Playground", "PLAYGROUND", "ACTIVE", "Central Park", "Melbourne", "3000", "VIC",
        "Children's playground equipment", "EXCELLENT", "LOW", "Playground Solutions", "Adventure Set A", "PL001",
        "2021-03-15", "2026-03-15", "10", "150000", "120000", "180000", "10.00", "2023-10-01",
        "2024-01-01", "90", "5000", "playground,children,park", "Well maintained",
        "-37.8120", "144.9620"
      ],
      [
        "EQ-001", "Street Lighting System", "STREET_LIGHT", "ACTIVE", "Main Street Corridor", "Melbourne", "3000", "VIC",
        "LED street lighting system", "GOOD", "MEDIUM", "Lighting Solutions", "LED Pro 2000", "SL001",
        "2019-09-01", "2024-09-01", "8", "500000", "400000", "600000", "12.50", "2023-09-15",
        "2024-12-15", "90", "25000", "lighting,led,street", "Energy efficient",
        "-37.8130", "144.9630"
      ]
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths
    const columnWidths = [
      { wch: 12 }, // asset_number
      { wch: 25 }, // name
      { wch: 15 }, // asset_type
      { wch: 12 }, // status
      { wch: 20 }, // address
      { wch: 15 }, // suburb
      { wch: 10 }, // postcode
      { wch: 8 },  // state
      { wch: 25 }, // description
      { wch: 12 }, // condition
      { wch: 10 }, // priority
      { wch: 15 }, // manufacturer
      { wch: 15 }, // model
      { wch: 15 }, // serial_number
      { wch: 15 }, // installation_date
      { wch: 15 }, // warranty_expiry
      { wch: 15 }, // expected_lifespan
      { wch: 15 }, // purchase_price
      { wch: 15 }, // current_value
      { wch: 15 }, // replacement_cost
      { wch: 15 }, // depreciation_rate
      { wch: 15 }, // last_inspection
      { wch: 15 }, // next_inspection
      { wch: 15 }, // inspection_frequency
      { wch: 15 }, // maintenance_cost
      { wch: 20 }, // tags
      { wch: 25 }, // notes
      { wch: 12 }, // latitude
      { wch: 12 }, // longitude
    ];

    worksheet["!cols"] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asset Import Template");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: "buffer", 
      bookType: "xlsx",
      compression: true 
    });

    // Set response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    headers.set("Content-Disposition", "attachment; filename=Aegrid_Asset_Import_Template.xlsx");
    headers.set("Content-Length", excelBuffer.length.toString());

    return new NextResponse(excelBuffer, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
