import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTaskStore } from "../store/taskStore";
import type { Task } from "../types/task";

function getMonthMatrix(year: number, month: number) {
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const matrix: (Date | null)[][] = [];
    let week: (Date | null)[] = new Array(7).fill(null);
    let day = 1;

    for (let i = startDay; i < 7; i++) {
        week[i] = new Date(year, month, day++);
    }
    matrix.push(week);

    while (day <= daysInMonth) {
        week = new Array(7).fill(null);
        for (let i = 0; i < 7 && day <= daysInMonth; i++) {
            week[i] = new Date(year, month, day++);
        }
        matrix.push(week);
    }

    return matrix;
}

function formatDayKey(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function Calendar() {
    const { tasks } = useTaskStore();
    const today = formatDayKey(new Date());
    const [cursor, setCursor] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const matrix = useMemo(
        () => getMonthMatrix(cursor.getFullYear(), cursor.getMonth()),
        [cursor]
    );

    const tasksByDay = useMemo(() => {
        const map = new Map<string, Task[]>();
        tasks.forEach((t) => {
            if (!t.dueDate) return;
            const day = t.dueDate.slice(0, 10);
            if (!map.has(day)) map.set(day, []);
            map.get(day)!.push(t);
        });
        return map;
    }, [tasks]);

    const prev = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
    const next = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
    const goToday = () => {
        const now = new Date();
        setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    const isCurrentMonth =
        cursor.getFullYear() === new Date().getFullYear() &&
        cursor.getMonth() === new Date().getMonth();

    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button className="button-icon" onClick={prev} aria-label="Previous month">
                        <FiChevronLeft />
                    </button>
                    <button className="button-icon" onClick={next} aria-label="Next month">
                        <FiChevronRight />
                    </button>
                </div>
                <h2>{cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}</h2>
                {!isCurrentMonth && (
                    <button className="button-secondary btn-sm" onClick={goToday}>
                        Today
                    </button>
                )}
                {isCurrentMonth && <div style={{ width: 72 }} />}
            </div>

            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="calendar-weekday">
                        {d}
                    </div>
                ))}

                {matrix.flat().map((cell, idx) => {
                    if (!cell) return <div key={`empty-${idx}`} className="calendar-cell empty" />;
                    const dayKey = formatDayKey(cell);
                    const items = tasksByDay.get(dayKey) || [];
                    const isToday = dayKey === today;

                    return (
                        <div
                            key={dayKey}
                            className={`calendar-cell${isToday ? " today" : ""}`}
                        >
                            <div className="calendar-cell-label">{cell.getDate()}</div>
                            <div className="calendar-items">
                                {items.slice(0, 3).map((t) => (
                                    <div
                                        key={t.id}
                                        className={`calendar-event${t.completed ? " done" : ""}`}
                                        title={t.title}
                                    >
                                        {t.title}
                                    </div>
                                ))}
                                {items.length > 3 && (
                                    <div className="calendar-more">+{items.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
