import { FiInbox } from "react-icons/fi";
import type { Task } from "../../types/task";
import type { Project } from "../../types/project";
import { TaskListItem } from "./TaskListItem";

export function TaskList({
    tasks,
    emptyMessage,
    onToggle,
    onEdit,
    onDelete,
    projectMap,
}: {
    tasks: Task[];
    emptyMessage: string;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    projectMap: Map<string, Project>;
}) {
    if (tasks.length === 0) {
        return (
            <div className="empty-list">
                <div className="empty-icon">
                    <FiInbox />
                </div>
                <h3>All clear</h3>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskListItem
                    key={task.id}
                    task={task}
                    project={task.projectId ? projectMap.get(task.projectId) : undefined}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
