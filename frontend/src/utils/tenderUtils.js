export const STAGES = [
  { name: "Registration" },
  { name: "Pre-Qualification" },
  { name: "Proposal" },
  { name: "Negotiation" },
  { name: "Contract" },
];

export const STAGE_NAMES = STAGES.map((stage) => stage.name);
export const STANDARD_STAGE_SET = new Set(
  STAGE_NAMES.map((stage) => stage.toLowerCase()),
);
export const CUSTOM_STAGE_VALUE = "__custom__";

export const MAIN_STATUS_OPTIONS = {
  Registration: ["Initiation", "On Progress", "Clarification", "Evaluation"],
  Contract: ["Award", "Standstill", "Letter of Award", "Signed"],
  Default: ["Planning", "On Progress", "Clarification", "Evaluation"],
};

export const getMainStatusOptions = (stage) => {
  if (stage === "Registration") return MAIN_STATUS_OPTIONS.Registration;
  if (stage === "Contract") return MAIN_STATUS_OPTIONS.Contract;
  return MAIN_STATUS_OPTIONS.Default;
};

export const normalizeStages = (stages) =>
  stages
    .map((stage) => (typeof stage === "string" ? { name: stage } : stage))
    .filter((stage) => stage && stage.name);

export const STAGE_STEPS = {
  Registration: ["Letter of Interest"],
  "Pre-Qualification": ["Invitation", "Elucidation Meeting", "PQ Submission"],
  Proposal: ["Invitation", "Pre-Bid Meeting", "Site Survey", "Bid Submission"],
  Negotiation: [],
  Contract: [],
};

export const ADD_ITEM_STAGES = new Set(STAGES.map((stage) => stage.name));

export const STEP_META = {
  "Letter of Intent": {
    submission: "Email",
    attachment: "Letter of Intent Submission 2026.pdf",
    progress: 100,
  },
  "Letter of Interest": {
    submission: "Email",
    attachment: "Letter of Interest Submission 2026.pdf",
    progress: 100,
  },
  Invitation: {
    submission: "",
    attachment: "Invitation Letter 2026.pdf",
    progress: 100,
  },
  "Elucidation Meeting": {
    submission: "",
    attachment: "Elucidation Meeting Minutes and Action Items 2026.pdf",
    progress: 80,
  },
  "PQ Submission": {
    submission: "Eproc",
    attachment: "PQ Submission Documents Bundle v3.zip",
    progress: 80,
  },
  "Pre-Bid Meeting": {
    submission: "",
    attachment: "Pre-Bid Meeting Agenda.pdf",
    progress: 80,
  },
  "Site Survey": {
    submission: "Offline",
    attachment: "Site Survey Report Photos 2026.pdf",
    progress: 30,
  },
  "Bid Submission": {
    submission: "",
    attachment: "Bid Submission Final Version 2026.xlsx",
    progress: 100,
  },
};

export const stageOrder = STAGES.map((stage) => stage.name);
export const statusOrder = ["Not Started", "On Progress", "Done", "Failed"];
export const DETAIL_STATUS_OPTIONS = ["Not Started", "On Progress", "Done"];

export const DAY_MS = 24 * 60 * 60 * 1000;

export const normalizeDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildStageDates = (tender, stages = STAGES) => {
  const start = normalizeDate(tender.startDate);
  const end = normalizeDate(tender.dueDate);
  const dates = {};

  if (start && end && end >= start && stages.length > 1) {
    const stepMs = (end.getTime() - start.getTime()) / (stages.length - 1);
    stages.forEach((stage, index) => {
      dates[stage.name] = new Date(start.getTime() + stepMs * index);
    });
    return dates;
  }

  if (start) dates.Registration = start;
  if (end) dates.Contract = end;
  return dates;
};

export const computeStageEndDate = (stageDates, idx, stages = STAGES) => {
  for (let next = idx + 1; next < stages.length; next += 1) {
    const date = stageDates[stages[next].name];
    if (date) return date;
  }
  return null;
};

export const statusClassName = (status) => {
  if (status === "Done") return "status-done";
  if (status === "On Progress") return "status-on-progress";
  if (status === "Failed") return "status-failed";
  return "status-not-started";
};

export const stageClassName = (stage) => {
  if (stage === "Registration") return "stage-registration";
  if (stage === "Pre-Qualification") return "stage-prequal";
  if (stage === "Proposal") return "stage-proposal";
  if (stage === "Negotiation") return "stage-negotiation";
  if (stage === "Contract") return "stage-contract";
  return "";
};

export const priorityClassName = (priority) => {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  if (priority === "Low") return "priority-low";
  return "priority-none";
};

export const normalizeSubmissionValue = (value) => {
  if (!value) return "";
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "offline") return "Offline";
  if (normalized === "online") return "Online";
  return "Online";
};

export const submissionClassName = (value) => {
  if (value === "Online") return "submission-online";
  if (value === "Offline") return "submission-offline";
  return "submission-none";
};

export const normalizeAttachmentList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
};

export const formatAttachmentLabel = (attachments) => {
  if (!attachments.length) return "Add attachment";
  if (attachments.length === 1) return "1 attachment";
  return `${attachments.length} attachments`;
};

export const isAttachmentLink = (value) => /^https?:\/\//i.test(value);

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return null;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const buildCalendarDays = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startOffset);
  const days = [];

  for (let i = 0; i < 42; i += 1) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    days.push(current);
  }

  return days;
};

export const isSameDay = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
