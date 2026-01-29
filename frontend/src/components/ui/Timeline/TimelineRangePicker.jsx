import { useEffect, useMemo, useState } from "react";

import {
  MONTH_LABELS,
  WEEKDAY_LABELS,
  buildCalendarDays,
  formatDateKey,
  isSameDay,
  parseDateKey,
} from "../../../utils/tenderUtils.js";

const TimelineRangePicker = ({
  startDate,
  dueDate,
  dueTime,
  onStartSelect,
  onDueSelect,
  onDueTimeChange,
}) => {
  const startObj = parseDateKey(startDate);
  const dueObj = parseDateKey(dueDate);
  const today = new Date();
  const initialDate = startObj || dueObj || today;
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [dragAnchor, setDragAnchor] = useState(null);
  const [dragHover, setDragHover] = useState(null);
  const yearOptions = useMemo(() => {
    const range = 5;
    const start = viewYear - range;
    return Array.from({ length: range * 2 + 1 }, (_, index) => start + index);
  }, [viewYear]);

  const days = useMemo(
    () => buildCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const handlePrev = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const getDragRange = () => {
    if (!dragAnchor) return null;
    const edge = dragHover || dragAnchor;
    const start = dragAnchor < edge ? dragAnchor : edge;
    const end = dragAnchor < edge ? edge : dragAnchor;
    return { start, end };
  };

  const commitDragRange = () => {
    const range = getDragRange();
    if (!range) return;
    onStartSelect(formatDateKey(range.start));
    onDueSelect(formatDateKey(range.end));
    setDragAnchor(null);
    setDragHover(null);
  };

  const handleStartDrag = (date) => {
    setDragAnchor(date);
    setDragHover(date);
  };

  const handleHover = (date) => {
    if (!dragAnchor) return;
    setDragHover(date);
  };

  const handleEndDrag = () => {
    if (!dragAnchor) return;
    commitDragRange();
  };

  useEffect(() => {
    if (!dragAnchor) return undefined;
    const handleMouseUp = () => {
      commitDragRange();
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragAnchor, dragHover]);

  const dragRange = getDragRange();
  const activeStart = dragRange?.start || startObj;
  const activeEnd = dragRange?.end || dueObj;
  const displayStart = dragRange?.start
    ? formatDateKey(dragRange.start)
    : startDate;
  const displayDue = dragRange?.end ? formatDateKey(dragRange.end) : dueDate;
  const handleStartInputChange = (value) => {
    if (!value) return;
    onStartSelect(value);
    if (!displayDue) {
      onDueSelect(value);
    }
  };

  const handleDueInputChange = (value) => {
    if (!value) return;
    onDueSelect(value);
    if (!displayStart) {
      onStartSelect(value);
    }
  };

  return (
    <div className="grid w-[320px] gap-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          onClick={handlePrev}
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          <select
            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600"
            value={viewMonth}
            onChange={(event) => setViewMonth(Number(event.target.value))}
            aria-label="Select month"
          >
            {MONTH_LABELS.map((label, index) => (
              <option key={label} value={index}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600"
            value={viewYear}
            onChange={(event) => setViewYear(Number(event.target.value))}
            aria-label="Select year"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          onClick={handleNext}
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-semibold text-slate-400">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((date) => {
          const inMonth = date.getMonth() === viewMonth;
          const isStart = isSameDay(date, activeStart);
          const isEnd = isSameDay(date, activeEnd);
          const inRange =
            activeStart && activeEnd && date > activeStart && date < activeEnd;
          const isToday = isSameDay(date, today);
          const dayClass = [
            "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition",
            inMonth ? "text-slate-700" : "text-slate-300",
            inRange ? "bg-blue-50" : "",
            isStart || isEnd ? "bg-blue-500 text-white" : "",
            isToday && !isStart && !isEnd ? "ring-1 ring-blue-300" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={dayClass}
              onMouseDown={() => handleStartDrag(date)}
              onMouseEnter={() => handleHover(date)}
              onMouseUp={handleEndDrag}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="grid gap-3">
        <div>
          <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Start Date
          </span>
          <div className="relative mt-1">
            <input
              type="date"
              className="h-9 w-full rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-600"
              value={displayStart || ""}
              onChange={(event) => handleStartInputChange(event.target.value)}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1.5A1.5 1.5 0 0 1 18 5.5v10A1.5 1.5 0 0 1 16.5 17h-13A1.5 1.5 0 0 1 2 15.5v-10A1.5 1.5 0 0 1 3.5 4H5V3a1 1 0 0 1 1-1zm9 7H5a1 1 0 0 0-1 1v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V10a1 1 0 0 0-1-1z" />
              </svg>
            </span>
          </div>
        </div>
        <div>
          <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Due Date
          </span>
          <div className="relative mt-1">
            <input
              type="date"
              className="h-9 w-full rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-600"
              value={displayDue || ""}
              onChange={(event) => handleDueInputChange(event.target.value)}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1.5A1.5 1.5 0 0 1 18 5.5v10A1.5 1.5 0 0 1 16.5 17h-13A1.5 1.5 0 0 1 2 15.5v-10A1.5 1.5 0 0 1 3.5 4H5V3a1 1 0 0 1 1-1zm9 7H5a1 1 0 0 0-1 1v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V10a1 1 0 0 0-1-1z" />
              </svg>
            </span>
          </div>
        </div>
        <label className="grid gap-1">
          <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Set Time
          </span>
          <div className="relative">
            <input
              type="time"
              value={dueTime}
              disabled={!displayDue}
              className="h-9 w-full rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-600 disabled:opacity-60"
              onChange={(event) => onDueTimeChange(event.target.value)}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm.75 3a.75.75 0 0 0-1.5 0v4.25c0 .2.08.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06L10.75 10V6.5z" />
              </svg>
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default TimelineRangePicker;
