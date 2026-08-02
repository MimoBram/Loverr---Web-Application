/**
 * Shared mood picker options — used by the New Entry form (to set a mood)
 * and Entry Detail (to render the saved mood's emoji). Kept in one place so
 * the two screens can't drift out of sync on keys/emoji.
 */
export const MOODS = [
  { key: "senang", emoji: "😊", color: "bg-coral" },
  { key: "santai", emoji: "😌", color: "bg-violet" },
  { key: "seru", emoji: "😉", color: "bg-[#b08a3e]" },
  { key: "sayang", emoji: "🩷", color: "bg-periwinkle" },
] as const;

export function getMoodEmoji(mood: string | null | undefined): string | null {
  return MOODS.find((m) => m.key === mood)?.emoji ?? null;
}
