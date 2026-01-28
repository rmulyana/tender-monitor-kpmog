import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ProcessChart = ({
  labels,
  selectedMonth,
  onMonthChange,
  donutConfig,
  donutCenterStyle,
  processData,
  processTotal,
  CustomTooltip,
}) => (
  <article className="panel chart-panel">
    <header className="panel-header">
      <h2 className="panel-title">Tender Process Chart</h2>
      <select
        className="panel-select"
        aria-label="Select month"
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
        <div className="donut-center" style={donutCenterStyle} aria-hidden="true">
          <span className="donut-label">Total</span>
          <span className="donut-value">{processTotal}</span>
        </div>
      </div>
      <ul className="legend-list">
        {processData.map((item) => (
          <li key={item.name}>
            <span className="legend-dot" style={{ background: item.color }} />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  </article>
);

export default ProcessChart;

