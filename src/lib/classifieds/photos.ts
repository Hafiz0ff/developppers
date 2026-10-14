import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const MAX_BYTES = 10_485_760;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function assertClassifiedPhoto(file: { size: number; type: string; name: string }): void {
  if (!file.size) {
    throw new Error("empty_file");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("file_too_large");
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("unsupported_type");
  }
}

export function buildPhotoObjectPath(
  userId: string,
  draftId: string,
  index: number,
  ext: string
): string {
  const safeExt = ext.replace(/^\./, "").toLowerCase() || "jpg";
  return `${userId}/${draftId}/${index}.${safeExt}`;
}

function extFromType(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function saveClassifiedPhotos(userId: string, files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const draftId = crypto.randomUUID();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const urls: string[] = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    assertClassifiedPhoto(file);
    const objectPath = buildPhotoObjectPath(userId, draftId, i, extFromType(file.type));
    const bytes = Buffer.from(await file.arrayBuffer());

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { error } = await supabase.storage.from("classified-photos").upload(objectPath, bytes, {
        contentType: file.type,
        upsert: true,
      });
      if (error) {
        throw new Error(error.message);
      }
      const { data } = supabase.storage.from("classified-photos").getPublicUrl(objectPath);
      urls.push(data.publicUrl);
    } else {
      const abs = path.join(process.cwd(), "public", "classified-photos", objectPath);
      await mkdir(path.dirname(abs), { recursive: true });
      await writeFile(abs, bytes);
      urls.push(`/classified-photos/${objectPath}`);
    }
  }

  return urls;
}
