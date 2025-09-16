# Aegrid Asset Import Template

## Instructions

This Excel template is designed to help you import your existing asset data into Aegrid. Follow these steps:

1. **Download this template** and save it as `Aegrid_Asset_Import_Template.xlsx`
2. **Copy your data** into the appropriate columns
3. **Map your columns** to the Aegrid field names (see mapping guide below)
4. **Validate your data** using the validation rules
5. **Upload the file** through the Aegrid import interface

## Required Fields (Must be filled)

These fields are mandatory and must be present in your import file:

| Column | Field Name | Data Type | Description | Example | Validation Rules |
|--------|------------|-----------|-------------|---------|------------------|
| A | asset_number | Text | Unique asset identifier | BLD-001 | Must be unique, no duplicates |
| B | name | Text | Asset name/title | Main Administration Building | Cannot be empty |
| C | asset_type | Enum | Type of asset | BUILDING | Must match enum values exactly |
| D | status | Enum | Current status | ACTIVE | Must match enum values exactly |
| E | address | Text | Physical address | 123 Main Street | Cannot be empty |
| F | suburb | Text | Suburb name | Melbourne | Cannot be empty |
| G | postcode | Text | Postal code | 3000 | Must be valid Australian postcode |
| H | state | Text | State/Territory | VIC | Must be valid state abbreviation |

## Optional Fields (Can be filled)

These fields provide additional asset information:

| Column | Field Name | Data Type | Description | Example | Validation Rules |
|--------|------------|-----------|-------------|---------|------------------|
| I | description | Text | Detailed description | 3-storey office building | Free text |
| J | condition | Enum | Current condition | GOOD | Must match enum values |
| K | priority | Enum | Priority level | MEDIUM | Must match enum values |
| L | manufacturer | Text | Equipment manufacturer | Caterpillar | Free text |
| M | model | Text | Equipment model | CAT 320D | Free text |
| N | serial_number | Text | Serial number | SN123456789 | Free text |
| O | installation_date | Date | Installation date | 2020-01-15 | Format: YYYY-MM-DD or DD/MM/YYYY |
| P | warranty_expiry | Date | Warranty expiry | 2025-01-15 | Must be after installation date |
| Q | expected_lifespan | Number | Lifespan in years | 25 | Must be positive number |
| R | purchase_price | Currency | Purchase cost | $150000.00 | Must be numeric |
| S | current_value | Currency | Current value | $120000.00 | Must be numeric |
| T | replacement_cost | Currency | Replacement cost | $180000.00 | Must be numeric |
| U | depreciation_rate | Percentage | Annual depreciation | 4.00 | Must be 0-100% |
| V | last_inspection | Date | Last inspection date | 2023-12-01 | Format: YYYY-MM-DD or DD/MM/YYYY |
| W | next_inspection | Date | Next inspection due | 2024-03-01 | Format: YYYY-MM-DD or DD/MM/YYYY |
| X | inspection_frequency | Number | Days between inspections | 90 | Must be positive number |
| Y | maintenance_cost | Currency | Annual maintenance cost | $5000.00 | Must be numeric |
| Z | tags | Text | Comma-separated tags | office,admin,headquarters | Comma-separated list |
| AA | notes | Text | Additional notes | Recently renovated | Free text |
| AB | latitude | Number | GPS latitude | -37.8136 | Must be valid decimal degrees |
| AC | longitude | Number | GPS longitude | 144.9631 | Must be valid decimal degrees |

## Enum Values Reference

### Asset Types
```
BUILDING          - Buildings and structures
ROAD              - Roads and highways
BRIDGE            - Bridges and overpasses
FOOTPATH          - Footpaths and walkways
PARK              - Parks and recreational areas
PLAYGROUND        - Playground equipment
SPORTS_FACILITY   - Sports facilities and courts
LIBRARY           - Libraries
COMMUNITY_CENTRE  - Community centres
CAR_PARK          - Car parks and parking areas
STREET_FURNITURE  - Street furniture and fixtures
TRAFFIC_LIGHT     - Traffic lights and signals
STREET_LIGHT      - Street lighting
DRAINAGE          - Drainage systems
WATER_SUPPLY      - Water supply infrastructure
SEWER             - Sewer systems
ELECTRICAL_INFRASTRUCTURE - Electrical infrastructure
TELECOMMUNICATIONS - Telecommunications infrastructure
OTHER             - Other asset types
```

### Asset Status
```
ACTIVE            - Currently in use
INACTIVE          - Not currently in use
UNDER_CONSTRUCTION - Under construction
UNDER_MAINTENANCE - Under maintenance
DECOMMISSIONED    - Decommissioned/retired
PLANNED           - Planned for future
```

### Asset Condition
```
EXCELLENT         - Excellent condition
GOOD              - Good condition
FAIR              - Fair condition
POOR              - Poor condition
CRITICAL          - Critical condition requiring attention
UNKNOWN           - Condition unknown
```

### Asset Priority
```
LOW               - Low priority
MEDIUM            - Medium priority
HIGH              - High priority
CRITICAL          - Critical priority
```

## Sample Data

Here are some example records to help you understand the format:

| asset_number | name | asset_type | status | address | suburb | postcode | state | condition | priority |
|--------------|------|------------|--------|---------|--------|----------|-------|-----------|----------|
| BLD-001 | Main Administration Building | BUILDING | ACTIVE | 123 Main Street | Melbourne | 3000 | VIC | GOOD | MEDIUM |
| RD-001 | Main Street Road | ROAD | ACTIVE | Main Street | Melbourne | 3000 | VIC | FAIR | HIGH |
| PL-001 | Central Park Playground | PLAYGROUND | ACTIVE | Central Park | Melbourne | 3000 | VIC | EXCELLENT | LOW |
| EQ-001 | Street Lighting System | STREET_LIGHT | ACTIVE | Main Street Corridor | Melbourne | 3000 | VIC | GOOD | MEDIUM |

## Data Validation Rules

### Required Field Validation
- **asset_number**: Must be unique within your organisation
- **name**: Cannot be empty or just spaces
- **asset_type**: Must match one of the enum values exactly (case-sensitive)
- **status**: Must match one of the enum values exactly (case-sensitive)
- **address**: Cannot be empty
- **suburb**: Cannot be empty
- **postcode**: Must be a valid Australian postcode (4 digits)
- **state**: Must be a valid Australian state abbreviation (VIC, NSW, QLD, SA, WA, TAS, NT, ACT)

### Data Type Validation
- **Dates**: Use format YYYY-MM-DD (e.g., 2020-01-15) or DD/MM/YYYY (e.g., 15/01/2020)
- **Currency**: Enter as numbers only (e.g., 150000) or with $ symbol (e.g., $150000)
- **Numbers**: Must be numeric only, no text or special characters
- **Percentages**: Enter as numbers (e.g., 4.00 for 4%)
- **GPS Coordinates**: Must be valid decimal degrees (latitude: -90 to 90, longitude: -180 to 180)

### Business Rule Validation
- **Installation Date**: Cannot be in the future
- **Warranty Expiry**: Must be after installation date
- **Expected Lifespan**: Must be a positive number
- **Depreciation Rate**: Must be between 0 and 100
- **Inspection Frequency**: Must be a positive number
- **GPS Coordinates**: Must be within Australia bounds (approximate: lat -44 to -10, lon 113 to 154)

## Common Import Issues & Solutions

### Issue: "Asset number already exists"
**Solution**: Ensure each asset_number is unique. If updating existing assets, use the "Update Existing" import mode.

### Issue: "Invalid asset type"
**Solution**: Check that asset_type exactly matches one of the enum values. Use the reference table above.

### Issue: "Invalid postcode for state"
**Solution**: Verify that the postcode matches the state. For example, postcode 3000 belongs to VIC, not NSW.

### Issue: "Invalid date format"
**Solution**: Use YYYY-MM-DD format (e.g., 2020-01-15) or DD/MM/YYYY format (e.g., 15/01/2020).

### Issue: "GPS coordinates out of bounds"
**Solution**: Ensure latitude is between -44 and -10, longitude is between 113 and 154 for Australia.

## Tips for Successful Import

1. **Start Small**: Test with a small sample of data first
2. **Use Template**: Download and use this template to ensure proper formatting
3. **Validate Data**: Check your data against the validation rules before importing
4. **Check Enums**: Ensure all enum values match exactly (case-sensitive)
5. **Unique IDs**: Make sure asset numbers are unique within your organisation
6. **Complete Addresses**: Provide complete address information for better geocoding
7. **Backup Data**: Keep a backup of your original data before importing

## Support

If you encounter issues during the import process:

1. **Check Error Messages**: Review any error messages carefully
2. **Validate Data**: Use the validation rules to check your data
3. **Contact Support**: Reach out to our support team with specific error details
4. **Review Documentation**: Check the full import documentation for detailed guidance

## Next Steps After Import

Once your data is successfully imported:

1. **Review Assets**: Check the asset list to verify your data
2. **View on Map**: Use the map view to see your assets geographically
3. **Run Reports**: Generate reports to analyse your asset data
4. **Schedule Inspections**: Set up inspection schedules for your assets
5. **Configure Maintenance**: Set up maintenance schedules and workflows

---

**Template Version**: 1.0  
**Last Updated**: September 2024  
**Compatible with**: Aegrid v0.2.0+
