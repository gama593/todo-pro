import { db, now, type Project, type Tag, type Task } from "./db";

export const taskService = {
  list: () => db.tasks.orderBy("order").reverse().toArray(),
  get: (id: string) => db.tasks.get(id),
  create: async (data: Partial<Task> & { title: string }) => { const task: Task = { id: crypto.randomUUID(), title: data.title.trim(), description: data.description ?? "", completed: false, priority: data.priority ?? 4, status: data.status ?? "todo", projectId: data.projectId, parentTaskId: data.parentTaskId, tags: data.tags ?? [], dueDate: data.dueDate, dueTime: data.dueTime, duration: data.duration, recurrence: data.recurrence, reminder: data.reminder, createdAt: now(), updatedAt: now(), order: Date.now() }; await db.tasks.add(task); return task; },
  update: async (id: string, patch: Partial<Task>) => { await db.tasks.update(id, { ...patch, updatedAt: now() }); return db.tasks.get(id); },
  remove: (id: string) => db.tasks.delete(id),
  complete: (id: string, completed = true) => taskService.update(id, { completed, completedAt: completed ? now() : undefined, status: completed ? "done" : "todo" }),
  children: (parentTaskId: string) => db.tasks.where("parentTaskId").equals(parentTaskId).sortBy("order"),
};

export const projectService = {
  list: () => db.projects.orderBy("createdAt").reverse().toArray(),
  create: async (name: string, description = "", color = "#7f77dd") => { const project: Project = { id: crypto.randomUUID(), name: name.trim(), description, color, archived: false, createdAt: now(), updatedAt: now() }; await db.projects.add(project); return project; },
  update: async (id: string, patch: Partial<Project>) => { await db.projects.update(id, { ...patch, updatedAt: now() }); return db.projects.get(id); },
  remove: async (id: string) => { await db.transaction("rw", db.projects, db.tasks, async () => { await db.tasks.where("projectId").equals(id).modify({ projectId: undefined }); await db.projects.delete(id); }); },
};

export const tagService = {
  list: () => db.tags.orderBy("name").toArray(),
  create: async (name: string, color = "#7f77dd") => { const tag: Tag = { id: crypto.randomUUID(), name: name.trim(), color, createdAt: now() }; await db.tags.add(tag); return tag; },
  update: async (id: string, patch: Partial<Tag>) => { const existing = await db.tags.get(id); if (!existing) throw new Error("Tag not found"); await db.tags.update(id, patch); if (patch.name && patch.name !== existing.name) await db.tasks.toCollection().modify(task => { task.tags = task.tags.map(t => t === existing.name ? patch.name! : t); }); return db.tags.get(id); },
  remove: async (id: string) => { const tag = await db.tags.get(id); if (!tag) return; await db.transaction("rw", db.tags, db.tasks, async () => { await db.tasks.toCollection().modify(task => { task.tags = task.tags.filter(t => t !== tag.name); }); await db.tags.delete(id); }); },
};
