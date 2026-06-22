import Dexie from "dexie";
import type { Table } from "dexie";
import type { Task } from "../types/task";

class TodoDB extends Dexie {
    tasks!: Table<Task, string>;

    constructor() {
        super("TodoProDB");

        this.version(1).stores({
            tasks: "id, title, completed, status, dueDate, createdAt",
        });
    }
}

export const db = new TodoDB();