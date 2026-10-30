import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";

export type ClassifiedsActor = {
  id: string;
  role: string;
  name: string;
  phone: string | null;
  phoneVerified: boolean;
};

export async function getClassifiedsActor(): Promise<ClassifiedsActor | null> {
  let session = null;
  try {
    const reqHeaders = await headers();
    session = await auth.api.getSession({ headers: reqHeaders });
  } catch {
    return null;
  }
  if (!session?.user?.id) return null;

  const rows = await db
    .select({
      id: users.id,
      role: users.role,
      name: users.name,
      phone: users.phone,
      phoneVerified: users.phoneVerified,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const row = rows[0];
  if (row) {
    return {
      id: row.id,
      role: row.role,
      name: row.name,
      phone: row.phone,
      phoneVerified: row.phoneVerified,
    };
  }

  const sessionRole = (session.user as { role?: string }).role || "user";
  return {
    id: session.user.id,
    role: sessionRole,
    name: session.user.name ?? "",
    phone: null,
    phoneVerified: false,
  };
}
