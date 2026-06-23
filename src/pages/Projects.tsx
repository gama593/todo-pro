import { useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
    FiCheck,
    FiEdit2,
    FiFolder,
    FiPlus,
    FiTrash2,
    FiX,
} from "react-icons/fi";
import { useProjectStore } from "../store/projectStore";
import TaskPage from "./TaskPage";

const PRESET_COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
];

export default function Projects() {
    const { projectId } = useParams<{ projectId?: string }>();
    const navigate = useNavigate();
    const { projects, addProject, deleteProject, updateProject } = useProjectStore();
    const [name, setName] = useState("");
    const [color, setColor] = useState(PRESET_COLORS[0]);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const selectedProject = useMemo(
        () => projects.find((project) => project.id === projectId) ?? null,
        [projects, projectId]
    );

    const handleAdd = async () => {
        if (!name.trim()) return;
        const p = { id: crypto.randomUUID(), name: name.trim(), color };
        await addProject(p);
        setName("");
        navigate(`/projects/${p.id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleAdd();
    };

    const startDelete = (id: string) => setConfirmDelete(id);

    const confirmDeleteProject = async () => {
        if (!confirmDelete) return;
        if (projectId === confirmDelete) {
            navigate("/projects");
        }
        await deleteProject(confirmDelete);
        setConfirmDelete(null);
    };

    const startEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setEditName(currentName);
    };

    const saveEdit = async () => {
        if (!editingId || !editName.trim()) return;
        await updateProject(editingId, { name: editName.trim() });
        setEditingId(null);
        setEditName("");
    };

    return (
        <div className="projects-page">
            <aside className="projects-sidebar">
                <h2>Your projects</h2>

                <div className="project-add-form">
                    <input
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="New project name…"
                    />
                    <div className="color-picker">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                className={`color-swatch${color === c ? " selected" : ""}`}
                                style={{ background: c }}
                                onClick={() => setColor(c)}
                                aria-label={`Pick color ${c}`}
                            />
                        ))}
                    </div>
                    <button className="button-primary" onClick={handleAdd}>
                        <FiPlus aria-hidden="true" />
                        Add project
                    </button>
                </div>

                <div className="project-list">
                    {projects.length === 0 && (
                        <p className="empty-hint">No projects yet — create one above.</p>
                    )}
                    {projects.map((p) => (
                        <div key={p.id} className="project-item">
                            {editingId === p.id ? (
                                <div className="project-edit-row">
                                    <input
                                        className="input-field"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                        autoFocus
                                    />
                                    <button className="button-primary btn-sm" onClick={saveEdit} aria-label="Save">
                                        <FiCheck />
                                    </button>
                                    <button className="button-secondary btn-sm" onClick={() => setEditingId(null)} aria-label="Cancel">
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <NavLink
                                        to={`/projects/${p.id}`}
                                        className={({ isActive }) =>
                                            `project-button${isActive ? " active" : ""}`
                                        }
                                        style={{ borderLeft: `3px solid ${p.color ?? "#888"}` }}
                                    >
                                        {p.name}
                                    </NavLink>
                                    <div className="button-group">
                                        <button
                                            className="button-secondary btn-sm icon-btn"
                                            onClick={() => startEdit(p.id, p.name)}
                                            title="Rename"
                                            aria-label="Rename project"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="button-secondary btn-sm icon-btn icon-btn-danger"
                                            onClick={() => startDelete(p.id)}
                                            title="Delete project and its tasks"
                                            aria-label="Delete project"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            <main className="project-view">
                {selectedProject ? (
                    <TaskPage
                        title={selectedProject.name}
                        mode="project"
                        projectId={selectedProject.id}
                    />
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FiFolder />
                        </div>
                        <h2>Select a project</h2>
                        <p>Choose a project from the sidebar to view and manage its tasks.</p>
                    </div>
                )}
            </main>

            {confirmDelete && (
                <div className="task-editor-overlay" role="dialog" aria-modal="true">
                    <div className="confirm-dialog">
                        <h3>Delete project?</h3>
                        <p>
                            This will permanently delete the project and <strong>all of its tasks</strong>. This cannot be undone.
                        </p>
                        <div className="dialog-actions">
                            <button className="button-secondary" onClick={() => setConfirmDelete(null)}>
                                Cancel
                            </button>
                            <button className="button-danger" onClick={confirmDeleteProject}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
