# Excel Import User Journey - Aegrid Asset Management

## Overview

This document outlines the complete user journey for importing asset data from Excel spreadsheets into Aegrid. This is a critical feature for enterprise adoption, as most councils already have extensive asset data in spreadsheet format.

## User Journey Flow

### 1. Discovery & Preparation Phase

#### **Step 1.1: Access Import Feature**
- User navigates to **Assets** → **Import Data** from the main dashboard
- Or selects **"Import Data"** during onboarding trial selection
- System displays import options: **Excel Upload**, **CSV Upload**, **API Integration**

#### **Step 1.2: Download Template (Optional)**
- User clicks **"Download Excel Template"** button
- System provides `Aegrid_Asset_Import_Template.xlsx` with:
  - Pre-configured column headers
  - Data validation rules
  - Sample data examples
  - Field descriptions and requirements

#### **Step 1.3: Data Preparation**
- User reviews their existing Excel data
- Maps their columns to Aegrid's required fields
- Cleans and validates data according to requirements
- Ensures data meets import validation rules

### 2. Upload & Validation Phase

#### **Step 2.1: File Upload**
- User clicks **"Choose File"** or drags Excel file to upload area
- Supported formats: `.xlsx`, `.xls`, `.csv`
- Maximum file size: **50MB**
- System validates file format and size

#### **Step 2.2: Column Mapping**
- System auto-detects column headers from uploaded file
- User maps their columns to Aegrid fields using dropdown selectors
- **Required fields** are highlighted and must be mapped
- **Optional fields** can be skipped or mapped as needed
- User can preview mapped data in real-time

#### **Step 2.3: Data Validation**
- System performs comprehensive validation:
  - **Required field validation**: Ensures all mandatory fields are present
  - **Data type validation**: Checks formats (dates, numbers, enums)
  - **Enum value validation**: Validates against predefined lists
  - **Duplicate detection**: Identifies duplicate asset numbers
  - **Geographic validation**: Validates address/postcode combinations
  - **Business rule validation**: Checks logical constraints

#### **Step 2.4: Validation Results**
- System displays validation summary:
  - ✅ **Valid records**: Count of records ready for import
  - ⚠️ **Warnings**: Non-critical issues that can be fixed
  - ❌ **Errors**: Critical issues that must be resolved
- User can review and fix issues before proceeding

### 3. Preview & Confirmation Phase

#### **Step 3.1: Import Preview**
- System shows preview of first 10-20 records
- Displays mapped data with Aegrid field names
- Shows any transformation rules applied
- User can scroll through preview data

#### **Step 3.2: Import Settings**
- **Import Mode**:
  - **Create New**: Add all records as new assets
  - **Update Existing**: Update existing assets where asset numbers match
  - **Create or Update**: Hybrid mode (recommended)
- **Conflict Resolution**:
  - **Skip Duplicates**: Ignore records with existing asset numbers
  - **Overwrite**: Replace existing data with imported data
  - **Create New**: Generate new asset numbers for duplicates
- **Validation Level**:
  - **Strict**: Reject import if any errors found
  - **Permissive**: Import valid records, skip invalid ones

#### **Step 3.3: Final Confirmation**
- System shows final summary:
  - Total records to import
  - Records that will be created vs updated
  - Estimated processing time
  - Any remaining warnings
- User clicks **"Confirm Import"** to proceed

### 4. Processing & Monitoring Phase

#### **Step 4.1: Background Processing**
- Import runs in background (non-blocking)
- System processes records in batches of 100
- Real-time progress updates shown to user
- User can navigate away and return to check status

#### **Step 4.2: Progress Tracking**
- **Progress Bar**: Shows percentage completion
- **Current Status**: "Processing batch 3 of 15..."
- **Records Processed**: "1,247 of 2,500 records imported"
- **Estimated Time Remaining**: "~2 minutes remaining"

#### **Step 4.3: Error Handling**
- If errors occur during processing:
  - System continues with valid records
  - Errors are logged and reported
  - User receives detailed error report
  - Option to retry failed records

### 5. Completion & Review Phase

#### **Step 5.1: Import Summary**
- **Success Metrics**:
  - Total records imported successfully
  - Records created vs updated
  - Processing time taken
- **Error Report**:
  - Records that failed to import
  - Specific error messages
  - Suggestions for fixing issues

#### **Step 5.2: Data Verification**
- User can immediately view imported assets
- System highlights newly imported records
- Option to run data quality checks
- Integration with asset map view

#### **Step 5.3: Next Steps**
- **View Assets**: Navigate to asset list/map
- **Run Reports**: Generate asset reports
- **Schedule Inspections**: Set up inspection schedules
- **Import More Data**: Start another import process

## Excel Template Structure

### Required Fields (Must be mapped)

| Column Header | Data Type | Description | Example |
|---------------|-----------|-------------|---------|
| `asset_number` | Text | Unique asset identifier | "BLD-001" |
| `name` | Text | Asset name/title | "Main Administration Building" |
| `asset_type` | Enum | Type of asset | "BUILDING" |
| `status` | Enum | Current status | "ACTIVE" |
| `address` | Text | Physical address | "123 Main Street" |
| `suburb` | Text | Suburb name | "Melbourne" |
| `postcode` | Text | Postal code | "3000" |
| `state` | Text | State/Territory | "VIC" |

### Optional Fields (Can be mapped)

| Column Header | Data Type | Description | Example |
|---------------|-----------|-------------|---------|
| `description` | Text | Detailed description | "3-storey office building" |
| `condition` | Enum | Current condition | "GOOD" |
| `priority` | Enum | Priority level | "MEDIUM" |
| `manufacturer` | Text | Equipment manufacturer | "Caterpillar" |
| `model` | Text | Equipment model | "CAT 320D" |
| `serial_number` | Text | Serial number | "SN123456789" |
| `installation_date` | Date | Installation date | "2020-01-15" |
| `warranty_expiry` | Date | Warranty expiry | "2025-01-15" |
| `expected_lifespan` | Number | Lifespan in years | "25" |
| `purchase_price` | Currency | Purchase cost | "$150000.00" |
| `current_value` | Currency | Current value | "$120000.00" |
| `replacement_cost` | Currency | Replacement cost | "$180000.00" |
| `depreciation_rate` | Percentage | Annual depreciation | "4.00" |
| `last_inspection` | Date | Last inspection date | "2023-12-01" |
| `next_inspection` | Date | Next inspection due | "2024-03-01" |
| `inspection_frequency` | Number | Days between inspections | "90" |
| `maintenance_cost` | Currency | Annual maintenance cost | "$5000.00" |
| `tags` | Text | Comma-separated tags | "office,admin,headquarters" |
| `notes` | Text | Additional notes | "Recently renovated" |
| `latitude` | Number | GPS latitude | "-37.8136" |
| `longitude` | Number | GPS longitude | "144.9631" |

### Enum Values

#### Asset Types
```
BUILDING, ROAD, BRIDGE, FOOTPATH, PARK, PLAYGROUND, SPORTS_FACILITY, 
LIBRARY, COMMUNITY_CENTRE, CAR_PARK, STREET_FURNITURE, TRAFFIC_LIGHT, 
STREET_LIGHT, DRAINAGE, WATER_SUPPLY, SEWER, ELECTRICAL_INFRASTRUCTURE, 
TELECOMMUNICATIONS, OTHER
```

#### Asset Status
```
ACTIVE, INACTIVE, UNDER_CONSTRUCTION, UNDER_MAINTENANCE, 
DECOMMISSIONED, PLANNED
```

#### Asset Condition
```
EXCELLENT, GOOD, FAIR, POOR, CRITICAL, UNKNOWN
```

#### Asset Priority
```
LOW, MEDIUM, HIGH, CRITICAL
```

## Data Validation Rules

### Required Field Validation
- `asset_number`: Must be unique within organisation
- `name`: Cannot be empty
- `asset_type`: Must match enum values exactly
- `status`: Must match enum values exactly
- `address`: Cannot be empty
- `suburb`: Cannot be empty
- `postcode`: Must be valid Australian postcode format
- `state`: Must be valid Australian state abbreviation

### Data Type Validation
- **Dates**: Must be in format `YYYY-MM-DD` or `DD/MM/YYYY`
- **Currency**: Must be numeric, can include `$` symbol
- **Numbers**: Must be numeric, no text allowed
- **Percentages**: Must be numeric, can include `%` symbol
- **GPS Coordinates**: Must be valid decimal degrees

### Business Rule Validation
- **Installation Date**: Cannot be in the future
- **Warranty Expiry**: Must be after installation date
- **Expected Lifespan**: Must be positive number
- **Depreciation Rate**: Must be between 0-100%
- **Inspection Frequency**: Must be positive number
- **GPS Coordinates**: Must be within Australia bounds

### Geographic Validation
- **Postcode**: Must be valid Australian postcode
- **State**: Must match postcode state
- **Address**: Should be geocodable (if GPS not provided)

## Error Handling & Recovery

### Validation Errors
- **Field Required**: "Asset number is required for all records"
- **Invalid Enum**: "Asset type 'OFFICE' is not valid. Use: BUILDING, ROAD, etc."
- **Invalid Date**: "Installation date '32/13/2023' is not a valid date"
- **Duplicate Asset**: "Asset number 'BLD-001' already exists"
- **Invalid Postcode**: "Postcode '99999' is not valid for state 'VIC'"

### Processing Errors
- **Database Error**: "Failed to create asset BLD-001: Database connection error"
- **Geocoding Error**: "Could not geocode address '123 Main Street'"
- **File Error**: "Excel file appears to be corrupted"

### Recovery Options
- **Fix and Retry**: User can download error report, fix issues, and re-import
- **Skip Errors**: Continue with valid records, skip invalid ones
- **Partial Import**: Import valid records, provide detailed error report
- **Manual Review**: Flag problematic records for manual review

## Performance Considerations

### File Size Limits
- **Maximum File Size**: 50MB
- **Maximum Records**: 10,000 per import
- **Recommended Batch Size**: 1,000 records per batch

### Processing Performance
- **Background Processing**: Non-blocking import process
- **Batch Processing**: Process records in batches of 100
- **Progress Updates**: Real-time progress reporting
- **Memory Management**: Efficient memory usage for large files

### Scalability
- **Concurrent Imports**: Support multiple users importing simultaneously
- **Queue Management**: Import queue for high-volume scenarios
- **Resource Monitoring**: Monitor system resources during processing

## User Experience Best Practices

### Onboarding Integration
- **Trial Selection**: "Import Data" option during onboarding
- **Sample Data**: Provide sample Excel file for testing
- **Guided Tour**: Step-by-step import walkthrough
- **Help Documentation**: Contextual help throughout process

### Error Prevention
- **Template Download**: Pre-configured template with validation
- **Real-time Validation**: Immediate feedback during mapping
- **Preview Mode**: Show data before import
- **Confirmation Step**: Final review before processing

### User Support
- **Error Messages**: Clear, actionable error messages
- **Help Text**: Contextual help for each field
- **Video Tutorials**: Step-by-step video guides
- **Support Contact**: Easy access to support during import

## Technical Implementation

### Frontend Components
- **File Upload**: Drag-and-drop file upload component
- **Column Mapping**: Interactive column mapping interface
- **Data Preview**: Real-time data preview table
- **Progress Tracking**: Progress bar and status updates
- **Error Display**: Comprehensive error reporting

### Backend Services
- **File Processing**: Excel/CSV parsing service
- **Data Validation**: Comprehensive validation engine
- **Import Engine**: Batch processing service
- **Error Handling**: Robust error handling and reporting
- **Progress Tracking**: Real-time progress updates

### Database Operations
- **Batch Inserts**: Efficient bulk insert operations
- **Transaction Management**: Rollback on critical errors
- **Duplicate Handling**: Smart duplicate detection and resolution
- **Audit Logging**: Complete audit trail of import operations

## Future Enhancements

### Advanced Features
- **AI-Powered Mapping**: Automatic column mapping using AI
- **Data Transformation**: Built-in data transformation rules
- **Scheduled Imports**: Automated recurring imports
- **API Integration**: Direct integration with external systems
- **Data Quality Scoring**: Automated data quality assessment

### Enterprise Features
- **Multi-User Imports**: Collaborative import processes
- **Approval Workflows**: Import approval processes
- **Custom Validation**: Organisation-specific validation rules
- **Integration APIs**: REST APIs for external system integration
- **Advanced Analytics**: Import analytics and reporting

This comprehensive Excel import user journey ensures a smooth, user-friendly experience for councils migrating their existing asset data into Aegrid, while maintaining data quality and providing robust error handling throughout the process.
