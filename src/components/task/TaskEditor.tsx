import { useState } from "react";
import { FiX } from "react-icons/fi";
import type { Task, TaskPriority, TaskStatus } from "../../types/task";
import { useProjectStore } from "../../store/projectStore";

type RecurrenceRule = NonNullable<Task["recurrence"]>;

export default function TaskEditor({
    task,
    onClose,
    onSave,
}: {
    task: Task;
    onClose: () => void;
    onSave: (data: Partial<Task>) => Promise<void>;
}) {
    const { projects } = useProjectStore();

    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : "");
    const [priority, setPriority] = useState<TaskPriority>(task.priority || 4);
    const [status, setStatus] = useState<TaskStatus>(task.status || "todo");
    const [tags, setTags] = useState((task.tags || []).join(", "));
    const [projectId, setProjectId] = useState<string | undefined>(task.projectId);
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(!!task.recurrence);
    const [freq, setFreq] = useState<RecurrenceRule["freq"]>(task.recurrence?.freq ?? "daily");
    const [interval, setInterval] = useState(task.recurrence?.interval ?? 1);
    const [weekdays, setWeekdays] = useState((task.recurrence?.weekdays || []).join(","));
    const [until, setUntil] = useState(task.recurrence?.until ? task.recurrence.until.slice(0, 10) : "");
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setError(null);
        const weekdaysValues = weekdays
            .split(",")
            .map((w) => Number(w.trim()))
            .filter((n) => !Number.isNaN(n) && n >= 0 && n <= 6);

        if (!title.trim()) {
            setError("Task title cannot be empty.");
            return;
        }

        if (recurrenceEnabled && interval < 1) {
            setError("Interval must be at least 1.");
            return;
        }

        if (recurrenceEnabled && freq === "weekly" && weekdays.trim().length > 0 && weekdaysValues.length === 0) {
            setError("Enter valid weekdays as comma-separated numbers from 0 to 6.");
            return;
        }

        if (recurrenceEnabled && until) {
            const untilDate = new Date(until);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (untilDate < today) {
                setError("Until date cannot be in the past.");
                return;
            }
        }

        const recurrence: RecurrenceRule | undefined = recurrenceEnabled
            ? {
                freq,
                interval,
                weekdays: weekdaysValues,
                until: until ? new Date(until).toISOString() : undefined,
            }
            : undefined;

        const data: Partial<Task> = {
            title: title.trim(),
            description: description.trim(),
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            priority,
            status,
            tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
            projectId,
            recurrence,
        };

        await onSave(data);
        onClose();
    };

    return (
        <div className="task-editor-overlay" onClick={onClose}>
            <div
                className="task-editor-modal"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-editor-title"
            >
                <div className="modal-header">
                    <h3 id="task-editor-title">Edit task</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <FiX />
                    </button>
                </div>

                <div className="task-editor-form">
                    <label className="field-label">
                        Title
                        <input
                            className="input-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Task title"
                        />
                    </label>

                    <label className="field-label">
                        Description
                        <textarea
                            className="text-area"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Add details…"
                        />
                    </label>

                    <div className="field-row">
                        <label className="field-label">
                            Due date
                            <input
                                className="input-field"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </label>

                        <label className="field-label">
                            Priority
                            <select
                                className="select-field"
                                value={priority}
                                onChange={(e) => setPriority(Number(e.target.value) as TaskPriority)}
                            >
                                <option value={1}>Urgent</option>
                                <option value={2}>High</option>
                                <option value={3}>Medium</option>
                                <option value={4}>Low</option>
                            </select>
                        </label>

                        <label className="field-label">
                            Status
                            <select
                                className="select-field"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            >
                                <option value="todo">To do</option>
                                <option value="in-progress">In progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                            </select>
                        </label>
                    </div>

                    <label className="field-label">
                        Tags
                        <input
                            className="input-field"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="work, personal, urgent"
                        />
                    </label>

                    <label className="field-label">
                        Project
                        <select
                            className="select-field"
                            value={projectId || ""}
                            onChange={(e) => setProjectId(e.target.value || undefined)}
                        >
                            <option value="">None</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <fieldset className="task-editor-fieldset">
                        <legend>Recurring task</legend>
                        <label className="field-label checkbox-label">
                            <input
                                type="checkbox"
                                checked={recurrenceEnabled}
                                onChange={(e) => setRecurrenceEnabled(e.target.checked)}
                            />
                            Enable recurrence
                        </label>

                        {recurrenceEnabled && (
                            <div className="field-grid">
                                <label className="field-label">
                                    Frequency
                                    <select
                                        className="select-field"
                                        value={freq}
                                        onChange={(e) => setFreq(e.target.value as RecurrenceRule["freq"])}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </label>

                                <label className="field-label">
                                    Interval
                                    <input
                                        className="input-field"
                                        type="number"
                                        min={1}
                                        value={interval}
                                        onChange={(e) => setInterval(Number(e.target.value) || 1)}
                                    />
                                </label>

                                {freq === "weekly" && (
                                    <label className="field-label">
                                        Weekdays (0=Sun, 6=Sat)
                                        <input
                                            className="input-field"
                                            value={weekdays}
                                            onChange={(e) => setWeekdays(e.target.value)}
                                            placeholder="0,1,2"
                                        />
                                    </label>
                                )}

                                <label className="field-label">
                                    Until
                                    <input
                                        className="input-field"
                                        type="date"
                                        value={until}
                                        onChange={(e) => setUntil(e.target.value)}
                                    />
                                </label>
                            </div>
                        )}
                    </fieldset>

                    {error && <div className="field-error">{error}</div>}

                    <div className="dialog-actions">
                        <button className="button-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="button-primary" onClick={handleSave}>
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
