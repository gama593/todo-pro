import Dexie, { type Table } from "dexie";
import type { Task } from "../types/task";
import type { Project } from "../types/project";

class TodoDB extends Dexie {
  tasks!: Table<Task, string>;
  projects!: Table<Project, string>;

  constructor() {
    super("TodoProDB");

    this.version(1).stores({
      tasks: "id, title, completed, status, dueDate, createdAt, projectId",
      projects: "id, name, color",
    });

    this.version(2).stores({
      tasks: "id, title, completed, status, dueDate, createdAt, updatedAt, projectId, parentTaskId, *tags",
      projects: "id, name, color, archived",
    }).upgrade(async (tx) => {
      const now = new Date().toISOString();
      await tx.table("tasks").toCollection().modify((task: Partial<Task>) => {
        task.updatedAt ??= task.createdAt ?? now;
        task.order ??= 0;
        task.tags ??= [];
        task.status ??= task.completed ? "done" : "todo";
      });
    });
  }
}

export const db = new TodoDB();
