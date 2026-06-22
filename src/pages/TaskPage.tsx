import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import type { Task } from "../types/task";

export default function TaskPage({ title }: { title: string }) {
    const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
    const [text, setText] = useState("");

    const handleAdd = () => {
        if (!text.trim()) return;

        const task: Task = {
            id: crypto.randomUUID(),
            title: text,
            completed: false,
            priority: 4,
            status: "todo",
            tags: [],
            createdAt: new Date().toISOString(),
        };

        addTask(task);
        setText("");
    };

    return (
        <div>
            <h1>{title}</h1>

            <div style={{ display: "flex", gap: 10 }}>
                <input value={text} onChange={(e) => setText(e.target.value)} />
                <button onClick={handleAdd}>Add</button>
            </div>

            <div style={{ marginTop: 20 }}>
                {tasks.map((task) => (
                    <div key={task.id} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span
                            onClick={() => toggleTask(task.id)}
                            style={{
                                textDecoration: task.completed ? "line-through" : "none",
                                cursor: "pointer",
                            }}
                        >
                            {task.title}
                        </span>

                        <button onClick={() => deleteTask(task.id)}>X</button>
                    </div>
                ))}
            </div>
        </div>
    );
}