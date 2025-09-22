/**
 * Vendor Ecosystem - Comprehensive Vendor, Contract, and SLA Management
 *
 * Creates a realistic vendor ecosystem that demonstrates Rule 2 (Risk Sets Rhythm)
 * through SLA-driven contractor management and performance tracking.
 */

import { PrismaClient } from '@prisma/client';

export async function generateVendorEcosystem(
  prisma: PrismaClient,
  organisationId: string
) {
  console.log('  🤝 Creating vendor ecosystem...');

  const vendors = [];
  const contracts = [];
  const slas = [];

  // Electrical Contractors
  const electricalVendors = [
    {
      name: 'Greenfield Electrical Services',
      abn: '12 345 678 901',
      contactEmail: 'admin@greenfieldelectrical.com.au',
      contactPhone: '+61 3 9876 5432',
      performanceRating: 4.7,
      capacityMargin: 25,
    },
    {
      name: 'Renewable Power Solutions',
      abn: '12 345 678 902',
      contactEmail: 'info@renewablepower.com.au',
      contactPhone: '+61 3 9876 5433',
      performanceRating: 4.5,
      capacityMargin: 30,
    },
  ];

  for (const vendorData of electricalVendors) {
    const vendor = await prisma.vendor.create({
      data: {
        organisationId,
        name: vendorData.name,
        abn: vendorData.abn,
        contactEmail: vendorData.contactEmail,
        contactPhone: vendorData.contactPhone,
        performanceRating: vendorData.performanceRating,
        capacityMargin: vendorData.capacityMargin,
      },
    });
    vendors.push(vendor);
  }

  // Civil Contractors
  const civilVendors = [
    {
      name: 'Greenfield Civil Works',
      abn: '12 345 678 903',
      contactEmail: 'projects@greenfieldcivil.com.au',
      contactPhone: '+61 3 9876 5434',
      performanceRating: 4.3,
      capacityMargin: 20,
    },
    {
      name: 'Infrastructure Solutions Pty Ltd',
      abn: '12 345 678 904',
      contactEmail: 'contact@infrasolutions.com.au',
      contactPhone: '+61 3 9876 5435',
      performanceRating: 4.6,
      capacityMargin: 35,
    },
  ];

  for (const vendorData of civilVendors) {
    const vendor = await prisma.vendor.create({
      data: {
        organisationId,
        name: vendorData.name,
        abn: vendorData.abn,
        contactEmail: vendorData.contactEmail,
        contactPhone: vendorData.contactPhone,
        performanceRating: vendorData.performanceRating,
        capacityMargin: vendorData.capacityMargin,
      },
    });
    vendors.push(vendor);
  }

  // Renewable Energy Specialists
  const renewableVendors = [
    {
      name: 'Wind Power Maintenance Co',
      abn: '12 345 678 905',
      contactEmail: 'service@windpower.com.au',
      contactPhone: '+61 3 9876 5436',
      performanceRating: 4.8,
      capacityMargin: 40,
    },
    {
      name: 'Solar Farm Operations',
      abn: '12 345 678 906',
      contactEmail: 'ops@solarfarm.com.au',
      contactPhone: '+61 3 9876 5437',
      performanceRating: 4.4,
      capacityMargin: 25,
    },
    {
      name: 'Battery Storage Systems',
      abn: '12 345 678 907',
      contactEmail: 'support@batterystorage.com.au',
      contactPhone: '+61 3 9876 5438',
      performanceRating: 4.9,
      capacityMargin: 30,
    },
  ];

  for (const vendorData of renewableVendors) {
    const vendor = await prisma.vendor.create({
      data: {
        organisationId,
        name: vendorData.name,
        abn: vendorData.abn,
        contactEmail: vendorData.contactEmail,
        contactPhone: vendorData.contactPhone,
        performanceRating: vendorData.performanceRating,
        capacityMargin: vendorData.capacityMargin,
      },
    });
    vendors.push(vendor);
  }

  // Smart Infrastructure Specialists
  const smartInfrastructureVendors = [
    {
      name: 'Smart City Technologies',
      abn: '12 345 678 908',
      contactEmail: 'support@smartcitytech.com.au',
      contactPhone: '+61 3 9876 5439',
      performanceRating: 4.5,
      capacityMargin: 20,
    },
    {
      name: 'IoT Solutions Australia',
      abn: '12 345 678 909',
      contactEmail: 'info@iotsolutions.com.au',
      contactPhone: '+61 3 9876 5440',
      performanceRating: 4.6,
      capacityMargin: 25,
    },
  ];

  for (const vendorData of smartInfrastructureVendors) {
    const vendor = await prisma.vendor.create({
      data: {
        organisationId,
        name: vendorData.name,
        abn: vendorData.abn,
        contactEmail: vendorData.contactEmail,
        contactPhone: vendorData.contactPhone,
        performanceRating: vendorData.performanceRating,
        capacityMargin: vendorData.capacityMargin,
      },
    });
    vendors.push(vendor);
  }

  // Create Contracts with SLAs
  const contractTypes = [
    {
      name: 'Wind Farm Maintenance Contract',
      scope:
        'Comprehensive maintenance and operations for wind farm infrastructure',
      vendorIndex: 5, // Wind Power Maintenance Co
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      slaCount: 3,
    },
    {
      name: 'Solar Farm Operations Contract',
      scope:
        'Operations, maintenance, and performance optimization for solar arrays',
      vendorIndex: 6, // Solar Farm Operations
      startDate: new Date('2024-02-01'),
      endDate: new Date('2027-01-31'),
      slaCount: 4,
    },
    {
      name: 'Battery Storage Maintenance',
      scope: 'Maintenance and monitoring of grid-scale battery storage systems',
      vendorIndex: 7, // Battery Storage Systems
      startDate: new Date('2024-01-15'),
      endDate: new Date('2026-12-15'),
      slaCount: 2,
    },
    {
      name: 'Electrical Infrastructure Maintenance',
      scope:
        'General electrical infrastructure maintenance and emergency response',
      vendorIndex: 0, // Greenfield Electrical Services
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
      slaCount: 5,
    },
    {
      name: 'Smart Infrastructure Support',
      scope: 'IoT sensors, smart lighting, and traffic management systems',
      vendorIndex: 8, // Smart City Technologies
      startDate: new Date('2024-03-01'),
      endDate: new Date('2026-02-28'),
      slaCount: 3,
    },
  ];

  for (const contractData of contractTypes) {
    const contract = await prisma.contract.create({
      data: {
        organisationId,
        vendorId: vendors[contractData.vendorIndex].id,
        name: contractData.name,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        scope: contractData.scope,
        status: 'ACTIVE',
        renewalDueDate: new Date(
          contractData.endDate.getTime() - 90 * 24 * 60 * 60 * 1000
        ), // 90 days before end
      },
    });
    contracts.push(contract);

    // Create SLAs for each contract
    const slaTemplates = [
      {
        name: 'Emergency Response SLA',
        responseTimeHours: 2,
        resolutionTimeHours: 24,
        frequencyDays: null,
        costModel: 'Fixed Monthly',
        breachEscalation: 'Immediate escalation to management',
      },
      {
        name: 'Preventive Maintenance SLA',
        responseTimeHours: 24,
        resolutionTimeHours: 72,
        frequencyDays: 30,
        costModel: 'Per Task',
        breachEscalation: '24-hour escalation to project manager',
      },
      {
        name: 'Performance Monitoring SLA',
        responseTimeHours: 4,
        resolutionTimeHours: 48,
        frequencyDays: 7,
        costModel: 'Monthly Retainer',
        breachEscalation: '48-hour escalation to technical lead',
      },
      {
        name: 'Corrective Maintenance SLA',
        responseTimeHours: 8,
        resolutionTimeHours: 48,
        frequencyDays: null,
        costModel: 'Time and Materials',
        breachEscalation: '24-hour escalation to operations manager',
      },
      {
        name: 'System Optimization SLA',
        responseTimeHours: 48,
        resolutionTimeHours: 168,
        frequencyDays: 90,
        costModel: 'Project Based',
        breachEscalation: 'Weekly escalation to account manager',
      },
    ];

    // Create SLAs for this contract
    for (let i = 0; i < contractData.slaCount; i++) {
      const slaTemplate = slaTemplates[i % slaTemplates.length];
      const sla = await prisma.sla.create({
        data: {
          organisationId,
          contractId: contract.id,
          name: `${slaTemplate.name} - ${contractData.name}`,
          responseTimeHours: slaTemplate.responseTimeHours,
          resolutionTimeHours: slaTemplate.resolutionTimeHours,
          frequencyDays: slaTemplate.frequencyDays,
          costModel: slaTemplate.costModel,
          breachEscalation: slaTemplate.breachEscalation,
        },
      });
      slas.push(sla);
    }
  }

  console.log(
    `  ✅ Created ${vendors.length} vendors, ${contracts.length} contracts, ${slas.length} SLAs`
  );

  return {
    vendors,
    contracts,
    slas,
  };
}
