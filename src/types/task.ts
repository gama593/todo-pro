export type TaskPriority = 1 | 2 | 3 | 4;

export type TaskStatus =
    | "todo"
    | "in-progress"
    | "review"
    | "done";

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: TaskPriority;
    status: TaskStatus;
    tags: string[];
    dueDate?: string;
    createdAt: string;
}