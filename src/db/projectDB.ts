import { db } from "./db";
import type { Project } from "../types/project";

export const projectDB = {
    async getAll(): Promise<Project[]> {
        return await db.projects.toArray();
    },

    async add(project: Project) {
        return await db.projects.add(project);
    },

    async update(id: string, data: Partial<Project>) {
        return await db.projects.update(id, data);
    },

    async remove(id: string) {
        // cascade: delete all tasks belonging to this project
        await db.tasks.where("projectId").equals(id).delete();
        return await db.projects.delete(id);
    },

    async clear() {
        return await db.projects.clear();
    },
};
