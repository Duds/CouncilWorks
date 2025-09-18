/**
 * Resilience Engine API Endpoints
 * 
 * RESTful API endpoints for resilience operations
 * Aligned with The Aegrid Rules for resilient asset management
 * 
 * @file app/api/resilience/route.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  ResilienceEngine, 
  createResilienceEngine, 
  defaultResilienceConfig 
} from '@/lib/resilience-engine';
import { 
  ResilienceResponse, 
  SignalProcessingRequest, 
  MarginAllocationRequest,
  ResilienceConfigUpdateRequest 
} from '@/types/resilience';

// Global resilience engine instance
let resilienceEngine: ResilienceEngine | null = null;

/**
 * Initialize resilience engine if not already initialized
 */
async function initializeResilienceEngine(): Promise<ResilienceEngine> {
  if (!resilienceEngine) {
    resilienceEngine = createResilienceEngine(defaultResilienceConfig);
    await resilienceEngine.initialize();
  }
  return resilienceEngine;
}

/**
 * GET /api/resilience
 * Get current resilience status and health
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!hasResiliencePermission(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Initialize resilience engine
    const engine = await initializeResilienceEngine();

    // Get resilience status
    const status = engine.getStatus();

    const response: ResilienceResponse = {
      success: true,
      data: status,
      timestamp: new Date(),
      metadata: {
        endpoint: '/api/resilience',
        method: 'GET',
        user: session.user.email
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ GET /api/resilience failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resilience
 * Process signals and update resilience state
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!hasResiliencePermission(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate request body
    if (!body.action) {
      return NextResponse.json(
        { success: false, error: 'Missing action parameter' },
        { status: 400 }
      );
    }

    // Initialize resilience engine
    const engine = await initializeResilienceEngine();

    let response: ResilienceResponse;

    // Handle different actions
    switch (body.action) {
      case 'process_signals':
        response = await handleProcessSignals(engine, body);
        break;
      
      case 'allocate_margin':
        response = await handleAllocateMargin(engine, body);
        break;
      
      case 'deploy_margin':
        response = await handleDeployMargin(engine, body);
        break;
      
      case 'update_config':
        response = await handleUpdateConfig(engine, body);
        break;
      
      case 'health_check':
        response = await handleHealthCheck(engine);
        break;
      
      case 'get_adaptive':
        response = await handleGetAdaptive(engine);
        break;
      
      case 'update_adaptive_config':
        response = await handleUpdateAdaptiveConfig(engine, body);
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${body.action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ POST /api/resilience failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/resilience
 * Update resilience configuration
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions - only admins can update configuration
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin permissions required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: ResilienceConfigUpdateRequest = await request.json();
    
    // Validate request body
    if (!body.updates) {
      return NextResponse.json(
        { success: false, error: 'Missing updates parameter' },
        { status: 400 }
      );
    }

    // Initialize resilience engine
    const engine = await initializeResilienceEngine();

    // Update configuration
    const response = await engine.updateConfig(body.updates);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ PUT /api/resilience failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resilience
 * Shutdown resilience engine (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check permissions - only admins can shutdown
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin permissions required' },
        { status: 403 }
      );
    }

    // Shutdown resilience engine
    if (resilienceEngine) {
      await resilienceEngine.shutdown();
      resilienceEngine = null;
    }

    const response: ResilienceResponse = {
      success: true,
      data: { message: 'Resilience engine shutdown successfully' },
      timestamp: new Date(),
      metadata: {
        endpoint: '/api/resilience',
        method: 'DELETE',
        user: session.user.email
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ DELETE /api/resilience failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Antifragile System Endpoints
// ============================================================================

/**
 * GET /api/resilience/antifragile - Get antifragile system status
 */
export async function GET_ANTIFRAGILE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasResiliencePermission(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access to antifragile system' },
        { status: 401 }
      );
    }

    if (!resilienceEngine) {
      return NextResponse.json(
        { error: 'Resilience engine not initialized' },
        { status: 503 }
      );
    }

    const antifragileStatus = resilienceEngine.getAntifragileStatus();
    const patterns = resilienceEngine.getAntifragilePatterns();
    const stressEvents = resilienceEngine.getStressEvents();
    const adaptationHistory = resilienceEngine.getAdaptationHistory();

    return NextResponse.json({
      success: true,
      data: {
        status: antifragileStatus,
        patterns,
        stressEvents: stressEvents.slice(-10), // Last 10 events
        adaptationHistory: adaptationHistory.slice(-20) // Last 20 adaptations
      }
    });

  } catch (error) {
    console.error('❌ Failed to get antifragile status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resilience/antifragile - Process stress event through antifragile system
 */
export async function POST_ANTIFRAGILE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasResiliencePermission(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access to antifragile system' },
        { status: 401 }
      );
    }

    if (!resilienceEngine) {
      return NextResponse.json(
        { error: 'Resilience engine not initialized' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { signals } = body;

    if (!signals || !Array.isArray(signals)) {
      return NextResponse.json(
        { error: 'Invalid signals data' },
        { status: 400 }
      );
    }

    // Process signals through resilience engine (which includes antifragile processing)
    const result = await resilienceEngine.processSignals(signals);

    if (result.success) {
      const antifragileStatus = resilienceEngine.getAntifragileStatus();
      
      return NextResponse.json({
        success: true,
        data: {
          processedSignals: result.data,
          antifragileStatus,
          message: 'Stress event processed successfully'
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to process stress event' 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Failed to process stress event:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resilience/adaptive - Get adaptive algorithm status
 */
export async function GET_ADAPTIVE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasResiliencePermission(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access to adaptive algorithms' },
        { status: 401 }
      );
    }

    if (!resilienceEngine) {
      return NextResponse.json(
        { error: 'Resilience engine not initialized' },
        { status: 503 }
      );
    }

    const adaptiveStatus = resilienceEngine.getAdaptiveAlgorithmStatus();
    const learningEvents = resilienceEngine.getLearningEvents();
    const models = resilienceEngine.getMachineLearningModels();

    return NextResponse.json({
      success: true,
      data: {
        status: adaptiveStatus,
        learningEvents: learningEvents.slice(-10), // Last 10 events
        models: models.map(model => ({
          ...model,
          trainingData: {
            ...model.trainingData,
            lastUpdated: model.trainingData.lastUpdated.toISOString()
          },
          performance: {
            ...model.performance,
            lastEvaluated: model.performance.lastEvaluated.toISOString()
          }
        }))
      }
    });

  } catch (error) {
    console.error('❌ Failed to get adaptive algorithm status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resilience/adaptive - Update adaptive algorithm configuration
 */
export async function POST_ADAPTIVE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !hasResiliencePermission(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access to adaptive algorithms' },
        { status: 401 }
      );
    }

    if (!resilienceEngine) {
      return NextResponse.json(
        { error: 'Resilience engine not initialized' },
        { status: 503 }
      );
    }

    const body = await request.json();
    if (!body.config) {
      return NextResponse.json(
        { error: 'Missing config parameter' },
        { status: 400 }
      );
    }

    resilienceEngine.updateAdaptiveAlgorithmConfig(body.config);

    return NextResponse.json({
      success: true,
      message: 'Adaptive algorithm configuration updated successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Failed to update adaptive algorithm config:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Handle get adaptive algorithm action
 */
async function handleGetAdaptive(engine: ResilienceEngine): Promise<ResilienceResponse> {
  const adaptiveStatus = engine.getAdaptiveAlgorithmStatus();
  const learningEvents = engine.getLearningEvents();
  const models = engine.getMachineLearningModels();

  return {
    success: true,
    data: {
      status: adaptiveStatus,
      learningEvents: learningEvents.slice(-10), // Last 10 events
      models: models.map(model => ({
        ...model,
        trainingData: {
          ...model.trainingData,
          lastUpdated: model.trainingData.lastUpdated.toISOString()
        },
        performance: {
          ...model.performance,
          lastEvaluated: model.performance.lastEvaluated.toISOString()
        }
      }))
    },
    timestamp: new Date()
  };
}

/**
 * Handle update adaptive algorithm configuration action
 */
async function handleUpdateAdaptiveConfig(
  engine: ResilienceEngine, 
  body: any
): Promise<ResilienceResponse> {
  if (!body.config) {
    throw new Error('Missing config parameter');
  }

  engine.updateAdaptiveAlgorithmConfig(body.config);

  return {
    success: true,
    message: 'Adaptive algorithm configuration updated successfully',
    timestamp: new Date()
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if user has resilience permissions
 */
function hasResiliencePermission(role: string): boolean {
  const resilienceRoles = ['ADMIN', 'MANAGER', 'SUPERVISOR', 'EXEC'];
  return resilienceRoles.includes(role);
}

/**
 * Handle process signals action
 */
async function handleProcessSignals(
  engine: ResilienceEngine, 
  body: SignalProcessingRequest
): Promise<ResilienceResponse> {
  if (!body.signals) {
    throw new Error('Missing signals parameter');
  }

  return await engine.processSignals(body.signals);
}

/**
 * Handle allocate margin action
 */
async function handleAllocateMargin(
  engine: ResilienceEngine, 
  body: MarginAllocationRequest
): Promise<ResilienceResponse> {
  if (!body.marginType || !body.amount || !body.reason) {
    throw new Error('Missing required parameters: marginType, amount, reason');
  }

  return await engine.allocateMargin(
    body.marginType,
    body.amount,
    body.reason
  );
}

/**
 * Handle deploy margin action
 */
async function handleDeployMargin(
  engine: ResilienceEngine, 
  body: MarginAllocationRequest
): Promise<ResilienceResponse> {
  if (!body.marginType || !body.amount || !body.reason) {
    throw new Error('Missing required parameters: marginType, amount, reason');
  }

  return await engine.deployMargin(
    body.marginType,
    body.amount,
    body.reason
  );
}

/**
 * Handle update config action
 */
async function handleUpdateConfig(
  engine: ResilienceEngine, 
  body: ResilienceConfigUpdateRequest
): Promise<ResilienceResponse> {
  if (!body.updates) {
    throw new Error('Missing updates parameter');
  }

  return await engine.updateConfig(body.updates);
}

/**
 * Handle health check action
 */
async function handleHealthCheck(engine: ResilienceEngine): Promise<ResilienceResponse> {
  const healthCheck = await engine.performHealthCheck();
  
  return {
    success: true,
    data: healthCheck,
    timestamp: new Date()
  };
}
