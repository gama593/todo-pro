import { db } from "./db";
import type { Task } from "../types/task";

export const taskDB = {
    async getAll() {
        return await db.tasks.toArray();
    },

    async getByProject(projectId: string) {
        return await db.tasks.where("projectId").equals(projectId).toArray();
    },

    async getToday() {
        const today = new Date().toISOString().slice(0, 10);
        return await db.tasks.filter((t) => !!t.dueDate && t.dueDate.slice(0, 10) === today).toArray();
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