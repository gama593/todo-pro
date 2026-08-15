import type { Recurrence, Task } from "./db";

function clampDate(year: number, month: number, day: number) { return new Date(year, month + 1, 0).getDate() < day ? new Date(year, month + 1, 0).getDate() : day; }
export function nextOccurrence(task: Task): string | null {
  const rule = task.recurrence; if (!rule || !task.dueDate) return null;
  const base = new Date(`${task.dueDate}T${task.dueTime ?? "00:00"}:00`); if (Number.isNaN(base.getTime())) return null;
  const interval = Math.max(1, rule.interval || 1); let next = new Date(base);
  if (rule.frequency === "daily") next.setDate(next.getDate() + interval);
  else if (rule.frequency === "weekly") {
    const days = [...new Set(rule.weekdays ?? [base.getDay()])].sort((a,b)=>a-b); const following = days.find(d=>d>base.getDay());
    next.setDate(next.getDate() + (following === undefined ? 7 - base.getDay() + days[0] + 7 * (interval - 1) : following - base.getDay()));
  } else if (rule.frequency === "monthly") { const day = rule.dayOfMonth ?? base.getDate(); next = new Date(base.getFullYear(), base.getMonth() + interval, clampDate(base.getFullYear(), base.getMonth() + interval, day), base.getHours(), base.getMinutes()); }
  else next = new Date(base.getFullYear() + interval, base.getMonth(), base.getDate(), base.getHours(), base.getMinutes());
  if (rule.endDate && next.toISOString().slice(0,10) > rule.endDate) return null;
  return next.toISOString();
}

export function makeNextRecurringTask(task: Task): Task | null { const occurrence = nextOccurrence(task); if (!occurrence) return null; const date = occurrence.slice(0,10); const time = occurrence.slice(11,16); const now = new Date().toISOString(); return { ...task, id: crypto.randomUUID(), completed: false, completedAt: undefined, dueDate: date, dueTime: time, createdAt: now, updatedAt: now, order: Date.now() }; }
