import { create } from "zustand";
import { taskDB } from "../db/taskDB";
import type { Task, TaskStatus } from "../types/task";

interface TaskState {
    tasks: Task[];

    init: () => Promise<void>;
    addTask: (task: Task) => Promise<void>;
    updateTask: (id: string, data: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],

    init: async () => {
        const data = await taskDB.getAll();
        set({ tasks: data });
    },

    addTask: async (task) => {
        await taskDB.add(task);
        set((state) => ({ tasks: [task, ...state.tasks] }));
    },

    updateTask: async (id, data) => {
        await taskDB.update(id, data);
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
    },

    deleteTask: async (id) => {
        await taskDB.remove(id);
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    },

    toggleTask: async (id) => {
        const t = get().tasks.find((x) => x.id === id);
        if (!t) return;
        const completed = !t.completed;
        const status: TaskStatus = completed ? "done" : "todo";
        const updated = { ...t, completed, status };

        await taskDB.update(id, { completed, status });
        set((state) => ({ tasks: state.tasks.map((x) => (x.id === id ? updated : x)) }));

        // handle recurrence: when a recurring task is completed, create next occurrence
        if (updated.completed && updated.recurrence) {
            try {
                const { computeNextDate } = await import("../utils/recurrence");
                const nextDue = computeNextDate(t.dueDate, updated.recurrence);
                if (nextDue) {
                    const nextTask: Task = {
                        ...t,
                        id: crypto.randomUUID(),
                        completed: false,
                        createdAt: new Date().toISOString(),
                        dueDate: nextDue,
                    };

                    await taskDB.add(nextTask);
                    set((state) => ({ tasks: [nextTask, ...state.tasks] }));
                }
            } catch (err) {
                // ignore recurrence errors
                console.error("recurrence error", err);
            }
        }
    },

    setTasks: (tasks) => set({ tasks }),
}));