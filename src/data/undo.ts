export interface UndoAction { label: string; undo: () => Promise<void>; }

class UndoManager {
  private current: UndoAction | null = null;
  set(action: UndoAction) { this.current = action; }
  consume() { const action = this.current; this.current = null; return action; }
  get available() { return this.current !== null; }
}
export const undoManager = new UndoManager();
