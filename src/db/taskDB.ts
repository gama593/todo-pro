import { db } from "./db";
import type { Task } from "../types/task";

export const taskDB = {
    async getAll() {
        return await db.tasks.toArray();
    },

    async add(task: Task) {
        return await db.tasks.add(task);
    },

    async update(id: string, data: Partial<Task>) {
        return await db.tasks.update(id, data);
    },

    async remove(id: string) {
        return await db.tasks.delete(id);
    },

    async clear() {
        return await db.tasks.clear();
    },
};