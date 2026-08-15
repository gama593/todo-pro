import { useEffect, useState } from "react";
import type { Priority, Task } from "../../data/db";

interface Props { task?: Task; onSave: (task: Partial<Task>) => void; onClose: () => void; }

export function TaskEditor({ task, onSave, onClose }: Props) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 4);
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [dueTime, setDueTime] = useState(task?.dueTime ?? "");
  const [tags, setTags] = useState(task?.tags.join(", ") ?? "");

  useEffect(() => { setTitle(task?.title ?? ""); setDescription(task?.description ?? ""); setPriority(task?.priority ?? 4); setDueDate(task?.dueDate ?? ""); setDueTime(task?.dueTime ?? ""); setTags(task?.tags.join(", ") ?? ""); }, [task]);

  const submit = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    onSave({ title: cleanTitle, description, priority, dueDate: dueDate || undefined, dueTime: dueTime || undefined, tags: tags.split(",").map(v => v.trim()).filter(Boolean) });
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="task-editor" role="dialog" aria-modal="true" aria-label={task ? "Edit task" : "New task"}>
      <div className="editor-head"><h2>{task ? "Edit task" : "New task"}</h2><button className="icon-btn" onClick={onClose} aria-label="Close">×</button></div>
      <label>Title<input autoFocus value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Escape" && onClose()} placeholder="What needs to be done?" /></label>
      <label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add notes…" rows={4}/></label>
      <div className="editor-grid">
        <label>Priority<select value={priority} onChange={e => setPriority(Number(e.target.value) as Priority)}><option value={1}>P1 — Urgent</option><option value={2}>P2 — High</option><option value={3}>P3 — Medium</option><option value={4}>P4 — Low</option></select></label>
        <label>Due date<input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></label>
        <label>Due time<input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} /></label>
        <label>Tags<input value={tags} onChange={e => setTags(e.target.value)} placeholder="work, study" /></label>
      </div>
      <div className="editor-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" onClick={submit}>{task ? "Save changes" : "Create task"}</button></div>
    </div>
  </div>;
}
