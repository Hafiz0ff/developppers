import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function createPng(width, height, isMaskable = false) {
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  
  // Emerald brand colors
  // Gradient from teal-600 (#0D9488) to emerald-700 (#047857)
  const c1 = [13, 148, 136]; // #0D9488
  const c2 = [4, 120, 87];   // #047857
  const cornerRadius = isMaskable ? 0 : Math.round(width * 0.22);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    rawData[rowOffset] = 0; // Filter byte 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Check corner radius if not maskable
      let inside = true;
      if (cornerRadius > 0) {
        let dx = 0;
        let dy = 0;
        if (x < cornerRadius) dx = cornerRadius - x;
        else if (x >= width - cornerRadius) dx = x - (width - cornerRadius);
        if (y < cornerRadius) dy = cornerRadius - y;
        else if (y >= height - cornerRadius) dy = y - (height - cornerRadius);

        if (dx > 0 && dy > 0) {
          if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
            inside = false;
          }
        }
      }

      if (!inside) {
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Base gradient
      const t = (x + y) / (width + height);
      let r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
      let g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
      let b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
      let a = 255;

      // Normalize coords to [0, 1]
      const nx = x / width;
      const ny = y / height;

      // Draw modern architectural buildings in white:
      // Center tower: nx in [0.42, 0.58], ny in [0.24, 0.78]
      // Left slanted block: nx in [0.22, 0.40], ny in [0.38, 0.78]
      // Right tower: nx in [0.60, 0.78], ny in [0.34, 0.78]
      let isBuilding = false;
      let isWindow = false;

      // Center tower
      if (nx >= 0.42 && nx <= 0.58 && ny >= 0.22 && ny <= 0.78) {
        isBuilding = true;
        // Windows grid
        const wx = (nx - 0.42) / 0.16;
        const wy = (ny - 0.22) / 0.56;
        if ((wx > 0.18 && wx < 0.42 || wx > 0.58 && wx < 0.82) && (wy % 0.16 > 0.04 && wy % 0.16 < 0.12)) {
          isWindow = true;
        }
      }

      // Left block (roof slanting)
      if (nx >= 0.22 && nx <= 0.40) {
        const roofY = 0.44 - (nx - 0.22) * 0.4;
        if (ny >= roofY && ny <= 0.78) {
          isBuilding = true;
          const wx = (nx - 0.22) / 0.18;
          const wy = (ny - 0.38) / 0.40;
          if (wy > 0 && (wx > 0.2 && wx < 0.45 || wx > 0.55 && wx < 0.8) && (wy % 0.2 > 0.05 && wy % 0.2 < 0.15)) {
            isWindow = true;
          }
        }
      }

      // Right block
      if (nx >= 0.60 && nx <= 0.78 && ny >= 0.32 && ny <= 0.78) {
        isBuilding = true;
        const wx = (nx - 0.60) / 0.18;
        const wy = (ny - 0.32) / 0.46;
        if ((wx > 0.2 && wx < 0.45 || wx > 0.55 && wx < 0.8) && (wy % 0.18 > 0.04 && wy % 0.18 < 0.14)) {
          isWindow = true;
        }
      }

      // Golden sun emblem above tower: cx=0.50, cy=0.14, r=0.045
      const sDx = nx - 0.50;
      const sDy = ny - 0.14;
      if (sDx * sDx + sDy * sDy <= 0.042 * 0.042) {
        r = 251; // #FBBF24
        g = 191;
        b = 36;
      } else if (isWindow) {
        r = 13; // Teal window tint
        g = 148;
        b = 136;
      } else if (isBuilding) {
        r = 255;
        g = 255;
        b = 255;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Header chunk (IHDR)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // deflate compression
  ihdr[11] = 0; // adaptive filter
  ihdr[12] = 0; // no interlace

  const compressed = zlib.deflateSync(rawData);

  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk("IHDR", ihdr);
  const idatChunk = makeChunk("IDAT", compressed);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
}

const targets = [
  { file: "public/icons/icon-192x192.png", size: 192, maskable: false },
  { file: "public/icons/icon-maskable-192x192.png", size: 192, maskable: true },
  { file: "public/icons/icon-512x512.png", size: 512, maskable: false },
  { file: "public/icons/icon-maskable-512x512.png", size: 512, maskable: true },
  { file: "public/apple-touch-icon.png", size: 180, maskable: false },
  { file: "public/icons/apple-touch-icon.png", size: 180, maskable: false },
  { file: "public/favicon.png", size: 64, maskable: false },
];

for (const t of targets) {
  const dir = path.dirname(t.file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const buf = createPng(t.size, t.size, t.maskable);
  fs.writeFileSync(t.file, buf);
  console.log(`Generated ${t.file} (${t.size}x${t.size}, maskable=${t.maskable}, ${buf.length} bytes)`);
}
