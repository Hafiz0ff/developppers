/**
 * MASKANI.TJ — Telegram Channel Registry & Publication Logs
 * Conforms to Technical Specification v2.0 (Sections 9.1 & 12)
 *
 * Stores exactly 1 linked Telegram channel per user account and
 * records publication attempts/results for auditing and duplicate prevention.
 */

export interface LinkedTelegramChannel {
  userId: string;
  channelUsername: string; // e.g. "@sogd_realty_channel"
  channelTitle: string;
  channelId?: string | number;
  verifiedAt: string;
}

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
  status: "success" | "failed";
  error?: string;
  publishedAt: string;
}

// In-memory persistent registry fallback across requests in Node process
const channelRegistry = new Map<string, LinkedTelegramChannel>();
const publicationLogs: PublicationLogEntry[] = [];

// Seed default channels for standard demo actors to enable frictionless testing
channelRegistry.set("usr_realtor_01", {
  userId: "usr_realtor_01",
  channelUsername: "@khujand_realty_official",
  channelTitle: "Недвижимость Худжанда | Риелторский канал",
  channelId: -1001928374650,
  verifiedAt: new Date().toISOString(),
});

channelRegistry.set("demo_realtor", {
  userId: "demo_realtor",
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

channelRegistry.set("demo_developer", {
  userId: "demo_developer",
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
  // Strip full URLs if user pasted https://t.me/channel_name
  cleaned = cleaned.replace(/^https?:\/\/t\.me\//i, "");
  // Strip trailing slashes
  cleaned = cleaned.replace(/\/+$/, "");
  // Ensure leading @
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
  const channel = channelRegistry.get(userId);
  return channel || null;
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
 * Records a publication result per Section 12 of TZ
 */
export async function recordPublicationLog(
  entry: Omit<PublicationLogEntry, "id" | "publishedAt">
): Promise<PublicationLogEntry> {
  const record: PublicationLogEntry = {
    ...entry,
    id: `pub_log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    publishedAt: new Date().toISOString(),
  };
  publicationLogs.unshift(record);
  // Keep last 1000 logs in memory
  if (publicationLogs.length > 1000) {
    publicationLogs.pop();
  }
  return record;
}

/**
 * Checks if the exact same object was successfully published to the exact channel
 * within the last `withinSeconds` seconds (default 15 seconds) to prevent accidental double posts.
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
    if (log.status !== "success") return false;
    const pubTime = new Date(log.publishedAt).getTime();
    return pubTime >= cutoffTime;
  });
}

/**
 * Retrieves publication logs for analytics / inspection
 */
export async function getPublicationLogs(userId?: string): Promise<PublicationLogEntry[]> {
  if (!userId) return [...publicationLogs];
  return publicationLogs.filter((l) => l.userId === userId);
}
