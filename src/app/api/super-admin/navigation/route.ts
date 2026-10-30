import { NextRequest, NextResponse } from "next/server";
import {
  getMenuItems,
  getMenuItemsTree,
  upsertMenuItem,
  deleteMenuItem,
  reorderMenuItems,
  type MenuItem,
  type MenuLocation,
} from "@/lib/navigation/menu-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = (searchParams.get("location") || "header_main") as MenuLocation;
    const asTree = searchParams.get("tree") === "true";

    if (asTree) {
      const tree = getMenuItemsTree(location);
      return NextResponse.json({ success: true, tree });
    }

    const items = getMenuItems(location);
    return NextResponse.json({ success: true, items, count: items.length });
  } catch (error) {
    console.error("Super Admin Navigation GET error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id || !body.label?.ru || !body.type) {
      return NextResponse.json(
        { success: false, error: "id, label.ru, and type are required" },
        { status: 400 }
      );
    }

    const item: MenuItem = {
      id: body.id,
      menuLocation: body.menuLocation || "header_main",
      type: body.type,
      label: {
        ru: body.label.ru,
        tg: body.label.tg || body.label.ru,
        en: body.label.en || body.label.ru,
      },
      targetType: body.targetType,
      targetId: body.targetId,
      customUrl: body.customUrl,
      parentId: body.parentId || null,
      column: body.column ? Number(body.column) : undefined,
      sortOrder: Number(body.sortOrder) || 1,
      isActive: body.isActive !== false,
      badge: body.badge,
    };

    const saved = upsertMenuItem(item);
    return NextResponse.json({ success: true, item: saved }, { status: 201 });
  } catch (error: unknown) {
    console.error("Super Admin Navigation POST error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "internal_error" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!Array.isArray(body.orderedIds)) {
      return NextResponse.json(
        { success: false, error: "orderedIds array is required" },
        { status: 400 }
      );
    }

    reorderMenuItems(body.orderedIds);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Super Admin Navigation PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "internal_error" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "id parameter required" }, { status: 400 });
    }

    const success = deleteMenuItem(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Super Admin Navigation DELETE error:", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
