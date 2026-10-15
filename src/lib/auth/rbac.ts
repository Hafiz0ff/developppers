/**
 * Role-Based Access Control (RBAC) Architecture
 * Implements Section 5.1 & 5.2 of the specification:
 * - 7 User Roles: user, realtor, developer, agency, agency_agent, admin, super_admin
 * - Granular permissions matrix for sections and operations
 * - Server-side guards and entity ownership enforcement
 */

export type UserRole =
  | "user"
  | "realtor"
  | "developer"
  | "agency"
  | "agency_agent"
  | "admin"
  | "super_admin";

export type Permission =
  // Classifieds permissions
  | "classified:create"
  | "classified:update_own"
  | "classified:update_agency"
  | "classified:update_any"
  | "classified:delete_own"
  | "classified:delete_agency"
  | "classified:delete_any"
  | "classified:moderate"
  // Projects (New developments) permissions
  | "project:create"
  | "project:update_own"
  | "project:update_any"
  | "project:delete"
  | "project:manage_chess"
  | "project:manage_parking"
  | "project:manage_storage"
  | "project:manage_docs"
  // Agency management
  | "agency:manage_agents"
  | "agency:assign_leads"
  // CRM Leads
  | "crm:leads_own"
  | "crm:leads_agency"
  | "crm:leads_all"
  // User & Administrative permissions
  | "user:read"
  | "user:manage_roles"
  | "user:ban"
  | "system:view_audit_logs"
  | "system:manage_feature_flags"
  | "system:super_admin_access";

/**
 * Base permissions mapped to each of the 7 roles
 */
export const ROLE_PERMISSIONS: Record<UserRole, ReadonlySet<Permission>> = {
  // 1. Regular user: can post personal classifieds, manage own ads
  user: new Set<Permission>([
    "classified:create",
    "classified:update_own",
    "classified:delete_own",
  ]),

  // 2. Private Realtor: posts classifieds, receives CRM leads for their ads
  realtor: new Set<Permission>([
    "classified:create",
    "classified:update_own",
    "classified:delete_own",
    "crm:leads_own",
  ]),

  // 3. Developer: manages residential complexes, layouts, chessboard, parking, storage, docs
  developer: new Set<Permission>([
    "project:create",
    "project:update_own",
    "project:manage_chess",
    "project:manage_parking",
    "project:manage_storage",
    "project:manage_docs",
    "crm:leads_own",
  ]),

  // 4. Real Estate Agency: manages agency listings, agent accounts, distributes leads
  agency: new Set<Permission>([
    "classified:create",
    "classified:update_own",
    "classified:update_agency",
    "classified:delete_own",
    "classified:delete_agency",
    "agency:manage_agents",
    "agency:assign_leads",
    "crm:leads_own",
    "crm:leads_agency",
  ]),

  // 5. Agency Agent: posts and edits listings on behalf of agency
  agency_agent: new Set<Permission>([
    "classified:create",
    "classified:update_own",
    "crm:leads_own",
  ]),

  // 6. Admin: content moderation, managing any project or classified, reading users
  admin: new Set<Permission>([
    "classified:create",
    "classified:update_own",
    "classified:update_agency",
    "classified:update_any",
    "classified:delete_own",
    "classified:delete_agency",
    "classified:delete_any",
    "classified:moderate",
    "project:create",
    "project:update_own",
    "project:update_any",
    "project:delete",
    "project:manage_chess",
    "project:manage_parking",
    "project:manage_storage",
    "project:manage_docs",
    "agency:manage_agents",
    "agency:assign_leads",
    "crm:leads_own",
    "crm:leads_agency",
    "crm:leads_all",
    "user:read",
  ]),

  // 7. Super-Admin: unrestricted master permissions across the entire platform
  super_admin: new Set<Permission>([
    "classified:create",
    "classified:update_own",
    "classified:update_agency",
    "classified:update_any",
    "classified:delete_own",
    "classified:delete_agency",
    "classified:delete_any",
    "classified:moderate",
    "project:create",
    "project:update_own",
    "project:update_any",
    "project:delete",
    "project:manage_chess",
    "project:manage_parking",
    "project:manage_storage",
    "project:manage_docs",
    "agency:manage_agents",
    "agency:assign_leads",
    "crm:leads_own",
    "crm:leads_agency",
    "crm:leads_all",
    "user:read",
    "user:manage_roles",
    "user:ban",
    "system:view_audit_logs",
    "system:manage_feature_flags",
    "system:super_admin_access",
  ]),
};

export class ForbiddenError extends Error {
  code = "FORBIDDEN";
  status = 403;
  constructor(message = "Access denied: insufficient permissions") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Checks whether a user with given role has a specific permission
 */
export function hasPermission(role: UserRole | string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;
  const permissions = ROLE_PERMISSIONS[role as UserRole];
  if (!permissions) return false;
  return permissions.has(permission);
}

/**
 * Throws ForbiddenError if user lacks permission
 */
export function assertPermission(role: UserRole | string | null | undefined, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new ForbiddenError(`User with role '${role}' lacks required permission: '${permission}'`);
  }
}

export interface UserContext {
  id: string;
  role: UserRole;
  agencyId?: string | null;
  developerId?: string | null;
}

export interface EntityContext {
  userId?: string | null;
  developerId?: string | null;
  agencyId?: string | null;
}

/**
 * Server-side ownership and authorization check.
 * Strictly prevents users from altering objects owned by others.
 */
export function canModifyEntity(user: UserContext, entity: EntityContext): boolean {
  if (!user || !user.role) return false;

  // Super-admin and admin can modify any entity
  if (user.role === "super_admin" || user.role === "admin") {
    return true;
  }

  // Developer modifying their own project
  if (user.role === "developer") {
    if (entity.developerId && user.developerId && entity.developerId === user.developerId) {
      return true;
    }
    if (entity.userId && entity.userId === user.id) {
      return true;
    }
    return false;
  }

  // Agency owner/manager modifying agency-affiliated listings
  if (user.role === "agency") {
    if (entity.agencyId && user.agencyId && entity.agencyId === user.agencyId) {
      return true;
    }
    if (entity.userId && entity.userId === user.id) {
      return true;
    }
    return false;
  }

  // Agency agent modifying own listings
  if (user.role === "agency_agent" || user.role === "realtor" || user.role === "user") {
    return Boolean(entity.userId && entity.userId === user.id);
  }

  return false;
}

/**
 * Throws ForbiddenError if user cannot modify this entity
 */
export function assertCanModifyEntity(user: UserContext, entity: EntityContext, entityDescription = "object"): void {
  if (!canModifyEntity(user, entity)) {
    throw new ForbiddenError(`User '${user.id}' (${user.role}) is not authorized to modify ${entityDescription}`);
  }
}
