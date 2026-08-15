export type TaskPriority = 1 | 2 | 3 | 4;

export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface RecurrenceRule {
  freq: RecurrenceFrequency;
  interval: number;
  weekdays?: number[];
  dayOfMonth?: number;
  weekOfMonth?: 1 | 2 | 3 | 4 | 5 | -1;
  endDate?: string;
  count?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  projectId?: string;
  parentTaskId?: string;
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  recurrence?: RecurrenceRule;
  reminder?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}
