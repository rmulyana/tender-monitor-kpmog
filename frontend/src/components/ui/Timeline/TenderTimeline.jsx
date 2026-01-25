import "../../../styles/tenders.css";

import { formatDate } from "../../../utils/formatters.js";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatTime = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TenderTimeline = ({ startDate, dueDate, overdueDays }) => {
  const start = new Date(startDate);
  const due = new Date(dueDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(due.getTime())) {
    return null;
  }
  const today = new Date();
  const totalMs = Math.max(due.getTime() - start.getTime(), 1);
  const elapsedMs = today.getTime() - start.getTime();
  const progress = clamp((elapsedMs / totalMs) * 100, 0, 100);
  const diffMs = due.getTime() - today.getTime();
  const isOverdue = overdueDays > 0 || diffMs < 0;
  const absMs = Math.abs(diffMs);
  const dayMs = 86400000;
  const hourMs = 3600000;
  const minuteMs = 60000;
  let label = "";

  if (absMs >= dayMs) {
    const days = Math.floor(absMs / dayMs);
    label = isOverdue ? `Overdue ${days}d` : `${days}d left`;
  } else if (absMs >= hourMs) {
    const hours = Math.floor(absMs / hourMs);
    const unit = hours === 1 ? "hour" : "hours";
    label = isOverdue ? `${hours} ${unit} overdue` : `${hours} ${unit} left`;
  } else {
    const minutesRaw = Math.floor(absMs / minuteMs);
    const minutes = Math.max(1, minutesRaw);
    const unit = minutes === 1 ? "minute" : "minutes";
    label = isOverdue
      ? `${minutes} ${unit} overdue`
      : `${minutes} ${unit} left`;
  }
  const dueTime = formatTime(dueDate);

  return (
    <div className="timeline">
      <div className="timeline-meta">
        <span>{formatDate(startDate)}</span>
        <span>{formatDate(dueDate)}</span>
      </div>
      <div className="timeline-bar">
        <span
          className={`timeline-progress${isOverdue ? " overdue" : ""}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="timeline-footer">
        <span className={`timeline-label${isOverdue ? " overdue" : ""}`}>
          {label}
        </span>
        <span className={`timeline-time${isOverdue ? " overdue" : ""}`}>
          {dueTime}
        </span>
      </div>
    </div>
  );
};

export default TenderTimeline;
