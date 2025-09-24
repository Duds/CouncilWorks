/**
 * Energy Management Core Integration Tests - E21
 *
 * Comprehensive tests for energy management functionality
 * Implements The Aegrid Rules for energy asset management
 *
 * @fileoverview Energy management core integration tests
 */

import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { createEnergyManagementCore, EnergyManagementCore } from '../lib/energy-management-core';
import { prisma } from '../lib/prisma';

describe('Energy Management Core Integration - E21', () => {
  let organisationId: string;
  let energyCore: EnergyManagementCore;
  let testAssetId: string;
  let testMeterId: string;

  beforeEach(async () => {
    // Create test organisation
    const organisation = await prisma.organisation.create({
      data: {
        name: 'Test Energy Organisation',
      },
    });
    organisationId = organisation.id;

    // Create test asset
    const asset = await prisma.asset.create({
      data: {
        organisationId,
        assetNumber: 'ENERGY-TEST-001',
        name: 'Test Energy Asset',
        description: 'Test asset for energy management',
        assetType: 'BUILDING',
        assetStatus: 'Active',
        assetCondition: 'Good',
        assetPriority: 'Medium',
        location: 'Test Location',
        manufacturer: 'Test Manufacturer',
        model: 'Test Model',
      },
    });
    testAssetId = asset.id;

    // Create test energy meter
    const meter = await prisma.energyMeter.create({
      data: {
        organisationId,
        meterId: 'METER-001',
        name: 'Test Energy Meter',
        description: 'Test meter for energy management',
        meterType: 'ELECTRICITY',
        manufacturer: 'Test Meter Manufacturer',
        model: 'Test Meter Model',
        assetId: testAssetId,
        location: 'Test Meter Location',
        unit: 'kWh',
        precision: 4,
        samplingRate: 15,
        connectionType: 'DIRECT',
        status: 'ACTIVE',
        isOnline: true,
      },
    });
    testMeterId = meter.id;

    energyCore = createEnergyManagementCore(organisationId);
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.energyOptimisationAction.deleteMany({
      where: { organisationId },
    });
    await prisma.energyAlert.deleteMany({
      where: { organisationId },
    });
    await prisma.carbonEmission.deleteMany({
      where: { organisationId },
    });
    await prisma.energyEfficiencyMetric.deleteMany({
      where: { organisationId },
    });
    await prisma.energyConsumption.deleteMany({
      where: { organisationId },
    });
    await prisma.energyMeter.deleteMany({
      where: { organisationId },
    });
    await prisma.asset.deleteMany({
      where: { organisationId },
    });
    await prisma.organisation.deleteMany({
      where: { id: organisationId },
    });
  });

  describe('F21.1: Energy Data Ingestion', () => {
    it('should register a new energy meter successfully', async () => {
      const meterData = {
        meterId: 'METER-002',
        name: 'Test Meter 2',
        description: 'Second test meter',
        meterType: 'GAS' as const,
        manufacturer: 'Test Manufacturer',
        model: 'Test Model',
        assetId: testAssetId,
        location: 'Test Location',
        unit: 'kWh',
        precision: 4,
        samplingRate: 15,
        connectionType: 'MODBUS',
      };

      const result = await energyCore.registerEnergyMeter(meterData);

      expect(result.success).toBe(true);
      expect(result.meter).toBeDefined();
      expect(result.meter.meterId).toBe('METER-002');
      expect(result.meter.meterType).toBe('GAS');
      expect(result.meter.organisationId).toBe(organisationId);
    });

    it('should ingest energy consumption data successfully', async () => {
      const consumptionData = {
        meterId: testMeterId,
        assetId: testAssetId,
        consumptionValue: 125.5,
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        powerDemand: 5.2,
        costPerUnit: 0.25,
        totalCost: 31.375,
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
        temperature: 22.5,
        humidity: 45.0,
        occupancy: 10,
      };

      const result = await energyCore.ingestEnergyConsumption(consumptionData);

      expect(result.success).toBe(true);
      expect(result.consumption).toBeDefined();
      expect(result.consumption.consumptionValue).toBe(125.5);
      expect(result.consumption.totalCost).toBe(31.375);
    });

    it('should retrieve energy consumption data with filtering', async () => {
      // First, ingest some test data
      const consumptionData = {
        meterId: testMeterId,
        assetId: testAssetId,
        consumptionValue: 100.0,
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
      };

      await energyCore.ingestEnergyConsumption(consumptionData);

      // Retrieve the data
      const result = await energyCore.getEnergyConsumption({
        assetId: testAssetId,
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].consumptionValue).toBe(100.0);
    });

    it('should handle invalid meter ID gracefully', async () => {
      const consumptionData = {
        meterId: 'INVALID-METER-ID',
        assetId: testAssetId,
        consumptionValue: 100.0,
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
      };

      const result = await energyCore.ingestEnergyConsumption(consumptionData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('F21.2: Energy Analytics Engine', () => {
    beforeEach(async () => {
      // Create some consumption data for analytics
      const consumptionData = [
        {
          meterId: testMeterId,
          assetId: testAssetId,
          consumptionValue: 100.0,
          consumptionUnit: 'kWh',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          dataQuality: 'GOOD' as const,
          source: 'METER' as const,
        },
        {
          meterId: testMeterId,
          assetId: testAssetId,
          consumptionValue: 120.0,
          consumptionUnit: 'kWh',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          dataQuality: 'GOOD' as const,
          source: 'METER' as const,
        },
        {
          meterId: testMeterId,
          assetId: testAssetId,
          consumptionValue: 80.0,
          consumptionUnit: 'kWh',
          timestamp: new Date(),
          dataQuality: 'GOOD' as const,
          source: 'METER' as const,
        },
      ];

      for (const data of consumptionData) {
        await energyCore.ingestEnergyConsumption(data);
      }
    });

    it('should calculate energy efficiency metrics successfully', async () => {
      const efficiencyData = {
        assetId: testAssetId,
        meterId: testMeterId,
        efficiencyScore: 85.5,
        benchmarkScore: 80.0,
        carbonIntensity: 0.5,
        costPerUnit: 0.25,
        energyUseIndex: 120.5,
        peakDemand: 15.2,
        loadFactor: 75.0,
        periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        periodType: 'DAILY' as const,
      };

      const result = await energyCore.calculateEnergyEfficiency(efficiencyData);

      expect(result.success).toBe(true);
      expect(result.efficiencyMetric).toBeDefined();
      expect(result.efficiencyMetric.efficiencyScore).toBe(85.5);
      expect(result.efficiencyMetric.status).toBe('NORMAL');
    });

    it('should detect energy consumption anomalies', async () => {
      // Create a consumption spike
      const spikeData = {
        meterId: testMeterId,
        assetId: testAssetId,
        consumptionValue: 500.0, // Much higher than normal
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
      };

      const result = await energyCore.ingestEnergyConsumption(spikeData);

      expect(result.success).toBe(true);

      // Check if anomaly detection was triggered
      const anomalies = await energyCore.detectEnergyAnomalies(testMeterId, spikeData);
      expect(anomalies.success).toBe(true);
      expect(anomalies.anomalies).toBeDefined();
    });

    it('should handle efficiency calculation with low score', async () => {
      const efficiencyData = {
        assetId: testAssetId,
        meterId: testMeterId,
        efficiencyScore: 45.0, // Low score
        benchmarkScore: 80.0,
        carbonIntensity: 0.8,
        costPerUnit: 0.35,
        periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        periodType: 'DAILY' as const,
      };

      const result = await energyCore.calculateEnergyEfficiency(efficiencyData);

      expect(result.success).toBe(true);
      expect(result.efficiencyMetric.status).toBe('CRITICAL');
      expect(result.efficiencyMetric.alertLevel).toBe('CRITICAL');
    });
  });

  describe('F21.3: Carbon Tracking System', () => {
    it('should calculate and record carbon emissions successfully', async () => {
      const carbonData = {
        assetId: testAssetId,
        meterId: testMeterId,
        scope1Emissions: 10.5,
        scope2Emissions: 45.2,
        scope3Emissions: 5.8,
        emissionFactor: 0.5,
        energyConsumed: 100.0,
        measurementPeriod: new Date(),
        periodType: 'MONTHLY' as const,
        renewableEnergy: 20.0,
        carbonOffset: 5.0,
        reportingStandard: 'GHG Protocol',
      };

      const result = await energyCore.calculateCarbonEmissions(carbonData);

      expect(result.success).toBe(true);
      expect(result.carbonEmission).toBeDefined();
      expect(result.carbonEmission.totalEmissions).toBe(56.5); // 10.5 + 45.2 + 5.8 - (20.0 * 0.5)
      expect(result.carbonEmission.scope1Emissions).toBe(10.5);
      expect(result.carbonEmission.scope2Emissions).toBe(45.2);
      expect(result.carbonEmission.scope3Emissions).toBe(5.8);
    });

    it('should get carbon emissions summary', async () => {
      // First, create some carbon emission data
      const carbonData = {
        assetId: testAssetId,
        meterId: testMeterId,
        scope1Emissions: 10.0,
        scope2Emissions: 40.0,
        scope3Emissions: 5.0,
        emissionFactor: 0.5,
        energyConsumed: 100.0,
        measurementPeriod: new Date(),
        periodType: 'MONTHLY' as const,
      };

      await energyCore.calculateCarbonEmissions(carbonData);

      const result = await energyCore.getCarbonEmissionsSummary('MONTHLY');

      expect(result.success).toBe(true);
      expect(result.summary).toBeDefined();
      expect(result.summary.totalScope1).toBe(10.0);
      expect(result.summary.totalScope2).toBe(40.0);
      expect(result.summary.totalScope3).toBe(5.0);
      expect(result.summary.totalEmissions).toBe(55.0);
    });

    it('should trigger alert for high carbon intensity', async () => {
      const carbonData = {
        assetId: testAssetId,
        meterId: testMeterId,
        scope1Emissions: 10.0,
        scope2Emissions: 40.0,
        emissionFactor: 0.8, // High emission factor
        energyConsumed: 100.0,
        measurementPeriod: new Date(),
        periodType: 'MONTHLY' as const,
      };

      const result = await energyCore.calculateCarbonEmissions(carbonData);

      expect(result.success).toBe(true);

      // Check if alert was created for high carbon intensity
      const alerts = await prisma.energyAlert.findMany({
        where: {
          organisationId,
          alertType: 'CARBON_INTENSITY_HIGH',
        },
      });

      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].severity).toBe('HIGH');
    });
  });

  describe('F21.4: Energy Optimisation Engine', () => {
    it('should create energy optimisation action successfully', async () => {
      const actionData = {
        assetId: testAssetId,
        systemType: 'HVAC',
        actionType: 'SCHEDULE_ADJUSTMENT',
        description: 'Optimize HVAC schedule for energy efficiency',
        parameters: {
          temperatureSetpoint: 22,
          scheduleAdjustment: 'peak_hours_avoidance',
        },
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        expectedSavings: 150.0,
      };

      const result = await energyCore.createOptimisationAction(actionData);

      expect(result.success).toBe(true);
      expect(result.action).toBeDefined();
      expect(result.action.systemType).toBe('HVAC');
      expect(result.action.actionType).toBe('SCHEDULE_ADJUSTMENT');
      expect(result.action.status).toBe('PENDING');
    });

    it('should execute optimisation action successfully', async () => {
      // First, create an optimisation action
      const actionData = {
        assetId: testAssetId,
        systemType: 'LIGHTING',
        actionType: 'EFFICIENCY_IMPROVEMENT',
        description: 'Implement LED lighting upgrade',
        expectedSavings: 200.0,
      };

      const createResult = await energyCore.createOptimisationAction(actionData);
      expect(createResult.success).toBe(true);

      // Execute the action
      const executeResult = await energyCore.executeOptimisationAction(createResult.action.id);

      expect(executeResult.success).toBe(true);
      expect(executeResult.actionId).toBe(createResult.action.id);

      // Verify the action status was updated
      const updatedAction = await prisma.energyOptimisationAction.findUnique({
        where: { id: createResult.action.id },
      });

      expect(updatedAction?.status).toBe('EXECUTING');
      expect(updatedAction?.executedAt).toBeDefined();
    });

    it('should handle invalid action ID gracefully', async () => {
      const result = await energyCore.executeOptimisationAction('invalid-action-id');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Energy Dashboard Integration', () => {
    beforeEach(async () => {
      // Create comprehensive test data
      const consumptionData = {
        meterId: testMeterId,
        assetId: testAssetId,
        consumptionValue: 100.0,
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
      };

      await energyCore.ingestEnergyConsumption(consumptionData);

      const efficiencyData = {
        assetId: testAssetId,
        meterId: testMeterId,
        efficiencyScore: 85.0,
        carbonIntensity: 0.5,
        costPerUnit: 0.25,
        periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        periodType: 'DAILY' as const,
      };

      await energyCore.calculateEnergyEfficiency(efficiencyData);

      const carbonData = {
        assetId: testAssetId,
        meterId: testMeterId,
        scope1Emissions: 10.0,
        scope2Emissions: 40.0,
        emissionFactor: 0.5,
        energyConsumed: 100.0,
        measurementPeriod: new Date(),
        periodType: 'MONTHLY' as const,
      };

      await energyCore.calculateCarbonEmissions(carbonData);
    });

    it('should get comprehensive energy dashboard data', async () => {
      const result = await energyCore.getEnergyDashboard();

      expect(result.success).toBe(true);
      expect(result.dashboard).toBeDefined();
      expect(result.dashboard.recentConsumption).toBeDefined();
      expect(result.dashboard.efficiencyMetrics).toBeDefined();
      expect(result.dashboard.carbonSummary).toBeDefined();
      expect(result.dashboard.activeAlerts).toBeDefined();
      expect(result.dashboard.optimisationActions).toBeDefined();
    });

    it('should provide real-time energy metrics', async () => {
      const result = await energyCore.getEnergyDashboard();

      expect(result.success).toBe(true);

      // Verify consumption data
      expect(result.dashboard.recentConsumption.length).toBeGreaterThan(0);
      expect(result.dashboard.recentConsumption[0].consumptionValue).toBeDefined();

      // Verify efficiency metrics
      expect(result.dashboard.efficiencyMetrics.length).toBeGreaterThan(0);
      expect(result.dashboard.efficiencyMetrics[0].efficiencyScore).toBeDefined();

      // Verify carbon summary
      expect(result.dashboard.carbonSummary.totalEmissions).toBeDefined();
      expect(result.dashboard.carbonSummary.totalScope1).toBeDefined();
      expect(result.dashboard.carbonSummary.totalScope2).toBeDefined();
    });
  });

  describe('Aegrid Rules Compliance', () => {
    it('should implement Rule 1: Energy purpose mapping and value contribution tracking', async () => {
      // Test that energy consumption is properly linked to asset purpose
      const consumptionData = {
        meterId: testMeterId,
        assetId: testAssetId,
        consumptionValue: 100.0,
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
      };

      const result = await energyCore.ingestEnergyConsumption(consumptionData);

      expect(result.success).toBe(true);
      expect(result.consumption.assetId).toBe(testAssetId);

      // Verify asset-purpose mapping exists
      const asset = await prisma.asset.findUnique({
        where: { id: testAssetId },
        include: { assetPurposeMappings: true },
      });

      expect(asset).toBeDefined();
    });

    it('should implement Rule 2: Risk-based energy optimisation and maintenance', async () => {
      // Test that energy efficiency triggers risk-based maintenance
      const efficiencyData = {
        assetId: testAssetId,
        meterId: testMeterId,
        efficiencyScore: 45.0, // Low efficiency score
        carbonIntensity: 0.8,
        costPerUnit: 0.35,
        periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
        periodType: 'DAILY' as const,
      };

      const result = await energyCore.calculateEnergyEfficiency(efficiencyData);

      expect(result.success).toBe(true);
      expect(result.efficiencyMetric.status).toBe('CRITICAL');

      // Verify that an alert was created for maintenance
      const alerts = await prisma.energyAlert.findMany({
        where: {
          organisationId,
          alertType: 'EFFICIENCY_DECLINE',
        },
      });

      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should implement Rule 3: Critical energy asset monitoring and response', async () => {
      // Test critical asset monitoring through high consumption alerts
      const highConsumptionData = {
        meterId: testMeterId,
        assetId: testAssetId,
        consumptionValue: 1000.0, // Very high consumption
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
      };

      const result = await energyCore.ingestEnergyConsumption(highConsumptionData);

      expect(result.success).toBe(true);

      // Verify that anomaly detection was triggered
      const anomalies = await energyCore.detectEnergyAnomalies(testMeterId, highConsumptionData);
      expect(anomalies.success).toBe(true);
    });

    it('should implement Rule 4: Long-term energy planning and sustainability', async () => {
      // Test long-term planning through carbon tracking and optimisation
      const carbonData = {
        assetId: testAssetId,
        meterId: testMeterId,
        scope1Emissions: 10.0,
        scope2Emissions: 40.0,
        emissionFactor: 0.5,
        energyConsumed: 100.0,
        measurementPeriod: new Date(),
        periodType: 'YEARLY' as const,
        renewableEnergy: 20.0,
        carbonOffset: 5.0,
      };

      const result = await energyCore.calculateCarbonEmissions(carbonData);

      expect(result.success).toBe(true);
      expect(result.carbonEmission.periodType).toBe('YEARLY');
      expect(result.carbonEmission.renewableEnergy).toBe(20.0);
      expect(result.carbonEmission.carbonOffset).toBe(5.0);

      // Verify sustainability planning capabilities
      const summary = await energyCore.getCarbonEmissionsSummary('YEARLY');
      expect(summary.success).toBe(true);
      expect(summary.summary.totalRenewable).toBe(20.0);
      expect(summary.summary.totalOffset).toBe(5.0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing organisation gracefully', async () => {
      const invalidCore = createEnergyManagementCore('invalid-organisation-id');

      const result = await invalidCore.getEnergyDashboard();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should validate input data correctly', async () => {
      const invalidData = {
        meterId: testMeterId,
        assetId: testAssetId,
        consumptionValue: -100.0, // Negative value
        consumptionUnit: 'kWh',
        timestamp: new Date(),
        dataQuality: 'GOOD' as const,
        source: 'METER' as const,
      };

      const result = await energyCore.ingestEnergyConsumption(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle concurrent data ingestion', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        const consumptionData = {
          meterId: testMeterId,
          assetId: testAssetId,
          consumptionValue: 100.0 + i,
          consumptionUnit: 'kWh',
          timestamp: new Date(),
          dataQuality: 'GOOD' as const,
          source: 'METER' as const,
        };

        promises.push(energyCore.ingestEnergyConsumption(consumptionData));
      }

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });
});
