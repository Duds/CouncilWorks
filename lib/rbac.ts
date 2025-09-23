import { hasRole } from "@/lib/audit";
import { Role } from "@prisma/client";

/**
 * RBAC utility functions for role-based access control
 */

/**
 * Check if user has admin privileges
 */
export function isAdmin(userRole: Role): boolean {
  return userRole === Role.ADMIN;
}

/**
 * Check if user has manager privileges or higher
 */
export function isManagerOrHigher(userRole: Role): boolean {
  return hasRole(userRole, [Role.MANAGER, Role.EXEC, Role.ADMIN]);
}

/**
 * Check if user has supervisor privileges or higher
 */
export function isSupervisorOrHigher(userRole: Role): boolean {
  return hasRole(userRole, [Role.SUPERVISOR, Role.MANAGER, Role.EXEC, Role.ADMIN]);
}

/**
 * Check if user can access executive features (EXEC and ADMIN only, not MANAGER)
 */
export function canAccessExecutive(userRole: Role): boolean {
  return hasRole(userRole, [Role.EXEC, Role.ADMIN]);
}

/**
 * Check if user can access admin features
 */
export function canAccessAdmin(userRole: Role): boolean {
  return hasRole(userRole, [Role.ADMIN]);
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(userRole: Role): boolean {
  return hasRole(userRole, [Role.ADMIN, Role.MANAGER]);
}

/**
 * Check if user can view reports
 */
export function canViewReports(userRole: Role): boolean {
  return hasRole(userRole, [Role.EXEC, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can create work orders
 */
export function canCreateWorkOrders(userRole: Role): boolean {
  return hasRole(userRole, [Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can assign work orders
 */
export function canAssignWorkOrders(userRole: Role): boolean {
  return hasRole(userRole, [Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can perform field work
 */
export function canPerformFieldWork(userRole: Role): boolean {
  return hasRole(userRole, [Role.CONTRACTOR, Role.MAINTENANCE_PLANNER, Role.CREW, Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can view citizen reports
 */
export function canViewCitizenReports(userRole: Role): boolean {
  return hasRole(userRole, [Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can create citizen reports
 */
export function canCreateCitizenReports(userRole: Role): boolean {
  return hasRole(userRole, [Role.CITIZEN, Role.PARTNER, Role.CONTRACTOR, Role.CREW, Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can access contractor features
 */
export function canAccessContractorFeatures(userRole: Role): boolean {
  return hasRole(userRole, [Role.CONTRACTOR, Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can access partner features
 */
export function canAccessPartnerFeatures(userRole: Role): boolean {
  return hasRole(userRole, [Role.PARTNER, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can view contractor work orders
 */
export function canViewContractorWorkOrders(userRole: Role): boolean {
  return hasRole(userRole, [Role.CONTRACTOR, Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can update contractor work orders
 */
export function canUpdateContractorWorkOrders(userRole: Role): boolean {
  return hasRole(userRole, [Role.CONTRACTOR, Role.SUPERVISOR, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can view partner data
 */
export function canViewPartnerData(userRole: Role): boolean {
  return hasRole(userRole, [Role.PARTNER, Role.MANAGER, Role.ADMIN]);
}

/**
 * Check if user can share data with partners
 */
export function canShareDataWithPartners(userRole: Role): boolean {
  return hasRole(userRole, [Role.MANAGER, Role.ADMIN]);
}

/**
 * Get accessible routes for a user role
 */
export function getAccessibleRoutes(userRole: Role): string[] {
  const routes: string[] = ["/dashboard"];

  if (canAccessAdmin(userRole)) {
    routes.push("/admin");
  }

  if (canViewReports(userRole)) {
    routes.push("/reports");
  }

  if (canCreateWorkOrders(userRole)) {
    routes.push("/work-orders");
  }

  if (canPerformFieldWork(userRole)) {
    routes.push("/field-work");
  }

  if (canCreateCitizenReports(userRole)) {
    routes.push("/citizen-reports");
  }

  if (canAccessContractorFeatures(userRole)) {
    routes.push("/contractor-portal");
  }

  if (canAccessPartnerFeatures(userRole)) {
    routes.push("/partner-portal");
  }

  return routes;
}

/**
 * Middleware helper to check permissions
 */
export function requirePermission(
  userRole: Role,
  permissionCheck: (role: Role) => boolean,
  errorMessage = "Insufficient permissions"
) {
  if (!permissionCheck(userRole)) {
    throw new Error(errorMessage);
  }
}

/**
 * API route helper to validate user permissions
 */
export function validatePermissions(
  userRole: Role,
  requiredPermissions: ((role: Role) => boolean)[]
): boolean {
  return requiredPermissions.every(permission => permission(userRole));
}
