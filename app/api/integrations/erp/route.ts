// app/api/integrations/erp/route.ts

import { NextResponse } from 'next/server';
import { ERPIntegrationFramework, ERPConfig } from '@/lib/integrations/erp-integration-framework';
import { SAPIntegration, SAPConfig } from '@/lib/integrations/sap-integration';

export async function GET() {
  try {
    // Return available ERP integration types
    return NextResponse.json({
      availableIntegrations: ['SAP', 'Oracle', 'MicrosoftDynamics'],
      activeIntegrations: [],
      lastSyncTimes: {},
    });
  } catch (error) {
    console.error('Failed to get ERP integration status:', error);
    return NextResponse.json(
      { message: 'Failed to get ERP integration status' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, integrationType, config } = body;

    switch (action) {
      case 'initialize':
        return await initializeERPIntegration(integrationType, config);
      case 'sync':
        return await performERPSync(integrationType, config);
      case 'test':
        return await testERPConnection(integrationType, config);
      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('ERP integration request failed:', error);
    return NextResponse.json(
      { message: 'ERP integration request failed' },
      { status: 500 }
    );
  }
}

async function initializeERPIntegration(integrationType: string, config: any) {
  try {
    let integration: ERPIntegrationFramework;

    switch (integrationType) {
      case 'SAP':
        const sapConfig: SAPConfig = {
          systemType: 'SAP',
          endpoint: config.endpoint,
          credentials: config.credentials,
          dataMapping: config.dataMapping,
          syncSettings: config.syncSettings,
          sapSettings: config.sapSettings,
          rfcConnections: config.rfcConnections,
        };
        integration = new SAPIntegration(sapConfig);
        break;
      case 'Oracle':
        // Oracle integration would be implemented here
        throw new Error('Oracle integration not yet implemented');
      case 'MicrosoftDynamics':
        // Microsoft Dynamics integration would be implemented here
        throw new Error('Microsoft Dynamics integration not yet implemented');
      default:
        throw new Error(`Unsupported integration type: ${integrationType}`);
    }

    const success = await integration.initialize();
    
    if (success) {
      return NextResponse.json({
        message: `${integrationType} integration initialized successfully`,
        integrationType,
        status: 'active',
      });
    } else {
      return NextResponse.json(
        { message: `Failed to initialize ${integrationType} integration` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Failed to initialize ${integrationType} integration:`, error);
    return NextResponse.json(
      { message: `Failed to initialize ${integrationType} integration: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

async function performERPSync(integrationType: string, config: any) {
  try {
    let integration: ERPIntegrationFramework;

    switch (integrationType) {
      case 'SAP':
        const sapConfig: SAPConfig = {
          systemType: 'SAP',
          endpoint: config.endpoint,
          credentials: config.credentials,
          dataMapping: config.dataMapping,
          syncSettings: config.syncSettings,
          sapSettings: config.sapSettings,
          rfcConnections: config.rfcConnections,
        };
        integration = new SAPIntegration(sapConfig);
        break;
      default:
        throw new Error(`Unsupported integration type: ${integrationType}`);
    }

    await integration.initialize();
    
    // Perform full sync
    const results = await integration.performFullSync();
    
    return NextResponse.json({
      message: `${integrationType} sync completed`,
      results,
      totalRecordsProcessed: results.reduce((sum, result) => sum + result.recordsProcessed, 0),
      totalRecordsUpdated: results.reduce((sum, result) => sum + result.recordsUpdated, 0),
      totalRecordsCreated: results.reduce((sum, result) => sum + result.recordsCreated, 0),
      totalErrors: results.reduce((sum, result) => sum + result.errors.length, 0),
    });
  } catch (error) {
    console.error(`Failed to perform ${integrationType} sync:`, error);
    return NextResponse.json(
      { message: `Failed to perform ${integrationType} sync: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

async function testERPConnection(integrationType: string, config: any) {
  try {
    let integration: ERPIntegrationFramework;

    switch (integrationType) {
      case 'SAP':
        const sapConfig: SAPConfig = {
          systemType: 'SAP',
          endpoint: config.endpoint,
          credentials: config.credentials,
          dataMapping: config.dataMapping,
          syncSettings: config.syncSettings,
          sapSettings: config.sapSettings,
          rfcConnections: config.rfcConnections,
        };
        integration = new SAPIntegration(sapConfig);
        break;
      default:
        throw new Error(`Unsupported integration type: ${integrationType}`);
    }

    const success = await integration.initialize();
    
    return NextResponse.json({
      message: success ? 'Connection test successful' : 'Connection test failed',
      success,
      integrationType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to test ${integrationType} connection:`, error);
    return NextResponse.json(
      { message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
