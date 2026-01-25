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
    <div className="timeline-calendar">
      <div className="calendar-header">
        <button type="button" className="calendar-nav" onClick={handlePrev}>
          ‹
        </button>
        <div className="calendar-title">
          <select
            className="calendar-title-select"
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
            className="calendar-title-select"
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
        <button type="button" className="calendar-nav" onClick={handleNext}>
          ›
        </button>
      </div>
      <div className="calendar-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((date) => {
          const inMonth = date.getMonth() === viewMonth;
          const isStart = isSameDay(date, activeStart);
          const isEnd = isSameDay(date, activeEnd);
          const inRange =
            activeStart && activeEnd && date > activeStart && date < activeEnd;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`calendar-day${
                inMonth ? "" : " is-outside"
              }${isStart ? " is-start" : ""}${isEnd ? " is-end" : ""}${
                inRange ? " is-range" : ""
              }${isToday ? " is-today" : ""}`}
              onMouseDown={() => handleStartDrag(date)}
              onMouseEnter={() => handleHover(date)}
              onMouseUp={handleEndDrag}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="calendar-footer">
        <div className="calendar-meta">
          <span className="calendar-label">Start Date</span>
          <div className="calendar-input-row">
            <input
              type="date"
              className="calendar-date-input"
              value={displayStart || ""}
              onChange={(event) => handleStartInputChange(event.target.value)}
            />
            <span className="calendar-input-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1.5A1.5 1.5 0 0 1 18 5.5v10A1.5 1.5 0 0 1 16.5 17h-13A1.5 1.5 0 0 1 2 15.5v-10A1.5 1.5 0 0 1 3.5 4H5V3a1 1 0 0 1 1-1zm9 7H5a1 1 0 0 0-1 1v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V10a1 1 0 0 0-1-1z" />
              </svg>
            </span>
          </div>
        </div>
        <div className="calendar-meta">
          <span className="calendar-label">Due Date</span>
          <div className="calendar-input-row">
            <input
              type="date"
              className="calendar-date-input"
              value={displayDue || ""}
              onChange={(event) => handleDueInputChange(event.target.value)}
            />
            <span className="calendar-input-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1.5A1.5 1.5 0 0 1 18 5.5v10A1.5 1.5 0 0 1 16.5 17h-13A1.5 1.5 0 0 1 2 15.5v-10A1.5 1.5 0 0 1 3.5 4H5V3a1 1 0 0 1 1-1zm9 7H5a1 1 0 0 0-1 1v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V10a1 1 0 0 0-1-1z" />
              </svg>
            </span>
          </div>
        </div>
        <label className="calendar-time">
          <span className="calendar-label">Set Time</span>
          <div className="calendar-input-row">
            <input
              type="time"
              value={dueTime}
              disabled={!displayDue}
              className="calendar-time-input"
              onChange={(event) => onDueTimeChange(event.target.value)}
            />
            <span className="calendar-input-icon" aria-hidden="true">
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
