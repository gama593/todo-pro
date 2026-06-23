import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import { PRIORITY_LABELS, formatDueDate } from "./taskHelpers";

export function TaskListItem({
    task,
    project,
    onToggle,
    onEdit,
    onDelete,
}: {
    task: Task;
    project?: Project;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div key={task.id} className="task-item">
            <div className="task-item-main">
                <label className="task-check">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggle(task.id)}
                    />
                    <span className={`task-title${task.completed ? " completed" : ""}`}>
                        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                    </span>
                </label>
                <div className="task-meta">
                    <span className={`task-chip priority-${task.priority}`}>
                        {PRIORITY_LABELS[task.priority]}
                    </span>
                    {task.dueDate && <span className="task-chip">{formatDueDate(task.dueDate)}</span>}
                    {project && (
                        <span
                            className="task-chip project-chip"
                            style={{ borderLeftColor: project.color ?? "#888" }}
                        >
                            {project.name}
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
    );
}
