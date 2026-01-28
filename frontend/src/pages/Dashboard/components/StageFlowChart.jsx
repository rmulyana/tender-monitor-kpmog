import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const StageFlowChart = ({
  labels,
  selectedMonth,
  onMonthChange,
  data,
  chartColors,
  stageLegend,
  CustomTooltip,
}) => (
  <article className="panel chart-panel">
    <header className="panel-header">
      <h2 className="panel-title">Monthly Stage Flow</h2>
      <select
        className="panel-select"
        aria-label="Select month for monthly stage flow"
        value={selectedMonth}
        onChange={(event) => onMonthChange(event.target.value)}
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
        <BarChart data={data} margin={{ top: 4, right: 12, left: -10, bottom: 8 }}>
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
          <Bar dataKey="Proposal" stackId="a" fill={chartColors.Proposal} name="Proposal" />
          <Bar
            dataKey="Negotiation"
            stackId="a"
            fill={chartColors.Negotiation}
            name="Negotiation"
          />
          <Bar dataKey="Contract" stackId="a" fill={chartColors.Contract} name="Contract" />
          <Bar dataKey="Failed" stackId="a" fill={chartColors.Failed} name="Failed" />
        </BarChart>
      </ResponsiveContainer>
      <div className="stacked-legend" aria-hidden="true">
        {stageLegend.map((item) => (
          <div key={item.id} className="stacked-legend-item">
            <span className="legend-dot" style={{ background: item.color }} />
            {item.value}
          </div>
        ))}
      </div>
    </div>
  </article>
);

export default StageFlowChart;

