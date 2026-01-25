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

import StagePill from "../components/tenders/StagePill.jsx";
import { useTenders } from "../context/TenderContext.jsx";
import { dashboardData } from "../data/dashboardData.js";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatDate,
} from "../utils/formatters.js";
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
      "Contract",
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

const donutConfig = {
  outerRadius: 135,
  innerRadius: 100,
  padding: 10,
};
const contractLegendItems = [
  { id: "accumulated", label: "Accumulated Value", color: "#2563eb" },
  { id: "target", label: "Target Value", color: "#f59e0b" },
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
  return unitLabel ? `${formatted} ${unitLabel}` : formatted;
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

const Dashboard = () => {
  const { allTenders, selectedYear } = useTenders();
  const yearOptions = useMemo(() => Object.keys(dashboardData.years), []);
  const yearData =
    dashboardData.years[selectedYear] ||
    dashboardData.years[yearOptions[yearOptions.length - 1]];
  const labels = yearData?.labels || [];
  const currentMonthIndex = new Date().getMonth();
  const defaultMonth =
    labels[currentMonthIndex] || labels[labels.length - 1] || "Dec";

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  useEffect(() => {
    setSelectedMonth(defaultMonth);
  }, [defaultMonth, selectedYear]);

  const monthIndex = Math.max(labels.indexOf(selectedMonth), 0);
  const snapshot = yearData?.monthlySnapshot || {};
  const contractValue = yearData?.contractValue || {};
  const unitLabel = contractValue.unitLabel || "B";

  const summaryColumns = useMemo(() => {
    return summaryConfig.map((config) => {
      const summary = yearData?.summary?.[config.key] || {
        rows: [0, 0, 0, 0],
        value: 0,
      };
      const rows = config.rows.map((label, index) => ({
        label,
        value: summary.rows?.[index] ?? 0,
      }));
      const maxValue = Math.max(...rows.map((row) => row.value), 1);

      return {
        ...config,
        rows: rows.map((row) => ({
          ...row,
          percent: (row.value / maxValue) * 100,
        })),
        totalValue: summary.value ?? 0,
      };
    });
  }, [yearData]);

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
    [monthIndex, snapshot]
  );

  const processTotal = useMemo(
    () => processData.reduce((sum, item) => sum + item.value, 0),
    [processData]
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
    []
  );

  const contractValueData = useMemo(() => {
    const accumulated = normalizeSeries(contractValue.accumulated);
    const target = normalizeSeries(contractValue.target);

    return labels.map((label, index) => ({
      month: label,
      monthly: accumulated[index],
      accumulated: accumulated[index],
      target: target[index],
      unitLabel,
    }));
  }, [contractValue.accumulated, contractValue.target, labels, unitLabel]);

  const recentTenders = useMemo(() => {
    const stageList = [
      "Registration",
      "Pre-Qualification",
      "Proposal",
      "Negotiation",
      "Contract",
    ];
    const pinList = ["K001", "K002", "K003"];
    const dueOffsets = [3, 9, 18];
    const today = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    return [...allTenders]
      .filter((tender) =>
        ["On Progress", "Done"].includes(tender.status)
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
      .map((tender, index) => {
        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + dueOffsets[index % dueOffsets.length]);
        const dueInDays = Math.ceil((dueDate - today) / dayMs);
        const dueStatus =
          dueInDays < 7 ? "urgent" : dueInDays < 14 ? "warn" : "ok";

        return {
          ...tender,
          pin: pinList[index] || tender.pin,
          stage: stageList[index % stageList.length],
          currency: index === 0 ? "USD" : "IDR",
          dueDate,
          dueStatus,
        };
      });
  }, [allTenders]);

  return (
    <div className="dashboard-layout">
      <section className="panel summary-panel">
        <h2 className="panel-title">Tender Active Summary</h2>
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
                    className="summary-value"
                    style={{
                      color: summaryPillColors[column.key]?.text,
                      background: summaryPillColors[column.key]?.bg,
                      borderColor: summaryPillColors[column.key]?.border,
                    }}
                  >
                    {formatCurrencyCompact(column.totalValue, "IDR")}
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
                  <Tooltip content={(props) => <CustomTooltip {...props} />} />
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
          </header>
          <div className="chart-body stacked-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={monthlyStageFlow}
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
                      0
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
          <h2 className="panel-title">
            Contract Value {selectedYear} (Actual vs Target)
          </h2>
        </header>
        <div className="chart-body tall">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={contractValueData}
              margin={{ top: 12, right: 16, left: 0, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) => formatChartValue(value, unitLabel)}
                width={50}
              />
              <Tooltip
                formatter={(value) => formatChartValue(value, unitLabel)}
                labelFormatter={(label) => `Month: ${label}`}
                content={(props) => {
                  const filtered = (props.payload || []).filter(
                    (entry) => entry.dataKey !== "monthly"
                  );
                  return <CustomTooltip {...props} payload={filtered} />;
                }}
              />
              <Bar
                dataKey="monthly"
                name="Monthly Contract"
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
                  formatter={(value) => formatChartValue(value, unitLabel)}
                  fill="#2563eb"
                />
              </Line>
              <Line
                type="monotone"
                dataKey="target"
                name="Target Value"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
                activeDot={{ r: 4 }}
              >
                <LabelList
                  dataKey="target"
                  position="bottom"
                  offset={-2}
                  formatter={(value) => formatChartValue(value, unitLabel)}
                  fill="#f59e0b"
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
              {recentTenders.map((tender) => (
                <tr
                  key={tender.id}
                  className={`recent-row recent-row-${tender.dueStatus}`}
                >
                  <td>
                    <div className="title-cell">{tender.projectTitle}</div>
                    <span className="pin-cell">{tender.pin}</span>
                  </td>
                  <td>{tender.client}</td>
                  <td>{formatCurrencyCode(tender.estValue, tender.currency)}</td>
                  <td>{formatDate(tender.dueDate)}</td>
                  <td>
                    <StagePill stage={tender.stage} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
