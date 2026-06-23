import { Link } from "react-router-dom";
import { FiEdit2, FiInbox, FiTrash2 } from "react-icons/fi";
import type { Task, TaskStatus } from "../../types/task";
import type { Project } from "../../types/project";
import { PRIORITY_LABELS, STATUS_COLUMNS, formatDueDate } from "./taskHelpers";

export function KanbanBoard({
    tasks,
    projectMap,
    onDrop,
    onDragStart,
    onEdit,
    onDelete,
}: {
    tasks: Task[];
    projectMap: Map<string, Project>;
    onDrop: (status: TaskStatus) => Promise<void>;
    onDragStart: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}) {
    if (tasks.length === 0) {
        return (
            <div className="empty-list">
                <div className="empty-icon">
                    <FiInbox />
                </div>
                <h3>All clear</h3>
                <p>No tasks yet. Add one above to get started.</p>
            </div>
        );
    }

    return (
        <div className="kanban-columns">
            {STATUS_COLUMNS.map((column) => {
                const columnTasks = tasks.filter((t) => t.status === column.key);

                return (
                    <div
                        key={column.key}
                        className={`kanban-column ${column.className}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }}
                        onDrop={() => onDrop(column.key)}
                    >
                        <div className="kanban-column-header">
                            <span className="kanban-dot" />
                            <h4>{column.label}</h4>
                            <span className="kanban-count">{columnTasks.length}</span>
                        </div>

                        {columnTasks.length === 0 && <p className="empty-hint">Drop tasks here</p>}

                        {columnTasks.map((task) => (
                            <div
                                key={task.id}
                                className="task-card"
                                draggable
                                onDragStart={() => onDragStart(task.id)}
                            >
                                <div className="task-card-header">
                                    <span className="task-title">
                                        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                                    </span>
                                    <div className="button-group">
                                        <button
                                            className="button-secondary btn-sm icon-btn"
                                            onClick={() => onEdit(task)}
                                            title="Edit task"
                                            aria-label="Edit task"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="button-secondary btn-sm icon-btn icon-btn-danger"
                                            onClick={() => onDelete(task.id)}
                                            title="Delete task"
                                            aria-label="Delete task"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                                <div className="task-meta">
                                    <span className={`task-chip priority-${task.priority}`}>
                                        {PRIORITY_LABELS[task.priority]}
                                    </span>
                                    {task.dueDate && <span className="task-chip">{formatDueDate(task.dueDate)}</span>}
                                    {task.projectId && projectMap.get(task.projectId) && (
                                        <span
                                            className="task-chip project-chip"
                                            style={{ borderLeftColor: projectMap.get(task.projectId)?.color ?? "#888" }}
                                        >
                                            {projectMap.get(task.projectId)?.name}
                                        </span>
                                    )}
                                    {task.recurrence && <span className="task-chip">↻ Recurring</span>}
                                    {task.tags.map((tag) => (
                                        <span key={tag} className="task-chip tag-chip">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
