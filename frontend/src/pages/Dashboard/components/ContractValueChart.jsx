import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ContractValueChart = ({
  selectedYear,
  activeTargetLabel,
  labels,
  selectedMonth,
  onMonthChange,
  onTargetEdit,
  isTargetLoading,
  isTargetSaving,
  data,
  contractValueData,
  displayCurrency,
  MONTH_LABELS,
  FULL_MONTH_LABELS,
  formatChartValue,
  formatFullCurrency,
  tooltipSurfaceStyle,
  tooltipLabelStyle,
  tooltipListStyle,
  contractLegendItems,
}) => (
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
          onChange={(event) => onMonthChange(event.target.value)}
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
          onClick={onTargetEdit}
          disabled={isTargetLoading || isTargetSaving}
        >
          {isTargetSaving ? "Saving..." : "Add / Edit Target"}
        </button>
      </div>
    </header>
    <div className="chart-body tall">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => formatChartValue(value)} width={50} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;

              const monthIndex = MONTH_LABELS.indexOf(label);
              const fullMonthName = FULL_MONTH_LABELS[monthIndex] || label;
              const divisor = displayCurrency === "IDR" ? 1_000_000_000 : 1_000_000;

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
          <Bar dataKey="accumulated" name="Contract Value" fill="#10b981" radius={[6, 6, 0, 0]} />
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
            <span className="legend-dot" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ContractValueChart;

