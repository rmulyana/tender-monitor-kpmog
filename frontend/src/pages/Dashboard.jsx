import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";
import CurrencyControls from "./Dashboard/CurrencyControls.jsx";
import StagePill from "../components/tenders/StagePill.jsx";
import { useTenders } from "../context/TenderContext.jsx";
import {
  formatCurrencyCompact,
  formatDate,
  formatNumber,
} from "../utils/formatters.js";
import {
  fetchTargetByYear,
  fetchUsdToIdrRate,
  setTargetByYear,
} from "../utils/tendersApi.js";
import {
  STAGES,
  buildStageDates,
  computeStageEndDate,
  isTenderClosed,
  matchesYearFilter,
  normalizeDate,
} from "../utils/tenderUtils.js";
import "../styles/dashboard.css";

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
  const hasExplicitTimeline = stageData.some(
    (stage) => stage?.timeline?.startDate || stage?.timeline?.dueDate,
  );

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

  return stageTimelineByName;
};

const resolveStageAtDate = (tender, stageTimeline, atDate) => {
  const fallbackStatusDate =
    normalizeDate(tender.statusChangedAt) ||
    normalizeDate(tender.updatedAt) ||
    normalizeDate(tender.createdAt);

  const failedFlag = tender.isFailed || tender.status === "Failed";
  const failedAt =
    normalizeDate(tender.failedAt) || (failedFlag ? fallbackStatusDate : null);
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

const Dashboard = () => {
  const { allTenders, selectedYear } = useTenders();
  const [displayCurrency, setDisplayCurrency] = useState("IDR");
  const [usdToIdrRate, setUsdToIdrRate] = useState(USD_TO_IDR_RATE);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [rateToast, setRateToast] = useState("");
  const [targetConfig, setTargetConfig] = useState(null);
  const [isTargetLoading, setIsTargetLoading] = useState(false);
  const [isTargetSaving, setIsTargetSaving] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetInputRaw, setTargetInputRaw] = useState("");

  const yearTenders = useMemo(
    () =>
      allTenders.filter(
        (tender) => !tender.archived && matchesYearFilter(tender, selectedYear),
      ),
    [allTenders, selectedYear],
  );
  const labels = MONTH_LABELS;
  const currentMonthIndex = new Date().getMonth();
  const defaultMonth =
    labels[currentMonthIndex] || labels[labels.length - 1] || "Dec";

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  useEffect(() => {
    setSelectedMonth(defaultMonth);
  }, [defaultMonth, selectedYear]);

  const monthIndex = Math.max(labels.indexOf(selectedMonth), 0);
  const timelineYear = useMemo(
    () => resolveTimelineYear(selectedYear),
    [selectedYear],
  );

  useEffect(() => {
    let cancelled = false;
    const loadTarget = async () => {
      setIsTargetLoading(true);
      try {
        const data = await fetchTargetByYear(timelineYear);
        if (!cancelled) {
          setTargetConfig(data);
        }
      } catch (error) {
        if (!cancelled) {
          setTargetConfig(null);
        }
      } finally {
        if (!cancelled) {
          setIsTargetLoading(false);
        }
      }
    };
    loadTarget();
    return () => {
      cancelled = true;
    };
  }, [timelineYear]);

  const targetMonthlySeries = useMemo(
    () => normalizeTargetSeries(targetConfig?.monthlyTargets),
    [targetConfig],
  );

  const snapshot = useMemo(
    () => buildMonthlySnapshot(yearTenders, timelineYear),
    [yearTenders, timelineYear],
  );
  const contractSeries = useMemo(
    () =>
      buildContractSeries(
        yearTenders,
        displayCurrency,
        usdToIdrRate,
        targetMonthlySeries,
      ),
    [yearTenders, displayCurrency, usdToIdrRate, targetMonthlySeries],
  );

  const handleTargetEdit = async () => {
    const currentValue = Number(targetConfig?.contractTarget) || 0;
    setTargetInputRaw(currentValue ? String(Math.trunc(currentValue)) : "");
    setIsTargetModalOpen(true);
  };

  const handleTargetSave = async (event) => {
    event.preventDefault();
    const numeric = Number(String(targetInputRaw).replace(/[^0-9]/g, ""));
    if (!Number.isFinite(numeric) || numeric < 0) return;

    setIsTargetSaving(true);
    try {
      const saved = await setTargetByYear(timelineYear, numeric);
      setTargetConfig(saved);
      setIsTargetModalOpen(false);
    } catch (error) {
      // Intentionally ignore UI noise; user can retry.
    } finally {
      setIsTargetSaving(false);
    }
  };

  const summaryColumns = useMemo(() => {
    return summaryConfig.map((config) => {
      let rows = [];
      let totalValue = 0;

      if (config.key === "Failed") {
        const failedTenders = yearTenders.filter(
          (tender) => tender.isFailed || tender.status === "Failed",
        );
        rows = config.rows.map((label) => ({
          label: `Lost at ${label}`,
          value: failedTenders.filter((tender) => tender.stage === label)
            .length,
        }));
        totalValue = sumEstValue(failedTenders, displayCurrency, usdToIdrRate);
      } else {
        const stageTenders = yearTenders.filter(
          (tender) => tender.stage === config.key,
        );
        const activeStageTenders = stageTenders.filter(
          (tender) => !(tender.isFailed || tender.status === "Failed"),
        );
        rows = config.rows.map((label) => {
          const matches = getStatusMatches(label);
          return {
            label,
            value: activeStageTenders.filter((tender) =>
              matches.includes(tender.status),
            ).length,
          };
        });
        totalValue = sumEstValue(
          activeStageTenders,
          displayCurrency,
          usdToIdrRate,
        );
      }

      const maxValue = Math.max(...rows.map((row) => row.value), 1);

      return {
        ...config,
        rows: rows.map((row) => ({
          ...row,
          percent: (row.value / maxValue) * 100,
        })),
        totalValue,
      };
    });
  }, [yearTenders, displayCurrency, usdToIdrRate]);

  const handleCurrencyChange = (event) => {
    setDisplayCurrency(event.target.value);
  };

  useEffect(() => {
    if (!rateToast) return undefined;
    const timeoutId = setTimeout(() => setRateToast(""), 2000);
    return () => clearTimeout(timeoutId);
  }, [rateToast]);

  const handleUpdateRate = () => {
    setIsRateLoading(true);
    fetchUsdToIdrRate()
      .then((data) => {
        const nextRate = Number(data?.rate);
        if (Number.isFinite(nextRate) && nextRate > 0) {
          setUsdToIdrRate(nextRate);
          setRateToast(
            `Rate: ${formatNumber(Math.round(nextRate), "IDR")} (updated)`,
          );
        }
      })
      .finally(() => {
        setIsRateLoading(false);
      });
  };

  const processData = useMemo(
    () => [
      {
        name: "Registration",
        value: snapshot.Registration?.[monthIndex] ?? 0,
        color: chartColors.Registration,
      },
      {
        name: "Pre-Qualification",
        value: snapshot.PQ?.[monthIndex] ?? 0,
        color: chartColors["Pre-Qualification"],
      },
      {
        name: "Proposal",
        value: snapshot.Proposal?.[monthIndex] ?? 0,
        color: chartColors.Proposal,
      },
      {
        name: "Negotiation",
        value: snapshot.Negotiation?.[monthIndex] ?? 0,
        color: chartColors.Negotiation,
      },
      {
        name: "Contract",
        value: snapshot.Contract?.[monthIndex] ?? 0,
        color: chartColors.Contract,
      },
      {
        name: "Failed",
        value: snapshot.Failed?.[monthIndex] ?? 0,
        color: chartColors.Failed,
      },
    ],
    [monthIndex, snapshot],
  );

  const processTotal = useMemo(
    () => processData.reduce((sum, item) => sum + item.value, 0),
    [processData],
  );

  const monthlyStageFlow = useMemo(() => {
    return labels.map((label, index) => ({
      month: label,
      Registration: snapshot.Registration?.[index] ?? 0,
      PreQualification: snapshot.PQ?.[index] ?? 0,
      Proposal: snapshot.Proposal?.[index] ?? 0,
      Negotiation: snapshot.Negotiation?.[index] ?? 0,
      Contract: snapshot.Contract?.[index] ?? 0,
      Failed: snapshot.Failed?.[index] ?? 0,
    }));
  }, [labels, snapshot]);

  const monthlyStageFlowVisible = useMemo(() => {
    const endIndex = Math.max(labels.indexOf(selectedMonth), 0);
    return monthlyStageFlow.slice(0, endIndex + 1);
  }, [labels, monthlyStageFlow, selectedMonth]);

  const stageLegend = useMemo(
    () => [
      {
        value: "Registration",
        type: "circle",
        id: "Registration",
        color: chartColors.Registration,
      },
      {
        value: "Pre-Qualification",
        type: "circle",
        id: "Pre-Qualification",
        color: chartColors["Pre-Qualification"],
      },
      {
        value: "Proposal",
        type: "circle",
        id: "Proposal",
        color: chartColors.Proposal,
      },
      {
        value: "Negotiation",
        type: "circle",
        id: "Negotiation",
        color: chartColors.Negotiation,
      },
      {
        value: "Contract",
        type: "circle",
        id: "Contract",
        color: chartColors.Contract,
      },
      {
        value: "Failed",
        type: "circle",
        id: "Failed",
        color: chartColors.Failed,
      },
    ],
    [],
  );

  const contractValueData = useMemo(() => {
    const { monthly, accumulated, target } = contractSeries;
    const unitAbbreviation = displayCurrency === "IDR" ? "B" : "M";
    const newUnitLabel = `${displayCurrency} ${unitAbbreviation}`;

    return labels.map((label, index) => ({
      month: label,
      monthly: monthly[index],
      accumulated: accumulated[index],
      target: target[index],
      unitLabel: newUnitLabel,
    }));
  }, [contractSeries, labels, displayCurrency]);

  const contractValueVisible = useMemo(() => {
    const endIndex = Math.max(labels.indexOf(selectedMonth), 0);
    return contractValueData.slice(0, endIndex + 1);
  }, [contractValueData, labels, selectedMonth]);

  const activeTargetLabel = useMemo(() => {
    const value = Number(targetConfig?.contractTarget);
    if (!Number.isFinite(value) || value <= 0) return "No target set";
    return `Target: IDR ${formatNumber(value, "IDR")}`;
  }, [targetConfig]);

  const recentTenders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayMs = 24 * 60 * 60 * 1000;

    return [...yearTenders]
      .filter((tender) => !isTenderClosed(tender))
      .filter((tender) => !Number.isNaN(new Date(tender.dueDate).getTime()))
      .map((tender) => {
        const dueDate = new Date(tender.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffMs = dueDate.getTime() - today.getTime();
        const dueInDays = Number.isFinite(diffMs)
          ? Math.ceil(diffMs / dayMs)
          : 0;

        return {
          ...tender,
          dueDate,
          dueInDays,
        };
      })
      .filter((tender) => tender.dueInDays >= 0)
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 3)
      .map((tender) => {
        const dueStatus =
          tender.dueInDays < 7
            ? "urgent"
            : tender.dueInDays <= 14
              ? "warn"
              : "ok";
        const dueInLabel =
          tender.dueInDays <= 0 ? "Due today" : `${tender.dueInDays}d left`;

        return {
          ...tender,
          dueStatus,
          dueInLabel,
        };
      });
  }, [yearTenders]);

  return (
    <div className="dashboard-layout">
      {rateToast ? (
        <div className="rate-toast" role="status">
          {rateToast}
        </div>
      ) : null}
      <section className="panel summary-panel">
        <div className="panel-title-group">
          <h2 className="panel-title">Tender Active Summary</h2>
          <CurrencyControls
            displayCurrency={displayCurrency}
            onCurrencyChange={handleCurrencyChange}
            onUpdateRate={handleUpdateRate}
            isRateLoading={isRateLoading}
          />
        </div>
        <div className="summary-scroll">
          <div className="summary-grid">
            {summaryColumns.map((column) => (
              <div key={column.key} className="summary-column">
                <h3>{column.title}</h3>
                <div className="summary-rows">
                  {column.rows.map((row, index) => {
                    const palette = rowPalette[index] || rowPalette[0];
                    return (
                      <div key={row.label} className="summary-row">
                        <span>{row.label}</span>
                        <span
                          className="row-value"
                          style={{ color: palette.text }}
                        >
                          {row.value}
                        </span>
                        <div className="row-bar">
                          <span
                            style={{
                              width: `${row.percent}%`,
                              background: palette.bar,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="summary-footer">
                  <p>{column.valueLabel}</p>
                  <span
                    title={formatFullCurrency(
                      column.totalValue,
                      displayCurrency,
                    )}
                    className="summary-value"
                    style={{
                      color: summaryPillColors[column.key]?.text,
                      background: summaryPillColors[column.key]?.bg,
                      borderColor: summaryPillColors[column.key]?.border,
                    }}
                  >
                    {formatCurrencyCompact(column.totalValue, displayCurrency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <header className="panel-header">
            <h2 className="panel-title">Tender Process Chart</h2>
            <select
              className="panel-select"
              aria-label="Select month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {labels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </header>
          <div className="chart-body donut-layout">
            <div className="donut-chart">
              <ResponsiveContainer
                width="100%"
                height={donutConfig.outerRadius * 2 + donutConfig.padding * 2}
              >
                <PieChart>
                  <Pie
                    data={processData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={donutConfig.innerRadius}
                    outerRadius={donutConfig.outerRadius}
                    cx={donutConfig.outerRadius + donutConfig.padding}
                    cy={donutConfig.outerRadius + donutConfig.padding}
                    paddingAngle={0}
                    stroke="#ffffff"
                    strokeWidth={2}
                    cornerRadius={0}
                    label={false}
                  >
                    {processData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={(props) => <CustomTooltip {...props} />}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                className="donut-center"
                style={donutCenterStyle}
                aria-hidden="true"
              >
                <span className="donut-label">Total</span>
                <span className="donut-value">{processTotal}</span>
              </div>
            </div>
            <ul className="legend-list">
              {processData.map((item) => (
                <li key={item.name}>
                  <span
                    className="legend-dot"
                    style={{ background: item.color }}
                  />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="panel chart-panel">
          <header className="panel-header">
            <h2 className="panel-title">Monthly Stage Flow</h2>
            <select
              className="panel-select"
              aria-label="Select month for monthly stage flow"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {labels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </header>
          <div className="chart-body stacked-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={monthlyStageFlowVisible}
                margin={{ top: 4, right: 12, left: -10, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} />}
                  labelFormatter={(label, payload) => {
                    const total = (payload || []).reduce(
                      (sum, entry) => sum + (Number(entry.value) || 0),
                      0,
                    );
                    return `${label} : ${total} Tenders`;
                  }}
                />
                <Bar
                  dataKey="Registration"
                  stackId="a"
                  fill={chartColors.Registration}
                  name="Registration"
                />
                <Bar
                  dataKey="PreQualification"
                  stackId="a"
                  fill={chartColors["Pre-Qualification"]}
                  name="Pre-Qualification"
                />
                <Bar
                  dataKey="Proposal"
                  stackId="a"
                  fill={chartColors.Proposal}
                  name="Proposal"
                />
                <Bar
                  dataKey="Negotiation"
                  stackId="a"
                  fill={chartColors.Negotiation}
                  name="Negotiation"
                />
                <Bar
                  dataKey="Contract"
                  stackId="a"
                  fill={chartColors.Contract}
                  name="Contract"
                />
                <Bar
                  dataKey="Failed"
                  stackId="a"
                  fill={chartColors.Failed}
                  name="Failed"
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="stacked-legend" aria-hidden="true">
              {stageLegend.map((item) => (
                <div key={item.id} className="stacked-legend-item">
                  <span
                    className="legend-dot"
                    style={{ background: item.color }}
                  />
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="panel chart-panel">
        <header className="panel-header">
          <div className="panel-title-block">
            <h2 className="panel-title">
              Contract Value {selectedYear} (Actual vs Target)
            </h2>
            <div className="panel-meta">{activeTargetLabel}</div>
          </div>
          <div className="panel-header-actions">
            <select
              className="panel-select"
              aria-label="Select month for contract value"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {labels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="panel-select target-button"
              onClick={handleTargetEdit}
              disabled={isTargetLoading || isTargetSaving}
            >
              {isTargetSaving ? "Saving..." : "Add / Edit Target"}
            </button>
          </div>
        </header>
        <div className="chart-body tall">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={contractValueVisible}
              margin={{ top: 12, right: 16, left: 0, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => formatChartValue(value)}
                width={50}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;

                  const monthIndex = MONTH_LABELS.indexOf(label);
                  const fullMonthName = FULL_MONTH_LABELS[monthIndex] || label;
                  const divisor =
                    displayCurrency === "IDR" ? 1_000_000_000 : 1_000_000;

                  const filteredPayload = payload.filter(
                    (entry) => entry.name !== "Contract Value",
                  );

                  if (filteredPayload.length === 0) return null;

                  return (
                    <div style={tooltipSurfaceStyle}>
                      <div style={tooltipLabelStyle}>{fullMonthName}</div>
                      <div style={tooltipListStyle}>
                        {filteredPayload.map((entry, index) => {
                          const fullValue = entry.value * divisor;
                          return (
                            <div
                              key={`${entry.dataKey || entry.name}-${index}`}
                              style={{ color: entry.color, fontWeight: 600 }}
                            >
                              {formatFullCurrency(fullValue, displayCurrency)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="accumulated"
                name="Contract Value"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="accumulated"
                name="Accumulated Value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 4 }}
              >
                <LabelList
                  dataKey="accumulated"
                  position="top"
                  offset={4}
                  formatter={(value) =>
                    formatChartValue(value, contractValueData[0]?.unitLabel)
                  }
                  fill="#2563eb"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                />
              </Line>
              <Line
                type="monotone"
                dataKey="target"
                name="Target Value"
                stroke="#cc0000"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
                activeDot={{ r: 4 }}
              >
                <LabelList
                  dataKey="target"
                  position="top"
                  offset={6}
                  formatter={(value) =>
                    formatChartValue(value, contractValueData[0]?.unitLabel)
                  }
                  fill="#cc0000"
                  style={{ fontSize: "12px", fontWeight: 600 }}
                />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
          <div className="contract-legend" aria-hidden="true">
            {contractLegendItems.map((item) => (
              <div key={item.id} className="contract-legend-item">
                <span
                  className="legend-dot"
                  style={{ background: item.color }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {isTargetModalOpen ? (
        <div
          className="target-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Set Annual Contract Target"
          onClick={() => !isTargetSaving && setIsTargetModalOpen(false)}
        >
          <div
            className="target-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="target-modal-header">
              <h3 className="target-modal-title">Annual Contract Target</h3>
              <p className="target-modal-subtitle">{timelineYear}</p>
            </div>
            <form className="target-modal-form" onSubmit={handleTargetSave}>
              <input
                id="annual-target"
                className="target-modal-input"
                inputMode="numeric"
                placeholder="set annual target"
                value={
                  targetInputRaw
                    ? formatNumber(Number(targetInputRaw), "IDR")
                    : ""
                }
                onChange={(event) =>
                  setTargetInputRaw(
                    String(event.target.value || "").replace(/[^0-9]/g, ""),
                  )
                }
                disabled={isTargetSaving}
                autoFocus
              />
              <div className="target-modal-actions">
                <button
                  type="button"
                  className="panel-select target-modal-cancel"
                  onClick={() => setIsTargetModalOpen(false)}
                  disabled={isTargetSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="panel-select target-modal-save"
                  disabled={isTargetSaving}
                >
                  {isTargetSaving ? "Saving..." : "Save Target"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <section className="panel">
        <header className="panel-header">
          <h2 className="panel-title">Recent Active Tenders</h2>
        </header>
        <div className="table-wrap">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Client</th>
                <th>Estimated Value</th>
                <th>Due Date</th>
                <th>Stage</th>
              </tr>
            </thead>
            <tbody>
              {recentTenders.length === 0 ? (
                <tr className="recent-row-empty">
                  <td colSpan={5}>No recent active tender</td>
                </tr>
              ) : (
                recentTenders.map((tender) => (
                  <tr
                    key={tender.id}
                    className={`recent-row recent-row-${tender.dueStatus}`}
                  >
                    <td>
                      <div className="title-cell">{tender.projectTitle}</div>
                      <span className="pin-cell">{tender.pin}</span>
                    </td>
                    <td>{tender.client}</td>
                    <td>
                      {formatCurrencyCode(
                        convertValue(
                          tender.estValue,
                          tender.currency,
                          displayCurrency,
                          usdToIdrRate,
                        ),
                        displayCurrency,
                      )}
                    </td>
                    <td>
                      <div>{formatDate(tender.dueDate)}</div>
                      <div className="recent-duein">{tender.dueInLabel}</div>
                    </td>
                    <td className="recent-stage-cell">
                      <StagePill stage={tender.stage} />
                    </td>
                  </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
