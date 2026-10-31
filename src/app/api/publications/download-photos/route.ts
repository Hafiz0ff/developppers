import { NextResponse } from "next/server";

/**
 * MASKANI.TJ — Photo & ZIP Download Endpoint (Deprecated)
 * Per Technical Specification v2.0 Sections 7.1 & 16:
 * Photo ZIP export functionality is deprecated and removed from the publication module.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "deprecated_endpoint",
      message: "Функция скачивания фотографий ZIP-архивом удалена из модуля «Публикация объектов» в соответствии с ТЗ v2.0.",
    },
    { status: 410 }
  );
}
