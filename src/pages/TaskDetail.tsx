import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskEditor from "../components/task/TaskEditor";
import { useTaskStore } from "../store/taskStore";

export default function TaskDetail() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { tasks, updateTask, deleteTask } = useTaskStore();

    const task = useMemo(
        () => tasks.find((t) => t.id === taskId) ?? null,
        [tasks, taskId]
    );

    if (!task) {
        return (
            <div className="task-page">
                <h2>Task not found</h2>
                <p>The requested task could not be found.</p>
            </div>
        );
    }

    return (
        <div className="task-page">
            <TaskEditor
                task={task}
                onClose={() => navigate(-1)}
                onSave={async (data) => {
                    const patch = { ...data };
                    if (patch.status === "done") patch.completed = true;
                    if (patch.status && patch.status !== "done") patch.completed = false;
                    await updateTask(task.id, patch);
                }}
            />
            <div className="task-detail-actions">
                <button className="button-secondary" onClick={() => navigate(-1)}>
                    Back
                </button>
                <button
                    className="button-danger"
                    onClick={async () => {
                        await deleteTask(task.id);
                        navigate(-1);
                    }}
                >
                    Delete task
                </button>
            </div>
        </div>
    );
}
