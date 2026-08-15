import type { RecurrenceRule } from "../types/task";

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonthsClamped(date: Date, months: number): Date {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, lastDay));
  return next;
}

function addYearsClamped(date: Date, years: number): Date {
  const next = new Date(date);
  const month = next.getMonth();
  const day = next.getDate();
  next.setDate(1);
  next.setFullYear(next.getFullYear() + years);
  next.setMonth(month);
  const lastDay = new Date(next.getFullYear(), month + 1, 0).getDate();
  next.setDate(Math.min(day, lastDay));
  return next;
}

export function computeNextDate(fromIso: string | undefined, rule: RecurrenceRule): string | null {
  const from = fromIso ? new Date(fromIso) : new Date();
  if (Number.isNaN(from.getTime())) return null;

  const interval = Math.max(1, rule.interval || 1);
  let next: Date;

  switch (rule.freq) {
    case "daily":
      next = addDays(from, interval);
      break;
    case "weekly": {
      const weekdays = [...new Set(rule.weekdays ?? [])].filter((day) => day >= 0 && day <= 6).sort((a, b) => a - b);
      if (!weekdays.length) {
        next = addDays(from, 7 * interval);
        break;
      }
      const current = from.getDay();
      const following = weekdays.find((day) => day > current);
      next = following !== undefined
        ? addDays(from, following - current)
        : addDays(from, (7 - current) + weekdays[0] + 7 * (interval - 1));
      break;
    }
    case "monthly":
      next = addMonthsClamped(from, interval);
      break;
    case "yearly":
      next = addYearsClamped(from, interval);
      break;
    default:
      return null;
  }

  if (rule.endDate && next > new Date(rule.endDate)) return null;
  return next.toISOString();
}
