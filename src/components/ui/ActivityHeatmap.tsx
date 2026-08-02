import { toLocalDateKey } from "@/lib/utils";

interface ActivityHeatmapProps {
  /** Map of "YYYY-MM-DD" -> activity count for that day. */
  counts: Record<string, number>;
  /** How many weeks (columns) to show, ending on the current week. Default 18. */
  weeks?: number;
}

function levelClass(count: number) {
  if (count <= 0) return "bg-divider";
  if (count === 1) return "bg-rose/35";
  if (count === 2) return "bg-rose/65";
  return "bg-rose";
}

// GitHub-style grid: 7 rows (Sun..Sat), only label Mon/Wed/Fri to stay compact.
const DAY_LABELS = ["", "Sen", "", "Rab", "", "Jum", ""];

/** GitHub-style contribution grid, driven by a plain date->count map. */
export function ActivityHeatmap({ counts, weeks = 18 }: ActivityHeatmapProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Anchor the grid to the end of the current week (Saturday) so today
  // always lands in the last column, like GitHub's contribution graph.
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

  const totalDays = weeks * 7;
  const start = new Date(endOfWeek);
  start.setDate(endOfWeek.getDate() - totalDays + 1);

  const columns: Date[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      col.push(day);
    }
    columns.push(col);
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      <div className="flex shrink-0 flex-col gap-[3px] pt-[1px]">
        {DAY_LABELS.map((label, i) => (
          <span
            key={i}
            className="flex h-[12px] items-center text-[9px] leading-none text-subtle"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px]">
        {columns.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {col.map((day, di) => {
              const isFuture = day > today;
              const key = toLocalDateKey(day);
              const count = counts[key] ?? 0;
              return (
                <div
                  key={di}
                  title={
                    isFuture ? undefined : `${key} — ${count} aktivitas`
                  }
                  className={`h-[12px] w-[12px] rounded-[3px] ${
                    isFuture ? "bg-transparent" : levelClass(count)
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
