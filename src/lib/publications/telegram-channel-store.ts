/**
 * MASKANI.TJ — Telegram Channel Registry & Publication Logs (Hardened v2.0)
 * Conforms to Technical Specification v2.0 (Sections 9.1, 9.4 & 12)
 *
 * Stores exactly 1 linked Telegram channel per user account.
 * Implements atomic in-flight locks to prevent parallel requests,
 * handles uncertain network timeout states, and records publication history.
 */

export interface LinkedTelegramChannel {
  userId: string;
  channelUsername: string; // e.g. "@khujand_realty_official"
  channelTitle: string;
  channelId?: string | number;
  verifiedAt: string;
}

export type PublicationStatus = "pending" | "success" | "failed" | "uncertain";

export interface PublicationLogEntry {
  id: string;
  userId: string;
  objectId: string;
  objectType: "classified" | "project";
  userRole: string;
  channelUsername: string;
  messageId?: number;
  photoUrl: string;
  captionSnippet: string;
  status: PublicationStatus;
  error?: string;
  lockKey: string;
  createdAt: number;
  publishedAt: string;
}

// In-memory persistent registry across requests in Node process
const channelRegistry = new Map<string, LinkedTelegramChannel>();
const publicationLogs: PublicationLogEntry[] = [];

// Seed default channels for standard demo actors
channelRegistry.set("usr_realtor_01", {
  userId: "usr_realtor_01",
  channelUsername: "@khujand_realty_official",
  channelTitle: "Недвижимость Худжанда | Риелторский канал",
  channelId: -1001928374650,
  verifiedAt: new Date().toISOString(),
});

channelRegistry.set("usr_dev_rep_01", {
  userId: "usr_dev_rep_01",
  channelUsername: "@qayroqum_avenue_live",
  channelTitle: "ЖК Qayroqum Avenue | Официальный канал продаж",
  channelId: -1001928374651,
  verifiedAt: new Date().toISOString(),
});

/**
 * Normalizes Telegram channel username format into "@username"
 */
export function normalizeChannelUsername(input: string): string {
  let cleaned = input.trim();
  cleaned = cleaned.replace(/^https?:\/\/t\.me\//i, "");
  cleaned = cleaned.replace(/\/+$/, "");
  if (!cleaned.startsWith("@")) {
    cleaned = `@${cleaned}`;
  }
  return cleaned;
}

/**
 * Retrieves the linked channel for a given user
 */
export async function getLinkedChannel(userId: string): Promise<LinkedTelegramChannel | null> {
  if (!userId) return null;
  return channelRegistry.get(userId) || null;
}

/**
 * Saves or updates the single linked Telegram channel for a user
 */
export async function saveLinkedChannel(channel: LinkedTelegramChannel): Promise<LinkedTelegramChannel> {
  const normalized: LinkedTelegramChannel = {
    ...channel,
    channelUsername: normalizeChannelUsername(channel.channelUsername),
    verifiedAt: channel.verifiedAt || new Date().toISOString(),
  };
  channelRegistry.set(channel.userId, normalized);
  return normalized;
}

/**
 * Unlinks the Telegram channel for a user
 */
export async function removeLinkedChannel(userId: string): Promise<boolean> {
  return channelRegistry.delete(userId);
}

/**
 * Tries to acquire an atomic publication lock for a given user, object and channel.
 * Rejects if:
 * 1. A publication is currently in-flight ('pending' within 30 seconds).
 * 2. An uncertain publication exists within the last 60 seconds (network timeout).
 * 3. A successful publication occurred within the last 15 seconds.
 */
export async function acquirePublicationLock(params: {
  userId: string;
  objectId: string;
  channelUsername: string;
  userRole: string;
  objectType: "classified" | "project";
  photoUrl: string;
  captionSnippet: string;
}): Promise<{ acquired: boolean; lockId?: string; reason?: string }> {
  const normChannel = normalizeChannelUsername(params.channelUsername);
  const now = Date.now();
  const lockKey = `${params.userId}:${params.objectId}:${normChannel}`;

  for (const log of publicationLogs) {
    if (log.lockKey !== lockKey) continue;

    // 1. In-flight pending lock (active for 30s)
    if (log.status === "pending" && now - log.createdAt < 30000) {
      return {
        acquired: false,
        reason: "Публикация этого объекта в данный канал уже выполняется. Пожалуйста, дождитесь ответа Telegram.",
      };
    }

    // 2. Uncertain result due to network timeout (blocks for 60s to prevent duplicate delivery)
    if (log.status === "uncertain" && now - log.createdAt < 60000) {
      return {
        acquired: false,
        reason: "Результат предыдущей отправки неопределён из-за таймаута сети. Пожалуйста, проверьте ваш Telegram-канал вручную перед повторной попыткой.",
      };
    }

    // 3. Successful duplicate within 15s
    if (log.status === "success" && now - log.createdAt < 15000) {
      return {
        acquired: false,
        reason: "Этот объект уже был опубликован в данный канал несколько секунд назад. Во избежание дубликатов повторная публикация отклонена.",
      };
    }
  }

  // Atomically acquire lock
  const lockId = `pub_lock_${now}_${Math.random().toString(36).slice(2, 7)}`;
  const pendingEntry: PublicationLogEntry = {
    id: lockId,
    userId: params.userId,
    objectId: params.objectId,
    objectType: params.objectType,
    userRole: params.userRole,
    channelUsername: normChannel,
    photoUrl: params.photoUrl,
    captionSnippet: params.captionSnippet,
    status: "pending",
    lockKey,
    createdAt: now,
    publishedAt: new Date().toISOString(),
  };

  publicationLogs.unshift(pendingEntry);
  if (publicationLogs.length > 1000) {
    publicationLogs.pop();
  }

  return { acquired: true, lockId };
}

/**
 * Updates the publication lock status upon completion
 */
export async function finalizePublicationLock(
  lockId: string,
  result: {
    status: "success" | "failed" | "uncertain";
    messageId?: number;
    error?: string;
  }
): Promise<void> {
  const entry = publicationLogs.find((l) => l.id === lockId);
  if (entry) {
    entry.status = result.status;
    if (result.messageId) entry.messageId = result.messageId;
    if (result.error) entry.error = result.error;
    entry.publishedAt = new Date().toISOString();
  }
}

/**
 * Backward compatible check for duplicates
 */
export async function checkRecentPublicationDuplicate(
  userId: string,
  objectId: string,
  channelUsername: string,
  withinSeconds: number = 15
): Promise<boolean> {
  const normChannel = normalizeChannelUsername(channelUsername);
  const cutoffTime = Date.now() - withinSeconds * 1000;

  return publicationLogs.some((log) => {
    if (log.userId !== userId) return false;
    if (log.objectId !== objectId) return false;
    if (normalizeChannelUsername(log.channelUsername) !== normChannel) return false;
    if (log.status !== "success" && log.status !== "uncertain") return false;
    return log.createdAt >= cutoffTime;
  });
}

/**
 * Retrieves publication logs for analytics / inspection
 */
export async function getPublicationLogs(userId?: string): Promise<PublicationLogEntry[]> {
  if (!userId) return [...publicationLogs];
  return publicationLogs.filter((l) => l.userId === userId);
}
