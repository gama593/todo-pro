import { useMemo, useState } from "react";
import type { Project, Task } from "../../data/db";
import { db, now } from "../../data/db";

export function Dashboard({ tasks }: { tasks: Task[] }) {
  const today = new Date().toISOString().slice(0,10);
  const completedToday = tasks.filter(t => t.completed && t.completedAt?.slice(0,10) === today).length;
  const open = tasks.filter(t => !t.completed);
  const overdue = open.filter(t => t.dueDate && t.dueDate < today).length;
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const completedWeek = tasks.filter(t => t.completed && t.completedAt && new Date(t.completedAt) >= weekStart).length;
  const rate = tasks.length ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0;
  const upcoming = open.filter(t => t.dueDate && t.dueDate >= today).sort((a,b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? '')).slice(0,6);
  return <section><div className="section-head"><div><h2>Dashboard</h2><p>A compact view of your productivity.</p></div></div><div className="stats-grid"><Stat label="Open tasks" value={open.length}/><Stat label="Completed today" value={completedToday}/><Stat label="Completed this week" value={completedWeek}/><Stat label="Completion rate" value={`${rate}%`}/><Stat label="Overdue" value={overdue}/></div><div className="dashboard-grid"><div className="panel"><h3>Upcoming</h3>{upcoming.length ? upcoming.map(t => <div className="mini-task" key={t.id}><span>{t.title}</span><small>{t.dueDate}</small></div>) : <p className="muted">Nothing scheduled.</p>}</div><div className="panel"><h3>Priority focus</h3>{open.filter(t => t.priority <= 2).slice(0,6).map(t => <div className="mini-task" key={t.id}><span>{t.title}</span><b>P{t.priority}</b></div>)}{!open.some(t => t.priority <= 2) && <p className="muted">No high-priority tasks.</p>}</div></div></section>;
}
function Stat({label,value}:{label:string;value:string|number}) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>; }

export function Kanban({ tasks, onEdit, onMove }: { tasks: Task[]; onEdit: (task: Task) => void; onMove: (task: Task, status: Task['status']) => void }) {
  const columns: {status: Task['status']; label:string}[] = [{status:'todo',label:'Todo'},{status:'in-progress',label:'In Progress'},{status:'done',label:'Done'}];
  return <section><div className="section-head"><div><h2>Kanban</h2><p>Move work through your workflow.</p></div></div><div className="kanban">{columns.map(c => <div className="kanban-column" key={c.status}><div className="column-head"><strong>{c.label}</strong><span>{tasks.filter(t=>t.status===c.status).length}</span></div>{tasks.filter(t=>t.status===c.status).map(t=><article className="kanban-card" draggable onDragStart={e=>e.dataTransfer.setData('taskId',t.id)} onClick={()=>onEdit(t)} key={t.id}><strong>{t.title}</strong><small>{t.dueDate ?? 'No date'} · P{t.priority}</small></article>)}<div className="drop-zone" onDragOver={e=>e.preventDefault()} onDrop={e=>{const id=e.dataTransfer.getData('taskId'); const task=tasks.find(t=>t.id===id); if(task) onMove(task,c.status)}}>Drop here</div></div>)}</div></section>;
}

export function ProjectsManager({ tasks, projects, reload, onEdit }: { tasks: Task[]; projects: Project[]; reload:()=>Promise<void>; onEdit:(task:Task)=>void }) {
  const [name,setName]=useState(''); const [description,setDescription]=useState(''); const [color,setColor]=useState('#7f77dd');
  const create=async()=>{if(!name.trim())return; const t=now(); await db.projects.add({id:crypto.randomUUID(),name:name.trim(),description,color,archived:false,createdAt:t,updatedAt:t});setName('');setDescription('');await reload();};
  const remove=async(id:string)=>{if(!confirm('Delete this project? Tasks will remain but become unassigned.'))return; await db.transaction('rw',db.projects,db.tasks,async()=>{await db.projects.delete(id);await db.tasks.where('projectId').equals(id).modify({projectId:undefined,updatedAt:now()});});await reload();};
  const archive=async(p:Project)=>{await db.projects.update(p.id,{archived:!p.archived,updatedAt:now()});await reload();};
  return <section><div className="section-head"><div><h2>Projects</h2><p>Create focused areas for your work.</p></div></div><div className="project-create"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Project name"/><input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description (optional)"/><input type="color" value={color} onChange={e=>setColor(e.target.value)}/><button className="primary-btn" onClick={()=>void create()}>Create project</button></div><div className="project-grid">{projects.filter(p=>!p.archived).map(p=>{const pt=tasks.filter(t=>t.projectId===p.id);const done=pt.filter(t=>t.completed).length;return <div className="project-card" key={p.id}><div className="project-dot" style={{background:p.color}}/><strong>{p.name}</strong><span>{done}/{pt.length} complete</span><p>{p.description}</p><div className="project-actions"><button onClick={()=>void archive(p)}>Archive</button><button onClick={()=>void remove(p.id)}>Delete</button></div>{pt.slice(0,4).map(t=><button className="project-task" key={t.id} onClick={()=>onEdit(t)}>{t.title}</button>)}</div>})}</div></section>;
}
