import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { resolveCoupleId } from "@/lib/data/auth";
import type { AppNotification } from "@/lib/supabase/types";

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
