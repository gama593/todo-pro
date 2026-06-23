import { useMemo, useState, type KeyboardEvent } from "react";
import { useTaskStore } from "../store/taskStore";
import { useUIStore } from "../store/uiStore";
import { useProjectStore } from "../store/projectStore";
import { TaskControls } from "../components/task/TaskControls";
import { TaskList } from "../components/task/TaskList";
import { KanbanBoard } from "../components/task/KanbanBoard";
import TaskEditor from "../components/task/TaskEditor";
import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { matchesSearch, sortTasks, todayKey, getProjectMap } from "../components/task/taskHelpers";

type TaskPageProps = {
    title: string;
    mode?: "today" | "project";
    projectId?: string;
    groupByStatus?: boolean;
};

export default function TaskPage({
    title,
    mode,
    projectId,
    groupByStatus = false,
}: TaskPageProps) {
    const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTaskStore();
    const { searchQuery } = useUIStore();
    const { projects } = useProjectStore();

    const [text, setText] = useState("");
    const [priority, setPriority] = useState<TaskPriority>(4);
    const [dueDate, setDueDate] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const filteredTasks = useMemo(() => {
        const today = todayKey();

        return tasks
            .filter((task) => {
                if (mode === "project" && projectId) {
                    if (task.projectId !== projectId) return false;
                } else if (mode === "today") {
                    if (!task.dueDate) return false;
                    const day = task.dueDate.slice(0, 10);
                    if (task.completed) return day === today;
                    return day <= today;
                } else if (!groupByStatus && mode !== "project") {
                    if (task.projectId) return false;
                }

                return matchesSearch(task, searchQuery);
            })
            .sort(sortTasks);
    }, [tasks, mode, projectId, groupByStatus, searchQuery]);

    const projectMap = useMemo(() => getProjectMap(projects), [projects]);

    const handleAdd = async () => {
        if (!text.trim()) return;

        const task: Task = {
            id: crypto.randomUUID(),
            title: text.trim(),
            completed: false,
            priority,
            status: "todo",
            tags: [],
            createdAt: new Date().toISOString(),
            dueDate: dueDate ? new Date(dueDate).toISOString() : mode === "today" ? new Date().toISOString() : undefined,
            projectId: mode === "project" ? projectId : undefined,
        };

        await addTask(task);
        setText("");
        setDueDate("");
        setPriority(4);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAdd();
    };

    const handleDrop = async (status: TaskStatus) => {
        if (!draggedId) return;
        await updateTask(draggedId, {
            status,
            completed: status === "done",
        });
        setDraggedId(null);
    };

    const confirmDelete = async () => {
        if (!confirmDeleteId) return;
        await deleteTask(confirmDeleteId);
        setConfirmDeleteId(null);
    };

    const emptyMessage = searchQuery.trim()
        ? "No tasks match your search."
        : "No tasks yet. Add one above to get started.";

    return (
        <div className="task-page">
            <TaskControls
                title={title}
                text={text}
                setText={setText}
                dueDate={dueDate}
                setDueDate={setDueDate}
                priority={priority}
                setPriority={setPriority}
                onAdd={handleAdd}
                onKeyDown={handleKeyDown}
            />

            {groupByStatus ? (
                <KanbanBoard
                    tasks={filteredTasks}
                    projectMap={projectMap}
                    onDrop={handleDrop}
                    onDragStart={setDraggedId}
                    onEdit={setEditingTask}
                    onDelete={setConfirmDeleteId}
                />
            ) : (
                <TaskList
                    tasks={filteredTasks}
                    emptyMessage={emptyMessage}
                    onToggle={toggleTask}
                    onEdit={setEditingTask}
                    onDelete={setConfirmDeleteId}
                    projectMap={projectMap}
                />
            )}

            {editingTask && (
                <TaskEditor
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={async (data) => {
                        const patch = { ...data };
                        if (patch.status === "done") patch.completed = true;
                        if (patch.status && patch.status !== "done") patch.completed = false;
                        await updateTask(editingTask.id, patch);
                    }}
                />
            )}

            {confirmDeleteId && (
                <div className="task-editor-overlay" role="dialog" aria-modal="true">
                    <div className="confirm-dialog">
                        <h3>Delete task?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="dialog-actions">
                            <button className="button-secondary" onClick={() => setConfirmDeleteId(null)}>
                                Cancel
                            </button>
                            <button className="button-danger" onClick={confirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
