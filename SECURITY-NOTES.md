# Security Note: xlsx Package Vulnerability

#

# The xlsx package has known vulnerabilities:

# - GHSA-4r6h-8v6p-xvw6: Prototype Pollution

# - GHSA-5pgg-2g8v-p4x9: Regular Expression Denial of Service (ReDoS)

#

# This package is used for Excel file import functionality in:

# - app/api/imports/excel/route.ts

# - components/imports/excel-import-component.tsx

# - components/assets/asset-import.tsx

#

# Mitigation strategies:

# 1. Input validation and sanitization

# 2. File size limits (currently 50MB)

# 3. File type validation

# 4. Consider replacing with more secure alternatives like:

# - exceljs (more actively maintained)

# - node-xlsx (lighter weight)

# - csv-parser for CSV files only

#

# TODO: Replace xlsx with more secure alternative

# Priority: Medium (file upload functionality)

# Risk: Medium (requires user to upload malicious Excel files)
