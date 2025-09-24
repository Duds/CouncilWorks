# Customer Journey Documentation

This directory contains customer journey documentation organized by persona role and system-wide processes.

## Directory Structure

### Persona-Specific Journeys

- **`admin/`** - System administrator journeys and workflows
  - `admin-journey.puml` - PlantUML diagram source
  - `admin-journey.png` - Generated diagram image

- **`citizen/`** - Citizen/public user journeys and workflows
  - `citizen-journey.puml` - PlantUML diagram source
  - `citizen-journey.png` - Generated diagram image

- **`crew/`** - Field crew member journeys and workflows
  - `crew-journey.puml` - PlantUML diagram source
  - `crew-journey.png` - Generated diagram image

- **`executive/`** - Executive-level journeys and workflows
  - `executive-journey.puml` - PlantUML diagram source
  - `executive-journey.png` - Generated diagram image

- **`manager/`** - Manager-level journeys and workflows
  - `manager-journey.puml` - PlantUML diagram source
  - `manager-journey.png` - Generated diagram image

- **`supervisor/`** - Supervisor-level journeys and workflows
  - `supervisor-journey.puml` - PlantUML diagram source
  - `supervisor-journey.png` - Generated diagram image

- **`partner-contractor-vendor/`** - External partner journeys and workflows
  - `partner-contractor-vendor-journey.puml` - PlantUML diagram source
  - `partner-contractor-vendor-journey.png` - Generated diagram image

### System-Wide Journeys

- **`system-wide/`** - Cross-functional and system-wide processes
  - `journey-overview.puml` - Overall journey overview diagram
  - `journey-overview.png` - Generated overview image
  - `margin-management-journey.puml` - Margin management process diagram
  - `margin-management-journey.png` - Generated margin management image
  - `resilience-journey.puml` - Resilience engineering process diagram
  - `resilience-journey.png` - Generated resilience image

### Archive

- **`archive/`** - Archived or deprecated journey documentation

## Usage

Each persona directory contains:

- **`.puml` files**: PlantUML source code for journey diagrams
- **`.png` files**: Generated diagram images for documentation

To regenerate diagram images from PlantUML source:

```bash
# Install PlantUML (if not already installed)
# Then generate images from source files
plantuml *.puml
```

## Journey Mapping Standards

All customer journeys follow these principles:

- **Aegrid Rules Alignment**: Each journey demonstrates application of The Aegrid Rules
- **Role-Based Access**: Journeys reflect appropriate RBAC permissions
- **Industry Standards**: Terminology and workflows align with asset management best practices
- **User-Centric Design**: Focus on user needs and workflows, not system features

## Related Documentation

- `../../core/aegrid-rules.md` - The Aegrid Rules framework
- `../../development/developer-brief.md` - Development standards and guidelines
- `../SAD.md` - System Architecture Document
