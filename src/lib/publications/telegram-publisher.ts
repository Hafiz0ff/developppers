/**
 * MASKANI.TJ — Telegram Publisher Engine
 * Conforms to Technical Specification v2.0 (Sections 9, 12, 13)
 *
 * Server-only Telegram Bot API client for channel verification and
 * single-photo publishing using sendPhoto with HTML parse mode and 1,024 char limits.
 * Token is strictly isolated on the server.
 */

import {
  normalizeChannelUsername,
  recordPublicationLog,
  checkRecentPublicationDuplicate,
} from "./telegram-channel-store";

export interface ChannelVerificationResult {
  verified: boolean;
  channelUsername: string;
  channelTitle?: string;
  channelId?: number | string;
  error?: string;
  simulated?: boolean;
}

export interface TelegramPublishResult {
  success: boolean;
  messageId?: number;
  postUrl?: string;
  channelUsername: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Checks if a channel exists and whether the Maskani bot is an administrator with `can_post_messages`
 */
export async function verifyTelegramChannelAdmin(
  channelInput: string
): Promise<ChannelVerificationResult> {
  const channelUsername = normalizeChannelUsername(channelInput);
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!channelUsername || channelUsername.length < 4) {
    return {
      verified: false,
      channelUsername,
      error: "Укажите корректный адрес канала (например, @my_realty_channel)",
    };
  }

  // Simulation mode if bot token is not configured in environment
  if (!botToken || botToken.trim() === "") {
    if (channelUsername.toLowerCase().includes("error") || channelUsername.toLowerCase().includes("norights")) {
      return {
        verified: false,
        channelUsername,
        error: "У бота нет прав администратора на публикацию сообщений в этом канале.",
        simulated: true,
      };
    }
    if (channelUsername.toLowerCase().includes("notfound")) {
      return {
        verified: false,
        channelUsername,
        error: "Канал не найден. Убедитесь, что канал публичный или бот добавлен в него.",
        simulated: true,
      };
    }

    // Clean simulated channel
    const cleanName = channelUsername.replace(/^@/, "");
    return {
      verified: true,
      channelUsername,
      channelTitle: `Канал @${cleanName} (Simulated)`,
      channelId: -1001000000000 + Math.floor(Math.random() * 999999),
      simulated: true,
    };
  }

  try {
    // 1. Get Chat details
    const chatRes = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: channelUsername }),
      signal: AbortSignal.timeout(10000),
    });

    const chatData = await chatRes.json();
    if (!chatData.ok) {
      if (chatData.error_code === 400 && chatData.description?.includes("chat not found")) {
        return {
          verified: false,
          channelUsername,
          error: "Канал не найден. Проверьте правильность публичного адреса @username.",
        };
      }
      return {
        verified: false,
        channelUsername,
        error: chatData.description || "Не удалось найти канал в Telegram",
      };
    }

    const chat = chatData.result;
    const channelTitle = chat.title || chat.username || channelUsername;
    const channelId = chat.id;

    // 2. Get Bot User ID via getMe
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
      signal: AbortSignal.timeout(10000),
    });
    const meData = await meRes.json();
    if (!meData.ok) {
      return {
        verified: false,
        channelUsername,
        error: "Ошибка авторизации бота в Telegram API",
      };
    }
    const botId = meData.result.id;

    // 3. Check Chat Member status for bot in target channel
    const memberRes = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: channelId, user_id: botId }),
      signal: AbortSignal.timeout(10000),
    });
    const memberData = await memberRes.json();

    if (!memberData.ok) {
      return {
        verified: false,
        channelUsername,
        channelTitle,
        error: "Бот не добавлен в канал. Пожалуйста, добавьте бота в администраторы канала.",
      };
    }

    const member = memberData.result;
    const isOwner = member.status === "creator";
    const isAdmin = member.status === "administrator";
    const canPost = isOwner || Boolean(member.can_post_messages);

    if (!isAdmin && !isOwner) {
      return {
        verified: false,
        channelUsername,
        channelTitle,
        error: "Бот добавлен в канал, но не назначен администратором.",
      };
    }

    if (!canPost) {
      return {
        verified: false,
        channelUsername,
        channelTitle,
        error: "У бота нет права на публикацию сообщений («Публикация сообщений» / can_post_messages).",
      };
    }

    return {
      verified: true,
      channelUsername,
      channelTitle,
      channelId,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("verifyTelegramChannelAdmin error:", msg);
    return {
      verified: false,
      channelUsername,
      error: "Сетевая ошибка или таймаут при проверке канала в Telegram",
    };
  }
}

/**
 * Publishes a single photo with an HTML caption to a Telegram channel via sendPhoto.
 * Strictly enforces Section 9: 1 photo + 1 message, <= 1024 characters, duplicate protection.
 */
export async function publishPhotoToTelegramChannel(params: {
  channelUsername: string;
  photoUrl: string;
  captionHtml: string;
  objectId: string;
  objectType: "classified" | "project";
  userId: string;
  userRole: string;
}): Promise<TelegramPublishResult> {
  const { channelUsername, photoUrl, captionHtml, objectId, objectType, userId, userRole } = params;
  const normChannel = normalizeChannelUsername(channelUsername);
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // 1. Validate Photo
  if (!photoUrl || photoUrl.trim() === "") {
    return {
      success: false,
      channelUsername: normChannel,
      error: "Для публикации в Telegram требуется фотография обложки.",
    };
  }

  // 2. Validate Caption Length (Telegram sendPhoto caption limit is 1024 characters)
  // Stripping tags to count visible characters (URL inside <a href="..."> is not counted against caption limit)
  const visibleTextOnly = captionHtml.replace(/<[^>]+>/g, "");
  if (visibleTextOnly.length > 1024) {
    return {
      success: false,
      channelUsername: normChannel,
      error: `Длина текста подписи (${visibleTextOnly.length} симв.) превышает лимит Telegram в 1 024 символа. Сократите описание.`,
    };
  }

  // 3. Duplicate Prevention Check (Section 9.4)
  const isDuplicate = await checkRecentPublicationDuplicate(userId, objectId, normChannel, 15);
  if (isDuplicate) {
    return {
      success: false,
      channelUsername: normChannel,
      error: "Этот объект уже был опубликован в данный канал несколько секунд назад. Во избежание дубликатов повторная публикация отклонена.",
    };
  }

  // 4. Handle Simulated Mode when TELEGRAM_BOT_TOKEN is not set
  if (!botToken || botToken.trim() === "") {
    const mockMessageId = Math.floor(1000 + Math.random() * 9000);
    const cleanChannel = normChannel.replace(/^@/, "");
    const postUrl = `https://t.me/${cleanChannel}/${mockMessageId}`;

    await recordPublicationLog({
      userId,
      objectId,
      objectType,
      userRole,
      channelUsername: normChannel,
      messageId: mockMessageId,
      photoUrl,
      captionSnippet: visibleTextOnly.slice(0, 100),
      status: "success",
    });

    return {
      success: true,
      messageId: mockMessageId,
      postUrl,
      channelUsername: normChannel,
      simulated: true,
    };
  }

  // 5. Execute Live Telegram API call
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: normChannel,
        photo: photoUrl,
        caption: captionHtml,
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json();

    if (!data.ok) {
      const errDescription = data.description || "Telegram API Error";
      console.error("[Telegram sendPhoto Error]:", data);

      await recordPublicationLog({
        userId,
        objectId,
        objectType,
        userRole,
        channelUsername: normChannel,
        photoUrl,
        captionSnippet: visibleTextOnly.slice(0, 100),
        status: "failed",
        error: errDescription,
      });

      let friendlyError = errDescription;
      if (errDescription.includes("chat not found")) {
        friendlyError = "Канал не найден. Проверьте правильность адреса @username.";
      } else if (errDescription.includes("not enough rights") || errDescription.includes("need administrator rights")) {
        friendlyError = "У бота нет прав на публикацию в этом канале (нужны права администратора «Публикация сообщений»).";
      } else if (errDescription.includes("MEDIA_CAPTION_TOO_LONG")) {
        friendlyError = "Длина подписи к фотографии превышает 1 024 символа.";
      } else if (errDescription.includes("wrong type of the web page content") || errDescription.includes("failed to get HTTP URL content")) {
        friendlyError = "Telegram не смог загрузить фотографию по указанной ссылке.";
      }

      return {
        success: false,
        channelUsername: normChannel,
        error: friendlyError,
      };
    }

    const messageId = data.result?.message_id;
    const cleanChannel = normChannel.replace(/^@/, "");
    const postUrl = `https://t.me/${cleanChannel}/${messageId}`;

    await recordPublicationLog({
      userId,
      objectId,
      objectType,
      userRole,
      channelUsername: normChannel,
      messageId,
      photoUrl,
      captionSnippet: visibleTextOnly.slice(0, 100),
      status: "success",
    });

    return {
      success: true,
      messageId,
      postUrl,
      channelUsername: normChannel,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("publishPhotoToTelegramChannel exception:", msg);

    await recordPublicationLog({
      userId,
      objectId,
      objectType,
      userRole,
      channelUsername: normChannel,
      photoUrl,
      captionSnippet: visibleTextOnly.slice(0, 100),
      status: "failed",
      error: msg,
    });

    return {
      success: false,
      channelUsername: normChannel,
      error: "Сетевая ошибка при отправке публикации в Telegram. Проверьте соединение и повторите попытку.",
    };
  }
}
