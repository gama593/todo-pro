import type { Project } from "../../types/project";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";

export const STATUS_COLUMNS: { key: TaskStatus; label: string; className: string }[] = [
    { key: "todo", label: "To do", className: "kanban-todo" },
    { key: "in-progress", label: "In progress", className: "kanban-in-progress" },
    { key: "review", label: "Review", className: "kanban-review" },
    { key: "done", label: "Done", className: "kanban-done" },
];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    1: "Urgent",
    2: "High",
    3: "Medium",
    4: "Low",
};

export function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

export function formatDueDate(iso: string) {
    const day = iso.slice(0, 10);
    const today = todayKey();
    if (day === today) return "Today";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (day === tomorrow.toISOString().slice(0, 10)) return "Tomorrow";

    return new Date(day).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function matchesSearch(task: Task, query: string) {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
        task.title.toLowerCase().includes(q) ||
        (task.description ?? "").toLowerCase().includes(q) ||
        task.tags.some((tag) => tag.toLowerCase().includes(q))
    );
}

export function sortTasks(a: Task, b: Task) {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return b.createdAt.localeCompare(a.createdAt);
}

export function getProjectMap(projects: Project[]) {
    return new Map(projects.map((project) => [project.id, project]));
}
