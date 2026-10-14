import { NextResponse } from "next/server";
import { canPostClassified } from "@/lib/classifieds/access";
import { saveClassifiedPhotos } from "@/lib/classifieds/photos";
import { getClassifiedsActor } from "@/lib/classifieds/session";

export async function POST(req: Request) {
  try {
    const actor = await getClassifiedsActor();
    if (!actor) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
    if (!canPostClassified(actor.role)) {
      return NextResponse.json({ success: false, error: "citizens_only" }, { status: 403 });
    }

    const form = await req.formData();
    const files = form
      .getAll("files")
      .filter((value): value is File => value instanceof File)
      .slice(0, 10);

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "no_files" }, { status: 400 });
    }

    const urls = await saveClassifiedPhotos(actor.id, files);
    return NextResponse.json({ success: true, urls });
  } catch (error) {
    const message = error instanceof Error ? error.message : "internal_error";
    const status =
      message === "file_too_large" || message === "unsupported_type" || message === "empty_file"
        ? 400
        : 500;
    console.error("Classified photos error:", error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
