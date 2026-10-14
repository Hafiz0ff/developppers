export type PortalRole = "user" | "realtor" | "developer" | "admin";

/** Default on for the live marketplace; set CLASSIFIEDS_AUTO_APPROVE=false for the moderation queue. */
export const CLASSIFIEDS_AUTO_APPROVE = process.env.CLASSIFIEDS_AUTO_APPROVE !== "false";

/** Default off so seed citizens can post; set CLASSIFIEDS_REQUIRE_PHONE=true for OTP. */
export const CLASSIFIEDS_REQUIRE_PHONE = process.env.CLASSIFIEDS_REQUIRE_PHONE === "true";

export function canPostClassified(role: string | undefined): boolean {
  return role === "user";
}

export function canMutateClassified(args: {
  actorId: string | undefined;
  actorRole: string | undefined;
  ownerId: string;
}): boolean {
  if (!args.actorId) return false;
  if (args.actorRole !== "user") return false;
  return args.actorId === args.ownerId;
}

export function canModerateClassifieds(role: string | undefined): boolean {
  return role === "admin";
}

export function isPubliclyListed(status: string): boolean {
  return status === "active";
}

export function initialClassifiedStatus(opts: { autoApprove: boolean }): "pending" | "active" {
  return opts.autoApprove ? "active" : "pending";
}

export const ownerStatusTransitions = ["archived", "sold"] as const;
export type OwnerStatus = (typeof ownerStatusTransitions)[number];

export function canOwnerSetStatus(status: string): status is OwnerStatus {
  return (ownerStatusTransitions as readonly string[]).includes(status);
}

export const adminStatusTransitions = ["active", "rejected"] as const;
export type AdminStatus = (typeof adminStatusTransitions)[number];

export function canAdminSetStatus(status: string): status is AdminStatus {
  return (adminStatusTransitions as readonly string[]).includes(status);
}
