import type { Task } from "./db";

export interface ReminderScheduler { schedule(task: Task): Promise<void>; cancel(taskId: string): Promise<void>; }

export class BrowserReminderScheduler implements ReminderScheduler {
  async schedule(task: Task) {
    if (!task.reminder || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    // Scheduling is intentionally delegated to a future service worker/alarm implementation.
    void task;
  }
  async cancel(taskId: string) { void taskId; }
}
export const reminderScheduler = new BrowserReminderScheduler();
