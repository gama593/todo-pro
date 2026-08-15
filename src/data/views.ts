import type { Task } from "./db";

export type TaskFilter = { completed?: boolean; priority?: number[]; projectId?: string; tags?: string[]; due?: "today" | "overdue" | "upcoming" | "none"; search?: string };
export interface SavedView { id: string; name: string; filter: TaskFilter; createdAt: string; }

export function matchesFilter(task: Task, filter: TaskFilter, today = new Date().toISOString().slice(0, 10)): boolean {
  if (filter.completed !== undefined && task.completed !== filter.completed) return false;
  if (filter.priority?.length && !filter.priority.includes(task.priority)) return false;
  if (filter.projectId && task.projectId !== filter.projectId) return false;
  if (filter.tags?.length && !filter.tags.every(tag => task.tags.includes(tag))) return false;
  if (filter.due === "today" && task.dueDate !== today) return false;
  if (filter.due === "overdue" && (!task.dueDate || task.dueDate >= today || task.completed)) return false;
  if (filter.due === "upcoming" && (!task.dueDate || task.dueDate <= today || task.completed)) return false;
  if (filter.due === "none" && task.dueDate) return false;
  if (filter.search) { const q = filter.search.toLowerCase(); if (!`${task.title} ${task.description} ${task.tags.join(" ")} ${task.projectId ?? ""}`.toLowerCase().includes(q)) return false; }
  return true;
}
