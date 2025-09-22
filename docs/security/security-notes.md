# Security Notes: xlsx Package Vulnerability

## The Issue

The xlsx package has known vulnerabilities:

- **GHSA-4r6h-8v6p-xvw6**: Prototype Pollution
- **GHSA-5pgg-2g8v-p4x9**: Regular Expression Denial of Service (ReDoS)

## Usage in Aegrid

This package is used for Excel file import functionality in:

- `app/api/imports/excel/route.ts`
- `components/imports/excel-import-component.tsx`
- `components/assets/asset-import.tsx`

## Mitigation Strategies

1. **Input validation and sanitisation**
2. **File size limits** (currently 50MB)
3. **File type validation**
4. **Consider replacing with more secure alternatives like:**
   - `exceljs` (more actively maintained)
   - `node-xlsx` (lighter weight)
   - `csv-parser` for CSV files only

## TODO

- **Replace xlsx with more secure alternative**
- **Priority**: Medium (file upload functionality)
- **Risk**: Medium (requires user to upload malicious Excel files)

## Current Status

- **Mitigation**: Input validation, file size limits, type validation implemented
- **Monitoring**: Regular security scans detect vulnerabilities
- **Action Required**: Plan migration to more secure alternative
