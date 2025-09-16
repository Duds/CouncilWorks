/**
 * Advanced Analytics & AI API Endpoints
 * 
 * Implements API endpoints for predictive analytics, AI intelligence, and decision support
 * 
 * @fileoverview Advanced analytics and AI API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { predictiveAnalyticsEngine } from '@/lib/analytics/predictive-engine';
import { aiPoweredAssetIntelligence } from '@/lib/analytics/ai-intelligence';
import { intelligentDecisionSupport } from '@/lib/analytics/decision-support';

/**
 * GET /api/analytics/models
 * Get predictive models
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    let models;
    if (type) {
      models = predictiveAnalyticsEngine.getModelsByType(type as any);
    } else if (status) {
      models = predictiveAnalyticsEngine.getAllModels().filter(m => m.status === status);
    } else {
      models = predictiveAnalyticsEngine.getAllModels();
    }

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error getting models:', error);
    return NextResponse.json(
      { error: 'Failed to get models' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/models/{modelId}/predict
 * Create prediction using model
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { modelId } = params;
    const { assetId, features } = await request.json();

    if (!assetId || !features) {
      return NextResponse.json(
        { error: 'Asset ID and features are required' },
        { status: 400 }
      );
    }

    const prediction = await predictiveAnalyticsEngine.createPrediction(modelId, assetId, features);

    return NextResponse.json({
      prediction,
      modelId,
      assetId,
    });
  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/models/{modelId}/train
 * Train model
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { modelId } = params;
    const { trainingData } = await request.json();

    await predictiveAnalyticsEngine.trainModel(modelId, trainingData || []);

    return NextResponse.json({
      message: 'Model training initiated',
      modelId,
    });
  } catch (error) {
    console.error('Error training model:', error);
    return NextResponse.json(
      { error: 'Failed to train model' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/models/{modelId}/deploy
 * Deploy model
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { modelId } = params;

    await predictiveAnalyticsEngine.deployModel(modelId);

    return NextResponse.json({
      message: 'Model deployed successfully',
      modelId,
    });
  } catch (error) {
    console.error('Error deploying model:', error);
    return NextResponse.json(
      { error: 'Failed to deploy model' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/intelligence
 * Get AI intelligence insights
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');

    let intelligence;
    if (assetId) {
      intelligence = aiPoweredAssetIntelligence.getIntelligenceForAsset(assetId);
    } else if (type) {
      intelligence = aiPoweredAssetIntelligence.getIntelligenceByType(type as any);
    } else if (severity) {
      intelligence = aiPoweredAssetIntelligence.getActiveIntelligence().filter(
        i => i.severity === severity
      );
    } else {
      intelligence = aiPoweredAssetIntelligence.getActiveIntelligence();
    }

    return NextResponse.json({ intelligence });
  } catch (error) {
    console.error('Error getting intelligence:', error);
    return NextResponse.json(
      { error: 'Failed to get intelligence' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/intelligence/generate
 * Generate AI insights for asset
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assetId, data } = await request.json();

    if (!assetId || !data) {
      return NextResponse.json(
        { error: 'Asset ID and data are required' },
        { status: 400 }
      );
    }

    const insights = await aiPoweredAssetIntelligence.generateInsights(assetId, data);

    return NextResponse.json({
      insights,
      assetId,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/intelligence/{intelligenceId}/acknowledge
 * Acknowledge intelligence insight
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { intelligenceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { intelligenceId } = params;
    const { userId } = await request.json();

    aiPoweredAssetIntelligence.acknowledgeIntelligence(intelligenceId, userId);

    return NextResponse.json({
      message: 'Intelligence acknowledged',
      intelligenceId,
    });
  } catch (error) {
    console.error('Error acknowledging intelligence:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge intelligence' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/workflows
 * Get AI workflows
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflows = aiPoweredAssetIntelligence.getAllWorkflows();

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Error getting workflows:', error);
    return NextResponse.json(
      { error: 'Failed to get workflows' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/workflows/{workflowId}/execute
 * Execute AI workflow
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workflowId } = params;
    const { context } = await request.json();

    await aiPoweredAssetIntelligence.executeWorkflow(workflowId, context || {});

    return NextResponse.json({
      message: 'Workflow executed successfully',
      workflowId,
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/dashboards
 * Get analytics dashboards
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let dashboards;
    if (type === 'predictive') {
      dashboards = predictiveAnalyticsEngine.getAllDashboards();
    } else if (type === 'ai') {
      dashboards = aiPoweredAssetIntelligence.getAllDashboards();
    } else {
      dashboards = [
        ...predictiveAnalyticsEngine.getAllDashboards(),
        ...aiPoweredAssetIntelligence.getAllDashboards(),
      ];
    }

    return NextResponse.json({ dashboards });
  } catch (error) {
    console.error('Error getting dashboards:', error);
    return NextResponse.json(
      { error: 'Failed to get dashboards' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/reports
 * Get analytics reports
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reports = predictiveAnalyticsEngine.getAllReports();

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error getting reports:', error);
    return NextResponse.json(
      { error: 'Failed to get reports' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/decisions
 * Get decision scenarios
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let scenarios;
    if (status) {
      scenarios = intelligentDecisionSupport.getScenariosByStatus(status as any);
    } else if (priority) {
      scenarios = intelligentDecisionSupport.getScenariosByPriority(priority as any);
    } else {
      scenarios = intelligentDecisionSupport.getAllScenarios();
    }

    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Error getting scenarios:', error);
    return NextResponse.json(
      { error: 'Failed to get scenarios' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/decisions
 * Create decision scenario
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scenarioData = await request.json();

    const scenarioId = intelligentDecisionSupport.createScenario(scenarioData);

    return NextResponse.json({
      message: 'Scenario created successfully',
      scenarioId,
    });
  } catch (error) {
    console.error('Error creating scenario:', error);
    return NextResponse.json(
      { error: 'Failed to create scenario' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/decisions/{scenarioId}/analyze
 * Analyze decision scenario
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { scenarioId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scenarioId } = params;

    const recommendation = await intelligentDecisionSupport.analyzeScenario(scenarioId);

    return NextResponse.json({
      recommendation,
      scenarioId,
    });
  } catch (error) {
    console.error('Error analyzing scenario:', error);
    return NextResponse.json(
      { error: 'Failed to analyze scenario' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/decisions/{scenarioId}/approve
 * Approve decision scenario
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { scenarioId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scenarioId } = params;
    const { approver, comments } = await request.json();

    intelligentDecisionSupport.approveScenario(scenarioId, approver, comments);

    return NextResponse.json({
      message: 'Scenario approved',
      scenarioId,
    });
  } catch (error) {
    console.error('Error approving scenario:', error);
    return NextResponse.json(
      { error: 'Failed to approve scenario' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/decisions/{scenarioId}/reject
 * Reject decision scenario
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { scenarioId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scenarioId } = params;
    const { rejector, reason } = await request.json();

    intelligentDecisionSupport.rejectScenario(scenarioId, rejector, reason);

    return NextResponse.json({
      message: 'Scenario rejected',
      scenarioId,
    });
  } catch (error) {
    console.error('Error rejecting scenario:', error);
    return NextResponse.json(
      { error: 'Failed to reject scenario' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/templates
 * Get decision templates
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = intelligentDecisionSupport.getAllTemplates();

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error getting templates:', error);
    return NextResponse.json(
      { error: 'Failed to get templates' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/rules
 * Get decision rules
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rules = intelligentDecisionSupport.getAllRules();

    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Error getting rules:', error);
    return NextResponse.json(
      { error: 'Failed to get rules' },
      { status: 500 }
    );
  }
}
