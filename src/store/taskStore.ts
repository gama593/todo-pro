import { create } from "zustand";
import type { Task } from "../types/task";

interface TaskState {
    tasks: Task[];

    addTask: (task: Task) => void;
    updateTask: (id: string, data: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTask: (id: string) => void;
    setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],

    addTask: (task) =>
        set((state) => ({
            tasks: [task, ...state.tasks],
        })),

    updateTask: (id, data) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, ...data } : t
            ),
        })),

    deleteTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
        })),

    toggleTask: (id) =>
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id
                    ? { ...t, completed: !t.completed }
                    : t
            ),
        })),

    setTasks: (tasks) => set({ tasks }),
}));