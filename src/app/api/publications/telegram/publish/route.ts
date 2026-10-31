import { NextRequest, NextResponse } from "next/server";
import { getPublicationsActor } from "@/lib/publications/auth-guard";
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
import { getLinkedChannel, normalizeChannelUsername } from "@/lib/publications/telegram-channel-store";
import { getCanonicalSiteOrigin } from "@/lib/publications/site-origin";
import { type Locale } from "@/lib/seo/taxonomy-store";

export async function POST(req: NextRequest) {
  try {
    const actor = await getPublicationsActor(req);

    if (!actor) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "Требуется авторизация для публикации в Telegram",
        },
        { status: 401 }
      );
    }

    const isRealtor = actor.role === "realtor" || actor.role === "agency_agent" || actor.role === "agency";
    const isDeveloper = actor.role === "developer";
    const isSuperAdmin = actor.role === "super_admin" || actor.role === "admin";

    // 1. Role verification
    if (!isRealtor && !isDeveloper && !isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "Доступ к публикации в Telegram разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      objectId,
      objectType = "classified",
      photoUrl,
      editableBody,
      locale = "ru",
      channelUsername,
    } = body;

    if (!objectId) {
      return NextResponse.json(
        { success: false, error: "bad_request", message: "Параметр objectId обязателен" },
        { status: 400 }
      );
    }

    // 2. Strict Real-Time Ownership & Status Check (Section 3.3 & 4)
    const ownership = await checkObjectOwnership({
      objectId,
      objectType: objectType as PublishableObjectType,
      actorRole: actor.role,
      actorId: actor.id,
    });

    if (!ownership.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: ownership.reason || "Вы можете публиковать только собственные объекты.",
        },
        { status: ownership.statusCode || 403 }
      );
    }

    // 3. Strict Channel Binding Check (Section 9.1 & Point 3 - Anti-spoofing)
    const linkedChannel = await getLinkedChannel(actor.id);
    if (!linkedChannel) {
      return NextResponse.json(
        {
          success: false,
          error: "no_linked_channel",
          message: "У вас нет подключённого Telegram-канала. Сначала подключите и проверьте канал в настройках.",
        },
        { status: 400 }
      );
    }

    // If request specifies a channel, it MUST match the user's verified linked channel
    if (channelUsername && normalizeChannelUsername(channelUsername) !== linkedChannel.channelUsername) {
      return NextResponse.json(
        {
          success: false,
          error: "channel_mismatch",
          message: `Публикация разрешена только в ваш подтверждённый канал ${linkedChannel.channelUsername}. Подмена канала запрещена.`,
        },
        { status: 403 }
      );
    }

    const targetChannel = linkedChannel.channelUsername;

    // 4. Strict Photo Validation (Section 7.1 & Point 3 - Anti-injection)
    const validPhotos = ownership.validPhotos;
    if (validPhotos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "no_photos",
          message: "У данного объекта нет загруженных фотографий. Для публикации в Telegram требуется хотя бы одна фотография.",
        },
        { status: 400 }
      );
    }

    const requestedPhoto = photoUrl || validPhotos[0];
    const isAuthorizedPhoto = validPhotos.some(
      (vp) => vp === requestedPhoto || vp.replace(/^https?:\/\/[^/]+/, "") === requestedPhoto.replace(/^https?:\/\/[^/]+/, "")
    );

    if (!isAuthorizedPhoto) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized_photo",
          message: "Указанная фотография не принадлежит выбранному объекту.",
        },
        { status: 400 }
      );
    }

    // 5. Origin from environment (Point 8 - Host protection)
    const origin = getCanonicalSiteOrigin();

    let protectedContacts = "";
    let mandatoryCtaHtml = "";
    let mandatoryCtaText = "";
    let defaultBody = "";

    if (objectType === "classified") {
      const prop = ownership.object as CatalogProperty;
      const parts = buildClassifiedPublicationParts(prop, locale as Locale, origin);
      protectedContacts = parts.protectedContacts;
      mandatoryCtaHtml = parts.mandatoryCtaHtml;
      mandatoryCtaText = parts.mandatoryCtaText;
      defaultBody = parts.editableBody;
    } else if (objectType === "project") {
      const proj = ownership.object as ProjectData;
      const dev = INITIAL_DEVELOPERS.find((d) => d.id === proj.developerId);
      const parts = buildProjectPublicationParts(proj, dev, locale as Locale, origin);
      protectedContacts = parts.protectedContacts;
      mandatoryCtaHtml = parts.mandatoryCtaHtml;
      mandatoryCtaText = parts.mandatoryCtaText;
      defaultBody = parts.editableBody;
    }

    // 6. User Text & 1,024 Character Limit Check (Section 6)
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

    // 8. Publish photo with caption to Telegram (with atomic lock and timeout handling)
    const publishResult = await publishPhotoToTelegramChannel({
      channelUsername: targetChannel,
      photoUrl: requestedPhoto,
      captionHtml: finalCaptionHtml,
      objectId,
      objectType: objectType as PublishableObjectType,
      userId: actor.id,
      userRole: actor.role,
      isDemo: actor.isDemo,
    });

    if (!publishResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "publish_failed",
          message: publishResult.error || "Ошибка при отправке публикации в Telegram",
          channelUsername: publishResult.channelUsername,
          isUncertain: publishResult.isUncertain,
        },
        { status: publishResult.isUncertain ? 504 : 400 }
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
