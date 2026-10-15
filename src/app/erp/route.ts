import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FALLBACK_HTML = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/erp/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Devcore — ERP для девелопера</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <script type="module" crossorigin src="/erp/assets/index-2bjW_WIl.js"></script>
    <link rel="modulepreload" crossorigin href="/erp/assets/utils-BXza46oy.js">
    <link rel="stylesheet" crossorigin href="/erp/assets/index-DMdD7Sdm.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "erp", "index.html");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return new NextResponse(content, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      });
    }
  } catch (e) {
    console.error("Error reading erp/index.html:", e);
  }

  return new NextResponse(FALLBACK_HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
