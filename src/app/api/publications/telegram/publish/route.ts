import { NextRequest, NextResponse } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { ALL_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, type ProjectData, type DeveloperData } from "@/lib/data/mock-db";
import { checkObjectOwnership } from "@/lib/publications/ownership";
import {
  buildClassifiedPublicationParts,
  buildProjectPublicationParts,
  assembleFinalTelegramCaption,
  calculateTelegramCharCount,
  type PublishableObjectType,
} from "@/lib/publications/publication-builder";
import { publishPhotoToTelegramChannel } from "@/lib/publications/telegram-publisher";
import { getLinkedChannel } from "@/lib/publications/telegram-channel-store";
import { type Locale } from "@/lib/seo/taxonomy-store";

export async function POST(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const body = await req.json();

    const {
      objectId,
      objectType = "classified",
      photoUrl,
      editableBody,
      locale = "ru",
      channelUsername,
      demoRole,
    } = body;

    const role = actor?.role || demoRole || null;
    const actorId = actor?.id || (role === "developer" ? "usr_dev_rep_01" : "usr_realtor_01");

    const isRealtor = role === "realtor" || role === "agency_agent" || role === "agency";
    const isDeveloper = role === "developer";
    const isSuperAdmin = role === "super_admin" || role === "admin";

    // 1. Role verification
    if (!role || (!isRealtor && !isDeveloper && !isSuperAdmin)) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "Доступ к публикации в Telegram разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    if (!objectId) {
      return NextResponse.json(
        { success: false, error: "bad_request", message: "Параметр objectId обязателен" },
        { status: 400 }
      );
    }

    // 2. Strict Ownership Check (Section 3.3)
    const ownership = checkObjectOwnership({
      objectId,
      objectType: objectType as PublishableObjectType,
      actorRole: role,
      actorId,
    });

    if (!ownership.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: ownership.reason || "Вы можете публиковать только собственные объекты.",
        },
        { status: 403 }
      );
    }

    // 3. Resolve Channel
    let targetChannel = channelUsername;
    if (!targetChannel) {
      const linked = await getLinkedChannel(actorId);
      if (linked) {
        targetChannel = linked.channelUsername;
      }
    }

    if (!targetChannel || targetChannel.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "no_channel",
          message: "Пожалуйста, подключите или укажите Telegram-канал для публикации.",
        },
        { status: 400 }
      );
    }

    // 4. Resolve Object & Contacts
    const host = req.headers.get("host") || "maskani.tj";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    let protectedContacts = "";
    let mandatoryCtaHtml = "";
    let mandatoryCtaText = "";
    let defaultBody = "";
    let availableImages: string[] = [];

    if (objectType === "classified") {
      const prop = ownership.object as CatalogProperty;
      const parts = buildClassifiedPublicationParts(prop, locale as Locale, origin);
      protectedContacts = parts.protectedContacts;
      mandatoryCtaHtml = parts.mandatoryCtaHtml;
      mandatoryCtaText = parts.mandatoryCtaText;
      defaultBody = parts.editableBody;

      availableImages = Array.isArray(prop.images) && prop.images.length > 0
        ? prop.images
        : prop.image
        ? [prop.image]
        : [];
    } else if (objectType === "project") {
      const proj = ownership.object as ProjectData;
      const dev = INITIAL_DEVELOPERS.find((d) => d.id === proj.developerId);
      const parts = buildProjectPublicationParts(proj, dev, locale as Locale, origin);
      protectedContacts = parts.protectedContacts;
      mandatoryCtaHtml = parts.mandatoryCtaHtml;
      mandatoryCtaText = parts.mandatoryCtaText;
      defaultBody = parts.editableBody;

      if (proj.coverImageUrl) availableImages.push(proj.coverImageUrl);
      if (Array.isArray(proj.images)) {
        for (const img of proj.images) {
          if (!availableImages.includes(img)) availableImages.push(img);
        }
      }
    }

    // 5. Single Photo Validation (Section 7.1)
    const effectivePhoto = photoUrl || availableImages[0];
    if (!effectivePhoto || effectivePhoto.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "no_photo",
          message: "Для публикации в Telegram требуется фотография обложки.",
        },
        { status: 400 }
      );
    }

    // 6. User text & 1,024 Char Limit Check (Section 6)
    const effectiveBody = typeof editableBody === "string" ? editableBody : defaultBody;
    const charCount = calculateTelegramCharCount(effectiveBody, protectedContacts, mandatoryCtaText);

    if (charCount.isOverLimit) {
      return NextResponse.json(
        {
          success: false,
          error: "caption_too_long",
          message: `Длина публикации (${charCount.totalVisibleChars} симв.) превышает лимит Telegram в 1 024 символа. Сократите текст на ${Math.abs(charCount.remainingChars)} симв.`,
        },
        { status: 400 }
      );
    }

    // 7. Assemble final Telegram HTML caption
    const finalCaptionHtml = assembleFinalTelegramCaption(
      effectiveBody,
      protectedContacts,
      mandatoryCtaHtml
    );

    // 8. Publish photo with caption to Telegram
    const publishResult = await publishPhotoToTelegramChannel({
      channelUsername: targetChannel,
      photoUrl: effectivePhoto,
      captionHtml: finalCaptionHtml,
      objectId,
      objectType: objectType as PublishableObjectType,
      userId: actorId,
      userRole: role,
    });

    if (!publishResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "publish_failed",
          message: publishResult.error || "Ошибка при отправке публикации в Telegram",
          channelUsername: publishResult.channelUsername,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: publishResult.messageId,
      postUrl: publishResult.postUrl,
      channelUsername: publishResult.channelUsername,
      simulated: publishResult.simulated,
    });
  } catch (error) {
    console.error("Publications Telegram publish POST error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка при выполнении публикации" },
      { status: 500 }
    );
  }
}
