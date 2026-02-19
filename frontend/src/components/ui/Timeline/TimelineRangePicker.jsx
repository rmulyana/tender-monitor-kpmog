import { useEffect, useMemo, useRef, useState } from "react";

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
  const timeInputRef = useRef(null);
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
    if (timeInputRef.current) {
      timeInputRef.current.focus();
    }
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
  const displayStartKey = dragRange?.start
    ? formatDateKey(dragRange.start)
    : startDate;
  const displayDueKey = dragRange?.end ? formatDateKey(dragRange.end) : dueDate;

  const formatDisplayDate = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return "";
    return `${day}/${month}/${year}`;
  };

  const displayStartText = formatDisplayDate(displayStartKey) || "--";
  const displayDueText = formatDisplayDate(displayDueKey) || "--";

  return (
    <div className="grid w-[320px] gap-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-orange-400 hover:bg-slate-50 hover:cursor-pointer"
          onClick={handlePrev}
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          <select
            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-orange-400 hover:cursor-pointer"
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
            className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-orange-400 hover:cursor-pointer"
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-orange-400 hover:bg-slate-50 hover:cursor-pointer"
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
            "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition cursor-pointer",
            inMonth ? "text-slate-700" : "text-slate-300",
            inRange ? "bg-orange-100" : "",
            isStart || isEnd ? "bg-orange-500 text-white" : "",
            isToday && !isStart && !isEnd ? "ring-[3px] ring-orange-300" : "",
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
        <div className="grid grid-cols-[150px_1fr] items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 outline-none focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-200/50">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Set Time
          </span>
          <input
            type="time"
            value={dueTime}
            disabled={!displayDueKey}
            className="ml-auto w-[80px] bg-transparent text-right outline-none [color-scheme:light] disabled:opacity-60 [::-webkit-calendar-picker-indicator]:ml-0"
            onChange={(event) => onDueTimeChange(event.target.value)}
            aria-label="Set time"
            ref={timeInputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineRangePicker;
