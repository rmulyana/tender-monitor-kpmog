import {
  STAGES,
  buildStageDates,
  computeStageEndDate,
  normalizeDate,
} from '../../../utils/tenderUtils.js';

const summaryConfig = [
  {
    key: "Registration",
    title: "Registration",
    rows: ["Initiation", "On Progress", "Clarification", "Under Evaluation"],
    valueLabel: "Estimated Value",
  },
  {
    key: "Pre-Qualification",
    title: "Pre-Qualification",
    rows: ["Planning", "On Progress", "Clarification", "Under Evaluation"],
    valueLabel: "Estimated Value",
  },
  {
    key: "Proposal",
    title: "Proposal",
    rows: ["Planning", "On Progress", "Clarification", "Under Evaluation"],
    valueLabel: "Estimated Value",
  },
  {
    key: "Negotiation",
    title: "Negotiation",
    rows: ["Planning", "On Progress", "Clarification", "Under Evaluation"],
    valueLabel: "Estimated Value",
  },
  {
    key: "Contract",
    title: "Contract",
    rows: [
      "Award Announcement",
      "Standstill Period",
      "Letter of Award (LoA)",
      "Contract Signed",
    ],
    valueLabel: "Contract Value",
  },
  {
    key: "Failed",
    title: "Failed",
    rows: ["Registration", "Pre-Qualification", "Proposal", "Negotiation"],
    valueLabel: "Estimated Loss",
  },
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTH_LABELS = [
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

const USD_TO_IDR_RATE = 16000;

const SUMMARY_STATUS_ALIASES = {
  "Under Evaluation": ["Under Evaluation", "Evaluation"],
  "Award Announcement": ["Award", "Award Announcement"],
  "Standstill Period": ["Standstill", "Standstill Period"],
  "Letter of Award (LoA)": ["Letter of Award", "Letter of Award (LoA)"],
  "Contract Signed": ["Signed", "Contract"],
};

const STAGE_FLOW_KEY_MAP = {
  Registration: "Registration",
  "Pre-Qualification": "PQ",
  Proposal: "Proposal",
  Negotiation: "Negotiation",
  Contract: "Contract",
  Failed: "Failed",
};

const chartColors = {
  Registration: "#3b82f6",
  "Pre-Qualification": "#6366f1",
  Proposal: "#f59e0b",
  Negotiation: "#a855f7",
  Contract: "#10b981",
  Failed: "#ef4444",
};

const summaryPillColors = {
  Registration: { text: "#2563eb", border: "#bfdbfe", bg: "#eff6ff" },
  "Pre-Qualification": { text: "#4f46e5", border: "#c7d2fe", bg: "#eef2ff" },
  Proposal: { text: "#9333ea", border: "#e9d5ff", bg: "#f3e8ff" },
  Negotiation: { text: "#ea580c", border: "#fed7aa", bg: "#fff7ed" },
  Contract: { text: "#059669", border: "#a7f3d0", bg: "#ecfdf5" },
  Failed: { text: "#dc2626", border: "#fecaca", bg: "#fef2f2" },
};

const rowPalette = [
  { bar: "#94a3b8", text: "#374151" },
  { bar: "#3b82f6", text: "#2563eb" },
  { bar: "#fb923c", text: "#ea580c" },
  { bar: "#a855f7", text: "#9333ea" },
];

const tooltipSurfaceStyle = {
  backgroundColor: "rgba(241, 245, 249, 0.95)",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
  padding: "8px 10px",
  fontSize: "0.75rem",
};
const tooltipLabelStyle = {
  color: "#64748b",
  fontWeight: 700,
  marginBottom: "4px",
};
const tooltipListStyle = { display: "grid", gap: "4px" };

const CustomTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
}) => {
  if (!active || !payload?.length) {
    return null;
  }
  const resolvedLabel = labelFormatter ? labelFormatter(label, payload) : label;
  return (
    <div style={tooltipSurfaceStyle}>
      {resolvedLabel ? (
        <div style={tooltipLabelStyle}>{resolvedLabel}</div>
      ) : null}
      <div style={tooltipListStyle}>
        {payload.map((entry, index) => {
          const formatted = formatter
            ? formatter(entry.value, entry.name, entry)
            : entry.value;
          let displayValue = formatted;
          let displayName = entry.name;
          if (Array.isArray(formatted)) {
            [displayValue, displayName] = formatted;
          }
          const color =
            entry.color || entry.payload?.color || entry.fill || "#334155";
          return (
            <div
              key={`${entry.dataKey || entry.name}-${index}`}
              style={{ color, fontWeight: 600 }}
            >
              {displayName} : {displayValue}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const normalizeSeries = (series) =>
  Array.from({ length: 12 }, (_, index) => Number(series?.[index] || 0));

const normalizeTargetSeries = (series) => {
  if (!Array.isArray(series) || series.length === 0) return [];
  return Array.from({ length: 12 }, (_, index) => Number(series?.[index] || 0));
};

const donutConfig = {
  outerRadius: 135,
  innerRadius: 100,
  padding: 10,
};
const contractLegendItems = [
  { id: "accumulated", label: "Accumulated Value", color: "#2563eb" },
  { id: "target", label: "Target Value", color: "#cc0000" },
];
const donutCenterStyle = {
  left: donutConfig.outerRadius + donutConfig.padding,
  top: donutConfig.outerRadius + donutConfig.padding,
};

const formatChartValue = (value, unitLabel) => {
  if (!Number.isFinite(value)) return "";
  const number = Number(value);
  const formatted = Number.isInteger(number)
    ? number.toFixed(0)
    : number.toFixed(1);

  if (!unitLabel) {
    return formatted;
  }
  const parts = unitLabel.split(" ");
  if (parts.length > 1) {
    const [currency, unit] = parts;
    return `${currency} ${formatted} ${unit}`;
  }
  return `${formatted} ${unitLabel}`;
};

const formatCurrencyCode = (value, currency) => {
  if (!Number.isFinite(value)) {
    return `${currency} 0`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s+/g, " ")
    .trim();
};

const convertValue = (value, fromCurrency, toCurrency, rate) => {
  if (!Number.isFinite(value) || !fromCurrency || !toCurrency || !rate) {
    return value;
  }
  if (fromCurrency === toCurrency) {
    return value;
  }
  if (fromCurrency === "USD" && toCurrency === "IDR") {
    return value * rate;
  }
  if (fromCurrency === "IDR" && toCurrency === "USD") {
    return value / rate;
  }
  return value; // Should not happen with current currencies
};

const formatFullCurrency = (value, currency) => {
  if (!Number.isFinite(value)) {
    return `${currency} 0`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s+/g, " ")
    .trim();
};

const getStatusMatches = (label) => SUMMARY_STATUS_ALIASES[label] || [label];

const getMonthIndex = (dateValue) => {
  if (!dateValue) return null;
  const date = normalizeDate(dateValue);
  if (!date) return null;
  return date.getMonth();
};

const resolveTimelineYear = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : new Date().getFullYear();
};

const buildStageTimelineForTender = (tender) => {
  const stageTimelineByName = {};
  const stageData = Array.isArray(tender?.subitems?.stages)
    ? tender.subitems.stages
    : [];
  const stageDataByName = new Map(
    stageData
      .filter((stage) => stage && stage.name)
      .map((stage) => [stage.name, stage]),
  );
  const timelineStagesCount = stageData.filter(
    (stage) => stage?.timeline?.startDate || stage?.timeline?.dueDate,
  ).length;
  const hasExplicitTimeline = timelineStagesCount >= 2;

  const fallbackStage =
    tender.stage && STAGES.some((stage) => stage.name === tender.stage)
      ? tender.stage
      : "Registration";

  if (!hasExplicitTimeline) {
    const baseStart =
      normalizeDate(tender.startDate) || normalizeDate(tender.createdAt);
    const baseEnd = normalizeDate(tender.dueDate);
    const failedAt = normalizeDate(tender.failedAt);
    const contractAt = normalizeDate(tender.contractAt);
    let fallbackStart = baseStart;
    if (fallbackStage === "Contract") {
      fallbackStart = contractAt || baseEnd || baseStart;
    } else if (fallbackStage === "Failed") {
      fallbackStart = failedAt || baseEnd || baseStart;
    }
    stageTimelineByName[fallbackStage] = {
      start: fallbackStart,
      end: baseEnd,
    };
    return stageTimelineByName;
  }

  const stageDates = buildStageDates(tender, STAGES);

  STAGES.forEach((stage, index) => {
    const data = stageDataByName.get(stage.name);
    const timeline = data?.timeline || {};
    if (!timeline.startDate && !timeline.dueDate) return;
    const start =
      normalizeDate(timeline.startDate) ||
      normalizeDate(timeline.dueDate) ||
      normalizeDate(stageDates[stage.name]);
    const end =
      normalizeDate(timeline.dueDate) ||
      normalizeDate(computeStageEndDate(stageDates, index, STAGES));
    if (start || end) {
      stageTimelineByName[stage.name] = { start, end };
    }
  });

  if (!stageTimelineByName[fallbackStage]) {
    const baseStart =
      normalizeDate(tender.startDate) || normalizeDate(tender.createdAt);
    const baseEnd = normalizeDate(tender.dueDate);
    if (baseStart || baseEnd) {
      stageTimelineByName[fallbackStage] = {
        start: baseStart,
        end: baseEnd,
      };
    }
  }

  return stageTimelineByName;
};

const resolveStageAtDate = (tender, stageTimeline, atDate) => {
  const fallbackStatusDate =
    normalizeDate(tender.statusChangedAt) ||
    normalizeDate(tender.updatedAt) ||
    normalizeDate(tender.createdAt);

  const failedFlag = tender.isFailed || tender.status === "Failed";
  const timelineYear = atDate.getFullYear();
  let failedAt =
    normalizeDate(tender.failedAt) || (failedFlag ? fallbackStatusDate : null);
  if (
    failedFlag &&
    failedAt &&
    Number.isFinite(timelineYear) &&
    failedAt.getFullYear() > timelineYear
  ) {
    // If the failure was recorded later (e.g., data imported today),
    // fall back to the tender's due date for historical views.
    failedAt = normalizeDate(tender.dueDate) || failedAt;
  }
  if (failedAt && failedAt <= atDate) return "Failed";

  const contractAt =
    normalizeDate(tender.contractAt) ||
    stageTimeline?.Contract?.start ||
    ((tender.stage === "Contract" || tender.status === "Signed") &&
    fallbackStatusDate
      ? fallbackStatusDate
      : null);
  if (contractAt && contractAt <= atDate) return "Contract";

  let lastStage = null;
  STAGES.forEach((stage) => {
    const start = stageTimeline?.[stage.name]?.start;
    if (start && start <= atDate) {
      lastStage = stage.name;
    }
  });

  if (tender.stage) {
    const order = STAGES.map((stage) => stage.name);
    const stageIndex = order.indexOf(tender.stage);
    const lastIndex = lastStage ? order.indexOf(lastStage) : -1;
    const windowStart =
      normalizeDate(tender.startDate) || normalizeDate(tender.createdAt);
    const windowEnd = normalizeDate(tender.dueDate) || atDate;
    if (
      stageIndex !== -1 &&
      stageIndex > lastIndex &&
      (!windowStart || windowStart <= atDate) &&
      (!windowEnd || atDate <= windowEnd)
    ) {
      return tender.stage;
    }
  }

  if (lastStage) return lastStage;

  const fallbackStart =
    normalizeDate(tender.startDate) || normalizeDate(tender.createdAt);
  if (fallbackStart && fallbackStart <= atDate) {
    return tender.stage || "Registration";
  }

  return null;
};

const sumEstValue = (items, toCurrency, rate) =>
  items.reduce((sum, tender) => {
    const value = Number(tender.estValue);
    if (!Number.isFinite(value)) return sum;
    return sum + convertValue(value, tender.currency, toCurrency, rate);
  }, 0);

const buildMonthlySnapshot = (tenders, year) => {
  const snapshot = {
    Registration: Array(12).fill(0),
    PQ: Array(12).fill(0),
    Proposal: Array(12).fill(0),
    Negotiation: Array(12).fill(0),
    Contract: Array(12).fill(0),
    Failed: Array(12).fill(0),
  };
  const timelineYear = resolveTimelineYear(year);
  const monthEnds = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(timelineYear, index + 1, 0);
    date.setHours(23, 59, 59, 999);
    return date;
  });

  tenders.forEach((tender) => {
    const stageTimeline = buildStageTimelineForTender(tender);
    monthEnds.forEach((monthEnd, index) => {
      const stage = resolveStageAtDate(tender, stageTimeline, monthEnd);
      if (!stage) return;
      const key = STAGE_FLOW_KEY_MAP[stage];
      if (!key) return;
      snapshot[key][index] += 1;
    });
  });

  return snapshot;
};

const resolveContractDate = (tender) => {
  const explicit = normalizeDate(tender.contractAt);
  if (explicit) return explicit;
  const statusDate = normalizeDate(tender.statusChangedAt);
  if (statusDate) return statusDate;
  const dueDate = normalizeDate(tender.dueDate);
  if (dueDate) return dueDate;
  const stages = Array.isArray(tender?.subitems?.stages)
    ? tender.subitems.stages
    : [];
  const contractStage = stages.find((stage) => stage?.name === "Contract");
  const contractDue = normalizeDate(contractStage?.timeline?.dueDate);
  return contractDue || null;
};

const convertTargetSeriesToDisplay = (series, displayCurrency, rate) => {
  const divisor = displayCurrency === "IDR" ? 1_000_000_000 : 1_000_000;
  const normalized = normalizeTargetSeries(series);
  return normalized.map((value) => {
    const converted = convertValue(value, "IDR", displayCurrency, rate);
    return converted / divisor;
  });
};

const buildContractSeries = (
  tenders,
  displayCurrency,
  rate,
  targetMonthlySeries,
) => {
  const monthly = Array(12).fill(0);
  tenders.forEach((tender) => {
    const outcome = String(tender.outcomeStatus || "").toLowerCase();
    const isWon = outcome === "won" || tender.status === "Signed";
    if (!isWon) return;
    const contractDate = resolveContractDate(tender);
    const monthIndex = getMonthIndex(contractDate);
    if (monthIndex === null) return;
    const value = Number(tender.estValue);
    if (Number.isFinite(value)) {
      const convertedValue = convertValue(
        value,
        tender.currency,
        displayCurrency,
        rate,
      );
      const divisor = displayCurrency === "IDR" ? 1_000_000_000 : 1_000_000;
      monthly[monthIndex] += convertedValue / divisor;
    }
  });

  const accumulated = [];
  let running = 0;
  monthly.forEach((value, index) => {
    running += value;
    accumulated[index] = running;
  });

  const fallbackTargetIDR = [
    0, 0, 0, 50, 50, 50, 100, 100, 100, 150, 150, 200,
  ].map((value) => value * 1_000_000_000);
  const baseTargetSeries = targetMonthlySeries?.length
    ? targetMonthlySeries
    : fallbackTargetIDR;
  const target = convertTargetSeriesToDisplay(
    baseTargetSeries,
    displayCurrency,
    rate,
  );

  return {
    monthly,
    accumulated,
    target,
  };
};

export {
  MONTH_LABELS,
  FULL_MONTH_LABELS,
  USD_TO_IDR_RATE,
  summaryConfig,
  chartColors,
  summaryPillColors,
  rowPalette,
  tooltipSurfaceStyle,
  tooltipLabelStyle,
  tooltipListStyle,
  CustomTooltip,
  normalizeTargetSeries,
  donutConfig,
  contractLegendItems,
  donutCenterStyle,
  formatChartValue,
  formatCurrencyCode,
  convertValue,
  formatFullCurrency,
  getStatusMatches,
  resolveTimelineYear,
  buildMonthlySnapshot,
  buildContractSeries,
  sumEstValue,
};
