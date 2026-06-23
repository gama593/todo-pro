import { create } from "zustand";
import { projectDB } from "../db/projectDB";
import { useTaskStore } from "./taskStore";
import type { Project } from "../types/project";

interface ProjectState {
    projects: Project[];

    init: () => Promise<void>;
    addProject: (p: Project) => Promise<void>;
    updateProject: (id: string, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    projects: [],

    init: async () => {
        const data = await projectDB.getAll();
        set({ projects: data });
    },

    addProject: async (p) => {
        await projectDB.add(p);
        set((s) => ({ projects: [p, ...s.projects] }));
    },

    updateProject: async (id, data) => {
        await projectDB.update(id, data);
        set((s) => ({ projects: s.projects.map((x) => (x.id === id ? { ...x, ...data } : x)) }));
    },

    deleteProject: async (id) => {
        // cascade delete: remove from DB (tasks too) then sync both stores
        await projectDB.remove(id);
        set((s) => ({ projects: s.projects.filter((x) => x.id !== id) }));
        // remove orphaned tasks from memory
        useTaskStore.setState((s) => ({
            tasks: s.tasks.filter((t) => t.projectId !== id),
        }));
    },

    setProjects: (projects) => set({ projects }),
}));
