import type { Task } from "./db";

function escape(value: unknown) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
export function exportTasksCsv(tasks: Task[]) {
  const headers = ["id","title","completed","priority","status","projectId","dueDate","dueTime","tags","createdAt","updatedAt"];
  const rows = tasks.map(task => headers.map(key => escape(key === "tags" ? task.tags.join(";") : task[key as keyof Task])).join(","));
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "todo-pro-tasks.csv"; a.click(); URL.revokeObjectURL(url);
}
