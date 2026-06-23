import Dexie from "dexie";
import type { Table } from "dexie";
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
    }
}

export const db = new TodoDB();