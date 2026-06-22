import { useEffect, useState } from "react";
import { useTaskStore } from "./store/taskStore";
import { taskDB } from "./db/taskDB";
import type { Task } from "./types/task";

export default function App() {
  const { tasks, setTasks, addTask, toggleTask, deleteTask } =
    useTaskStore();

  const [title, setTitle] = useState("");

  // load from DB
  useEffect(() => {
    async function load() {
      const data = await taskDB.getAll();
      setTasks(data);
    }

    load();
  }, []);

  // sync to DB
  useEffect(() => {
    tasks.forEach(async (task) => {
      await taskDB.update(task.id, task);
    });
  }, [tasks]);

  const handleAdd = async () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority: 4,
      status: "todo",
      tags: [],
      createdAt: new Date().toISOString(),
    };

    addTask(newTask);
    await taskDB.add(newTask);
    setTitle("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 250, background: "#111", color: "#fff", padding: 20 }}>
        <h2>Todo Pro</h2>
        <ul>
          <li>Inbox</li>
          <li>Today</li>
          <li>Projects</li>
        </ul>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: 20 }}>

        <h1>Inbox</h1>

        {/* ADD TASK */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task..."
          />
          <button onClick={handleAdd}>Add</button>
        </div>

        {/* TASK LIST */}
        <div style={{ marginTop: 20 }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 10,
                borderBottom: "1px solid #ccc",
              }}
            >
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
                onClick={() => toggleTask(task.id)}
              >
                {task.title}
              </span>

              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}