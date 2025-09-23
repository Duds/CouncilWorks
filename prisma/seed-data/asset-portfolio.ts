import { PrismaClient } from '@prisma/client';
import { seedComprehensiveAssetPortfolio } from './comprehensive-asset-portfolio';
import { seedRenewableEnergyAssets } from './renewable-energy';
import { seedSmartInfrastructureAssets } from './smart-infrastructure';
import { seedTraditionalInfrastructureAssets } from './traditional-infrastructure';

/**
 * Generate comprehensive asset portfolio for Greenfield Shire Council
 * Demonstrates Rule 1: Every Asset Has a Purpose
 */
export async function generateAssetPortfolio(prisma: PrismaClient, organisationId: string) {
  console.log('🏗️ Creating comprehensive asset portfolio...');

  const allAssets: any[] = [];

  try {
    // 1. Traditional Infrastructure Assets
    console.log('   📦 Adding traditional infrastructure assets...');
    const traditionalCount = await seedTraditionalInfrastructureAssets(organisationId);
    console.log(`   ✅ Added ${traditionalCount} traditional infrastructure assets`);

    // 2. Renewable Energy Assets
    console.log('   🌱 Adding renewable energy assets...');
    const renewableCount = await seedRenewableEnergyAssets(organisationId);
    console.log(`   ✅ Added ${renewableCount} renewable energy assets`);

    // 3. Smart Infrastructure Assets
    console.log('   🧠 Adding smart infrastructure assets...');
    const smartCount = await seedSmartInfrastructureAssets(organisationId);
    console.log(`   ✅ Added ${smartCount} smart infrastructure assets`);

    // 4. Comprehensive Asset Portfolio (94 additional assets)
    console.log('   🏗️ Adding comprehensive asset portfolio...');
    const comprehensiveCount = await seedComprehensiveAssetPortfolio(organisationId);
    console.log(`   ✅ Added ${comprehensiveCount} comprehensive assets`);

    const totalAssets = traditionalCount + renewableCount + smartCount + comprehensiveCount;
    console.log(`   ✅ Created ${totalAssets} assets with defined purposes`);

    return totalAssets;
  } catch (error) {
    console.error('❌ Error creating asset portfolio:', error);
    throw error;
  }
}
