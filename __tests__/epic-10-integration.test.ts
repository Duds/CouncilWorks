/**
 * E10 Integration Test Suite
 * 
 * Comprehensive integration tests for Sector-Neutral Platform Evolution (E10)
 * 
 * @fileoverview E10 integration test suite
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { sectorNeutralLanguageManager } from '@/lib/sector-neutral/language-management';
import { sectorTemplateManager } from '@/lib/sector-neutral/template-management';
import { multiSectorAssetClassificationManager } from '@/lib/sector-neutral/asset-classification';

describe('E10: Sector-Neutral Platform Evolution', () => {
  beforeAll(async () => {
    // Initialize test environment
    console.log('Initializing E10 test environment');
  });

  afterAll(async () => {
    // Cleanup test environment
    console.log('Cleaning up E10 test environment');
  });

  beforeEach(() => {
    // Reset state before each test
  });

  describe('E10.1: Language Refactoring & Terminology Standardization', () => {
    it('should initialize language manager', () => {
      expect(sectorNeutralLanguageManager).toBeDefined();
      expect(sectorNeutralLanguageManager.getAllSectorConfigurations()).toBeDefined();
    });

    it('should translate council-specific terms to sector-neutral terms', () => {
      const testText = 'Council Asset requires maintenance at the Works Depot';
      const context = {
        sector: 'government',
        userRole: 'manager',
        context: 'ui' as const,
        language: 'en-AU' as const,
      };

      const translatedText = sectorNeutralLanguageManager.translateText(testText, context);
      
      expect(translatedText).toContain('Organizational Asset');
      expect(translatedText).toContain('Maintenance Facility');
      expect(translatedText).not.toContain('Council Asset');
      expect(translatedText).not.toContain('Works Depot');
    });

    it('should get language mappings for specific sector', () => {
      const governmentMappings = sectorNeutralLanguageManager.getLanguageMappings('government');
      
      expect(governmentMappings).toBeDefined();
      expect(governmentMappings.length).toBeGreaterThan(0);
      
      const councilAssetMapping = governmentMappings.find(m => m.councilTerm === 'Council Asset');
      expect(councilAssetMapping).toBeDefined();
      expect(councilAssetMapping?.neutralTerm).toBe('Organizational Asset');
    });

    it('should set and get current sector', () => {
      sectorNeutralLanguageManager.setCurrentSector('utilities');
      expect(sectorNeutralLanguageManager.getCurrentSector()).toBe('utilities');
      
      sectorNeutralLanguageManager.setCurrentSector('transport');
      expect(sectorNeutralLanguageManager.getCurrentSector()).toBe('transport');
    });

    it('should validate sector configuration', () => {
      const validation = sectorNeutralLanguageManager.validateSectorConfiguration('government');
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should export and import sector configuration', () => {
      const configJson = sectorNeutralLanguageManager.exportSectorConfiguration('government');
      expect(configJson).toBeDefined();
      expect(() => JSON.parse(configJson)).not.toThrow();
      
      const parsedConfig = JSON.parse(configJson);
      expect(parsedConfig.id).toBe('government');
      expect(parsedConfig.displayName).toBe('Government & Public Sector');
    });

    it('should add custom language mapping', () => {
      const customMapping = {
        councilTerm: 'Custom Council Term',
        neutralTerm: 'Custom Neutral Term',
        description: 'Custom mapping for testing',
        category: 'asset' as const,
        sectors: ['government'],
        context: 'Test context',
      };

      sectorNeutralLanguageManager.addLanguageMapping(customMapping);
      
      const governmentMappings = sectorNeutralLanguageManager.getLanguageMappings('government');
      const foundMapping = governmentMappings.find(m => m.councilTerm === 'Custom Council Term');
      
      expect(foundMapping).toBeDefined();
      expect(foundMapping?.neutralTerm).toBe('Custom Neutral Term');
    });

    it('should update language mapping', () => {
      sectorNeutralLanguageManager.updateLanguageMapping('Council Asset', {
        description: 'Updated description for testing',
      });
      
      const governmentMappings = sectorNeutralLanguageManager.getLanguageMappings('government');
      const updatedMapping = governmentMappings.find(m => m.councilTerm === 'Council Asset');
      
      expect(updatedMapping?.description).toBe('Updated description for testing');
    });

    it('should remove language mapping', () => {
      sectorNeutralLanguageManager.removeLanguageMapping('Custom Council Term');
      
      const governmentMappings = sectorNeutralLanguageManager.getLanguageMappings('government');
      const removedMapping = governmentMappings.find(m => m.councilTerm === 'Custom Council Term');
      
      expect(removedMapping).toBeUndefined();
    });
  });

  describe('E10.2: Sector-Specific Templates & Configurations', () => {
    it('should initialize template manager', () => {
      expect(sectorTemplateManager).toBeDefined();
      expect(sectorTemplateManager.getAllSectorConfigurations()).toBeDefined();
    });

    it('should get templates by sector', () => {
      const governmentTemplates = sectorTemplateManager.getTemplatesBySector('government');
      
      expect(governmentTemplates).toBeDefined();
      expect(governmentTemplates.length).toBeGreaterThan(0);
      
      const dashboardTemplate = governmentTemplates.find(t => t.category === 'dashboard');
      expect(dashboardTemplate).toBeDefined();
      expect(dashboardTemplate?.name).toBe('Government Main Dashboard');
    });

    it('should get templates by category', () => {
      const dashboardTemplates = sectorTemplateManager.getTemplatesByCategory('dashboard');
      
      expect(dashboardTemplates).toBeDefined();
      expect(dashboardTemplates.length).toBeGreaterThan(0);
      
      // Should include templates from multiple sectors
      const sectors = dashboardTemplates.map(t => t.sector);
      expect(sectors).toContain('government');
      expect(sectors).toContain('utilities');
    });

    it('should create custom template', () => {
      const customTemplate = {
        name: 'Custom Test Template',
        displayName: 'Custom Test Template',
        description: 'Custom template for testing',
        sector: 'government',
        category: 'dashboard' as const,
        template: {
          layout: 'grid',
          widgets: [
            { type: 'custom_widget', position: { x: 0, y: 0, w: 4, h: 2 } },
          ],
        },
        variables: [
          {
            name: 'customVariable',
            type: 'string' as const,
            required: true,
            description: 'Custom variable for testing',
          },
        ],
        permissions: ['admin'],
        enabled: true,
      };

      const templateId = sectorTemplateManager.createTemplate(customTemplate);
      
      expect(templateId).toBeDefined();
      expect(templateId).toMatch(/^custom_/);
      
      const createdTemplate = sectorTemplateManager.getTemplate(templateId);
      expect(createdTemplate).toBeDefined();
      expect(createdTemplate?.name).toBe('Custom Test Template');
    });

    it('should render template with variables', () => {
      const templateId = 'gov_dashboard_main';
      const variables = {
        organizationName: 'Test Government Organization',
        primaryColor: '#FF0000',
      };

      const renderedTemplate = sectorTemplateManager.renderTemplate(templateId, variables);
      
      expect(renderedTemplate).toBeDefined();
      expect(renderedTemplate.layout).toBe('grid');
      expect(renderedTemplate.widgets).toBeDefined();
    });

    it('should validate template variables', () => {
      const templateId = 'gov_dashboard_main';
      const validVariables = {
        organizationName: 'Test Organization',
        primaryColor: '#FF0000',
      };

      const validation = sectorTemplateManager.validateTemplateVariables(templateId, validVariables);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate template variables with errors', () => {
      const templateId = 'gov_dashboard_main';
      const invalidVariables = {
        organizationName: 123, // Should be string
        primaryColor: 'invalid-color', // Should be valid hex color
      };

      const validation = sectorTemplateManager.validateTemplateVariables(templateId, invalidVariables);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should export and import template', () => {
      const templateId = 'gov_dashboard_main';
      const templateJson = sectorTemplateManager.exportTemplate(templateId);
      
      expect(templateJson).toBeDefined();
      expect(() => JSON.parse(templateJson)).not.toThrow();
      
      const parsedTemplate = JSON.parse(templateJson);
      expect(parsedTemplate.id).toBe(templateId);
      expect(parsedTemplate.name).toBe('Government Main Dashboard');
    });

    it('should update template', () => {
      const templateId = 'gov_dashboard_main';
      const updates = {
        description: 'Updated description for testing',
      };

      sectorTemplateManager.updateTemplate(templateId, updates);
      
      const updatedTemplate = sectorTemplateManager.getTemplate(templateId);
      expect(updatedTemplate?.description).toBe('Updated description for testing');
    });

    it('should delete template', () => {
      const templateId = 'gov_dashboard_main';
      
      sectorTemplateManager.deleteTemplate(templateId);
      
      const deletedTemplate = sectorTemplateManager.getTemplate(templateId);
      expect(deletedTemplate).toBeNull();
    });

    it('should get sector configuration', () => {
      const governmentConfig = sectorTemplateManager.getSectorConfiguration('government_config');
      
      expect(governmentConfig).toBeDefined();
      expect(governmentConfig?.sector).toBe('government');
      expect(governmentConfig?.settings).toBeDefined();
      expect(governmentConfig?.branding).toBeDefined();
    });
  });

  describe('E10.3: Multi-Sector Asset Classification', () => {
    it('should initialize asset classification manager', () => {
      expect(multiSectorAssetClassificationManager).toBeDefined();
      expect(multiSectorAssetClassificationManager.getAllSectorMappings()).toBeDefined();
    });

    it('should get classifications by sector', () => {
      const governmentClassifications = multiSectorAssetClassificationManager.getClassificationsBySector('government');
      
      expect(governmentClassifications).toBeDefined();
      expect(governmentClassifications.length).toBeGreaterThan(0);
      
      const roadInfrastructure = governmentClassifications.find(c => c.id === 'gov_road_infrastructure');
      expect(roadInfrastructure).toBeDefined();
      expect(roadInfrastructure?.name).toBe('Road Infrastructure');
    });

    it('should get classifications by category', () => {
      const infrastructureClassifications = multiSectorAssetClassificationManager.getClassificationsByCategory('infrastructure');
      
      expect(infrastructureClassifications).toBeDefined();
      expect(infrastructureClassifications.length).toBeGreaterThan(0);
      
      // Should include classifications from multiple sectors
      const sectors = infrastructureClassifications.map(c => c.sector);
      expect(sectors).toContain('government');
      expect(sectors).toContain('utilities');
    });

    it('should create custom classification', () => {
      const customClassification = {
        name: 'Custom Test Classification',
        displayName: 'Custom Test Classification',
        description: 'Custom classification for testing',
        sector: 'government',
        category: 'test',
        attributes: [
          {
            name: 'testAttribute',
            type: 'string' as const,
            required: true,
            description: 'Test attribute',
          },
        ],
        relationships: [],
        lifecycle: {
          phases: [
            {
              id: 'test_phase',
              name: 'Test Phase',
              description: 'Test phase',
              order: 1,
              activities: ['Test Activity'],
              deliverables: ['Test Deliverable'],
              duration: 1,
            },
          ],
          transitions: [],
          duration: { planned: 1 },
        },
        compliance: [],
        maintenance: [],
        enabled: true,
      };

      const classificationId = multiSectorAssetClassificationManager.createClassification(customClassification);
      
      expect(classificationId).toBeDefined();
      expect(classificationId).toMatch(/^custom_/);
      
      const createdClassification = multiSectorAssetClassificationManager.getClassification(classificationId);
      expect(createdClassification).toBeDefined();
      expect(createdClassification?.name).toBe('Custom Test Classification');
    });

    it('should validate asset against classification', () => {
      const classificationId = 'gov_road_infrastructure';
      const validAssetData = {
        roadType: 'highway',
        length: 10.5,
        lanes: 4,
        surfaceType: 'asphalt',
        constructionDate: '2020-01-01',
      };

      const validation = multiSectorAssetClassificationManager.validateAsset(classificationId, validAssetData);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate asset with errors', () => {
      const classificationId = 'gov_road_infrastructure';
      const invalidAssetData = {
        roadType: 'invalid_type', // Not in allowed options
        length: -5, // Negative length
        lanes: 10, // Too many lanes
        surfaceType: 'invalid_surface', // Not in allowed options
      };

      const validation = multiSectorAssetClassificationManager.validateAsset(classificationId, invalidAssetData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should get asset lifecycle phase', () => {
      const classificationId = 'gov_road_infrastructure';
      const assetAge = 6; // 6 months

      const lifecyclePhase = multiSectorAssetClassificationManager.getAssetLifecyclePhase(classificationId, assetAge);
      
      expect(lifecyclePhase).toBeDefined();
      expect(lifecyclePhase?.name).toBe('Planning');
    });

    it('should get maintenance requirements', () => {
      const classificationId = 'gov_road_infrastructure';
      const maintenanceRequirements = multiSectorAssetClassificationManager.getMaintenanceRequirements(classificationId);
      
      expect(maintenanceRequirements).toBeDefined();
      expect(maintenanceRequirements.length).toBeGreaterThan(0);
      
      const preventiveMaintenance = maintenanceRequirements.find(m => m.type === 'preventive');
      expect(preventiveMaintenance).toBeDefined();
      expect(preventiveMaintenance?.frequency).toBe('annually');
    });

    it('should get compliance requirements', () => {
      const classificationId = 'gov_road_infrastructure';
      const complianceRequirements = multiSectorAssetClassificationManager.getComplianceRequirements(classificationId);
      
      expect(complianceRequirements).toBeDefined();
      expect(complianceRequirements.length).toBeGreaterThan(0);
      
      const isoCompliance = complianceRequirements.find(c => c.standard === 'ISO 55000');
      expect(isoCompliance).toBeDefined();
      expect(isoCompliance?.frequency).toBe('yearly');
    });

    it('should export and import classification', () => {
      const classificationId = 'gov_road_infrastructure';
      const classificationJson = multiSectorAssetClassificationManager.exportClassification(classificationId);
      
      expect(classificationJson).toBeDefined();
      expect(() => JSON.parse(classificationJson)).not.toThrow();
      
      const parsedClassification = JSON.parse(classificationJson);
      expect(parsedClassification.id).toBe(classificationId);
      expect(parsedClassification.name).toBe('Road Infrastructure');
    });

    it('should update classification', () => {
      const classificationId = 'gov_road_infrastructure';
      const updates = {
        description: 'Updated description for testing',
      };

      multiSectorAssetClassificationManager.updateClassification(classificationId, updates);
      
      const updatedClassification = multiSectorAssetClassificationManager.getClassification(classificationId);
      expect(updatedClassification?.description).toBe('Updated description for testing');
    });

    it('should delete classification', () => {
      const classificationId = 'gov_road_infrastructure';
      
      multiSectorAssetClassificationManager.deleteClassification(classificationId);
      
      const deletedClassification = multiSectorAssetClassificationManager.getClassification(classificationId);
      expect(deletedClassification).toBeNull();
    });

    it('should get sector mapping', () => {
      const governmentMapping = multiSectorAssetClassificationManager.getSectorMapping('government');
      
      expect(governmentMapping).toBeDefined();
      expect(governmentMapping?.sector).toBe('government');
      expect(governmentMapping?.classifications).toBeDefined();
      expect(governmentMapping?.hierarchies).toBeDefined();
      expect(governmentMapping?.workflows).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should perform end-to-end sector-neutral workflow', () => {
      // Set sector to government
      sectorNeutralLanguageManager.setCurrentSector('government');
      expect(sectorNeutralLanguageManager.getCurrentSector()).toBe('government');

      // Translate text
      const testText = 'Council Asset at Works Depot needs maintenance';
      const context = {
        sector: 'government',
        userRole: 'manager',
        context: 'ui' as const,
        language: 'en-AU' as const,
      };
      const translatedText = sectorNeutralLanguageManager.translateText(testText, context);
      expect(translatedText).toContain('Organizational Asset');
      expect(translatedText).toContain('Maintenance Facility');

      // Get government templates
      const governmentTemplates = sectorTemplateManager.getTemplatesBySector('government');
      expect(governmentTemplates.length).toBeGreaterThan(0);

      // Render a template
      const dashboardTemplate = governmentTemplates.find(t => t.category === 'dashboard');
      if (dashboardTemplate) {
        const variables = {
          organizationName: 'Test Government Organization',
          primaryColor: '#3B82F6',
        };
        const renderedTemplate = sectorTemplateManager.renderTemplate(dashboardTemplate.id, variables);
        expect(renderedTemplate).toBeDefined();
      }

      // Get government asset classifications
      const governmentClassifications = multiSectorAssetClassificationManager.getClassificationsBySector('government');
      expect(governmentClassifications.length).toBeGreaterThan(0);

      // Validate an asset
      const roadClassification = governmentClassifications.find(c => c.id === 'gov_road_infrastructure');
      if (roadClassification) {
        const assetData = {
          roadType: 'highway',
          length: 15.2,
          lanes: 4,
          surfaceType: 'asphalt',
          constructionDate: '2018-06-01',
        };
        const validation = multiSectorAssetClassificationManager.validateAsset(roadClassification.id, assetData);
        expect(validation.isValid).toBe(true);
      }
    });

    it('should handle multiple sectors simultaneously', () => {
      // Test government sector
      sectorNeutralLanguageManager.setCurrentSector('government');
      const governmentMappings = sectorNeutralLanguageManager.getLanguageMappings('government');
      expect(governmentMappings.length).toBeGreaterThan(0);

      // Test utilities sector
      sectorNeutralLanguageManager.setCurrentSector('utilities');
      const utilitiesMappings = sectorNeutralLanguageManager.getLanguageMappings('utilities');
      expect(utilitiesMappings.length).toBeGreaterThan(0);

      // Test transport sector
      sectorNeutralLanguageManager.setCurrentSector('transport');
      const transportMappings = sectorNeutralLanguageManager.getLanguageMappings('transport');
      expect(transportMappings.length).toBeGreaterThan(0);

      // Verify different sectors have different mappings
      expect(governmentMappings).not.toEqual(utilitiesMappings);
      expect(utilitiesMappings).not.toEqual(transportMappings);
    });

    it('should handle error scenarios gracefully', () => {
      // Test invalid sector
      expect(() => {
        sectorNeutralLanguageManager.getLanguageMappings('invalid_sector');
      }).not.toThrow();

      // Test invalid template ID
      expect(() => {
        sectorTemplateManager.getTemplate('invalid_template_id');
      }).not.toThrow();

      // Test invalid classification ID
      expect(() => {
        multiSectorAssetClassificationManager.getClassification('invalid_classification_id');
      }).not.toThrow();

      // Test template rendering with missing variables
      expect(() => {
        sectorTemplateManager.renderTemplate('gov_dashboard_main', {});
      }).toThrow(); // Should throw for missing required variables
    });
  });
});
