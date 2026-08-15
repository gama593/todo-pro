import { db, now, type SavedView } from "./db";

export const savedViewService = {
  list: () => db.savedViews.orderBy("createdAt").toArray(),
  create: async (name: string, filter: SavedView["filter"]) => { const view: SavedView = { id: crypto.randomUUID(), name: name.trim(), filter, createdAt: now(), updatedAt: now() }; await db.savedViews.add(view); return view; },
  update: async (id: string, patch: Partial<Pick<SavedView, "name" | "filter">>) => { await db.savedViews.update(id, { ...patch, updatedAt: now() }); return db.savedViews.get(id); },
  remove: (id: string) => db.savedViews.delete(id),
};
