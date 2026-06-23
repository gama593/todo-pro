import type { KeyboardEvent } from "react";
import type { TaskPriority } from "../../types/task";

export function TaskControls({
    title,
    text,
    setText,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    onAdd,
    onKeyDown,
}: {
    title: string;
    text: string;
    setText: (value: string) => void;
    dueDate: string;
    setDueDate: (value: string) => void;
    priority: TaskPriority;
    setPriority: (value: TaskPriority) => void;
    onAdd: () => Promise<void>;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="task-controls">
            <input
                className="input-field"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={`Add a task to ${title}…`}
                aria-label="New task title"
            />
            <input
                className="input-field task-due-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Due date"
            />
            <select
                className="select-field task-priority-select"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value) as TaskPriority)}
                aria-label="Priority"
            >
                <option value={1}>Urgent</option>
                <option value={2}>High</option>
                <option value={3}>Medium</option>
                <option value={4}>Low</option>
            </select>
            <button className="button-primary" onClick={onAdd}>
                Add task
            </button>
        </div>
    );
}
