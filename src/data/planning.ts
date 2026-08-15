import type { Task } from "./db";

export type DayBucket = "overdue" | "today" | "upcoming" | "none";
export function bucketTask(task: Task, date = new Date()): DayBucket {
  if (!task.dueDate) return "none";
  const today = date.toISOString().slice(0,10);
  if (task.dueDate < today && !task.completed) return "overdue";
  if (task.dueDate === today) return "today";
  return "upcoming";
}

export function sortForPlanning(tasks: Task[]): Task[] {
  return [...tasks].sort((a,b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.priority !== b.priority) return a.priority - b.priority;
    const ad = a.dueDate ?? "9999-12-31";
    const bd = b.dueDate ?? "9999-12-31";
    if (ad !== bd) return ad.localeCompare(bd);
    const at = a.dueTime ?? "99:99";
    const bt = b.dueTime ?? "99:99";
    if (at !== bt) return at.localeCompare(bt);
    return a.order - b.order;
  });
}

export function completionRate(tasks: Task[]): number {
  if (!tasks.length) return 0;
  return Math.round(tasks.filter(t => t.completed).length / tasks.length * 100);
}

export function startOfWeek(date = new Date(), weekStartsOn = 1): Date {
  const d = new Date(date); d.setHours(0,0,0,0);
  const delta = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - delta); return d;
}
