export type RecurrenceFreq = "daily" | "weekly" | "monthly" | "yearly";

export interface RecurrenceRule {
    freq: RecurrenceFreq;
    interval?: number; // default 1
    weekdays?: number[]; // 0-6 for Sun-Sat (used with weekly)
    count?: number;
    until?: string; // ISO date
}

function addDays(d: Date, days: number) {
    const n = new Date(d);
    n.setDate(n.getDate() + days);
    return n;
}

function addMonths(d: Date, months: number) {
    const n = new Date(d);
    const day = n.getDate();
    n.setMonth(n.getMonth() + months);
    // handle end-of-month rollover
    if (n.getDate() < day) {
        n.setDate(0);
    }
    return n;
}

export function computeNextDate(fromIso: string | undefined, rule: RecurrenceRule): string | null {
    const interval = rule.interval || 1;
    const from = fromIso ? new Date(fromIso) : new Date();
    let next: Date | null = null;

    switch (rule.freq) {
        case "daily":
            next = addDays(from, interval);
            break;

        case "weekly":
            if (rule.weekdays && rule.weekdays.length > 0) {
                // find next weekday in list
                const sorted = [...rule.weekdays].sort();
                for (let i = 1; i <= 7; i++) {
                    const cand = addDays(from, i);
                    if (sorted.includes(cand.getDay())) {
                        next = cand;
                        break;
                    }
                }
                if (!next) next = addDays(from, 7 * interval);
            } else {
                next = addDays(from, 7 * interval);
            }
            break;

        case "monthly":
            next = addMonths(from, interval);
            break;

        case "yearly":
            next = new Date(from.getFullYear() + interval, from.getMonth(), from.getDate());
            break;

        default:
            next = null;
    }

    if (!next) return null;
    if (rule.until) {
        const until = new Date(rule.until);
        if (next > until) return null;
    }

    return next.toISOString();
}
