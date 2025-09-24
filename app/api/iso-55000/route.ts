/**
 * ISO 55000 Compliance API Routes
 *
 * REST API endpoints for ISO 55000 compliance functionality including
 * policy framework, strategic planning, objectives, and performance evaluation
 */

import { authOptions } from '@/lib/auth';
import { createISO55000PolicyFramework } from '@/lib/iso-55000-policy-framework';
import { createStrategicAssetManagementPlan } from '@/lib/strategic-asset-management-plan';
import { createAssetManagementObjectives } from '@/lib/asset-management-objectives';
import { createPerformanceEvaluationSystem } from '@/lib/performance-evaluation-system';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for request body validation
const iso55000RequestSchema = z.object({
  operation: z.enum(['policy', 'strategic-plan', 'objectives', 'performance-evaluation']),
  action: z.string(),
  data: z.record(z.any()).optional(),
});

/**
 * GET /api/iso-55000
 * Get ISO 55000 compliance status and dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.organisationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const operation = searchParams.get('operation') as 'policy' | 'strategic-plan' | 'objectives' | 'performance-evaluation';
    const action = searchParams.get('action') || 'dashboard';

    if (!operation) {
      return NextResponse.json({ message: 'Operation parameter is required' }, { status: 400 });
    }

    switch (operation) {
      case 'policy':
        const policyFramework = createISO55000PolicyFramework(session.user.organisationId);
        
        switch (action) {
          case 'dashboard':
            const policyDashboard = await policyFramework.trackImplementationProgress();
            return NextResponse.json(policyDashboard, { status: 200 });
          
          case 'compliance-report':
            const complianceReport = await policyFramework.generateComplianceReport();
            return NextResponse.json(complianceReport, { status: 200 });
          
          case 'alignment-assessment':
            const documentId = searchParams.get('documentId');
            if (!documentId) {
              return NextResponse.json({ message: 'Document ID is required for alignment assessment' }, { status: 400 });
            }
            const alignmentAssessment = await policyFramework.assessPolicyAlignment(documentId);
            return NextResponse.json(alignmentAssessment, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for policy operation' }, { status: 400 });
        }

      case 'strategic-plan':
        const strategicPlan = createStrategicAssetManagementPlan(session.user.organisationId);
        
        switch (action) {
          case 'dashboard':
            const planId = searchParams.get('planId');
            if (!planId) {
              return NextResponse.json({ message: 'Plan ID is required for dashboard' }, { status: 400 });
            }
            const strategicDashboard = await strategicPlan.generateStrategicDashboard(planId);
            return NextResponse.json(strategicDashboard, { status: 200 });
          
          case 'implementation-progress':
            const progressPlanId = searchParams.get('planId');
            if (!progressPlanId) {
              return NextResponse.json({ message: 'Plan ID is required for implementation progress' }, { status: 400 });
            }
            const implementationProgress = await strategicPlan.trackImplementationProgress(progressPlanId);
            return NextResponse.json(implementationProgress, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for strategic-plan operation' }, { status: 400 });
        }

      case 'objectives':
        const objectives = createAssetManagementObjectives(session.user.organisationId);
        
        switch (action) {
          case 'dashboard':
            const objectivesDashboard = await objectives.generateKPIDashboard();
            return NextResponse.json(objectivesDashboard, { status: 200 });
          
          case 'achievement-tracking':
            const achievementTracking = await objectives.trackObjectiveAchievement();
            return NextResponse.json(achievementTracking, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for objectives operation' }, { status: 400 });
        }

      case 'performance-evaluation':
        const performanceEvaluation = createPerformanceEvaluationSystem(session.user.organisationId);
        
        switch (action) {
          case 'dashboard':
            const performanceDashboard = await performanceEvaluation.generatePerformanceDashboard();
            return NextResponse.json(performanceDashboard, { status: 200 });
          
          case 'compliance-status':
            const complianceStatus = await performanceEvaluation.trackComplianceStatus();
            return NextResponse.json(complianceStatus, { status: 200 });
          
          case 'audit-trail':
            const startDate = searchParams.get('startDate');
            const endDate = searchParams.get('endDate');
            if (!startDate || !endDate) {
              return NextResponse.json({ message: 'Start date and end date are required for audit trail' }, { status: 400 });
            }
            const auditTrail = await performanceEvaluation.generateAuditTrail(
              new Date(startDate),
              new Date(endDate)
            );
            return NextResponse.json(auditTrail, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for performance-evaluation operation' }, { status: 400 });
        }

      default:
        return NextResponse.json({ message: 'Invalid operation' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in ISO 55000 GET API:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

/**
 * POST /api/iso-55000
 * Create or update ISO 55000 compliance elements
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.organisationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = iso55000RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request body', errors: validation.error.errors }, { status: 400 });
    }

    const { operation, action, data } = validation.data;

    switch (operation) {
      case 'policy':
        const policyFramework = createISO55000PolicyFramework(session.user.organisationId);
        
        switch (action) {
          case 'create-policy':
            if (!data || !data.templateId || !data.variables || !data.createdBy) {
              return NextResponse.json({ message: 'Template ID, variables, and createdBy are required' }, { status: 400 });
            }
            const policyDocument = await policyFramework.createPolicyDocument(
              data.templateId,
              data.variables,
              data.createdBy
            );
            return NextResponse.json(policyDocument, { status: 201 });
          
          case 'review-policy':
            if (!data || !data.documentId || !data.reviewer || !data.comments || !data.action) {
              return NextResponse.json({ message: 'Document ID, reviewer, comments, and action are required' }, { status: 400 });
            }
            await policyFramework.reviewPolicyDocument(
              data.documentId,
              data.reviewer,
              data.comments,
              data.action,
              data.conditions
            );
            return NextResponse.json({ message: 'Policy review completed successfully' }, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for policy operation' }, { status: 400 });
        }

      case 'strategic-plan':
        const strategicPlan = createStrategicAssetManagementPlan(session.user.organisationId);
        
        switch (action) {
          case 'create-plan':
            if (!data || !data.title || !data.description || !data.planningHorizon || !data.createdBy) {
              return NextResponse.json({ message: 'Title, description, planning horizon, and createdBy are required' }, { status: 400 });
            }
            const strategicAssetPlan = await strategicPlan.createStrategicPlan(
              data.title,
              data.description,
              data.planningHorizon,
              data.createdBy
            );
            return NextResponse.json(strategicAssetPlan, { status: 201 });
          
          case 'add-objective':
            if (!data || !data.planId || !data.objective) {
              return NextResponse.json({ message: 'Plan ID and objective are required' }, { status: 400 });
            }
            await strategicPlan.addStrategicObjective(data.planId, data.objective);
            return NextResponse.json({ message: 'Strategic objective added successfully' }, { status: 200 });
          
          case 'add-strategy':
            if (!data || !data.planId || !data.strategy) {
              return NextResponse.json({ message: 'Plan ID and strategy are required' }, { status: 400 });
            }
            await strategicPlan.addAssetStrategy(data.planId, data.strategy);
            return NextResponse.json({ message: 'Asset strategy added successfully' }, { status: 200 });
          
          case 'create-scenario':
            if (!data || !data.planId || !data.scenario) {
              return NextResponse.json({ message: 'Plan ID and scenario are required' }, { status: 400 });
            }
            await strategicPlan.createScenarioAnalysis(data.planId, data.scenario);
            return NextResponse.json({ message: 'Scenario analysis created successfully' }, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for strategic-plan operation' }, { status: 400 });
        }

      case 'objectives':
        const objectives = createAssetManagementObjectives(session.user.organisationId);
        
        switch (action) {
          case 'create-objective':
            if (!data || !data.objective) {
              return NextResponse.json({ message: 'Objective data is required' }, { status: 400 });
            }
            const assetManagementObjective = await objectives.createObjective(data.objective);
            return NextResponse.json(assetManagementObjective, { status: 201 });
          
          case 'update-progress':
            if (!data || !data.objectiveId) {
              return NextResponse.json({ message: 'Objective ID is required' }, { status: 400 });
            }
            await objectives.updateObjectiveProgress(data.objectiveId);
            return NextResponse.json({ message: 'Objective progress updated successfully' }, { status: 200 });
          
          case 'performance-report':
            if (!data || !data.objectiveId) {
              return NextResponse.json({ message: 'Objective ID is required' }, { status: 400 });
            }
            const performanceReport = await objectives.generatePerformanceReport(data.objectiveId);
            return NextResponse.json(performanceReport, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for objectives operation' }, { status: 400 });
        }

      case 'performance-evaluation':
        const performanceEvaluation = createPerformanceEvaluationSystem(session.user.organisationId);
        
        switch (action) {
          case 'create-evaluation':
            if (!data || !data.title || !data.description || !data.evaluationPeriod || !data.scope || !data.createdBy) {
              return NextResponse.json({ message: 'Title, description, evaluation period, scope, and createdBy are required' }, { status: 400 });
            }
            const evaluation = await performanceEvaluation.createPerformanceEvaluation(
              data.title,
              data.description,
              data.evaluationPeriod,
              data.scope,
              data.createdBy
            );
            return NextResponse.json(evaluation, { status: 201 });
          
          case 'execute-evaluation':
            if (!data || !data.evaluationId) {
              return NextResponse.json({ message: 'Evaluation ID is required' }, { status: 400 });
            }
            await performanceEvaluation.executePerformanceEvaluation(data.evaluationId);
            return NextResponse.json({ message: 'Performance evaluation executed successfully' }, { status: 200 });
          
          case 'performance-report':
            if (!data || !data.evaluationId) {
              return NextResponse.json({ message: 'Evaluation ID is required' }, { status: 400 });
            }
            const evaluationReport = await performanceEvaluation.generatePerformanceReport(data.evaluationId);
            return NextResponse.json(evaluationReport, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for performance-evaluation operation' }, { status: 400 });
        }

      default:
        return NextResponse.json({ message: 'Invalid operation' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in ISO 55000 POST API:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

/**
 * PUT /api/iso-55000
 * Update existing ISO 55000 compliance elements
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.organisationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = iso55000RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request body', errors: validation.error.errors }, { status: 400 });
    }

    const { operation, action, data } = validation.data;

    switch (operation) {
      case 'policy':
        const policyFramework = createISO55000PolicyFramework(session.user.organisationId);
        
        switch (action) {
          case 'escalate-flag':
            if (!data || !data.flagId) {
              return NextResponse.json({ message: 'Flag ID is required' }, { status: 400 });
            }
            const escalatedFlag = await policyFramework.escalateRedFlag(data.flagId);
            return NextResponse.json(escalatedFlag, { status: 200 });
          
          default:
            return NextResponse.json({ message: 'Invalid action for policy operation' }, { status: 400 });
        }

      case 'strategic-plan':
        // Strategic plan updates would be handled here
        return NextResponse.json({ message: 'Strategic plan updates not yet implemented' }, { status: 501 });

      case 'objectives':
        // Objectives updates would be handled here
        return NextResponse.json({ message: 'Objectives updates not yet implemented' }, { status: 501 });

      case 'performance-evaluation':
        // Performance evaluation updates would be handled here
        return NextResponse.json({ message: 'Performance evaluation updates not yet implemented' }, { status: 501 });

      default:
        return NextResponse.json({ message: 'Invalid operation' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in ISO 55000 PUT API:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

/**
 * DELETE /api/iso-55000
 * Delete ISO 55000 compliance elements
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.organisationId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const operation = searchParams.get('operation');
    const id = searchParams.get('id');

    if (!operation || !id) {
      return NextResponse.json({ message: 'Operation and ID parameters are required' }, { status: 400 });
    }

    switch (operation) {
      case 'policy':
        // Policy deletion would be handled here
        return NextResponse.json({ message: 'Policy deletion not yet implemented' }, { status: 501 });

      case 'strategic-plan':
        // Strategic plan deletion would be handled here
        return NextResponse.json({ message: 'Strategic plan deletion not yet implemented' }, { status: 501 });

      case 'objectives':
        // Objectives deletion would be handled here
        return NextResponse.json({ message: 'Objectives deletion not yet implemented' }, { status: 501 });

      case 'performance-evaluation':
        // Performance evaluation deletion would be handled here
        return NextResponse.json({ message: 'Performance evaluation deletion not yet implemented' }, { status: 501 });

      default:
        return NextResponse.json({ message: 'Invalid operation' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in ISO 55000 DELETE API:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
