import type { Task, TaskPriority } from "./db";

export interface ParsedTaskInput { title: string; dueDate?: string; dueTime?: string; priority?: TaskPriority; projectName?: string; tags?: string[]; duration?: number; }
export interface AiTaskBreakdown { title: string; subtasks: string[]; }
export interface ProductivityAiProvider { parseTask(input: string): Promise<ParsedTaskInput>; breakDownTask(task: Task): Promise<AiTaskBreakdown>; suggestPriority(task: Task): Promise<TaskPriority>; summarize(tasks: Task[]): Promise<string>; }

export class NoopAiProvider implements ProductivityAiProvider {
  async parseTask(input: string) { return { title: input.trim() }; }
  async breakDownTask(task: Task) { return { title: task.title, subtasks: [] }; }
  async suggestPriority(task: Task) { return task.priority; }
  async summarize(tasks: Task[]) { return `You have ${tasks.filter(t => !t.completed).length} open tasks and ${tasks.filter(t => t.completed).length} completed tasks.`; }
}

export let aiProvider: ProductivityAiProvider = new NoopAiProvider();
export function configureAiProvider(provider: ProductivityAiProvider) { aiProvider = provider; }
