import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { MOCK_NOTIFICATIONS, MOCK_COUPLE } from "@/lib/mock-data";
import { resolveCoupleId } from "@/lib/data/auth";
import type { AppNotification, NotificationType } from "@/lib/supabase/types";

export async function listNotifications(coupleId?: string): Promise<AppNotification[]> {
  if (!isSupabaseConfigured) {
    return [...MOCK_NOTIFICATIONS].sort((a, b) =>
      a.created_at < b.created_at ? 1 : -1,
    );
  }

  const resolvedCoupleId = await resolveCoupleId(coupleId);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("couple_id", resolvedCoupleId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export interface CreateNotificationInput {
  couple_id?: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  related_entry_id?: string | null;
}

/**
 * Logs an activity notification (new entry, new note, quiz result ready, …).
 * Called after the triggering action already succeeded — callers should
 * treat this as best-effort (fire-and-forget with `.catch(() => {})`) so a
 * failed notification insert never blocks the actual save.
 */
export async function createNotification(input: CreateNotificationInput): Promise<void> {
  const coupleId = isSupabaseConfigured
    ? await resolveCoupleId(input.couple_id)
    : (input.couple_id ?? MOCK_COUPLE.id);

  if (!isSupabaseConfigured) {
    MOCK_NOTIFICATIONS.unshift({
      id: `notif-${Date.now()}`,
      couple_id: coupleId,
      profile_id: null,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      related_entry_id: input.related_entry_id ?? null,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.from("notifications").insert({
    couple_id: coupleId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    related_entry_id: input.related_entry_id ?? null,
  });

  if (error) throw error;
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const n = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (n) n.is_read = true;
    return;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw error;
}
