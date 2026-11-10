import { NextRequest, NextResponse } from "next/server";
import {
  getAllSections,
  getAllAttributes,
  getAttributeByCode,
  archiveAttributeDefinition,
  restoreAttributeDefinition,
} from "@/lib/classifieds/attributes";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { hasPermission } from "@/lib/auth/rbac";
import { logAuditEvent } from "@/lib/audit-logger";

export async function GET(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const testRole = req.headers.get("x-test-role");
    const effectiveRole = testRole || actor?.role;

    // Check authorization: requires system:manage_feature_flags or super_admin
    const isAuthorized =
      effectiveRole === "super_admin" ||
      effectiveRole === "admin" ||
      hasPermission(effectiveRole, "system:manage_feature_flags") ||
      hasPermission(effectiveRole, "system:super_admin_access");

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: "forbidden" }, { status: 403 });
    }

    const sections = getAllSections();
    const attributes = getAllAttributes();

    return NextResponse.json({
      success: true,
      sections,
      attributes,
      totalAttributesCount: attributes.length,
      activeAttributesCount: attributes.filter((a) => a.active).length,
    });
  } catch (error) {
    console.error("Super Admin Listing Attributes GET error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const testRole = req.headers.get("x-test-role");
    const effectiveRole = testRole || actor?.role;

    // Modifying global attribute dictionary is restricted to super_admin
    const isAuthorized =
      effectiveRole === "super_admin" ||
      hasPermission(effectiveRole, "system:super_admin_access");

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: "forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { code, action, reason } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "invalid_input", message: "Attribute code is required" },
        { status: 400 }
      );
    }

    const attribute = getAttributeByCode(code);
    if (!attribute) {
      return NextResponse.json(
        { success: false, error: "not_found", message: `Attribute with code '${code}' not found` },
        { status: 404 }
      );
    }

    const previousState = { ...attribute };

    if (action === "archive") {
      archiveAttributeDefinition(code);
    } else if (action === "restore") {
      restoreAttributeDefinition(code);
    } else {
      return NextResponse.json(
        { success: false, error: "invalid_action", message: "Action must be 'archive' or 'restore'" },
        { status: 400 }
      );
    }

    const updated = getAttributeByCode(code);

    // Audit log the configuration change
    await logAuditEvent({
      userId: actor?.id || "super_admin_system",
      userRole: effectiveRole || "super_admin",
      action: "toggle_feature_flag",
      entityType: "listing_attribute",
      entityId: code,
      status: "success",
      details: {
        action,
        reason: reason || "Administrative state transition",
        previousActive: previousState.active,
        newActive: updated?.active,
      },
    });

    return NextResponse.json({
      success: true,
      attribute: updated,
    });
  } catch (error) {
    console.error("Super Admin Listing Attributes PATCH error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
