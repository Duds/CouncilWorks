/**
 * ISO 20000 Compliance Implementation
 * 
 * Implements ISO/IEC 20000-1:2018 - Information technology — Service management — Part 1: Service management system requirements
 * 
 * This module provides IT service management implementation,
 * service lifecycle management, and service quality assurance.
 * 
 * @fileoverview ISO 20000 compliance for IT service management
 */

import { PrismaClient } from '@prisma/client';

export interface ServiceManagementSystem {
  id: string;
  name: string;
  description: string;
  services: Service[];
  processes: ServiceProcess[];
  policies: ServicePolicy[];
  objectives: ServiceObjective[];
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  type: 'Infrastructure' | 'Application' | 'Business' | 'Support';
  status: 'Active' | 'Inactive' | 'Deprecated';
  sla: ServiceLevelAgreement;
  metrics: ServiceMetric[];
  incidents: ServiceIncident[];
  changes: ServiceChange[];
}

export interface ServiceLevelAgreement {
  id: string;
  name: string;
  availability: number;
  responseTime: number;
  resolutionTime: number;
  uptime: number;
  customerSatisfaction: number;
  penalties: string[];
}

export interface ServiceMetric {
  id: string;
  name: string;
  type: 'Performance' | 'Quality' | 'Availability' | 'Customer Satisfaction';
  value: number;
  target: number;
  unit: string;
  measuredAt: Date;
}

export interface ServiceIncident {
  id: string;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reportedAt: Date;
  resolvedAt?: Date;
  resolutionTime?: number;
}

export interface ServiceChange {
  id: string;
  title: string;
  description: string;
  type: 'Standard' | 'Normal' | 'Emergency';
  status: 'Requested' | 'Approved' | 'Implemented' | 'Closed';
  requestedAt: Date;
  implementedAt?: Date;
  risk: 'Low' | 'Medium' | 'High';
}

export interface ServiceProcess {
  id: string;
  name: string;
  description: string;
  type: 'Incident Management' | 'Change Management' | 'Problem Management' | 'Service Level Management';
  activities: ProcessActivity[];
  roles: ProcessRole[];
  metrics: ProcessMetric[];
}

export interface ProcessActivity {
  id: string;
  name: string;
  description: string;
  sequence: number;
  responsible: string;
  duration: number;
  dependencies: string[];
}

export interface ProcessRole {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  training: string[];
}

export interface ProcessMetric {
  id: string;
  name: string;
  type: 'Efficiency' | 'Effectiveness' | 'Quality';
  value: number;
  target: number;
  unit: string;
  measuredAt: Date;
}

export interface ServicePolicy {
  id: string;
  name: string;
  description: string;
  scope: string;
  objectives: string[];
  requirements: string[];
  compliance: number;
}

export interface ServiceObjective {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: 'On Track' | 'At Risk' | 'Behind';
}

export class Iso20000Compliance {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create service management system
   */
  async createServiceManagementSystem(data: Omit<ServiceManagementSystem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceManagementSystem> {
    const system = await this.prisma.serviceManagementSystem.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return system as ServiceManagementSystem;
  }

  /**
   * Get service management systems
   */
  async getServiceManagementSystems(organisationId: string): Promise<ServiceManagementSystem[]> {
    const systems = await this.prisma.serviceManagementSystem.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return systems as ServiceManagementSystem[];
  }

  /**
   * Create service incident
   */
  async createServiceIncident(data: Omit<ServiceIncident, 'id' | 'reportedAt'>): Promise<ServiceIncident> {
    const incident = await this.prisma.serviceIncident.create({
      data: {
        ...data,
        reportedAt: new Date(),
      },
    });

    return incident as ServiceIncident;
  }

  /**
   * Get service incidents
   */
  async getServiceIncidents(organisationId: string): Promise<ServiceIncident[]> {
    const incidents = await this.prisma.serviceIncident.findMany({
      where: { organisationId },
      orderBy: { reportedAt: 'desc' },
    });

    return incidents as ServiceIncident[];
  }

  /**
   * Create service change
   */
  async createServiceChange(data: Omit<ServiceChange, 'id' | 'requestedAt'>): Promise<ServiceChange> {
    const change = await this.prisma.serviceChange.create({
      data: {
        ...data,
        requestedAt: new Date(),
      },
    });

    return change as ServiceChange;
  }

  /**
   * Get service changes
   */
  async getServiceChanges(organisationId: string): Promise<ServiceChange[]> {
    const changes = await this.prisma.serviceChange.findMany({
      where: { organisationId },
      orderBy: { requestedAt: 'desc' },
    });

    return changes as ServiceChange[];
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    organisationId: string,
    period: { startDate: Date; endDate: Date },
    generatedBy: string
  ): Promise<{
    organisationId: string;
    period: { startDate: Date; endDate: Date };
    generatedBy: string;
    generatedAt: Date;
    complianceScore: number;
    systems: number;
    services: number;
    processes: number;
    policies: number;
    objectives: number;
    incidents: number;
    changes: number;
    slaCompliance: number;
    recommendations: string[];
  }> {
    const systems = await this.getServiceManagementSystems(organisationId);
    const incidents = await this.getServiceIncidents(organisationId);
    const changes = await this.getServiceChanges(organisationId);

    const complianceScore = this.calculateComplianceScore(systems, incidents, changes);
    const recommendations = this.generateRecommendations(systems, incidents, changes);

    const services = systems.reduce((sum, sys) => sum + sys.services.length, 0);
    const processes = systems.reduce((sum, sys) => sum + sys.processes.length, 0);
    const policies = systems.reduce((sum, sys) => sum + sys.policies.length, 0);
    const objectives = systems.reduce((sum, sys) => sum + sys.objectives.length, 0);

    const slaCompliance = this.calculateSLACompliance(systems);

    return {
      organisationId,
      period,
      generatedBy,
      generatedAt: new Date(),
      complianceScore,
      systems: systems.length,
      services,
      processes,
      policies,
      objectives,
      incidents: incidents.length,
      changes: changes.length,
      slaCompliance,
      recommendations,
    };
  }

  /**
   * Calculate compliance score
   */
  private calculateComplianceScore(
    systems: ServiceManagementSystem[],
    incidents: ServiceIncident[],
    changes: ServiceChange[]
  ): number {
    let score = 0;
    let weight = 0;

    // Service management systems
    if (systems.length > 0) {
      const systemScore = systems.reduce((sum, sys) => {
        const serviceScore = sys.services.length > 0 ? 100 : 0;
        const processScore = sys.processes.length > 0 ? 100 : 0;
        const policyScore = sys.policies.length > 0 ? 100 : 0;
        const objectiveScore = sys.objectives.length > 0 ? 100 : 0;
        return sum + (serviceScore + processScore + policyScore + objectiveScore) / 4;
      }, 0) / systems.length;
      score += systemScore * 40;
      weight += 40;
    }

    // Incident management
    if (incidents.length > 0) {
      const resolvedIncidents = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
      const incidentScore = (resolvedIncidents / incidents.length) * 100;
      score += incidentScore * 30;
      weight += 30;
    }

    // Change management
    if (changes.length > 0) {
      const implementedChanges = changes.filter(c => c.status === 'Implemented' || c.status === 'Closed').length;
      const changeScore = (implementedChanges / changes.length) * 100;
      score += changeScore * 30;
      weight += 30;
    }

    return weight > 0 ? Math.round(score / weight * 100) : 0;
  }

  /**
   * Calculate SLA compliance
   */
  private calculateSLACompliance(systems: ServiceManagementSystem[]): number {
    if (systems.length === 0) return 0;

    let totalCompliance = 0;
    let totalSLAs = 0;

    systems.forEach(sys => {
      sys.services.forEach(service => {
        const sla = service.sla;
        const availabilityCompliance = sla.availability >= 99.9 ? 100 : (sla.availability / 99.9) * 100;
        const responseCompliance = sla.responseTime <= 4 ? 100 : Math.max(0, 100 - (sla.responseTime - 4) * 10);
        const resolutionCompliance = sla.resolutionTime <= 24 ? 100 : Math.max(0, 100 - (sla.resolutionTime - 24) * 2);
        
        const slaCompliance = (availabilityCompliance + responseCompliance + resolutionCompliance) / 3;
        totalCompliance += slaCompliance;
        totalSLAs++;
      });
    });

    return totalSLAs > 0 ? Math.round(totalCompliance / totalSLAs * 100) / 100 : 0;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    systems: ServiceManagementSystem[],
    incidents: ServiceIncident[],
    changes: ServiceChange[]
  ): string[] {
    const recommendations: string[] = [];

    if (systems.length === 0) {
      recommendations.push('Implement service management system');
    }

    systems.forEach(sys => {
      if (sys.services.length === 0) {
        recommendations.push(`Define services for system: ${sys.name}`);
      }
      if (sys.processes.length === 0) {
        recommendations.push(`Implement service processes for system: ${sys.name}`);
      }
      if (sys.policies.length === 0) {
        recommendations.push(`Define service policies for system: ${sys.name}`);
      }
      if (sys.objectives.length === 0) {
        recommendations.push(`Set service objectives for system: ${sys.name}`);
      }
    });

    const openIncidents = incidents.filter(i => i.status === 'Open' || i.status === 'In Progress');
    if (openIncidents.length > 0) {
      recommendations.push(`Resolve ${openIncidents.length} open service incidents`);
    }

    const pendingChanges = changes.filter(c => c.status === 'Requested' || c.status === 'Approved');
    if (pendingChanges.length > 0) {
      recommendations.push(`Implement ${pendingChanges.length} pending service changes`);
    }

    return recommendations;
  }
}

export const iso20000Compliance = new Iso20000Compliance(new PrismaClient());
