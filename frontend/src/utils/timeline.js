import { DAY_MS, normalizeDate } from "./tenderUtils.js";

export const overdueDays = (value) => {
  const due = normalizeDate(value);
  if (!due) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const ms = today.getTime() - target.getTime();
  return ms > 0 ? Math.floor(ms / DAY_MS) : 0;
};

export const formatTimelineLabel = (startDate, dueDate) => {
  const start = normalizeDate(startDate);
  const due = normalizeDate(dueDate);
  if (!start || !due) return "";
  const today = new Date();
  const daysLeft = Math.ceil((due.getTime() - today.getTime()) / DAY_MS);
  if (daysLeft < 0) return `Overdue ${Math.abs(daysLeft)}d`;
  return `${daysLeft}d left`;
};

export const normalizeDateInput = (value) => {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  const text = String(value);
  if (text.includes("T")) {
    return text.split("T")[0];
  }
  return text.slice(0, 10);
};

export const normalizeDateTimeInput = (value) => {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString().slice(0, 16);
  }
  const text = String(value);
  if (text.includes("T")) {
    return text.slice(0, 16);
  }
  return `${text}T00:00`;
};

export const extractTimePart = (value) => {
  if (!value) return "00:00";
  const text = String(value);
  if (text.includes("T")) {
    return text.split("T")[1].slice(0, 5);
  }
  return "00:00";
};
