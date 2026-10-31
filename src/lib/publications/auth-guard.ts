import { NextRequest } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";

export interface PublicationsActor {
  id: string;
  role: string;
  name: string;
  phone: string | null;
  phoneVerified: boolean;
  isDemo?: boolean;
}

/**
 * MASKANI.TJ — Publication Auth Guard
 * Strictly resolves actor from server session in normal mode.
 * Demo/mock access is ONLY enabled if explicitly configured via server environment flag
 * (process.env.ALLOW_PUBLICATIONS_DEMO === "true" or NODE_ENV === "test").
 * Demo actors are strictly barred from making real Telegram API calls.
 */
export async function getPublicationsActor(req?: NextRequest): Promise<PublicationsActor | null> {
  // 1. Try real server-side session first
  const realActor = await getClassifiedsActor();
  if (realActor && realActor.id) {
    return {
      ...realActor,
      isDemo: false,
    };
  }

  // 2. Demo mode is strictly restricted to test environment or explicit env flag
  const isDemoAllowed =
    process.env.NODE_ENV === "test" ||
    process.env.ALLOW_PUBLICATIONS_DEMO === "true";

  if (!isDemoAllowed) {
    return null;
  }

  // If demo mode is permitted on the server (e.g. unit/integration tests):
  let demoRole =
    req?.nextUrl?.searchParams?.get("demoRole") ||
    req?.headers?.get("x-demo-role") ||
    null;

  let demoUserId =
    req?.nextUrl?.searchParams?.get("demoUserId") ||
    req?.headers?.get("x-demo-user-id") ||
    null;

  if (!demoRole && req && req.method === "POST") {
    try {
      const cloned = req.clone();
      const body = await cloned.json();
      if (body) {
        if (body.demoRole) demoRole = body.demoRole;
        if (body.demoUserId) demoUserId = body.demoUserId;
      }
    } catch {
      // not JSON body
    }
  }

  if (!demoRole) {
    return null;
  }

  if (demoRole === "realtor" || demoRole === "agency_agent" || demoRole === "agency") {
    const actorId = demoUserId || "usr_realtor_01";
    return {
      id: actorId,
      role: demoRole,
      name: "Рустам Алиев (Тестовый риелтор)",
      phone: "+992927712233",
      phoneVerified: true,
      isDemo: true,
    };
  }

  if (demoRole === "developer") {
    const actorId = demoUserId || "usr_dev_rep_01";
    return {
      id: actorId,
      role: "developer",
      name: "Отдел Продаж «Qayroqum Avenue» (Тестовый застройщик)",
      phone: "+992927005555",
      phoneVerified: true,
      isDemo: true,
    };
  }

  if (demoRole === "super_admin" || demoRole === "admin") {
    return {
      id: "usr_super_admin",
      role: demoRole,
      name: "Супер Администратор",
      phone: "+992920000000",
      phoneVerified: true,
      isDemo: true,
    };
  }

  return null;
}
