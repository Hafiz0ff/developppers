import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { classifieds } from "@/db/schema";
import {
  canAdminSetStatus,
  canModerateClassifieds,
  canMutateClassified,
  canOwnerSetStatus,
} from "@/lib/classifieds/access";
import { mapClassifiedToCard } from "@/lib/classifieds/map-card";
import { getClassifiedsActor } from "@/lib/classifieds/session";

const bodySchema = z.object({
  status: z.string(),
  moderationNote: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await getClassifiedsActor();
    if (!actor) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "invalid_input" }, { status: 400 });
    }

    const rows = await db.select().from(classifieds).where(eq(classifieds.id, id)).limit(1);
    const row = rows[0];
    if (!row) {
      return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
    }

    const { status, moderationNote } = parsed.data;
    const isOwner = canMutateClassified({
      actorId: actor.id,
      actorRole: actor.role,
      ownerId: row.userId,
    });
    const isAdmin = canModerateClassifieds(actor.role);

    if (isOwner && canOwnerSetStatus(status)) {
      await db
        .update(classifieds)
        .set({ status, updatedAt: new Date() })
        .where(eq(classifieds.id, id));
    } else if (isAdmin && canAdminSetStatus(status)) {
      await db
        .update(classifieds)
        .set({
          status,
          moderationNote: moderationNote || null,
          updatedAt: new Date(),
        })
        .where(eq(classifieds.id, id));
    } else {
      return NextResponse.json({ success: false, error: "forbidden" }, { status: 403 });
    }

    const updated = await db.select().from(classifieds).where(eq(classifieds.id, id)).limit(1);
    return NextResponse.json({
      success: true,
      classified: updated[0] ? mapClassifiedToCard(updated[0]) : null,
    });
  } catch (error) {
    console.error("Classified status error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
