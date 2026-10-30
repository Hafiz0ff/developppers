/**
 * MASKANI.TJ — Module «Object Publication»
 * Lightweight, safe in-memory ZIP builder using Node.js native zlib.
 * Zero external packages required.
 * Conforms to TZ v1.1 Sections 9 & 12.3.
 */

import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";

export interface ZipFileInput {
  name: string;
  content: Buffer;
}

/**
 * Builds a standard PKZIP archive buffer from an array of files.
 */
export function buildZipArchive(files: ZipFileInput[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const filenameBuf = Buffer.from(file.name, "utf-8");
    const dataBuf = file.content;
    const compressed = zlib.deflateRawSync(dataBuf);
    const crc = zlib.crc32(dataBuf);

    // 1. Local File Header (30 bytes + filename)
    const lh = Buffer.alloc(30 + filenameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0); // Local header signature
    lh.writeUInt16LE(20, 4); // Minimum version required (2.0)
    lh.writeUInt16LE(0, 6); // General purpose bit flags
    lh.writeUInt16LE(8, 8); // Compression method 8 (Deflate)
    lh.writeUInt16LE(0, 10); // File last mod time
    lh.writeUInt16LE(0, 12); // File last mod date
    lh.writeUInt32LE(crc, 14); // CRC-32
    lh.writeUInt32LE(compressed.length, 18); // Compressed size
    lh.writeUInt32LE(dataBuf.length, 22); // Uncompressed size
    lh.writeUInt16LE(filenameBuf.length, 26); // Filename length
    lh.writeUInt16LE(0, 28); // Extra field length
    filenameBuf.copy(lh, 30);

    localHeaders.push(lh, compressed);

    // 2. Central Directory Header (46 bytes + filename)
    const ch = Buffer.alloc(46 + filenameBuf.length);
    ch.writeUInt32LE(0x02014b50, 0); // Central directory signature
    ch.writeUInt16LE(20, 4); // Version made by
    ch.writeUInt16LE(20, 6); // Version needed to extract
    ch.writeUInt16LE(0, 8); // General purpose bit flags
    ch.writeUInt16LE(8, 10); // Compression method (Deflate)
    ch.writeUInt16LE(0, 12); // File last mod time
    ch.writeUInt16LE(0, 14); // File last mod date
    ch.writeUInt32LE(crc, 16); // CRC-32
    ch.writeUInt32LE(compressed.length, 20); // Compressed size
    ch.writeUInt32LE(dataBuf.length, 24); // Uncompressed size
    ch.writeUInt16LE(filenameBuf.length, 28); // Filename length
    ch.writeUInt16LE(0, 30); // Extra field length
    ch.writeUInt16LE(0, 32); // File comment length
    ch.writeUInt16LE(0, 34); // Disk number start
    ch.writeUInt16LE(0, 36); // Internal file attributes
    ch.writeUInt32LE(0, 38); // External file attributes
    ch.writeUInt32LE(offset, 42); // Relative offset of local header
    filenameBuf.copy(ch, 46);

    centralHeaders.push(ch);
    offset += lh.length + compressed.length;
  }

  const centralDir = Buffer.concat(centralHeaders);
  const cdOffset = offset;
  const cdSize = centralDir.length;

  // 3. End of Central Directory Record (EOCD, 22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4); // Number of this disk
  eocd.writeUInt16LE(0, 6); // Disk where central directory starts
  eocd.writeUInt16LE(files.length, 8); // Number of central directory records on this disk
  eocd.writeUInt16LE(files.length, 10); // Total number of central directory records
  eocd.writeUInt32LE(cdSize, 12); // Size of central directory
  eocd.writeUInt32LE(cdOffset, 16); // Offset of start of central directory
  eocd.writeUInt16LE(0, 20); // Comment length

  return Buffer.concat([...localHeaders, centralDir, eocd]);
}

/**
 * Loads image files from public storage with strict path-traversal prevention.
 * Rules per Section 9.1 & 11:
 * - Only public image paths allowed
 * - Reject paths containing ".." or trying to escape the public dir
 * - Discard non-image or private document files
 */
export function collectPublicImagesForZip(
  imagePaths: string[],
  basePrefix: string = "photo"
): ZipFileInput[] {
  const publicDir = path.join(process.cwd(), "public");
  const files: ZipFileInput[] = [];
  let index = 1;

  for (const rawPath of imagePaths) {
    if (!rawPath || typeof rawPath !== "string") continue;

    // Sanitize: strip query parameters or leading slashes
    const cleanRelative = rawPath.split("?")[0].replace(/^\/+/, "");

    // Path traversal check
    const resolvedPath = path.resolve(publicDir, cleanRelative);
    if (!resolvedPath.startsWith(publicDir)) {
      console.warn(`[Security] Blocked path traversal attempt in ZIP generator: ${rawPath}`);
      continue;
    }

    // Only allow common image extensions
    const ext = path.extname(cleanRelative).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) {
      continue;
    }

    try {
      if (fs.existsSync(resolvedPath)) {
        const content = fs.readFileSync(resolvedPath);
        const filename = `${basePrefix}-${String(index).padStart(2, "0")}${ext}`;
        files.push({ name: filename, content });
        index++;
      } else {
        // If file doesn't exist physically, create a minimal placeholder text or skip
        // In dev/mock mode, if image is missing on disk, we can generate a small sample
        const dummyContent = Buffer.from(`MASKANI.TJ Public Photo Placeholder: ${cleanRelative}`);
        const filename = `${basePrefix}-${String(index).padStart(2, "0")}.txt`;
        files.push({ name: filename, content: dummyContent });
        index++;
      }
    } catch (err) {
      console.error(`Failed to read image for ZIP: ${resolvedPath}`, err);
    }
  }

  return files;
}
