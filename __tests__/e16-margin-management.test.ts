/**
 * E16: Margin Management & Antifragile Operations Tests
 *
 * Comprehensive tests for all E16 features including:
 * - F16.1: Time Margin Management
 * - F16.2: Capacity Margin Management
 * - F16.3: Material Margin Management
 * - F16.4: Financial Margin Management
 * - F16.5: Surge Capacity Management
 *
 * @file __tests__/e16-margin-management.test.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import { TimeMarginManagementSystem } from '@/lib/time-margin-management';
import { CapacityMarginManagementSystem } from '@/lib/capacity-margin-management';
import { MaterialMarginManagementSystem } from '@/lib/material-margin-management';
import { FinancialMarginManagementSystem } from '@/lib/financial-margin-management';
import { SurgeCapacityManagementSystem } from '@/lib/surge-capacity-management';
import {
  Signal,
  SignalType,
  SignalSeverity,
  SignalSource,
  MarginType,
  MarginEventType,
} from '@/types/resilience';

describe('E16: Margin Management & Antifragile Operations', () => {
  describe('F16.1: Time Margin Management', () => {
    let timeMarginSystem: TimeMarginManagementSystem;

    beforeEach(() => {
      timeMarginSystem = new TimeMarginManagementSystem({
        enabled: true,
        defaultBufferTime: 30,
        emergencyResponseTime: 15,
        maintenanceWindowBuffer: 60,
        projectTimelineBuffer: 0.2,
        maxConcurrentAllocations: 10,
        updateInterval: 300000,
      });
    });

    it('should initialize with default configuration', () => {
      expect(timeMarginSystem).toBeDefined();
      const status = timeMarginSystem.getStatus();
      expect(status.enabled).toBe(true);
      expect(status.totalAllocated).toBe(0);
      expect(status.totalDeployed).toBe(0);
      expect(status.availableMargin).toBe(1000); // Base available time margin
      expect(status.utilizationRate).toBe(0);
      expect(status.activeAllocations).toBe(0);
      expect(status.activeDeployments).toBe(0);
    });

    it('should allocate time margin for operations', async () => {
      const allocation = await timeMarginSystem.allocateTimeMargin(
        'test-operation',
        60, // 60 minutes
        'HIGH',
        'Test operation time requirement'
      );

      expect(allocation).toBeDefined();
      expect(allocation?.type).toBe(MarginType.TIME);
      expect(allocation?.amount).toBe(60);
      expect(allocation?.metadata.operationId).toBe('test-operation');
      expect(allocation?.metadata.priority).toBe('HIGH');

      const status = timeMarginSystem.getStatus();
      expect(status.totalAllocated).toBe(60);
      expect(status.activeAllocations).toBe(1);
    });

    it('should deploy time margin for immediate use', async () => {
      const allocation = await timeMarginSystem.allocateTimeMargin(
        'test-operation',
        60,
        'HIGH',
        'Test operation'
      );

      expect(allocation).toBeDefined();

      const deployment = await timeMarginSystem.deployTimeMargin(
        allocation!.id,
        30, // Deploy 30 minutes
        'Emergency deployment'
      );

      expect(deployment).toBeDefined();
      expect(deployment?.amount).toBe(30);
      expect(deployment?.reason).toBe('Emergency deployment');

      const status = timeMarginSystem.getStatus();
      expect(status.totalDeployed).toBe(30);
      expect(status.activeDeployments).toBe(1);
    });

    it('should recover time margin after operation completion', async () => {
      const allocation = await timeMarginSystem.allocateTimeMargin(
        'test-operation',
        60,
        'HIGH',
        'Test operation'
      );

      expect(allocation).toBeDefined();

      const recovered = await timeMarginSystem.recoverTimeMargin(
        allocation!.id,
        'Operation completed'
      );

      expect(recovered).toBe(true);

      const status = timeMarginSystem.getStatus();
      expect(status.activeAllocations).toBe(0);
    });

    it('should process emergency signals and allocate emergency time', async () => {
      const emergencySignal: Signal = {
        id: 'emergency-1',
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM_MONITOR,
        timestamp: new Date(),
        description: 'Emergency situation detected',
        data: { emergencyType: 'fire' },
        status: 'ACTIVE',
        acknowledged: false,
        resolved: false,
        metadata: {},
      };

      await timeMarginSystem.processSignals([emergencySignal]);

      const status = timeMarginSystem.getStatus();
      expect(status.activeAllocations).toBeGreaterThan(0);
      expect(status.recentEvents.length).toBeGreaterThan(0);
    });
  });

  describe('F16.2: Capacity Margin Management', () => {
    let capacityMarginSystem: CapacityMarginManagementSystem;

    beforeEach(() => {
      capacityMarginSystem = new CapacityMarginManagementSystem({
        enabled: true,
        defaultSurgeCapacity: 0.2,
        emergencyCapacityReserve: 0.1,
        maxConcurrentAllocations: 20,
        capacityOptimizationInterval: 300000,
        updateInterval: 60000,
      });
    });

    it('should initialize with default resource pools', () => {
      expect(capacityMarginSystem).toBeDefined();
      const status = capacityMarginSystem.getStatus();
      expect(status.enabled).toBe(true);
      expect(status.resourcePools.length).toBe(5); // COMPUTATIONAL, HUMAN, EQUIPMENT, STORAGE, NETWORK
      expect(status.totalAllocated).toBe(0);
      expect(status.totalAvailable).toBeGreaterThan(0);
      expect(status.overallUtilization).toBe(0);
    });

    it('should allocate capacity margin for operations', async () => {
      const request = {
        id: 'test-capacity-request',
        resourceType: 'COMPUTATIONAL' as const,
        requestedCapacity: 100,
        priority: 'HIGH' as const,
        duration: 60,
        reason: 'Test capacity requirement',
        metadata: {},
      };

      const allocation = await capacityMarginSystem.allocateCapacityMargin(request);

      expect(allocation).toBeDefined();
      expect(allocation?.type).toBe(MarginType.CAPACITY);
      expect(allocation?.amount).toBe(100);
      expect(allocation?.metadata.resourceType).toBe('COMPUTATIONAL');

      const status = capacityMarginSystem.getStatus();
      expect(status.totalAllocated).toBe(100);
      expect(status.activeAllocations).toBe(1);
    });

    it('should deploy capacity margin for immediate use', async () => {
      const request = {
        id: 'test-capacity-request',
        resourceType: 'COMPUTATIONAL' as const,
        requestedCapacity: 100,
        priority: 'HIGH' as const,
        duration: 60,
        reason: 'Test capacity requirement',
        metadata: {},
      };

      const allocation = await capacityMarginSystem.allocateCapacityMargin(request);
      expect(allocation).toBeDefined();

      const deployment = await capacityMarginSystem.deployCapacityMargin(
        allocation!.id,
        50, // Deploy 50 units
        'Emergency deployment'
      );

      expect(deployment).toBeDefined();
      expect(deployment?.amount).toBe(50);
      expect(deployment?.reason).toBe('Emergency deployment');

      const status = capacityMarginSystem.getStatus();
      expect(status.activeDeployments).toBe(1);
    });

    it('should recover capacity margin after operation completion', async () => {
      const request = {
        id: 'test-capacity-request',
        resourceType: 'COMPUTATIONAL' as const,
        requestedCapacity: 100,
        priority: 'HIGH' as const,
        duration: 60,
        reason: 'Test capacity requirement',
        metadata: {},
      };

      const allocation = await capacityMarginSystem.allocateCapacityMargin(request);
      expect(allocation).toBeDefined();

      const recovered = await capacityMarginSystem.recoverCapacityMargin(
        allocation!.id,
        'Operation completed'
      );

      expect(recovered).toBe(true);

      const status = capacityMarginSystem.getStatus();
      expect(status.activeAllocations).toBe(0);
    });

    it('should process emergency signals and allocate emergency capacity', async () => {
      const emergencySignal: Signal = {
        id: 'emergency-1',
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM_MONITOR,
        timestamp: new Date(),
        description: 'Emergency situation detected',
        data: { emergencyType: 'system_failure' },
        status: 'ACTIVE',
        acknowledged: false,
        resolved: false,
        metadata: {},
      };

      await capacityMarginSystem.processSignals([emergencySignal]);

      const status = capacityMarginSystem.getStatus();
      expect(status.activeAllocations).toBeGreaterThan(0);
      expect(status.recentEvents.length).toBeGreaterThan(0);
    });
  });

  describe('F16.3: Material Margin Management', () => {
    let materialMarginSystem: MaterialMarginManagementSystem;

    beforeEach(() => {
      materialMarginSystem = new MaterialMarginManagementSystem({
        enabled: true,
        defaultBufferPercentage: 0.15,
        emergencyReservePercentage: 0.05,
        maxConcurrentAllocations: 50,
        inventoryUpdateInterval: 3600000,
        reorderCheckInterval: 86400000,
        updateInterval: 300000,
      });
    });

    it('should initialize with default material inventory', () => {
      expect(materialMarginSystem).toBeDefined();
      const status = materialMarginSystem.getStatus();
      expect(status.enabled).toBe(true);
      expect(status.inventory.length).toBe(5); // Default inventory items
      expect(status.totalItems).toBe(5);
      expect(status.totalQuantity).toBeGreaterThan(0);
      expect(status.totalAllocated).toBe(0);
      expect(status.totalAvailable).toBeGreaterThan(0);
    });

    it('should allocate material margin for operations', async () => {
      const request = {
        id: 'test-material-request',
        itemId: 'bearing-6205',
        requestedQuantity: 5,
        priority: 'HIGH' as const,
        duration: 7,
        reason: 'Test material requirement',
        requester: 'Test User',
        metadata: {},
      };

      const allocation = await materialMarginSystem.allocateMaterialMargin(request);

      expect(allocation).toBeDefined();
      expect(allocation?.type).toBe(MarginType.MATERIAL);
      expect(allocation?.amount).toBe(5);
      expect(allocation?.metadata.itemId).toBe('bearing-6205');

      const status = materialMarginSystem.getStatus();
      expect(status.totalAllocated).toBe(5);
      expect(status.activeAllocations).toBe(1);
    });

    it('should deploy material margin for immediate use', async () => {
      const request = {
        id: 'test-material-request',
        itemId: 'bearing-6205',
        requestedQuantity: 5,
        priority: 'HIGH' as const,
        duration: 7,
        reason: 'Test material requirement',
        requester: 'Test User',
        metadata: {},
      };

      const allocation = await materialMarginSystem.allocateMaterialMargin(request);
      expect(allocation).toBeDefined();

      const deployment = await materialMarginSystem.deployMaterialMargin(
        allocation!.id,
        3, // Deploy 3 units
        'Emergency deployment'
      );

      expect(deployment).toBeDefined();
      expect(deployment?.amount).toBe(3);
      expect(deployment?.reason).toBe('Emergency deployment');

      const status = materialMarginSystem.getStatus();
      expect(status.activeDeployments).toBe(1);
    });

    it('should recover material margin after operation completion', async () => {
      const request = {
        id: 'test-material-request',
        itemId: 'bearing-6205',
        requestedQuantity: 5,
        priority: 'HIGH' as const,
        duration: 7,
        reason: 'Test material requirement',
        requester: 'Test User',
        metadata: {},
      };

      const allocation = await materialMarginSystem.allocateMaterialMargin(request);
      expect(allocation).toBeDefined();

      const recovered = await materialMarginSystem.recoverMaterialMargin(
        allocation!.id,
        'Operation completed'
      );

      expect(recovered).toBe(true);

      const status = materialMarginSystem.getStatus();
      expect(status.activeAllocations).toBe(0);
    });

    it('should process emergency signals and allocate emergency materials', async () => {
      const emergencySignal: Signal = {
        id: 'emergency-1',
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM_MONITOR,
        timestamp: new Date(),
        description: 'Emergency situation detected',
        data: { emergencyType: 'safety_incident' },
        status: 'ACTIVE',
        acknowledged: false,
        resolved: false,
        metadata: {},
      };

      await materialMarginSystem.processSignals([emergencySignal]);

      const status = materialMarginSystem.getStatus();
      expect(status.activeAllocations).toBeGreaterThan(0);
      expect(status.recentEvents.length).toBeGreaterThan(0);
    });
  });

  describe('F16.4: Financial Margin Management', () => {
    let financialMarginSystem: FinancialMarginManagementSystem;

    beforeEach(() => {
      financialMarginSystem = new FinancialMarginManagementSystem({
        enabled: true,
        defaultContingencyPercentage: 0.1,
        emergencyReservePercentage: 0.05,
        maxConcurrentAllocations: 100,
        budgetUpdateInterval: 3600000,
        costOptimizationInterval: 86400000,
        updateInterval: 300000,
        currency: 'AUD',
      });
    });

    it('should initialize with default budget categories', () => {
      expect(financialMarginSystem).toBeDefined();
      const status = financialMarginSystem.getStatus();
      expect(status.enabled).toBe(true);
      expect(status.budgetCategories.length).toBe(5); // OPERATIONAL, CAPITAL, EMERGENCY, MAINTENANCE, CONTINGENCY
      expect(status.totalBudget).toBeGreaterThan(0);
      expect(status.totalAllocated).toBe(0);
      expect(status.totalAvailable).toBeGreaterThan(0);
    });

    it('should allocate financial margin for operations', async () => {
      const request = {
        id: 'test-financial-request',
        categoryId: 'operational-budget',
        requestedAmount: 10000,
        priority: 'HIGH' as const,
        duration: 30,
        reason: 'Test financial requirement',
        requester: 'Test User',
        approvalRequired: false,
        metadata: {},
      };

      const allocation = await financialMarginSystem.allocateFinancialMargin(request);

      expect(allocation).toBeDefined();
      expect(allocation?.type).toBe(MarginType.FINANCIAL);
      expect(allocation?.amount).toBe(10000);
      expect(allocation?.metadata.categoryId).toBe('operational-budget');

      const status = financialMarginSystem.getStatus();
      expect(status.totalAllocated).toBe(10000);
      expect(status.activeAllocations).toBe(1);
    });

    it('should deploy financial margin for immediate use', async () => {
      const request = {
        id: 'test-financial-request',
        categoryId: 'operational-budget',
        requestedAmount: 10000,
        priority: 'HIGH' as const,
        duration: 30,
        reason: 'Test financial requirement',
        requester: 'Test User',
        approvalRequired: false,
        metadata: {},
      };

      const allocation = await financialMarginSystem.allocateFinancialMargin(request);
      expect(allocation).toBeDefined();

      const deployment = await financialMarginSystem.deployFinancialMargin(
        allocation!.id,
        5000, // Deploy $5000
        'Emergency deployment'
      );

      expect(deployment).toBeDefined();
      expect(deployment?.amount).toBe(5000);
      expect(deployment?.reason).toBe('Emergency deployment');

      const status = financialMarginSystem.getStatus();
      expect(status.activeDeployments).toBe(1);
    });

    it('should recover financial margin after operation completion', async () => {
      const request = {
        id: 'test-financial-request',
        categoryId: 'operational-budget',
        requestedAmount: 10000,
        priority: 'HIGH' as const,
        duration: 30,
        reason: 'Test financial requirement',
        requester: 'Test User',
        approvalRequired: false,
        metadata: {},
      };

      const allocation = await financialMarginSystem.allocateFinancialMargin(request);
      expect(allocation).toBeDefined();

      const recovered = await financialMarginSystem.recoverFinancialMargin(
        allocation!.id,
        'Operation completed'
      );

      expect(recovered).toBe(true);

      const status = financialMarginSystem.getStatus();
      expect(status.activeAllocations).toBe(0);
    });

    it('should process emergency signals and allocate emergency funds', async () => {
      const emergencySignal: Signal = {
        id: 'emergency-1',
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM_MONITOR,
        timestamp: new Date(),
        description: 'Emergency situation detected',
        data: { emergencyType: 'financial_crisis' },
        status: 'ACTIVE',
        acknowledged: false,
        resolved: false,
        metadata: {},
      };

      await financialMarginSystem.processSignals([emergencySignal]);

      const status = financialMarginSystem.getStatus();
      expect(status.activeAllocations).toBeGreaterThan(0);
      expect(status.recentEvents.length).toBeGreaterThan(0);
    });
  });

  describe('F16.5: Surge Capacity Management', () => {
    let surgeCapacitySystem: SurgeCapacityManagementSystem;

    beforeEach(() => {
      surgeCapacitySystem = new SurgeCapacityManagementSystem({
        enabled: true,
        defaultSurgeThreshold: 0.8,
        defaultEmergencyThreshold: 0.95,
        maxConcurrentSurges: 5,
        surgeCooldownPeriod: 30,
        emergencyResponseTime: 5,
        updateInterval: 60000,
      });
    });

    it('should initialize with default surge capacity pools', () => {
      expect(surgeCapacitySystem).toBeDefined();
      const status = surgeCapacitySystem.getStatus();
      expect(status.enabled).toBe(true);
      expect(status.surgePools.length).toBe(5); // COMPUTATIONAL, HUMAN, EQUIPMENT, STORAGE, NETWORK
      expect(status.totalCapacity).toBeGreaterThan(0);
      expect(status.totalAllocated).toBe(0);
      expect(status.totalAvailable).toBeGreaterThan(0);
      expect(status.overallSurgeUtilization).toBe(0);
    });

    it('should allocate surge capacity for operations', async () => {
      const request = {
        id: 'test-surge-request',
        poolId: 'computational-surge-pool',
        requestedCapacity: 200,
        priority: 'HIGH' as const,
        duration: 60,
        reason: 'Test surge requirement',
        requester: 'Test User',
        emergencyLevel: 'HIGH' as const,
        metadata: {},
      };

      const allocation = await surgeCapacitySystem.allocateSurgeCapacity(request);

      expect(allocation).toBeDefined();
      expect(allocation?.type).toBe(MarginType.CAPACITY);
      expect(allocation?.amount).toBe(200);
      expect(allocation?.metadata.poolId).toBe('computational-surge-pool');

      const status = surgeCapacitySystem.getStatus();
      expect(status.totalAllocated).toBe(200);
      expect(status.activeAllocations).toBe(1);
      expect(status.activeSurges).toBe(1);
    });

    it('should deploy surge capacity for immediate use', async () => {
      const request = {
        id: 'test-surge-request',
        poolId: 'computational-surge-pool',
        requestedCapacity: 200,
        priority: 'HIGH' as const,
        duration: 60,
        reason: 'Test surge requirement',
        requester: 'Test User',
        emergencyLevel: 'HIGH' as const,
        metadata: {},
      };

      const allocation = await surgeCapacitySystem.allocateSurgeCapacity(request);
      expect(allocation).toBeDefined();

      const deployment = await surgeCapacitySystem.deploySurgeCapacity(
        allocation!.id,
        100, // Deploy 100 units
        'Emergency surge deployment'
      );

      expect(deployment).toBeDefined();
      expect(deployment?.amount).toBe(100);
      expect(deployment?.reason).toBe('Emergency surge deployment');

      const status = surgeCapacitySystem.getStatus();
      expect(status.activeDeployments).toBe(1);
    });

    it('should recover surge capacity after operation completion', async () => {
      const request = {
        id: 'test-surge-request',
        poolId: 'computational-surge-pool',
        requestedCapacity: 200,
        priority: 'HIGH' as const,
        duration: 60,
        reason: 'Test surge requirement',
        requester: 'Test User',
        emergencyLevel: 'HIGH' as const,
        metadata: {},
      };

      const allocation = await surgeCapacitySystem.allocateSurgeCapacity(request);
      expect(allocation).toBeDefined();

      const recovered = await surgeCapacitySystem.recoverSurgeCapacity(
        allocation!.id,
        'Operation completed'
      );

      expect(recovered).toBe(true);

      const status = surgeCapacitySystem.getStatus();
      expect(status.activeAllocations).toBe(0);
    });

    it('should process emergency signals and allocate emergency surge capacity', async () => {
      const emergencySignal: Signal = {
        id: 'emergency-1',
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM_MONITOR,
        timestamp: new Date(),
        description: 'Emergency situation detected',
        data: { emergencyType: 'system_overload' },
        status: 'ACTIVE',
        acknowledged: false,
        resolved: false,
        metadata: {},
      };

      await surgeCapacitySystem.processSignals([emergencySignal]);

      const status = surgeCapacitySystem.getStatus();
      expect(status.activeAllocations).toBeGreaterThan(0);
      expect(status.recentEvents.length).toBeGreaterThan(0);
    });
  });

  describe('E16 Integration Tests', () => {
    it('should coordinate all margin management systems', async () => {
      const timeMarginSystem = new TimeMarginManagementSystem();
      const capacityMarginSystem = new CapacityMarginManagementSystem();
      const materialMarginSystem = new MaterialMarginManagementSystem();
      const financialMarginSystem = new FinancialMarginManagementSystem();
      const surgeCapacitySystem = new SurgeCapacityManagementSystem();

      const emergencySignal: Signal = {
        id: 'emergency-integration-test',
        type: SignalType.EMERGENCY,
        severity: SignalSeverity.CRITICAL,
        source: SignalSource.SYSTEM_MONITOR,
        timestamp: new Date(),
        description: 'Integration test emergency',
        data: { emergencyType: 'comprehensive_test' },
        status: 'ACTIVE',
        acknowledged: false,
        resolved: false,
        metadata: {},
      };

      // Process signals across all systems
      await Promise.all([
        timeMarginSystem.processSignals([emergencySignal]),
        capacityMarginSystem.processSignals([emergencySignal]),
        materialMarginSystem.processSignals([emergencySignal]),
        financialMarginSystem.processSignals([emergencySignal]),
        surgeCapacitySystem.processSignals([emergencySignal]),
      ]);

      // Verify all systems responded
      expect(timeMarginSystem.getStatus().activeAllocations).toBeGreaterThan(0);
      expect(capacityMarginSystem.getStatus().activeAllocations).toBeGreaterThan(0);
      expect(materialMarginSystem.getStatus().activeAllocations).toBeGreaterThan(0);
      expect(financialMarginSystem.getStatus().activeAllocations).toBeGreaterThan(0);
      expect(surgeCapacitySystem.getStatus().activeAllocations).toBeGreaterThan(0);

      // Verify all systems have events
      expect(timeMarginSystem.getStatus().recentEvents.length).toBeGreaterThan(0);
      expect(capacityMarginSystem.getStatus().recentEvents.length).toBeGreaterThan(0);
      expect(materialMarginSystem.getStatus().recentEvents.length).toBeGreaterThan(0);
      expect(financialMarginSystem.getStatus().recentEvents.length).toBeGreaterThan(0);
      expect(surgeCapacitySystem.getStatus().recentEvents.length).toBeGreaterThan(0);
    });

    it('should handle concurrent margin operations', async () => {
      const timeMarginSystem = new TimeMarginManagementSystem();
      const capacityMarginSystem = new CapacityMarginManagementSystem();

      // Concurrent allocations
      const timeAllocation = timeMarginSystem.allocateTimeMargin('op1', 30, 'HIGH', 'Test');
      const capacityRequest = {
        id: 'cap1',
        resourceType: 'COMPUTATIONAL' as const,
        requestedCapacity: 50,
        priority: 'HIGH' as const,
        duration: 30,
        reason: 'Test',
        metadata: {},
      };
      const capacityAllocation = capacityMarginSystem.allocateCapacityMargin(capacityRequest);

      const [timeResult, capacityResult] = await Promise.all([timeAllocation, capacityAllocation]);

      expect(timeResult).toBeDefined();
      expect(capacityResult).toBeDefined();

      const timeStatus = timeMarginSystem.getStatus();
      const capacityStatus = capacityMarginSystem.getStatus();

      expect(timeStatus.activeAllocations).toBe(1);
      expect(capacityStatus.activeAllocations).toBe(1);
    });
  });
});
