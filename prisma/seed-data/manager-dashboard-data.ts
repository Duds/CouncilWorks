/**
 * Manager Dashboard Data Seeder
 * 
 * Creates comprehensive seed data for Manager Dashboard, Critical Controls,
 * Risk Planner, Margin Management, Demo scenarios, Citizen Dashboard,
 * and Asset Intelligence data.
 * 
 * This replaces all hard-coded mock data with proper database records.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedManagerDashboardData(organisationId: string) {
  console.log('📊 Seeding Manager Dashboard data...');

  try {
    // 1. Create Manager Metrics
    await seedManagerMetrics(organisationId);
    
    // 2. Create Margin Status data
    await seedMarginStatus(organisationId);
    
    // 3. Create Risk Trends
    await seedRiskTrends(organisationId);
    
    // 4. Create Demo Scenarios
    await seedDemoScenarios(organisationId);
    
    // 5. Create Citizen Dashboard Stats
    await seedCitizenDashboardStats(organisationId);
    
    // 6. Create Asset Intelligence Data
    await seedAssetIntelligenceData(organisationId);

    console.log('✅ Manager Dashboard data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Manager Dashboard data:', error);
    throw error;
  }
}

async function seedManagerMetrics(organisationId: string) {
  console.log('📈 Creating Manager Metrics...');

  const metrics = [
    {
      organisationId,
      overallScore: 87.5,
      criticalControls: 267,
      marginUtilization: 86.2,
      riskTrend: -12.3, // Improving trend
      signalResponse: 94.7,
      antifragileScore: 91.8,
      timeRange: '7d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      overallScore: 89.2,
      criticalControls: 267,
      marginUtilization: 88.1,
      riskTrend: -8.7,
      signalResponse: 96.1,
      antifragileScore: 93.4,
      timeRange: '30d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      overallScore: 91.7,
      criticalControls: 267,
      marginUtilization: 89.5,
      riskTrend: -15.2,
      signalResponse: 97.3,
      antifragileScore: 95.1,
      timeRange: '90d',
      calculatedAt: new Date(),
    },
  ];

  for (const metric of metrics) {
    await prisma.managerMetrics.create({
      data: metric,
    });
  }
}

async function seedMarginStatus(organisationId: string) {
  console.log('⏱️ Creating Margin Status data...');

  const marginStatuses = [
    {
      organisationId,
      marginType: 'time',
      utilizationRate: 86.2,
      availableCapacity: 13.8,
      totalCapacity: 100.0,
      status: 'optimal',
      lastUpdated: new Date(),
    },
    {
      organisationId,
      marginType: 'resource',
      utilizationRate: 78.5,
      availableCapacity: 21.5,
      totalCapacity: 100.0,
      status: 'healthy',
      lastUpdated: new Date(),
    },
    {
      organisationId,
      marginType: 'financial',
      utilizationRate: 92.1,
      availableCapacity: 7.9,
      totalCapacity: 100.0,
      status: 'warning',
      lastUpdated: new Date(),
    },
    {
      organisationId,
      marginType: 'capacity',
      utilizationRate: 73.8,
      availableCapacity: 26.2,
      totalCapacity: 100.0,
      status: 'healthy',
      lastUpdated: new Date(),
    },
  ];

  for (const status of marginStatuses) {
    await prisma.marginStatus.create({
      data: status,
    });
  }
}

async function seedRiskTrends(organisationId: string) {
  console.log('📊 Creating Risk Trends...');

  // Get some assets to create risk trends for
  const assets = await prisma.asset.findMany({
    where: { organisationId },
    select: { id: true, name: true },
    take: 10,
  });

  const riskTrends = [
    {
      organisationId,
      assetId: assets[0]?.id,
      riskScore: 95.0,
      trend: 'down',
      period: '7d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      assetId: assets[1]?.id,
      riskScore: 78.0,
      trend: 'stable',
      period: '7d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      assetId: assets[2]?.id,
      riskScore: 65.0,
      trend: 'down',
      period: '7d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      assetId: assets[3]?.id,
      riskScore: 72.0,
      trend: 'up',
      period: '7d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      assetId: assets[4]?.id,
      riskScore: 88.0,
      trend: 'stable',
      period: '7d',
      calculatedAt: new Date(),
    },
  ];

  for (const trend of riskTrends) {
    await prisma.riskTrend.create({
      data: trend,
    });
  }
}

async function seedDemoScenarios(organisationId: string) {
  console.log('🎭 Creating Demo Scenarios...');

  const scenarios = [
    {
      organisationId,
      scenarioType: 'default',
      title: 'Aegrid Resilience Demo',
      description: 'Comprehensive demonstration of The Aegrid Rules in action',
      narrative: 'See how Aegrid transforms reactive maintenance into proactive risk management',
      metrics: {
        resilienceImprovement: 87,
        costReduction: 23,
        downtimeReduction: 45,
        stakeholderSatisfaction: 94,
      },
      keyStories: [
        {
          rule: 'Rule 1: Every Asset Has a Purpose',
          story: 'Critical water treatment plant identified and prioritized based on service purpose',
          impact: '50,000 residents protected from water service disruption',
          metrics: '95% risk score → 15% risk score through purpose-driven management',
        },
        {
          rule: 'Rule 2: Risk Sets the Rhythm',
          story: 'Dynamic scheduling adapts to weather conditions and asset condition signals',
          impact: 'Emergency response time reduced from 4 hours to 45 minutes',
          metrics: 'Risk-based scheduling prevents 3 critical failures this quarter',
        },
        {
          rule: 'Rule 3: Respond to the Real World',
          story: 'Real-time signal detection prevents major infrastructure failure',
          impact: 'Early warning system prevents $2.3M in emergency repairs',
          metrics: 'Signal response time: 30 seconds average',
        },
        {
          rule: 'Rule 4: Operate with Margin',
          story: 'Antifragile systems improve performance under stress',
          impact: 'System resilience increased 12% during peak demand periods',
          metrics: '86% margin utilization with 94% availability',
        },
      ],
      isActive: true,
    },
    {
      organisationId,
      scenarioType: 'crisis',
      title: 'Crisis Response Scenario',
      description: 'How Aegrid responds to emergency situations',
      narrative: 'Demonstrates rapid response and recovery capabilities during crisis events',
      metrics: {
        resilienceImprovement: 92,
        costReduction: 18,
        downtimeReduction: 38,
        stakeholderSatisfaction: 89,
      },
      keyStories: [
        {
          rule: 'Rule 1: Every Asset Has a Purpose',
          story: 'Critical assets prioritized during emergency response',
          impact: 'Essential services maintained during crisis',
          metrics: '100% critical asset availability during emergency',
        },
        {
          rule: 'Rule 2: Risk Sets the Rhythm',
          story: 'Emergency protocols activated based on risk assessment',
          impact: 'Response time reduced by 60%',
          metrics: 'Emergency response: 15 minutes average',
        },
        {
          rule: 'Rule 3: Respond to the Real World',
          story: 'Real-time crisis monitoring and response',
          impact: 'Crisis impact minimized through rapid response',
          metrics: 'Crisis resolution: 2 hours average',
        },
        {
          rule: 'Rule 4: Operate with Margin',
          story: 'Emergency reserves activated during crisis',
          impact: 'System stability maintained under extreme stress',
          metrics: 'Emergency margin utilization: 95%',
        },
      ],
      isActive: false,
    },
    {
      organisationId,
      scenarioType: 'optimization',
      title: 'Continuous Improvement Scenario',
      description: 'How Aegrid learns and improves over time',
      narrative: 'Antifragile systems demonstrate continuous improvement under stress',
      metrics: {
        resilienceImprovement: 95,
        costReduction: 28,
        downtimeReduction: 52,
        stakeholderSatisfaction: 97,
      },
      keyStories: [
        {
          rule: 'Rule 1: Every Asset Has a Purpose',
          story: 'Purpose-driven optimization improves asset efficiency',
          impact: 'Asset utilization increased 15% through better purpose alignment',
          metrics: 'Purpose-driven optimization saves $1.2M annually',
        },
        {
          rule: 'Rule 2: Risk Sets the Rhythm',
          story: 'Machine learning improves risk assessment accuracy',
          impact: 'Risk prediction accuracy improved to 94%',
          metrics: 'Predictive maintenance prevents 89% of potential failures',
        },
        {
          rule: 'Rule 3: Respond to the Real World',
          story: 'Adaptive algorithms optimize response strategies',
          impact: 'Response effectiveness improved 23% through learning',
          metrics: 'Adaptive response algorithms reduce false alarms by 67%',
        },
        {
          rule: 'Rule 4: Operate with Margin',
          story: 'Antifragile systems demonstrate improvement under stress',
          impact: 'System performance improved 8% during stress events',
          metrics: 'Antifragile improvement rate: 12% per stress cycle',
        },
      ],
      isActive: false,
    },
  ];

  for (const scenario of scenarios) {
    await prisma.demoScenario.create({
      data: scenario,
    });
  }
}

async function seedCitizenDashboardStats(organisationId: string) {
  console.log('👥 Creating Citizen Dashboard Stats...');

  const stats = [
    {
      organisationId,
      totalReportsCompleted: 1247,
      reportsThisMonth: 89,
      averageResolutionTime: 8.5,
      satisfactionRate: 94.2,
      totalPeopleHelped: 15420,
      costSavings: 485000,
      period: '7d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      totalReportsCompleted: 1247,
      reportsThisMonth: 89,
      averageResolutionTime: 7.8,
      satisfactionRate: 95.1,
      totalPeopleHelped: 15420,
      costSavings: 485000,
      period: '30d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      totalReportsCompleted: 1247,
      reportsThisMonth: 89,
      averageResolutionTime: 6.9,
      satisfactionRate: 96.3,
      totalPeopleHelped: 15420,
      costSavings: 485000,
      period: '90d',
      calculatedAt: new Date(),
    },
  ];

  for (const stat of stats) {
    await prisma.citizenDashboardStats.create({
      data: stat,
    });
  }
}

async function seedAssetIntelligenceData(organisationId: string) {
  console.log('🧠 Creating Asset Intelligence Data...');

  const intelligenceData = [
    {
      organisationId,
      totalFunctions: 12,
      totalAssets: 1247,
      totalValue: 45600000,
      criticalAssets: 89,
      categoryBreakdown: [
        { category: 'Infrastructure', functions: 5, assets: 567, value: 28000000, criticalAssets: 45 },
        { category: 'Community Services', functions: 4, assets: 234, value: 8900000, criticalAssets: 23 },
        { category: 'Transportation', functions: 2, assets: 312, value: 6700000, criticalAssets: 18 },
        { category: 'Utilities', functions: 1, assets: 134, value: 2000000, criticalAssets: 3 },
      ],
      period: '7d',
      calculatedAt: new Date(),
    },
    {
      organisationId,
      totalFunctions: 12,
      totalAssets: 1247,
      totalValue: 45600000,
      criticalAssets: 89,
      categoryBreakdown: [
        { category: 'Infrastructure', functions: 5, assets: 567, value: 28000000, criticalAssets: 45 },
        { category: 'Community Services', functions: 4, assets: 234, value: 8900000, criticalAssets: 23 },
        { category: 'Transportation', functions: 2, assets: 312, value: 6700000, criticalAssets: 18 },
        { category: 'Utilities', functions: 1, assets: 134, value: 2000000, criticalAssets: 3 },
      ],
      period: '30d',
      calculatedAt: new Date(),
    },
  ];

  for (const data of intelligenceData) {
    await prisma.assetIntelligenceData.create({
      data: data,
    });
  }
}

export async function cleanupManagerDashboardData(organisationId: string) {
  console.log('🧹 Cleaning up Manager Dashboard data...');

  try {
    await prisma.managerMetrics.deleteMany({
      where: { organisationId },
    });

    await prisma.marginStatus.deleteMany({
      where: { organisationId },
    });

    await prisma.riskTrend.deleteMany({
      where: { organisationId },
    });

    await prisma.demoScenario.deleteMany({
      where: { organisationId },
    });

    await prisma.citizenDashboardStats.deleteMany({
      where: { organisationId },
    });

    await prisma.assetIntelligenceData.deleteMany({
      where: { organisationId },
    });

    console.log('✅ Manager Dashboard data cleaned up successfully');
  } catch (error) {
    console.error('❌ Error cleaning up Manager Dashboard data:', error);
    throw error;
  }
}
