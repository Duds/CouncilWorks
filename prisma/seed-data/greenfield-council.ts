/**
 * Greenfield Shire Council - Enhanced Organisation Setup
 *
 * Creates a fictional progressive council with comprehensive resilience configuration
 * that demonstrates all four Aegrid Rules in action.
 */

import { PrismaClient } from '@prisma/client';

export async function generateGreenfieldCouncil(prisma: PrismaClient) {
  console.log('  📍 Creating Greenfield Shire Council...');

  const organisation = await prisma.organisation.upsert({
    where: { name: 'Greenfield Shire Council' },
    update: {},
    create: {
      name: 'Greenfield Shire Council',
      // Enhanced resilience configuration for Aegrid Rules demonstration
      resilienceConfig: {
        // Rule 4: Margin Management Configuration
        margin_settings: {
          time_margin_percentage: 15,
          capacity_margin_percentage: 20,
          material_margin_percentage: 10,
          financial_margin_percentage: 12,
        },

        // Rule 2: Risk Thresholds
        signal_thresholds: {
          critical: 90,
          high: 75,
          medium: 50,
          low: 25,
        },

        // Rule 3: Emergency Response Protocols
        emergency_protocols: {
          weather_events: 'immediate_response',
          equipment_failure: '24_hour_response',
          service_disruption: '4_hour_response',
          safety_incidents: 'immediate_response',
          environmental_events: '2_hour_response',
        },

        // Rule 1: Purpose-Driven Asset Management
        asset_management: {
          purpose_validation_required: true,
          critical_control_mapping_required: true,
          function_based_categorization: true,
          service_impact_assessment: true,
        },

        // Operational Excellence
        operational_excellence: {
          sla_compliance_target: 95,
          evidence_capture_required: true,
          real_time_monitoring: true,
          predictive_maintenance: true,
        },

        // Innovation focus areas
        innovation_focus: [
          'renewable_energy',
          'smart_infrastructure',
          'battery_storage',
          'iot_sensors',
          'electric_vehicle_charging',
          'climate_adaptation',
          'digital_transformation',
        ],

        // Geographic and demographic information
        geographic_coverage: {
          area_km2: 2500,
          population: 45000,
          major_towns: ['Greenfield', 'Windy Ridge', 'Solar Valley', 'Bright Plains'],
          climate_zone: 'temperate',
          risk_factors: ['storm_damage', 'heat_waves', 'bushfire_risk', 'flood_risk'],
        },
      },

      // Detailed margin settings for Rule 4
      marginSettings: {
        time_margin: {
          buffer_hours: 2,
          emergency_buffer_hours: 8,
          peak_season_buffer_hours: 4,
        },
        capacity_margin: {
          surge_capacity_percentage: 25,
          emergency_capacity_percentage: 50,
          seasonal_capacity_adjustment: 15,
        },
        material_margin: {
          critical_spares_percentage: 15,
          emergency_spares_percentage: 30,
          seasonal_material_buffer: 20,
        },
        financial_margin: {
          contingency_percentage: 10,
          emergency_fund_percentage: 5,
          maintenance_reserve_percentage: 8,
        },
      },
    },
  });

  console.log(`   ✅ Created organisation: ${organisation.name}`);
  return organisation;
}
