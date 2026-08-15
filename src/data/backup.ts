import { db, type Project, type Tag, type Task } from "./db";

export interface BackupPayload { version: 1; exportedAt: string; tasks: Task[]; projects: Project[]; tags: Tag[]; }

export async function exportBackup(): Promise<void> {
  const payload: BackupPayload = { version: 1, exportedAt: new Date().toISOString(), tasks: await db.tasks.toArray(), projects: await db.projects.toArray(), tags: await db.tags.toArray() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `todo-pro-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
}

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object";
function validate(data: unknown): data is BackupPayload {
  if (!isRecord(data) || data.version !== 1 || !Array.isArray(data.tasks) || !Array.isArray(data.projects) || !Array.isArray(data.tags)) return false;
  const tasksOk = data.tasks.every(t => isRecord(t) && typeof t.id === "string" && typeof t.title === "string" && typeof t.completed === "boolean" && [1,2,3,4].includes(t.priority as number) && Array.isArray(t.tags));
  const projectsOk = data.projects.every(p => isRecord(p) && typeof p.id === "string" && typeof p.name === "string" && typeof p.archived === "boolean");
  const tagsOk = data.tags.every(t => isRecord(t) && typeof t.id === "string" && typeof t.name === "string");
  return tasksOk && projectsOk && tagsOk;
}

export async function importBackup(file: File): Promise<{ tasks: number; projects: number; tags: number }> {
  let parsed: unknown; try { parsed = JSON.parse(await file.text()); } catch { throw new Error("The backup file is not valid JSON."); }
  if (!validate(parsed)) throw new Error("Invalid Todo Pro backup file. Nothing was changed.");
  const data = parsed as BackupPayload;
  await db.transaction("rw", db.tasks, db.projects, db.tags, async () => { await db.tasks.bulkPut(data.tasks); await db.projects.bulkPut(data.projects); await db.tags.bulkPut(data.tags); });
  return { tasks: data.tasks.length, projects: data.projects.length, tags: data.tags.length };
}
