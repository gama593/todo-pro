import { db, type Project, type Tag, type Task } from "./db";

export interface BackupPayload { version: 1; exportedAt: string; tasks: Task[]; projects: Project[]; tags: Tag[]; }

export async function exportBackup(): Promise<void> {
  const payload: BackupPayload = { version: 1, exportedAt: new Date().toISOString(), tasks: await db.tasks.toArray(), projects: await db.projects.toArray(), tags: await db.tags.toArray() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = `todo-pro-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
}

function validArray(value: unknown): value is unknown[] { return Array.isArray(value); }
function validate(data: unknown): data is BackupPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return d.version === 1 && validArray(d.tasks) && validArray(d.projects) && validArray(d.tags) && d.tasks.every(t => !!t && typeof t === "object" && typeof (t as Task).id === "string" && typeof (t as Task).title === "string");
}

export async function importBackup(file: File): Promise<{ tasks: number; projects: number; tags: number }> {
  const parsed: unknown = JSON.parse(await file.text());
  if (!validate(parsed)) throw new Error("Invalid Todo Pro backup file.");
  const data = parsed as BackupPayload;
  await db.transaction("rw", db.tasks, db.projects, db.tags, async () => {
    await db.tasks.bulkPut(data.tasks); await db.projects.bulkPut(data.projects); await db.tags.bulkPut(data.tags);
  });
  return { tasks: data.tasks.length, projects: data.projects.length, tags: data.tags.length };
}
