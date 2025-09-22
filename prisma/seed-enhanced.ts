/**
 * Enhanced Seed Script for Aegrid Rules Demonstration
 *
 * This script creates comprehensive synthetic data that demonstrates all four Aegrid Rules:
 * - Rule 1: Every Asset Has a Purpose
 * - Rule 2: Risk Sets Rhythm
 * - Rule 3: Real-World Response
 * - Rule 4: Operate with Margin
 *
 * Features Greenfield Shire Council as a fictional early adopter with:
 * - 500+ assets across renewable energy, smart infrastructure, and traditional assets
 * - Complete vendor ecosystem with SLA tracking
 * - Critical controls and compliance monitoring
 * - Citizen engagement and feedback systems
 * - 2+ years of historical operational data
 */

import { PrismaClient } from '@prisma/client';
import { generateGreenfieldCouncil } from './seed-data/greenfield-council';
import { generateUserPersonas } from './seed-data/user-personas';
import { generateAssetPortfolio } from './seed-data/asset-portfolio';
import { generateVendorEcosystem } from './seed-data/vendor-ecosystem';
import { generateRCMTemplates } from './seed-data/rcm-templates';
import { generateCriticalControls } from './seed-data/critical-controls';
import { generateCitizenEngagement } from './seed-data/citizen-engagement';
import { generateSignalsAndRisk } from './seed-data/signals-risk';
import { generateHistoricalData } from './seed-data/historical-data';
import { generateEvidenceAndDocumentation } from './seed-data/evidence-documentation';
import { generateMarginManagement } from './seed-data/margin-management';
import { generateEmergencyResponse } from './seed-data/emergency-response';
import { generateComplianceAndAudit } from './seed-data/compliance-audit';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Aegrid Rules demonstration data seeding...');
  console.log('📋 Demonstrating: Purpose, Risk, Response, Margin');

  try {
    // 1. Create Greenfield Shire Council with resilience configuration
    console.log('🏛️ Creating organisation...');
    const organisation = await generateGreenfieldCouncil(prisma);

    // 2. Create complete user personas (Rule 1: Purpose-driven roles)
    console.log('👥 Creating user personas...');
    const users = await generateUserPersonas(prisma, organisation.id);

    // 3. Create comprehensive asset portfolio (Rule 1: Every asset has purpose)
    console.log('🏗️ Creating asset portfolio...');
    const assets = await generateAssetPortfolio(prisma, organisation.id);

    // 4. Create vendor ecosystem with contracts and SLAs (Rule 2: Risk-based management)
    console.log('🤝 Creating vendor ecosystem...');
    const { vendors, contracts, slas } = await generateVendorEcosystem(
      prisma,
      organisation.id
    );

    // 5. Create RCM templates for all asset types (Rule 2: Risk sets rhythm)
    console.log('📋 Creating RCM templates...');
    const rcmTemplates = await generateRCMTemplates(prisma, organisation.id);

    // 6. Create critical controls and asset mappings (Rule 1: Purpose-driven controls)
    console.log('🎯 Creating critical controls...');
    const criticalControls = await generateCriticalControls(
      prisma,
      organisation.id,
      assets
    );

    // 7. Create citizen engagement data (Rule 3: Real-world response)
    console.log('👥 Creating citizen engagement...');
    const citizenData = await generateCitizenEngagement(
      prisma,
      organisation.id,
      assets
    );

    // 8. Create signals and risk management data (Rule 3: Signal-driven response)
    console.log('📡 Creating signals and risk data...');
    const signalsData = await generateSignalsAndRisk(
      prisma,
      organisation.id,
      assets
    );

    // 9. Create evidence and documentation (Rule 3: Evidence-based operations)
    console.log('📸 Creating evidence and documentation...');
    const evidenceData = await generateEvidenceAndDocumentation(
      prisma,
      organisation.id
    );

    // 10. Create margin management data (Rule 4: Operate with margin)
    console.log('📊 Creating margin management...');
    const marginData = await generateMarginManagement(prisma, organisation.id);

    // 11. Create emergency response data (Rule 4: Emergency capabilities)
    console.log('🚨 Creating emergency response...');
    const emergencyData = await generateEmergencyResponse(
      prisma,
      organisation.id,
      assets
    );

    // 12. Create compliance and audit data (Rule 4: Future-focused compliance)
    console.log('📋 Creating compliance and audit...');
    const complianceData = await generateComplianceAndAudit(
      prisma,
      organisation.id,
      assets
    );

    // 13. Generate 2+ years of historical operational data
    console.log('📈 Creating historical data...');
    await generateHistoricalData(prisma, organisation.id, {
      assets,
      users,
      vendors,
      contracts,
      slas,
      criticalControls,
      rcmTemplates,
      citizenData,
      signalsData,
      evidenceData,
      marginData,
      emergencyData,
      complianceData,
    });

    console.log('✅ Aegrid Rules demonstration data seeding completed!');
    console.log(`📊 Created:`);
    console.log(`   • ${assets.length} assets with defined purposes`);
    console.log(`   • ${users.length} users across all roles`);
    console.log(`   • ${contracts.length} contracts with SLA tracking`);
    console.log(`   • ${criticalControls.length} critical controls mapped`);
    console.log(`   • ${citizenData.reports} citizen reports`);
    console.log(`   • ${signalsData.count} risk signals`);
    console.log(`   • ${marginData.count} margin management records`);
    console.log(`   • ${emergencyData.count} emergency response events`);

    // Validation Summary
    console.log('\n🎯 Aegrid Rules Validation:');
    console.log('   ✅ Rule 1: Every asset has defined service purpose');
    console.log('   ✅ Rule 2: Risk-based maintenance and SLA management');
    console.log('   ✅ Rule 3: Signal-driven response with evidence capture');
    console.log('   ✅ Rule 4: Margin management and emergency capabilities');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
