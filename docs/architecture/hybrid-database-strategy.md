# Hybrid Database Architecture Strategy

**Version**: 1.0  
**Date**: January 15, 2025  
**Status**: Architecture Decision

## Overview

Aegrid will implement a **hybrid database architecture** that leverages both PostgreSQL and Azure Cosmos DB (Gremlin API) to support the Aegrid Rules while maintaining existing functionality and ensuring smooth migration.

## Current State Analysis

### PostgreSQL Strengths (Keep)
- **Transactional Data**: User accounts, authentication, audit logs, configuration
- **Relational Data**: Structured data with clear relationships (users, roles, permissions)
- **ACID Compliance**: Critical for financial and compliance data
- **PostGIS Integration**: Geographic data and spatial queries
- **Existing Investment**: Current schema, migrations, and team expertise
- **Performance**: Excellent for structured queries and reporting

### PostgreSQL Limitations (Address)
- **Complex Relationships**: Difficult to model multiple overlapping hierarchies
- **Function-Based Modeling**: Challenging to structure assets by service purpose
- **Graph Queries**: Complex JOINs for relationship traversal
- **Flexible Tagging**: Limited support for dynamic, multi-dimensional tagging
- **Future-Proof Hierarchies**: Difficult to adapt to organisational changes

## Hybrid Architecture Design

### Database Responsibilities

#### PostgreSQL (Primary Database)
**Purpose**: Core transactional and structured data
**Data Types**:
- User management and authentication
- Audit logs and compliance data
- Configuration and system settings
- Financial data and reporting
- Geographic data (PostGIS)
- Work orders and maintenance records
- Basic asset properties (name, location, value)

**Schema Focus**:
```sql
-- Core transactional tables remain in PostgreSQL
users, roles, permissions, audit_logs, 
configurations, work_orders, maintenance_records,
asset_basic_properties, locations, financial_data
```

#### Azure Cosmos DB Gremlin API (Graph Database)
**Purpose**: Asset relationships and intelligent modeling
**Data Types**:
- Asset relationships and dependencies
- Function-based hierarchies
- Risk assessments and criticality
- Tagging systems (function, risk, criticality, view)
- Multiple overlapping hierarchies
- Future scenario modeling

**Graph Focus**:
```cypher
-- Graph relationships in Cosmos DB
(asset:Asset)-[:PERFORMS_FUNCTION]->(function:ServiceFunction)
(asset:Asset)-[:HAS_RISK]->(risk:RiskAssessment)
(asset:Asset)-[:TAGGED_WITH]->(tag:FunctionTag)
(asset:Asset)-[:CRITICAL_FOR]->(consequence:FailureConsequence)
```

## Implementation Strategy

### Phase 1: Hybrid Setup (Weeks 1-4)
**Goal**: Establish dual database architecture without disrupting existing functionality

#### PostgreSQL Enhancements
- **Keep existing schema**: No breaking changes to current functionality
- **Add graph sync fields**: Add `graph_id` field to asset tables for Cosmos DB reference
- **Maintain PostGIS**: Continue using PostgreSQL for geographic data
- **Preserve transactions**: Keep all transactional data in PostgreSQL

#### Azure Cosmos DB Setup
- **Create Gremlin API database**: Set up Cosmos DB with Gremlin API
- **Design graph schema**: Implement Aegrid Rules-compliant graph model
- **Build sync service**: Create service to sync asset data between databases
- **Implement graph queries**: Build API endpoints for graph-based queries

#### Integration Layer
```typescript
// Example integration service
class AssetService {
  async getAsset(id: string) {
    // Get basic properties from PostgreSQL
    const basicData = await this.postgres.getAsset(id);
    
    // Get relationships and intelligence from Cosmos DB
    const graphData = await this.cosmos.getAssetRelationships(id);
    
    return { ...basicData, ...graphData };
  }
  
  async getAssetsByFunction(functionName: string) {
    // Query graph database for function-based assets
    return await this.cosmos.getAssetsByFunction(functionName);
  }
}
```

### Phase 2: Feature Migration (Weeks 5-12)
**Goal**: Gradually migrate asset intelligence features to graph database

#### Asset Intelligence Features
- **Function-based asset organization**: Move to Cosmos DB
- **Risk-based grouping**: Implement in graph database
- **Critical asset identification**: Use graph algorithms
- **Multiple hierarchy support**: Leverage graph relationships

#### Data Synchronization
- **Real-time sync**: Keep PostgreSQL and Cosmos DB in sync
- **Conflict resolution**: Handle data conflicts between databases
- **Backup strategy**: Ensure data integrity across both systems

### Phase 3: Advanced Features (Weeks 13-16)
**Goal**: Implement advanced graph-based features

#### Advanced Capabilities
- **Graph algorithms**: Shortest path, centrality, community detection
- **Predictive analytics**: Failure prediction using graph relationships
- **Scenario modeling**: Future planning with graph-based scenarios
- **Performance optimization**: Query optimization and caching

## Azure Database Integration

### Azure Cosmos DB Gremlin API

#### Setup and Configuration
```yaml
# Azure Cosmos DB Configuration
cosmos_db:
  account_name: "aegrid-graph"
  database_name: "asset_intelligence"
  container_name: "assets"
  partition_key: "/asset_id"
  throughput: 400  # RU/s
  consistency_level: "Session"
```

#### Connection Management
```typescript
// Cosmos DB connection service
class CosmosGraphService {
  private client: CosmosClient;
  private database: Database;
  private container: Container;
  
  async connect() {
    this.client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });
    
    this.database = this.client.database('asset_intelligence');
    this.container = this.database.container('assets');
  }
  
  async queryAssets(cypher: string) {
    // Execute Gremlin queries
    const query = this.container.items.query({
      query: cypher
    });
    
    return await query.fetchAll();
  }
}
```

#### Graph Schema Design
```cypher
// Asset node with properties
(asset:Asset {
  id: "asset_123",
  name: "Mowing Machine Alpha",
  value: 50000,
  location: "Depot A",
  graph_id: "gremlin_123"
})

// Function relationship
(asset:Asset)-[:PERFORMS_FUNCTION]->(function:ServiceFunction {
  name: "Mowing",
  category: "Landscaping",
  value_delivered: "Green Space Maintenance"
})

// Risk relationship
(asset:Asset)-[:HAS_RISK]->(risk:RiskAssessment {
  level: "Medium",
  failure_mode: "Engine Failure",
  consequence: "Service Disruption"
})

// Criticality tag
(asset:Asset)-[:TAGGED_WITH]->(tag:CriticalityTag {
  type: "criticality",
  value: "High",
  reason: "Safety Critical"
})
```

### Azure Integration Benefits

#### Managed Service Advantages
- **No Infrastructure Management**: Azure handles scaling, backups, and maintenance
- **Global Distribution**: Built-in global distribution for multi-region deployments
- **Automatic Scaling**: Scale throughput based on demand
- **Security**: Built-in encryption, network security, and access controls
- **Monitoring**: Integrated with Azure Monitor and Application Insights

#### Cost Management
- **Pay-per-use**: Only pay for consumed throughput (RU/s)
- **Serverless**: Automatic scaling without manual intervention
- **Reserved Capacity**: Discounts for committed usage
- **Free Tier**: 25 GB storage and 400 RU/s free per month

## Data Synchronization Strategy

### Synchronization Patterns

#### Real-time Sync (Critical Data)
```typescript
// Real-time synchronization for critical asset changes
class AssetSyncService {
  async updateAsset(assetId: string, updates: any) {
    // Update PostgreSQL first (source of truth)
    await this.postgres.updateAsset(assetId, updates);
    
    // Sync to Cosmos DB
    await this.cosmos.updateAssetGraph(assetId, updates);
    
    // Handle sync conflicts
    await this.handleSyncConflicts(assetId);
  }
}
```

#### Batch Sync (Non-critical Data)
```typescript
// Batch synchronization for less critical data
class BatchSyncService {
  async syncAssetHierarchies() {
    // Sync hierarchy changes in batches
    const changes = await this.postgres.getHierarchyChanges();
    
    for (const change of changes) {
      await this.cosmos.updateHierarchy(change);
    }
  }
}
```

### Conflict Resolution

#### Conflict Resolution Strategy
1. **PostgreSQL as Source of Truth**: For transactional data
2. **Cosmos DB as Intelligence Layer**: For relationships and analytics
3. **Last-Write-Wins**: For non-critical data conflicts
4. **Manual Resolution**: For critical data conflicts

#### Data Consistency
- **Eventual Consistency**: Acceptable for graph relationships
- **Strong Consistency**: Required for financial and compliance data
- **Conflict Detection**: Monitor and alert on data conflicts
- **Reconciliation**: Regular reconciliation processes

## Migration Timeline

### Week 1-2: Infrastructure Setup
- Set up Azure Cosmos DB Gremlin API
- Configure connection services
- Design graph schema
- Set up monitoring and logging

### Week 3-4: Basic Integration
- Implement data synchronization
- Create graph query APIs
- Build conflict resolution
- Test with sample data

### Week 5-8: Feature Migration
- Migrate function-based asset organization
- Implement risk-based grouping
- Add critical asset identification
- Test with real data

### Week 9-12: Advanced Features
- Implement multiple hierarchies
- Add graph algorithms
- Build predictive analytics
- Performance optimization

### Week 13-16: Production Readiness
- Load testing and optimization
- Security hardening
- Documentation and training
- Production deployment

## Risk Mitigation

### Technical Risks
- **Data Consistency**: Implement robust sync mechanisms
- **Performance**: Monitor and optimize query performance
- **Cost Management**: Monitor Cosmos DB usage and costs
- **Complexity**: Maintain clear separation of concerns

### Business Risks
- **Downtime**: Implement gradual migration with rollback capability
- **Data Loss**: Maintain comprehensive backups
- **User Experience**: Ensure seamless user experience during migration
- **Training**: Provide adequate training for new features

## Success Metrics

### Technical Metrics
- **Query Performance**: Graph queries < 100ms response time
- **Data Consistency**: < 0.1% sync conflicts
- **Availability**: 99.9% uptime for both databases
- **Cost Efficiency**: Cosmos DB costs < 20% of total database costs

### Business Metrics
- **User Adoption**: 80% of users using graph-based features
- **Feature Usage**: Function-based organization used by 90% of asset managers
- **Critical Asset Visibility**: 100% of critical assets properly identified
- **Maintenance Efficiency**: 25% improvement in maintenance planning

## Conclusion

The hybrid database architecture allows us to:

1. **Preserve Existing Investment**: Keep PostgreSQL for transactional data
2. **Enable Aegrid Rules**: Use Cosmos DB for function-based modeling
3. **Maintain Performance**: Leverage strengths of both databases
4. **Ensure Reliability**: Maintain data integrity and consistency
5. **Support Growth**: Scale both databases independently

This approach provides the best of both worlds: the reliability and performance of PostgreSQL for core operations, and the flexibility and intelligence of Cosmos DB for advanced asset management features that support the Aegrid Rules.
